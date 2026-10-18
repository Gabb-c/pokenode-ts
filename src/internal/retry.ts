import type { RetryOptions } from "../clients/types";
import { toPokenodeError } from "../config/errors";
import { type Logger, logMessage } from "../config/logger";
import { finiteOr } from "./options";

const DEFAULT_RETRY_ATTEMPTS = 3;
const DEFAULT_INITIAL_DELAY = 300;
const DEFAULT_MAX_DELAY = 5_000;
const DEFAULT_RETRY_STATUSES = [429, 500, 502, 503, 504];

/** Attempts in total, the first included. A fraction rounds down: `2.5` is two. */
export const attemptCount = (retry: RetryOptions | undefined): number =>
  retry ? Math.max(Math.floor(finiteOr(retry.attempts, DEFAULT_RETRY_ATTEMPTS)), 1) : 1;

/** A configured wait in milliseconds; `NaN` would read as zero to `setTimeout`. */
const delayOption = (value: number | undefined, fallback: number): number =>
  Math.max(finiteOr(value, fallback), 0);

/** `Retry-After` in milliseconds; RFC 9110 allows seconds or an HTTP date. */
const toRetryAfterMs = (header: string | null): number | undefined => {
  if (header === null) {
    return undefined;
  }

  // `Number("")` is 0, which would read a blank header as "retry now"
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

/** A cancelled request is never retried or reported as a failure. */
export const isAbort = (error: unknown, signal: AbortSignal | undefined): boolean =>
  signal?.aborted === true ||
  (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError"));

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

    // a pending timer would keep an otherwise idle Node process alive; browsers return a number
    timer.unref?.();

    const onAbort = (): void => {
      clearTimeout(timer);
      reject(signal?.reason);
    };

    signal?.addEventListener("abort", onAbort, { once: true });
  });

/**
 * The wait `Retry-After` asks for, or `undefined` to let {@link backoff} decide.
 *
 * @throws {PokenodeError} If the failure is not one worth another attempt.
 */
export const retryDelay = async (
  response: Response,
  isLast: boolean,
  retry: RetryOptions | undefined,
): Promise<number | undefined> => {
  const statuses = retry?.statuses ?? DEFAULT_RETRY_STATUSES;
  const maxDelay = delayOption(retry?.maxDelay, DEFAULT_MAX_DELAY);

  if (isLast || !statuses.includes(response.status)) {
    throw await toPokenodeError(response);
  }

  const retryAfter = toRetryAfterMs(response.headers.get("Retry-After"));

  // waiting less than asked is what the header forbids, so give up instead
  if (retryAfter !== undefined && retryAfter > maxDelay) {
    throw await toPokenodeError(response);
  }

  return retryAfter;
};

export interface BackoffOptions {
  url: string;
  attempt: number;
  /** Absent when the attempt failed before any response. */
  status: number | undefined;
  retryAfter: number | undefined;
  signal: AbortSignal | undefined;
  retry: RetryOptions | undefined;
  logger: Logger | undefined;
}

/**
 * Waits before the next attempt: half a doubling window plus jitter over the
 * other half, so clients that failed together do not return together.
 * `Retry-After` overrides it.
 */
export const backoff = async (options: BackoffOptions): Promise<void> => {
  const { url, attempt, status, retryAfter, signal, retry, logger } = options;
  const initialDelay = delayOption(retry?.initialDelay, DEFAULT_INITIAL_DELAY);
  const maxDelay = delayOption(retry?.maxDelay, DEFAULT_MAX_DELAY);
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
