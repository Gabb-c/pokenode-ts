/**
 * ## Logger
 * Receives one call per request lifecycle event.
 *
 * Pass one as {@link ClientOptions.logger}; leave it unset and a client logs
 * nothing. {@link consoleLogger} covers the common case, and anything shaped
 * like this can forward to pino, winston, or a metrics collector instead.
 */
export interface Logger {
  /** A request is about to be resolved, from cache or over the network. */
  request(method: string, url: string): void;
  /** A response was produced. `cached` distinguishes a cache hit from a round trip. */
  response(status: number, cached: boolean): void;
  /** A request failed. The error is whatever `fetch` or the API produced. */
  error(error: unknown): void;
}

/** A {@link Logger} that writes the request lifecycle to the console. */
export const consoleLogger: Logger = {
  request(method, url) {
    console.log(`[ Request Config ] ${method.toUpperCase()} | ${url}`);
  },

  response(status, cached) {
    console.log(`[ Response ] STATUS ${status} | ${cached ? "CACHED" : "NOT CACHED"}`);
  },

  error(error) {
    const { name, message } =
      error instanceof Error ? error : { name: "UNKNOWN", message: String(error) };

    console.error(`[ Response Error ] CODE ${name} | ${message}`);
  },
};
