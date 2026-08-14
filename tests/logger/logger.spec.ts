import { consoleLogger } from "@config/logger";

const consoleLogSpy = vi.spyOn(console, "log");
const consoleErrorSpy = vi.spyOn(console, "error");

afterEach(() => {
  consoleLogSpy.mockClear();
  consoleErrorSpy.mockClear();
});

afterAll(() => {
  vi.clearAllMocks();
});

describe("consoleLogger", () => {
  it("should log a request", () => {
    consoleLogger.request("get", "https://pokeapi.co/api/v2/berry/1");

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "[ Request Config ] GET | https://pokeapi.co/api/v2/berry/1",
    );
  });

  it("should log a response", () => {
    consoleLogger.response(200, false);

    expect(consoleLogSpy).toHaveBeenCalledWith("[ Response ] STATUS 200 | NOT CACHED");
  });

  it("should flag cached responses", () => {
    consoleLogger.response(200, true);

    expect(consoleLogSpy).toHaveBeenCalledWith("[ Response ] STATUS 200 | CACHED");
  });

  it("should log an error", () => {
    consoleLogger.error(new TypeError("fetch failed"));

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[ Response Error ] CODE TypeError | fetch failed",
    );
  });

  it("should log a thrown non-error", () => {
    consoleLogger.error("boom");

    expect(consoleErrorSpy).toHaveBeenCalledWith("[ Response Error ] CODE UNKNOWN | boom");
  });
});
