import { BASE_URL, type Endpoint } from "@constants";
import { delay, HttpResponse, http, type JsonBodyType } from "msw";

import { BaseClient } from "../../src/clients/base";
import type { CacheStore } from "../../src/config/cache";
import { PokenodeError } from "../../src/config/errors";
import { server } from "../helpers/setup";

/** Exposes the protected request helpers so they can be exercised directly. */
class TestClient extends BaseClient {
  get<T>(endpoint: Endpoint, identifier?: string | number): Promise<T> {
    return this.getResource<T>(endpoint, identifier);
  }

  getByURL<T>(url: string, baseURL?: string): Promise<T> {
    return this.getResourceByURL<T>(url, baseURL);
  }

  list(endpoint: "/berry", offset?: number, limit?: number) {
    return this.getListResource(endpoint, offset, limit);
  }
}

const BERRY_URL = `${BASE_URL.REST}/berry/1`;

/** A `CacheStore` that records what the client asked of it. */
class RecordingStore implements CacheStore {
  readonly reads: string[] = [];
  readonly writes: [string, unknown][] = [];

  private readonly entries = new Map<string, unknown>();
  private readonly async: boolean;

  constructor(options?: { async?: boolean }) {
    this.async = options?.async ?? false;
  }

  get(key: string): unknown | Promise<unknown> {
    this.reads.push(key);
    const value = this.entries.get(key);
    return this.async ? Promise.resolve(value) : value;
  }

  set(key: string, value: unknown): void | Promise<void> {
    this.writes.push([key, value]);
    this.entries.set(key, value);
    return this.async ? Promise.resolve() : undefined;
  }
}

/** Registers a handler for `url` and returns a counter of how often it ran. */
const countingHandler = (url: string, body: JsonBodyType = { id: 1 }) => {
  const calls = { count: 0, urls: [] as string[] };

  server.use(
    http.get(url, ({ request }) => {
      calls.count += 1;
      calls.urls.push(request.url);
      return HttpResponse.json(body);
    }),
  );

  return calls;
};

describe("BaseClient", () => {
  it("should fetch a resource by identifier", async () => {
    const calls = countingHandler(BERRY_URL);

    await expect(new TestClient().get("/berry", 1)).resolves.toEqual({ id: 1 });
    expect(calls.urls[0]).toBe(BERRY_URL);
  });

  it("should treat the id 0 as a real identifier", async () => {
    const calls = countingHandler(`${BASE_URL.REST}/berry/0`);

    await new TestClient().get("/berry", 0);

    expect(calls.count).toBe(1);
  });

  it("should serve a repeated request from the cache", async () => {
    const calls = countingHandler(BERRY_URL);
    const client = new TestClient();

    await client.get("/berry", 1);
    await client.get("/berry", 1);

    expect(calls.count).toBe(1);
  });

  it("should hit the network every time when the cache is disabled", async () => {
    const calls = countingHandler(BERRY_URL);
    const client = new TestClient({ cache: false });

    await client.get("/berry", 1);
    await client.get("/berry", 1);

    expect(calls.count).toBe(2);
  });

  it("should read and write through a custom store", async () => {
    const calls = countingHandler(BERRY_URL);
    const store = new RecordingStore();
    const client = new TestClient({ cache: store });

    await client.get("/berry", 1);
    await client.get("/berry", 1);

    expect(calls.count).toBe(1);
    expect(store.reads).toEqual([BERRY_URL, BERRY_URL]);
    expect(store.writes).toEqual([[BERRY_URL, { id: 1 }]]);
  });

  it("should await an asynchronous store", async () => {
    const calls = countingHandler(BERRY_URL);
    const store = new RecordingStore({ async: true });
    const client = new TestClient({ cache: store });

    await client.get("/berry", 1);

    await expect(client.get("/berry", 1)).resolves.toEqual({ id: 1 });
    expect(calls.count).toBe(1);
  });

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
        debug: (payload) =>
          events.push(payload.event === "request" ? "request" : `response ${payload.source}`),
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

  it("should not share a cache between clients", async () => {
    const calls = countingHandler(BERRY_URL);

    await new TestClient().get("/berry", 1);
    await new TestClient().get("/berry", 1);

    expect(calls.count).toBe(2);
  });

  it("should send pagination as query parameters", async () => {
    const calls = countingHandler(`${BASE_URL.REST}/berry`, { count: 0, results: [] });

    await new TestClient().list("/berry", 20, 50);

    expect(calls.urls[0]).toBe(`${BASE_URL.REST}/berry?offset=20&limit=50`);
  });

  it("should honour a custom baseURL", async () => {
    const calls = countingHandler("https://example.test/api/v2/berry/1");

    await new TestClient({ baseURL: "https://example.test/api/v2" }).get("/berry", 1);

    expect(calls.count).toBe(1);
  });

  it("should tolerate a trailing slash on the baseURL", async () => {
    const calls = countingHandler("https://example.test/api/v2/berry/1");

    await new TestClient({ baseURL: "https://example.test/api/v2/" }).get("/berry", 1);

    expect(calls.count).toBe(1);
  });

  it("should resolve a resource from its absolute URL", async () => {
    const calls = countingHandler(BERRY_URL);

    await new TestClient().getByURL(BERRY_URL);

    expect(calls.count).toBe(1);
  });

  it("should resolve an absolute URL against the client baseURL", async () => {
    const calls = countingHandler("https://example.test/api/v2/berry/1");

    await new TestClient({ baseURL: "https://example.test/api/v2" }).getByURL(BERRY_URL);

    expect(calls.count).toBe(1);
  });

  it("should drop the trailing slash the PokéAPI puts on its own URLs", async () => {
    const calls = countingHandler(BERRY_URL);

    await new TestClient().getByURL(`${BERRY_URL}/`);

    expect(calls.urls[0]).toBe(BERRY_URL);
  });

  it("should give a resource one cache key however it is reached", async () => {
    const calls = countingHandler(BERRY_URL);
    const client = new TestClient();

    await client.get("/berry", 1);
    await client.getByURL(`${BERRY_URL}/`);

    expect(calls.count).toBe(1);
  });

  it("should not mistake a version marker in the host for one in the path", async () => {
    const calls = countingHandler("https://api.v2.example.test/api/v2/berry/1");
    const baseURL = "https://api.v2.example.test/api/v2";

    await new TestClient({ baseURL }).getByURL(`${baseURL}/berry/1/`);

    expect(calls.urls[0]).toBe("https://api.v2.example.test/api/v2/berry/1");
  });

  it("should keep the query string of a resource URL", async () => {
    const calls = countingHandler(`${BASE_URL.REST}/berry`, { count: 0, results: [] });

    await new TestClient().getByURL(`${BASE_URL.REST}/berry?offset=20&limit=50`);

    expect(calls.urls[0]).toBe(`${BASE_URL.REST}/berry?offset=20&limit=50`);
  });

  it("should reject a URL that names no endpoint", async () => {
    await expect(new TestClient().getByURL("https://example.test/berry/1")).rejects.toThrow(
      TypeError,
    );
  });

  it("should reject a URL that is not absolute", async () => {
    await expect(new TestClient().getByURL("/berry/1")).rejects.toThrow(TypeError);
  });

  it("should throw a PokenodeError on a non-2xx response", async () => {
    server.use(
      http.get(BERRY_URL, () => HttpResponse.json({ detail: "Not found." }, { status: 404 })),
    );

    const error = await new TestClient().get("/berry", 1).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(PokenodeError);
    expect(PokenodeError.isPokenodeError(error)).toBe(true);
    expect(error).toMatchObject({
      name: "PokenodeError",
      kind: "pokenode:http",
      status: 404,
      url: BERRY_URL,
      body: { detail: "Not found." },
    });
  });

  it("should leave the body undefined when the error response is not JSON", async () => {
    server.use(http.get(BERRY_URL, () => new HttpResponse("Not Found", { status: 404 })));

    const error = (await new TestClient()
      .get("/berry", 1)
      .catch((caught: unknown) => caught)) as PokenodeError;

    expect(error.body).toBeUndefined();
    expect(error.statusText).toBeDefined();
  });

  it("should pass the url and our init to a custom fetch", async () => {
    const calls: [string, RequestInit | undefined][] = [];
    const client = new TestClient({
      fetch: (url, init) => {
        calls.push([url, init]);
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });

    await expect(client.get("/berry", 1)).resolves.toEqual({ id: 1 });

    const [url, init] = calls[0] as [string, RequestInit];
    expect(url).toBe(BERRY_URL);
    expect(init.headers).toEqual({ Accept: "application/json" });
  });

  // `FetchLike` is deliberately narrower than `typeof globalThis.fetch`: the
  // wider type rejects an ordinary wrapper. Both of these have to keep
  // compiling, so widening or tightening the option breaks the build here.
  it("should accept the global fetch as its transport", async () => {
    const calls = countingHandler(BERRY_URL);

    await new TestClient({ fetch: globalThis.fetch }).get("/berry", 1);

    expect(calls.count).toBe(1);
  });

  it("should accept a plain fetch wrapper as its transport", async () => {
    const calls = countingHandler(BERRY_URL);
    const wrapper = (url: string, init?: RequestInit) => fetch(url, init);

    await new TestClient({ fetch: wrapper }).get("/berry", 1);

    expect(calls.count).toBe(1);
  });

  it("should not impose an abort signal of its own", async () => {
    let received: RequestInit | undefined;
    const client = new TestClient({
      fetch: (_url, init) => {
        received = init;
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });

    await client.get("/berry", 1);

    expect(received?.signal).toBeUndefined();
  });

  it("should surface an abort from a caller-supplied signal untouched", async () => {
    server.use(
      http.get(BERRY_URL, async () => {
        await delay(200);
        return HttpResponse.json({ id: 1 });
      }),
    );

    const client = new TestClient({
      fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(10) }),
    });

    const error = await client.get("/berry", 1).catch((caught: unknown) => caught);

    expect(PokenodeError.isPokenodeError(error)).toBe(false);
    expect((error as Error).name).toBe("TimeoutError");
  });

  it("should expose the store it built for itself", async () => {
    countingHandler(BERRY_URL);
    const client = new TestClient();

    await client.get("/berry", 1);

    expect(client.cache?.get(BERRY_URL)).toEqual({ id: 1 });
  });

  it("should expose no store when caching is disabled", () => {
    expect(new TestClient({ cache: false }).cache).toBeUndefined();
  });

  it("should refetch after the cache is cleared", async () => {
    const calls = countingHandler(BERRY_URL);
    const client = new TestClient();

    await client.get("/berry", 1);
    await client.clearCache();
    await client.get("/berry", 1);

    expect(calls.count).toBe(2);
  });

  it("should leave a store that cannot clear alone", async () => {
    const client = new TestClient({ cache: new RecordingStore() });

    await expect(client.clearCache()).resolves.toBeUndefined();
  });

  it("should report the request lifecycle to a supplied logger", async () => {
    countingHandler(BERRY_URL);
    const events: string[] = [];
    const client = new TestClient({
      logger: {
        debug: (payload) =>
          events.push(
            payload.event === "request"
              ? `request ${payload.method} ${payload.url}`
              : `response ${payload.url} ${payload.status} ${payload.source}`,
          ),
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

  it("should keep credentials out of the logged url", async () => {
    const requested: string[] = [];
    const logged: string[] = [];
    const client = new TestClient({
      baseURL: "https://someone:hunter2@poke.example/api/v2",
      cache: false,
      fetch: (url) => {
        requested.push(url);
        return Promise.resolve(Response.json({ id: 1 }));
      },
      logger: {
        debug: ({ url }) => logged.push(url),
        error: ({ url }) => logged.push(url),
      },
    });

    await client.get("/berry", 1);

    expect(logged).toEqual([
      "https://poke.example/api/v2/berry/1",
      "https://poke.example/api/v2/berry/1",
    ]);
    // The request itself still carries them, or the instance would reject it.
    expect(requested).toEqual(["https://someone:hunter2@poke.example/api/v2/berry/1"]);
  });

  it("should report the url of a failed request without its credentials", async () => {
    const logged: string[] = [];
    const client = new TestClient({
      baseURL: "https://someone:hunter2@poke.example/api/v2",
      cache: false,
      fetch: () => Promise.reject(new TypeError("fetch failed")),
      logger: {
        debug: () => {},
        error: ({ url }) => logged.push(url),
      },
    });

    await expect(client.get("/berry", 1)).rejects.toThrow(TypeError);
    expect(logged).toEqual(["https://poke.example/api/v2/berry/1"]);
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

  it("should stay silent without a logger", async () => {
    countingHandler(BERRY_URL);
    const log = vi.spyOn(console, "log").mockImplementation(() => {});

    await new TestClient().get("/berry", 1);

    expect(log).not.toHaveBeenCalled();
    log.mockRestore();
  });

  it("should not cache a failed response", async () => {
    let calls = 0;

    server.use(
      http.get(BERRY_URL, () => {
        calls += 1;
        return HttpResponse.json({ detail: "Not found." }, { status: 404 });
      }),
    );

    const client = new TestClient();

    await expect(client.get("/berry", 1)).rejects.toThrow(PokenodeError);
    await expect(client.get("/berry", 1)).rejects.toThrow(PokenodeError);

    expect(calls).toBe(2);
  });
});
