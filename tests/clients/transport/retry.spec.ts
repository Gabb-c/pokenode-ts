import { PokenodeError } from "@config/errors";
import { delay } from "msw/utils/delay";

import {
  BERRY_URL,
  countingHandler,
  failingHandler,
  IMMEDIATE,
  TestClient,
} from "../../helpers/transport";

describe("BaseClient retry", () => {
  it("should attempt a request once when retrying is not configured", async () => {
    const calls = failingHandler([503]);

    await expect(new TestClient().get("/berry", 1)).rejects.toThrow(PokenodeError);
    expect(calls.count).toBe(1);
  });

  it("should attempt again after a retryable status", async () => {
    const calls = failingHandler([503]);

    await expect(new TestClient({ retry: IMMEDIATE }).get("/berry", 1)).resolves.toEqual({ id: 1 });
    expect(calls.count).toBe(2);
  });

  it("should give up once it is out of attempts", async () => {
    const calls = failingHandler([503, 503, 503, 503]);

    const error = (await new TestClient({ retry: IMMEDIATE })
      .get("/berry", 1)
      .catch((caught: unknown) => caught)) as PokenodeError;

    expect(PokenodeError.isPokenodeError(error)).toBe(true);
    expect(error.status).toBe(503);
    expect(calls.count).toBe(3);
  });

  it("should fall back to the default when the attempt count is not a number", async () => {
    const calls = failingHandler([503, 503, 503, 503]);

    // `Math.max(NaN, 1)` is `NaN` and `attempt >= NaN` is never true, so an
    // unbounded count used to loop forever. `attempts` is exactly the option
    // that arrives as `Number(process.env.RETRIES)` with the variable unset.
    await expect(
      new TestClient({ retry: { ...IMMEDIATE, attempts: Number.NaN } }).get("/berry", 1),
    ).rejects.toThrow(PokenodeError);

    expect(calls.count).toBe(3);
  }, 2_000);

  it("should round a fractional attempt count down", async () => {
    const calls = failingHandler([503, 503, 503]);

    // `attempt >= 2.5` is first true at three, so a count between two and three
    // used to buy an attempt that was not asked for.
    await expect(
      new TestClient({ retry: { ...IMMEDIATE, attempts: 2.5 } }).get("/berry", 1),
    ).rejects.toThrow(PokenodeError);

    expect(calls.count).toBe(2);
  });

  it("should fall back to the default when a delay is not a number", async () => {
    const calls = failingHandler([503]);
    const startedAt = performance.now();

    // `setTimeout` reads a `NaN` delay as zero, so an unusable `initialDelay`
    // used to spend every attempt at once — a retry storm out of one unset
    // environment variable.
    await new TestClient({ retry: { attempts: 2, initialDelay: Number.NaN } }).get("/berry", 1);

    expect(calls.count).toBe(2);
    expect(performance.now() - startedAt).toBeGreaterThanOrEqual(100);
  }, 2_000);

  it("should fall back to the default when the longest wait is not a number", async () => {
    const calls = failingHandler([503], "600");

    // `600 > NaN` is false, which read an unusable `maxDelay` as willingness to
    // wait ten minutes.
    await expect(
      new TestClient({ retry: { ...IMMEDIATE, maxDelay: Number.NaN } }).get("/berry", 1),
    ).rejects.toThrow(PokenodeError);

    expect(calls.count).toBe(1);
  });

  it("should not attempt a status it was not told to retry again", async () => {
    const calls = failingHandler([404]);

    await expect(new TestClient({ retry: IMMEDIATE }).get("/berry", 1)).rejects.toThrow(
      PokenodeError,
    );
    expect(calls.count).toBe(1);
  });

  it("should retry only the statuses it was given", async () => {
    const calls = failingHandler([418]);

    await expect(
      new TestClient({ retry: { ...IMMEDIATE, statuses: [418] } }).get("/berry", 1),
    ).resolves.toEqual({ id: 1 });
    expect(calls.count).toBe(2);
  });

  it("should attempt again after a transport failure", async () => {
    let calls = 0;
    const client = new TestClient({
      retry: IMMEDIATE,
      fetch: (url, init) => {
        calls += 1;
        return calls === 1
          ? Promise.reject(new TypeError("fetch failed"))
          : fetch(url, init as RequestInit);
      },
    });

    countingHandler(BERRY_URL);

    await expect(client.get("/berry", 1)).resolves.toEqual({ id: 1 });
    expect(calls).toBe(2);
  });

  it("should wait as long as Retry-After asks", async () => {
    const calls = failingHandler([503], "0.05");
    const startedAt = performance.now();

    await new TestClient({ retry: { attempts: 2, initialDelay: 0 } }).get("/berry", 1);

    expect(calls.count).toBe(2);
    expect(performance.now() - startedAt).toBeGreaterThanOrEqual(45);
  });

  it("should back off normally when Retry-After is blank", async () => {
    const calls = failingHandler([503], "  ");
    const startedAt = performance.now();

    // A blank header reads as `Number("") === 0`, which would retry instantly.
    await new TestClient({ retry: { attempts: 2, initialDelay: 100 } }).get("/berry", 1);

    expect(calls.count).toBe(2);
    expect(performance.now() - startedAt).toBeGreaterThanOrEqual(45);
  });

  it("should give up rather than wait less than Retry-After asks", async () => {
    const calls = failingHandler([503], "600");

    await expect(
      new TestClient({ retry: { ...IMMEDIATE, maxDelay: 1_000 } }).get("/berry", 1),
    ).rejects.toThrow(PokenodeError);
    expect(calls.count).toBe(1);
  });

  it("should read Retry-After as an http date", async () => {
    const calls = failingHandler([503], new Date(Date.now() + 600_000).toUTCString());

    // RFC 9110 allows a date as well as a number of seconds. Ten minutes is
    // longer than this client will ever wait, so it gives up instead — which is
    // also what proves the date was read rather than discarded as unparseable.
    await expect(
      new TestClient({ retry: { ...IMMEDIATE, maxDelay: 1_000 } }).get("/berry", 1),
    ).rejects.toThrow(PokenodeError);

    expect(calls.count).toBe(1);
  });

  it("should not wait when the request was cancelled before the wait began", async () => {
    const controller = new AbortController();
    let calls = 0;

    const client = new TestClient({
      cache: false,
      retry: { attempts: 3, initialDelay: 20 },
      fetch: () => {
        calls += 1;
        // Cancelled while the response is still being handed back, so the wait
        // before the next attempt is asked to start on a signal already fired.
        controller.abort(new Error("gave up"));
        return Promise.resolve(Response.json({ detail: "no" }, { status: 503 }));
      },
    });

    await expect(client.with({ signal: controller.signal }).get("/berry", 1)).rejects.toThrow(
      "gave up",
    );

    // The caller gets its rejection from the scope either way. What the wait has
    // to get right is stopping the attempt loop: an `abort` listener registered
    // on a signal that has already fired never runs, so a wait that starts here
    // runs to completion and sends a second request nobody is waiting for.
    await delay(80);

    expect(calls).toBe(1);
  });

  it("should stop waiting when the request is cancelled", async () => {
    const calls = failingHandler([503, 503, 503]);
    const client = new TestClient({ retry: { attempts: 3, initialDelay: 10_000 } });

    await expect(client.with({ timeout: 20 }).get("/berry", 1)).rejects.toThrow(/abort|time/i);
    expect(calls.count).toBe(1);
  });

  it("should share one sequence of attempts between concurrent callers", async () => {
    const calls = failingHandler([503]);
    const client = new TestClient({ cache: false, retry: IMMEDIATE });

    const [first, second] = await Promise.all([client.get("/berry", 1), client.get("/berry", 1)]);

    expect(calls.count).toBe(2);
    expect(first).toEqual(second);
  });

  it("should report every attempt it retried to a supplied logger", async () => {
    failingHandler([503, 500]);
    const events: string[] = [];
    const client = new TestClient({
      retry: IMMEDIATE,
      logger: {
        debug: (payload) => {
          if (payload.event === "retry") {
            events.push(`retry ${payload.attempt} ${payload.status ?? "none"}`);
          }
        },
        error: () => {},
      },
    });

    await client.get("/berry", 1);

    expect(events).toEqual(["retry 1 503", "retry 2 500"]);
  });
});
