/**
 * A request already on the wire, and what it takes to cancel it.
 *
 * `waiters` counts the callers still interested. The request is aborted only
 * when the last of them has left, so one caller giving up does not cancel the
 * round trip the others are sharing.
 */
interface Request<T> {
  promise: Promise<T>;
  /** Absent when the caller that started the request had nothing to cancel it with. */
  controller: AbortController | undefined;
  waiters: number;
}

/** A resolved request, and whether this caller paid for it. */
export interface Shared<T> {
  value: T;
  /** Whether an identical request was already on the wire and this caller joined it. */
  joined: boolean;
}

/**
 * ## In Flight
 * The requests currently on the wire, keyed by URL, so concurrent callers asking
 * for the same one share a single round trip.
 *
 * Held by a transport's shared state and passed by reference, so a scoped
 * transport joins the requests already running rather than starting its own.
 *
 * Internal, and deliberately ignorant of what a request resolves to: it owns the
 * bookkeeping — who is still waiting, who may cancel, when an entry is forgotten
 * — and nothing about HTTP.
 */
export class InFlight<T> {
  private readonly requests = new Map<string, Request<T>>();

  /**
   * Resolves `key` through the request already running for it, or through a new
   * one started by `start`.
   *
   * `start` is handed the signal to cancel with, which is not the caller's: the
   * callers sharing a request come and go, and only the last one to leave may
   * cancel it.
   */
  async share(
    key: string,
    signal: AbortSignal | undefined,
    start: (signal: AbortSignal | undefined) => Promise<T>,
  ): Promise<Shared<T>> {
    const pending = this.requests.get(key);
    const entry = pending ?? this.dispatch(key, signal, start);

    return { value: await this.join(key, entry, signal), joined: pending !== undefined };
  }

  /** Issues a request and remembers it, so a concurrent caller can share it. */
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

    // A request abandoned by every caller rejects with nobody left awaiting it.
    // This handler exists only so that rejection is not unhandled; each caller
    // still sees the failure through its own `join`.
    entry.promise.catch(() => {});

    this.requests.set(key, entry);

    return entry;
  }

  /**
   * Forgets a request, unless a later caller has already replaced it: a request
   * that was aborted leaves the map before it settles, and the one dispatched in
   * its place must survive its predecessor finishing.
   */
  private release(key: string, entry: Request<T>): void {
    if (this.requests.get(key) === entry) {
      this.requests.delete(key);
    }
  }

  /**
   * Awaits a request, cancelling it if this caller was the last one interested.
   *
   * A caller with no signal never leaves early, so it holds the request open for
   * everyone — including a scoped caller that joined later and gave up.
   */
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

        // Dropped from the map before the abort settles it: a caller arriving in
        // between would otherwise join a request already on its way out and
        // inherit an abort it never asked for.
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
