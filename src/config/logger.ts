/**
 * Fields shared by every payload.
 *
 * The text is carried twice on purpose. pino, bunyan and roarr read `msg`;
 * winston reads `message`. Sending both is what lets a logger from either family
 * be passed straight in, with no adapter to write and nothing logged as
 * `undefined`.
 */
interface LogFields {
  /** Which point of the request lifecycle this is, for filtering. */
  event: "request" | "response" | "retry" | "cancelled" | "error";
  msg: string;
  message: string;
  /** The request URL, with any credentials the base URL carried removed. */
  url: string;
}

/**
 * ## Log Request Payload
 * A request is about to be resolved, from cache or over the network.
 */
export interface LogRequestPayload extends LogFields {
  event: "request";
  /** The HTTP method, uppercase, as RFC 9110 and OpenTelemetry both expect. */
  method: string;
}

/**
 * ## Log Response Payload
 * A response was produced.
 */
export interface LogResponsePayload extends LogFields {
  event: "response";
  status: number;
  /**
   * Where the response came from.
   *
   * - `network` — a round trip was made.
   * - `cache` — served by the {@link CacheStore}; nothing left the process.
   * - `in-flight` — an identical request was already on the wire and this caller
   *   shared it, so it made no round trip of its own.
   * - `revalidated` — a round trip was made, the API answered 304, and the body
   *   already held for that URL was reused. Cheap, but not free.
   *
   * Counting `network` and `revalidated` gives the number of requests the
   * PokéAPI actually saw. Every caller reports, so counting all four gives the
   * number of calls the application made.
   */
  source: "network" | "cache" | "in-flight" | "revalidated";
  /** How long the client took to resolve the request, in milliseconds. */
  durationMs: number;
}

/**
 * ## Log Retry Payload
 * An attempt failed and another one is coming.
 *
 * Only emitted when `retry` is configured, and never for the attempt that gives
 * up — that one is a `response` or an `error` like any other. Counting these
 * gives the round trips the PokéAPI saw beyond the ones it answered.
 */
export interface LogRetryPayload extends LogFields {
  event: "retry";
  /** Which attempt just failed, counting from one. */
  attempt: number;
  /** How long the client will wait before the next one, in milliseconds. */
  delayMs: number;
  /** The status that failed. Absent when the attempt never got a response. */
  status?: number;
}

/**
 * ## Log Cancelled Payload
 * A request was cancelled by the scope it was made through.
 *
 * A caller that hangs up asked for this, so it is not a failure and does not
 * reach `error`: a handler that scopes every request would otherwise report its
 * own timeouts as its error rate. Counting `response` and `cancelled` together
 * accounts for every `request` logged.
 */
export interface LogCancelledPayload extends LogFields {
  event: "cancelled";
  /** `signal.reason`, or the `TimeoutError` a scoped timeout raised. */
  reason: unknown;
  /** How long the request had been running when it was cancelled, in milliseconds. */
  durationMs: number;
}

/**
 * ## Log Error Payload
 * A request failed.
 *
 * The error is carried twice for the same reason the message is: pino runs its
 * error serializer on `err` and nothing else, so an `Error` under any other key
 * would reach the log as `{}` — no message, no stack.
 */
export interface LogErrorPayload extends LogFields {
  event: "error";
  /** Whatever `fetch` or the API produced. */
  err: unknown;
  error: unknown;
}

/**
 * ## Logger
 * Where a client reports what it did.
 *
 * Deliberately the shape every logging library already has, so one can be passed
 * without glue:
 *
 * ```ts
 * new PokemonClient({ logger: pino() });
 * new PokemonClient({ logger: console });
 * new PokemonClient({ logger: winston.createLogger() });
 * ```
 *
 * Requests, responses and cancellations go to `debug`; failures go to `error`.
 * Nothing is logged unless a logger is passed, and a client never picks a level
 * of its own.
 */
export interface Logger {
  debug(
    payload: LogRequestPayload | LogResponsePayload | LogRetryPayload | LogCancelledPayload,
  ): void;
  error(payload: LogErrorPayload): void;
}

/**
 * Builds the message keys both logging families expect. Internal — the payload
 * types are the public contract.
 */
export const logMessage = (text: string): { msg: string; message: string } => ({
  msg: text,
  message: text,
});

/**
 * A {@link Logger} that writes the request lifecycle to the console as one
 * formatted line per event.
 *
 * `console` itself is a valid {@link Logger} and logs the payload as an object;
 * this is for when the terminal should stay readable.
 */
export const consoleLogger: Logger = {
  debug(payload) {
    if (payload.event === "request") {
      console.log(`[ Request Config ] ${payload.method} | ${payload.url}`);
      return;
    }

    if (payload.event === "retry") {
      console.log(
        `[ Retry ] ATTEMPT ${payload.attempt} | STATUS ${payload.status ?? "NONE"} | IN ${payload.delayMs.toFixed(0)}ms | ${payload.url}`,
      );
      return;
    }

    if (payload.event === "cancelled") {
      console.log(`[ Cancelled ] ${payload.url} | AFTER ${payload.durationMs.toFixed(1)}ms`);
      return;
    }

    console.log(
      `[ Response ] STATUS ${payload.status} | ${payload.source.toUpperCase()} | ${payload.durationMs.toFixed(1)}ms`,
    );
  },

  error({ url, err }) {
    const { name, message } =
      err instanceof Error ? err : { name: "UNKNOWN", message: String(err) };

    console.error(`[ Response Error ] ${url} | CODE ${name} | ${message}`);
  },
};
