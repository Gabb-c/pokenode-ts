import { logError, logRequest, logResponse } from "@config/logger";

const consoleLogSpy = vi.spyOn(console, "log");
const consoleErrorSpy = vi.spyOn(console, "error");

afterEach(() => {
  consoleLogSpy.mockClear();
  consoleErrorSpy.mockClear();
});

afterAll(() => {
  vi.clearAllMocks();
});

describe("Logger", () => {
  it("should call the request log", () => {
    logRequest("get", "https://pokeapi.co/api/v2/berry/1", true);

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "[ Request Config ] GET | https://pokeapi.co/api/v2/berry/1",
    );
  });

  it("should not call the request log", () => {
    logRequest("get", "https://pokeapi.co/api/v2/berry/1");

    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it("should call the response log", () => {
    logResponse(200, false, true);

    expect(consoleLogSpy).toHaveBeenCalledWith("[ Response ] STATUS 200 | NOT CACHED");
  });

  it("should flag cached responses", () => {
    logResponse(200, true, true);

    expect(consoleLogSpy).toHaveBeenCalledWith("[ Response ] STATUS 200 | CACHED");
  });

  it("should not call the response log", () => {
    logResponse(200, false);

    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it("should call the error log", () => {
    logError(new TypeError("fetch failed"), true);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[ Response Error ] CODE TypeError | fetch failed",
    );
  });

  it("should call the error log for non-errors", () => {
    logError("boom", true);

    expect(consoleErrorSpy).toHaveBeenCalledWith("[ Response Error ] CODE UNKNOWN | boom");
  });

  it("should not call the error log", () => {
    logError(new Error("nope"));

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
