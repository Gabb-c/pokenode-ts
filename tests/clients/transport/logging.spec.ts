import { PokenodeError } from "@config/errors";
import { HttpResponse, http } from "msw/http";
import { delay } from "msw/utils/delay";
import { server } from "../../helpers/setup";
import { BERRY_URL, countingHandler, TestClient } from "../../helpers/transport";

describe("BaseClient logging", () => {
  it("should report the request lifecycle to a supplied logger", async () => {
    countingHandler(BERRY_URL);
    const events: string[] = [];
    const client = new TestClient({
      logger: {
        debug: (payload) => {
          if (payload.event === "request") {
            events.push(`request ${payload.method} ${payload.url}`);
          } else if (payload.event === "response") {
            events.push(`response ${payload.url} ${payload.status} ${payload.source}`);
          }
        },
        error: ({ err }) => events.push(`error ${String(err)}`),
      },
    });

    await client.get("/berry", 1);
    await client.get("/berry", 1);

    expect(events).toEqual([
      `request GET ${BERRY_URL}`,
      `response ${BERRY_URL} 200 network`,
      `request GET ${BERRY_URL}`,
      `response ${BERRY_URL} 200 cache`,
    ]);
  });

  it("should report the url of a failed request without its credentials", async () => {
    const logged: string[] = [];
    const messages: string[] = [];
    const client = new TestClient({
      baseURL: "https://someone:hunter2@poke.example/api/v2",
      cache: false,
      // What Node's own `fetch` throws: the message quotes the URL it was given.
      fetch: (url) =>
        Promise.reject(
          new TypeError(
            `Request cannot be constructed from a URL that includes credentials: ${url}`,
          ),
        ),
      logger: {
        debug: () => {},
        error: ({ url, err }) => {
          logged.push(url);
          messages.push(String((err as Error).message));
        },
      },
    });

    await expect(client.get("/berry", 1)).rejects.toThrow(TypeError);
    expect(logged).toEqual(["https://poke.example/api/v2/berry/1"]);
    // The forwarded error reaches a logger's own serializer intact — pino walks
    // `message` and `stack` — so it must not carry what the url no longer does.
    expect(messages.join("\n")).not.toContain("hunter2");
  });

  it("should time both a round trip and a cache hit", async () => {
    countingHandler(BERRY_URL);
    const durations: number[] = [];
    const client = new TestClient({
      logger: {
        debug: (payload) => {
          if (payload.event === "response") {
            durations.push(payload.durationMs);
          }
        },
        error: () => {},
      },
    });

    await client.get("/berry", 1);
    await client.get("/berry", 1);

    expect(durations).toHaveLength(2);
    for (const duration of durations) {
      expect(duration).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(duration)).toBe(true);
    }
  });

  it("should report a failure to a supplied logger", async () => {
    server.use(http.get(BERRY_URL, () => HttpResponse.json({}, { status: 404 })));

    const errors: { url: string; err: unknown }[] = [];
    const client = new TestClient({
      logger: { debug: () => {}, error: (payload) => errors.push(payload) },
    });

    await expect(client.get("/berry", 1)).rejects.toThrow(PokenodeError);
    expect(errors).toHaveLength(1);
    expect(errors[0]?.url).toBe(BERRY_URL);
  });

  it("should report a cancellation without reporting a failure", async () => {
    server.use(
      http.get(BERRY_URL, async () => {
        await delay(200);
        return HttpResponse.json({ id: 1 });
      }),
    );

    const events: string[] = [];
    const errors: unknown[] = [];
    const client = new TestClient({
      cache: false,
      logger: {
        debug: (payload) => events.push(payload.event),
        error: (payload) => errors.push(payload),
      },
    });

    // A caller that hangs up asked for exactly this, so it closes its `request`
    // on the debug channel. Reported as an error, a handler that scopes every
    // request drowns its own error rate in its own timeouts.
    await expect(client.with({ timeout: 20 }).get("/berry", 1)).rejects.toThrow(/abort|time/i);

    expect(events).toEqual(["request", "cancelled"]);
    expect(errors).toEqual([]);
  });

  it("should stay silent without a logger", async () => {
    countingHandler(BERRY_URL);
    const log = vi.spyOn(console, "log").mockImplementation(() => {});

    await new TestClient().get("/berry", 1);

    expect(log).not.toHaveBeenCalled();
    log.mockRestore();
  });
});
