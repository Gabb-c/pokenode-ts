/** Aborted only when the last of its `waiters` leaves. */
interface Request<T> {
  promise: Promise<T>;
  /** Absent when the starting caller had no signal. */
  controller: AbortController | undefined;
  waiters: number;
}

export interface Shared<T> {
  value: T;
  joined: boolean;
}

/**
 * ## In Flight
 * Requests on the wire by key, so concurrent identical callers share one. Knows
 * nothing about HTTP.
 */
export class InFlight<T> {
  private readonly requests = new Map<string, Request<T>>();

  /** `start` gets a signal of its own, not the caller's: only the last caller out may cancel. */
  async share(
    key: string,
    signal: AbortSignal | undefined,
    start: (signal: AbortSignal | undefined) => Promise<T>,
  ): Promise<Shared<T>> {
    const pending = this.requests.get(key);
    const entry = pending ?? this.dispatch(key, signal, start);

    return { value: await this.join(key, entry, signal), joined: pending !== undefined };
  }

  private dispatch(
    key: string,
    signal: AbortSignal | undefined,
    start: (signal: AbortSignal | undefined) => Promise<T>,
  ): Request<T> {
    const controller = signal ? new AbortController() : undefined;
    const entry: Request<T> = {
      promise: start(controller?.signal),
      controller,
      waiters: 0,
    };

    entry.promise = entry.promise.finally(() => this.release(key, entry));

    // an abandoned request rejects with nobody awaiting; callers still see it via `join`
    entry.promise.catch(() => {});

    this.requests.set(key, entry);

    return entry;
  }

  /** An aborted entry leaves early; its replacement must survive it settling. */
  private release(key: string, entry: Request<T>): void {
    if (this.requests.get(key) === entry) {
      this.requests.delete(key);
    }
  }

  /** A caller with no signal never leaves, so it holds the request open for everyone. */
  private join(key: string, entry: Request<T>, signal: AbortSignal | undefined): Promise<T> {
    entry.waiters += 1;

    if (!signal) {
      return entry.promise;
    }

    return new Promise<T>((resolve, reject) => {
      const leave = (): void => {
        entry.waiters -= 1;

        if (entry.waiters > 0) {
          return;
        }

        // released before aborting, or a caller arriving in between inherits the abort
        this.release(key, entry);
        entry.controller?.abort(signal.reason);
      };

      if (signal.aborted) {
        leave();
        reject(signal.reason);
        return;
      }

      const onAbort = (): void => {
        leave();
        reject(signal.reason);
      };

      signal.addEventListener("abort", onAbort, { once: true });

      entry.promise.then(
        (value) => {
          signal.removeEventListener("abort", onAbort);
          resolve(value);
        },
        (error: unknown) => {
          signal.removeEventListener("abort", onAbort);
          reject(error);
        },
      );
    });
  }
}
