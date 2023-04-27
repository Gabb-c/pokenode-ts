import {
  handleRequest,
  handleRequestError,
  handleResponse,
  handleResponseError,
} from "../config/logger";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";

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
    const handleRequestMock = vi.fn().mockImplementation(handleRequest);

    expect(handleRequestMock({}, true)).toEqual({});
    expect(consoleLogSpy).toHaveBeenCalled();
    expect(handleRequestMock).toHaveBeenCalled();
  });

  it("should not call the request log", () => {
    const handleRequestMock = vi.fn().mockImplementation(handleRequest);

    expect(handleRequestMock({})).toEqual({});
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(handleRequestMock).toHaveBeenCalled();
  });

  it("should call the request error log", async () => {
    const handleRequestErrorMock = vi.fn().mockImplementation(handleRequestError);

    await expect(handleRequestErrorMock({}, true)).rejects.toThrowError();
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(handleRequestErrorMock).toHaveBeenCalled();
  });

  it("should call the response log", () => {
    const handleResponseMock = vi.fn().mockImplementation(handleResponse);

    expect(handleResponseMock({}, true)).toEqual({});
    expect(consoleLogSpy).toHaveBeenCalled();
    expect(handleResponseMock).toHaveBeenCalled();
  });

  it("should not call the response log", () => {
    const handleResponseMock = vi.fn().mockImplementation(handleResponse);

    expect(handleResponseMock({})).toEqual({});
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(handleResponseMock).toHaveBeenCalled();
  });

  it("should call the request error log", async () => {
    const handleResponseErrorMock = vi.fn().mockImplementation(handleResponseError);

    await expect(handleResponseErrorMock({}, true)).rejects.toThrowError();
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(handleResponseErrorMock).toHaveBeenCalled();
  });
});
