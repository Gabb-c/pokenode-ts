import type { RetryOptions } from "../clients/base";
import { toPokenodeError } from "../config/errors";
import { type Logger, logMessage } from "../config/logger";

const DEFAULT_RETRY_ATTEMPTS = 3;
const DEFAULT_INITIAL_DELAY = 300;
const DEFAULT_MAX_DELAY = 5_000;
/** Transient by definition: rate limiting, and the gateway failures around it. */
const DEFAULT_RETRY_STATUSES = [429, 500, 502, 503, 504];

/**
 * How many attempts a request gets, the first one included.
 *
 * A non-finite count falls back to the default rather than being clamped:
 * `Math.max(NaN, 1)` is `NaN`, and an attempt loop bounded by `NaN` never ends.
 * `attempts` is exactly the sort of option that arrives as
 * `Number(process.env.RETRIES)`.
 */
export const attemptCount = (retry: RetryOptions | undefined): number => {
  if (!retry) {
    return 1;
  }

  const requested = retry.attempts ?? DEFAULT_RETRY_ATTEMPTS;

  return Number.isFinite(requested) ? Math.max(requested, 1) : DEFAULT_RETRY_ATTEMPTS;
};

/**
 * Reads `Retry-After`, which RFC 9110 allows to be either a number of seconds or
 * an HTTP date. Returns milliseconds, or nothing when the header is absent or
 * unparseable.
 */
const toRetryAfterMs = (header: string | null): number | undefined => {
  if (header === null) {
    return undefined;
  }

  // `Number("")` is a finite 0, which would read a blank header as permission to
  // retry immediately — the opposite of what the header is ever sent to say.
  const value = header.trim();

  if (value === "") {
    return undefined;
  }

  const seconds = Number(value);

  if (Number.isFinite(seconds)) {
    return Math.max(seconds, 0) * 1_000;
  }

  const date = Date.parse(value);

  return Number.isNaN(date) ? undefined : Math.max(date - Date.now(), 0);
};

/**
 * Whether an error is a request being cancelled rather than failing. A cancelled
 * request is never retried: someone asked for it to stop.
 */
export const isAbort = (error: unknown, signal: AbortSignal | undefined): boolean =>
  signal?.aborted === true ||
  (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError"));

/** Waits, unless the request is cancelled first. */
const sleep = (ms: number, signal: AbortSignal | undefined): Promise<void> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    const onAbort = (): void => {
      clearTimeout(timer);
      reject(signal?.reason);
    };

    signal?.addEventListener("abort", onAbort, { once: true });
  });

/**
 * How long `Retry-After` asks this client to wait, or nothing when the wait is
 * {@link backoff}'s to calculate.
 *
 * @throws {PokenodeError} If the failure is not one this client attempts again.
 */
export const retryDelay = async (
  response: Response,
  isLast: boolean,
  retry: RetryOptions | undefined,
): Promise<number | undefined> => {
  const statuses = retry?.statuses ?? DEFAULT_RETRY_STATUSES;
  const maxDelay = retry?.maxDelay ?? DEFAULT_MAX_DELAY;

  if (isLast || !statuses.includes(response.status)) {
    throw await toPokenodeError(response);
  }

  const retryAfter = toRetryAfterMs(response.headers.get("Retry-After"));

  // Asked to wait longer than this client is willing to: waiting less is
  // exactly what the header exists to prevent, so the attempt is the last.
  if (retryAfter !== undefined && retryAfter > maxDelay) {
    throw await toPokenodeError(response);
  }

  return retryAfter;
};

/** What one wait between attempts needs to know. */
export interface BackoffOptions {
  url: string;
  attempt: number;
  /** Absent when the attempt failed before there was a response to read. */
  status: number | undefined;
  /** What `Retry-After` asked for, when it asked for anything. */
  retryAfter: number | undefined;
  signal: AbortSignal | undefined;
  retry: RetryOptions | undefined;
  logger: Logger | undefined;
}

/**
 * Waits before the next attempt, and says so through the logger.
 *
 * The wait is half of a doubling window plus jitter over the other half, so
 * clients that failed together do not come back together, and none of them
 * comes back immediately. `Retry-After` replaces the calculation outright.
 */
export const backoff = async (options: BackoffOptions): Promise<void> => {
  const { url, attempt, status, retryAfter, signal, retry, logger } = options;
  const initialDelay = retry?.initialDelay ?? DEFAULT_INITIAL_DELAY;
  const maxDelay = retry?.maxDelay ?? DEFAULT_MAX_DELAY;
  const window = Math.min(initialDelay * 2 ** (attempt - 1), maxDelay);
  const delayMs = retryAfter ?? window / 2 + Math.random() * (window / 2);

  logger?.debug({
    event: "retry",
    ...logMessage("pokeapi request failed, retrying"),
    url,
    attempt,
    delayMs,
    ...(status === undefined ? {} : { status }),
  });

  await sleep(delayMs, signal);
};
