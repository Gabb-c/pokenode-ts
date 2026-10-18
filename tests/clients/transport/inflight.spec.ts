import { HttpResponse, http } from "msw/http";
import { server } from "../../helpers/setup";
import { BERRY_URL, countingHandler, TestClient } from "../../helpers/transport";

describe("BaseClient in-flight sharing", () => {
  it("should share one request between concurrent callers", async () => {
    const calls = countingHandler(BERRY_URL);
    const client = new TestClient({ cache: false });

    const [first, second] = await Promise.all([client.get("/berry", 1), client.get("/berry", 1)]);

    expect(calls.count).toBe(1);
    expect(first).toEqual(second);
  });

  it("should report an outcome to every caller sharing one request", async () => {
    const calls = countingHandler(BERRY_URL);
    const events: string[] = [];
    const client = new TestClient({
      cache: false,
      logger: {
        debug: (payload) => {
          if (payload.event === "response") {
            events.push(`response ${payload.source}`);
          } else if (payload.event === "request") {
            events.push("request");
          }
        },
        error: () => {},
      },
    });

    await Promise.all([client.get("/berry", 1), client.get("/berry", 1)]);

    expect(calls.count).toBe(1);
    // Two calls in, two requests and two responses out — but only one of them
    // reports a round trip, so counting `network` still counts what upstream saw.
    expect(events).toEqual(["request", "request", "response network", "response in-flight"]);
  });

  it("should report a shared failure to every caller", async () => {
    server.use(http.get(BERRY_URL, () => HttpResponse.json({}, { status: 500 })));

    const errors: string[] = [];
    const client = new TestClient({
      cache: false,
      logger: { debug: () => {}, error: ({ url }) => errors.push(url) },
    });

    const results = await Promise.allSettled([client.get("/berry", 1), client.get("/berry", 1)]);

    expect(results.map((result) => result.status)).toEqual(["rejected", "rejected"]);
    expect(errors).toEqual([BERRY_URL, BERRY_URL]);
  });

  it("should stop sharing a request once it settles", async () => {
    const calls = countingHandler(BERRY_URL);
    const client = new TestClient({ cache: false });

    await client.get("/berry", 1);
    await client.get("/berry", 1);

    expect(calls.count).toBe(2);
  });

  it("should stop sharing a request that failed", async () => {
    let calls = 0;

    server.use(
      http.get(BERRY_URL, () => {
        calls += 1;
        return HttpResponse.json({}, { status: 500 });
      }),
    );

    const client = new TestClient({ cache: false });

    await expect(client.get("/berry", 1)).rejects.toThrow(/failed with status 500/);
    await expect(client.get("/berry", 1)).rejects.toThrow(/failed with status 500/);

    // A failure forgotten is a url that can recover; one remembered is an entry
    // that outlives its request and answers every later caller with it.
    expect(calls).toBe(2);
  });
});
