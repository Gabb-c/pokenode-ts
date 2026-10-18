import { PokenodeError } from "@config/errors";

import { attemptCount, isAbort, retryDelay } from "../../src/internal/retry";

const NOW = Date.UTC(2026, 0, 1);

const failure = (status: number, retryAfter?: string): Response =>
  new Response(
    null,
    retryAfter === undefined ? { status } : { status, headers: { "Retry-After": retryAfter } },
  );

const named = (name: string): Error => Object.assign(new Error(name), { name });

describe("attemptCount", () => {
  it.each([
    ["no retry option", undefined, 1],
    ["the default", {}, 3],
    ["a fraction", { attempts: 2.5 }, 2],
    ["NaN", { attempts: Number.NaN }, 3],
    ["zero", { attempts: 0 }, 1],
    ["a negative count", { attempts: -4 }, 1],
  ])("should allow for %s", (_label, retry, expected) => {
    expect(attemptCount(retry)).toBe(expected);
  });
});

describe("retryDelay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([
    ["no header", undefined, undefined],
    ["a blank header", "  ", undefined],
    ["an unparseable header", "soon", undefined],
    ["seconds", "2", 2_000],
    ["a negative number", "-5", 0],
    ["an http date", new Date(NOW + 3_000).toUTCString(), 3_000],
    ["a date in the past", new Date(NOW - 3_000).toUTCString(), 0],
  ])("should read %s", async (_label, header, expected) => {
    await expect(retryDelay(failure(503, header), false, {})).resolves.toBe(expected);
  });

  it("should give up on a status it does not retry", async () => {
    await expect(retryDelay(failure(404), false, {})).rejects.toBeInstanceOf(PokenodeError);
  });

  it("should give up on the last attempt", async () => {
    await expect(retryDelay(failure(503), true, {})).rejects.toBeInstanceOf(PokenodeError);
  });

  it("should give up when asked to wait longer than maxDelay", async () => {
    await expect(retryDelay(failure(503, "10"), false, { maxDelay: 5_000 })).rejects.toBeInstanceOf(
      PokenodeError,
    );
  });

  it("should retry only the statuses it was given", async () => {
    await expect(retryDelay(failure(404), false, { statuses: [404] })).resolves.toBeUndefined();
    await expect(retryDelay(failure(503), false, { statuses: [404] })).rejects.toBeInstanceOf(
      PokenodeError,
    );
  });
});

describe("isAbort", () => {
  it.each([
    ["an AbortError", named("AbortError"), undefined, true],
    ["a TimeoutError", named("TimeoutError"), undefined, true],
    ["any error on an aborted signal", new Error("boom"), AbortSignal.abort(), true],
    ["an ordinary failure", new TypeError("fetch failed"), undefined, false],
    ["a thrown non-error", "AbortError", undefined, false],
  ])("should classify %s", (_label, error, signal, expected) => {
    expect(isAbort(error, signal)).toBe(expected);
  });
});
