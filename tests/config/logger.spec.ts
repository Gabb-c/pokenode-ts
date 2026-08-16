import { consoleLogger, type Logger } from "@config/logger";

const url = "https://pokeapi.co/api/v2/berry/1";

const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

afterEach(() => {
  consoleLogSpy.mockClear();
  consoleErrorSpy.mockClear();
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe("consoleLogger", () => {
  it("should log a request", () => {
    consoleLogger.debug({
      event: "request",
      msg: "pokeapi request",
      message: "pokeapi request",
      method: "GET",
      url,
    });

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "[ Request Config ] GET | https://pokeapi.co/api/v2/berry/1",
    );
  });

  it("should log a response", () => {
    consoleLogger.debug({
      event: "response",
      msg: "pokeapi response",
      message: "pokeapi response",
      url,
      status: 200,
      cached: false,
      durationMs: 12.34,
    });

    expect(consoleLogSpy).toHaveBeenCalledWith("[ Response ] STATUS 200 | NOT CACHED | 12.3ms");
  });

  it("should flag cached responses", () => {
    consoleLogger.debug({
      event: "response",
      msg: "pokeapi response",
      message: "pokeapi response",
      url,
      status: 200,
      cached: true,
      durationMs: 0.04,
    });

    expect(consoleLogSpy).toHaveBeenCalledWith("[ Response ] STATUS 200 | CACHED | 0.0ms");
  });

  it("should log an error", () => {
    const error = new TypeError("fetch failed");

    consoleLogger.error({
      event: "error",
      msg: "pokeapi request failed",
      message: "pokeapi request failed",
      url,
      err: error,
      error,
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[ Response Error ] https://pokeapi.co/api/v2/berry/1 | CODE TypeError | fetch failed",
    );
  });

  it("should log a thrown non-error", () => {
    consoleLogger.error({
      event: "error",
      msg: "pokeapi request failed",
      message: "pokeapi request failed",
      url,
      err: "boom",
      error: "boom",
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[ Response Error ] https://pokeapi.co/api/v2/berry/1 | CODE UNKNOWN | boom",
    );
  });
});

/*
 * The point of the payload shape is that a logger from any of the common
 * libraries satisfies `Logger` as-is. These mirror the call signatures those
 * packages publish, so a change to the interface that would break them fails
 * `pnpm typecheck` here rather than in someone's application.
 */

/** `pino`: overloaded call signatures on a property, object-first. */
interface PinoLogFn {
  <T extends object>(obj: T, msg?: string, ...args: unknown[]): void;
  (obj: unknown, msg?: string, ...args: unknown[]): void;
  (msg: string, ...args: unknown[]): void;
}

interface PinoLike {
  debug: PinoLogFn;
  info: PinoLogFn;
  warn: PinoLogFn;
  error: PinoLogFn;
}

/** `winston`: message-first, with an object-only overload, returning itself. */
interface WinstonLeveledLogMethod {
  (message: string, ...meta: unknown[]): WinstonLike;
  (message: unknown): WinstonLike;
  (infoObject: object): WinstonLike;
}

interface WinstonLike {
  debug: WinstonLeveledLogMethod;
  info: WinstonLeveledLogMethod;
  warn: WinstonLeveledLogMethod;
  error: WinstonLeveledLogMethod;
}

/** `console`, as lib.dom and @types/node both declare it. */
interface ConsoleLike {
  debug(...data: unknown[]): void;
  error(...data: unknown[]): void;
}

describe("Logger compatibility", () => {
  it("should accept a logger from any of the common libraries", () => {
    // Plain assignments: `tsc` rejects the file if any of these stops fitting.
    const pinoLike: Logger = {} as PinoLike;
    const winstonLike: Logger = {} as WinstonLike;
    const consoleLike: Logger = {} as ConsoleLike;
    const theConsole: Logger = console;

    expect([pinoLike, winstonLike, consoleLike, theConsole]).toHaveLength(4);
  });

  it("should carry the message under both keys every family reads", () => {
    const received: Record<string, unknown>[] = [];
    const logger: Logger = {
      debug: (payload) => received.push({ ...payload }),
      error: (payload) => received.push({ ...payload }),
    };

    logger.debug({
      event: "request",
      msg: "pokeapi request",
      message: "pokeapi request",
      method: "GET",
      url,
    });

    // pino reads `msg`, winston reads `message`.
    expect(received[0]?.msg).toBe("pokeapi request");
    expect(received[0]?.message).toBe("pokeapi request");
  });
});
