import { BASE_URL, type Endpoint } from "@constants";
import { delay, HttpResponse, http, type JsonBodyType } from "msw";

import { BaseClient, type RetryOptions } from "../../src/clients/base";
import { type CacheStore, EtagStore, MemoryCache } from "../../src/config/cache";
import { PokenodeError } from "../../src/config/errors";
import { server } from "../helpers/setup";

/** Exposes the protected request helpers so they can be exercised directly. */
class TestClient extends BaseClient {
  get<T>(endpoint: Endpoint, ...segments: (string | number)[]): Promise<T> {
    return this.getResource<T>(endpoint, ...segments);
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

  it("should normalize a long run of slashes without backtracking", async () => {
    const requested: string[] = [];
    // A run of slashes that does not end the string is what a backtracking
    // pattern walks quadratically. This resolves in milliseconds, or the test
    // times out.
    const baseURL = `https://example.test/${"/".repeat(200_000)}api/v2`;
    const client = new TestClient({
      baseURL,
      cache: false,
      fetch: (url) => {
        requested.push(url);
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });

    await client.get("/berry", 1);

    expect(requested).toEqual([`${baseURL}/berry/1`]);
  });

  it("should leave a trailing slash inside the query string alone", async () => {
    const requested: string[] = [];
    const client = new TestClient({
      baseURL: "https://example.test/api/v2",
      cache: false,
      fetch: (url) => {
        requested.push(url);
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });

    await client.getByURL("https://example.test/api/v2/berry?q=a/");

    expect(requested).toEqual(["https://example.test/api/v2/berry?q=a/"]);
  });

  it("should encode an identifier instead of letting it reach past the endpoint", async () => {
    const requested: string[] = [];
    const client = new TestClient({
      cache: false,
      fetch: (url) => {
        requested.push(url);
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });

    // A name is whatever the caller passed, and `getBerryByName(req.query.name)`
    // is the shape that call takes. Unencoded, a `?` addresses another query and
    // a `/` another endpoint.
    await client.get("/berry", "cheri?limit=99999");
    await client.get("/berry", "../pokemon/1");
    await client.get("/berry", "cheri#frag");

    expect(requested).toEqual([
      `${BASE_URL.REST}/berry/cheri%3Flimit%3D99999`,
      `${BASE_URL.REST}/berry/..%2Fpokemon%2F1`,
      `${BASE_URL.REST}/berry/cheri%23frag`,
    ]);
  });

  it("should leave a valid resource name untouched", async () => {
    const requested: string[] = [];
    const client = new TestClient({
      cache: false,
      fetch: (url) => {
        requested.push(url);
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });

    await client.get("/berry", "chesto");
    await client.get("/pokemon", "mr-mime");

    expect(requested).toEqual([
      `${BASE_URL.REST}/berry/chesto`,
      `${BASE_URL.REST}/pokemon/mr-mime`,
    ]);
  });

  it("should join a path below the endpoint without encoding the separator", async () => {
    const requested: string[] = [];
    const client = new TestClient({
      cache: false,
      fetch: (url) => {
        requested.push(url);
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });

    await client.get("/pokemon", 25, "encounters");

    expect(requested).toEqual([`${BASE_URL.REST}/pokemon/25/encounters`]);
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

  it("should send a credentialed baseURL as an Authorization header", async () => {
    const requested: string[] = [];
    const sent: RequestInit["headers"][] = [];
    const logged: string[] = [];
    const store = new RecordingStore();
    const client = new TestClient({
      baseURL: "https://someone:hunter2@poke.example/api/v2",
      cache: store,
      fetch: (url, init) => {
        requested.push(url);
        sent.push(init?.headers);
        return Promise.resolve(Response.json({ id: 1 }));
      },
      logger: {
        debug: ({ url }) => logged.push(url),
        error: ({ url }) => logged.push(url),
      },
    });

    await client.get("/berry", 1);

    // Native `fetch` rejects a URL carrying userinfo, so the credentials travel
    // as a header and nothing downstream of the URL ever sees them.
    expect(requested).toEqual(["https://poke.example/api/v2/berry/1"]);
    expect(sent).toEqual([
      { Accept: "application/json", Authorization: `Basic ${btoa("someone:hunter2")}` },
    ]);
    expect(logged).toEqual([
      "https://poke.example/api/v2/berry/1",
      "https://poke.example/api/v2/berry/1",
    ]);
    expect(store.writes).toEqual([["https://poke.example/api/v2/berry/1", { id: 1 }]]);
  });

  it("should percent-decode credentials before encoding them", async () => {
    const sent: RequestInit["headers"][] = [];
    const client = new TestClient({
      baseURL: "https://someone:hunter%402@poke.example/api/v2",
      cache: false,
      fetch: (_url, init) => {
        sent.push(init?.headers);
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });

    await client.get("/berry", 1);

    expect(sent).toEqual([
      { Accept: "application/json", Authorization: `Basic ${btoa("someone:hunter@2")}` },
    ]);
  });

  it("should send credentials it cannot percent-decode as they stand", async () => {
    const sent: RequestInit["headers"][] = [];
    // `URL` parses `%zz` happily; `decodeURIComponent` rejects it.
    const client = new TestClient({
      baseURL: "https://some%zzone:hunter2@poke.example/api/v2",
      cache: false,
      fetch: (_url, init) => {
        sent.push(init?.headers);
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });

    await expect(client.get("/berry", 1)).resolves.toEqual({ id: 1 });
    expect(sent).toEqual([
      { Accept: "application/json", Authorization: `Basic ${btoa("some%zzone:hunter2")}` },
    ]);
  });

  it("should leave a url it cannot parse exactly as it stands", async () => {
    const requested: string[] = [];
    const sent: RequestInit["headers"][] = [];
    // Looks credentialed but has no scheme, so `URL` refuses it. Nothing can be
    // stripped from a string nobody can parse, and `fetch` is the one to complain.
    const client = new TestClient({
      baseURL: "://someone:hunter2@poke.example/api/v2",
      cache: false,
      fetch: (url, init) => {
        requested.push(url);
        sent.push(init?.headers);
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });

    await client.get("/berry", 1);

    expect(requested).toEqual(["://someone:hunter2@poke.example/api/v2/berry/1"]);
    expect(sent).toEqual([{ Accept: "application/json" }]);
  });

  it("should not read an at sign in a path as credentials", async () => {
    const requested: string[] = [];
    const sent: RequestInit["headers"][] = [];
    const client = new TestClient({
      cache: false,
      fetch: (url, init) => {
        requested.push(url);
        sent.push(init?.headers);
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });

    // `@` is a legal path character, so a link can carry one with no userinfo
    // in front of it. Only a parsed username or password is a credential.
    await client.getByURL(`${BASE_URL.REST}/berry/a@b`);

    expect(requested).toEqual([`${BASE_URL.REST}/berry/a@b`]);
    expect(sent).toEqual([{ Accept: "application/json" }]);
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

/**
 * Answers with each status in turn, then `{ id: 1 }`, and counts the attempts.
 * `Retry-After` rides along on every failure when given.
 */
const failingHandler = (statuses: number[], retryAfter?: string) => {
  const calls = { count: 0 };

  server.use(
    http.get(BERRY_URL, () => {
      const status = statuses[calls.count];
      calls.count += 1;

      if (status === undefined) {
        return HttpResponse.json({ id: 1 });
      }

      return HttpResponse.json(
        { detail: "no" },
        retryAfter === undefined ? { status } : { status, headers: { "Retry-After": retryAfter } },
      );
    }),
  );

  return calls;
};

/** Retries with no wait worth measuring, so a test asserts attempts, not timing. */
const IMMEDIATE: RetryOptions = { attempts: 3, initialDelay: 0 };

/**
 * Lets every pending callback run, so a request has reached the transport and
 * every concurrent caller has joined it before a test aborts anything.
 */
const settle = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

/** Answers `BERRY_URL` after `ms`, so a scope has something to give up on. */
const slowHandler = (ms: number): void => {
  server.use(
    http.get(BERRY_URL, async () => {
      await delay(ms);
      return HttpResponse.json({ id: 1 });
    }),
  );
};

describe("BaseClient scope", () => {
  it("should abort a request that outlives its timeout", async () => {
    slowHandler(200);

    const error = await new TestClient()
      .with({ timeout: 10 })
      .get("/berry", 1)
      .catch((caught: unknown) => caught);

    expect(PokenodeError.isPokenodeError(error)).toBe(false);
    expect((error as Error).name).toBe("TimeoutError");
  });

  it("should reject with the reason the caller aborted with", async () => {
    slowHandler(200);

    const controller = new AbortController();
    const reason = new Error("caller went away");
    const request = new TestClient().with({ signal: controller.signal }).get("/berry", 1);

    controller.abort(reason);

    await expect(request).rejects.toBe(reason);
  });

  it("should reject a call made through an already-aborted scope", async () => {
    const requested: string[] = [];
    const client = new TestClient({
      fetch: (url) => {
        requested.push(url);
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });
    const controller = new AbortController();

    controller.abort(new Error("gone"));

    await expect(client.with({ signal: controller.signal }).get("/berry", 1)).rejects.toThrow(
      "gone",
    );
    // The point of the test: a scope that has already aborted makes no request.
    expect(requested).toEqual([]);
  });

  it("should not serve a call made through an already-aborted scope from the cache", async () => {
    const calls = countingHandler(BERRY_URL);
    const client = new TestClient();
    const controller = new AbortController();

    await client.get("/berry", 1);
    controller.abort(new Error("gone"));

    await expect(client.with({ signal: controller.signal }).get("/berry", 1)).rejects.toThrow(
      "gone",
    );
    expect(calls.count).toBe(1);
  });

  it("should keep a shared request alive for the callers that remain", async () => {
    slowHandler(50);

    const client = new TestClient({ cache: false });
    const controller = new AbortController();

    const abandoned = client.with({ signal: controller.signal }).get("/berry", 1);
    const kept = client.get("/berry", 1);

    await settle();
    controller.abort(new Error("first caller left"));

    await expect(abandoned).rejects.toThrow("first caller left");
    await expect(kept).resolves.toEqual({ id: 1 });
  });

  it("should cancel the round trip once its last caller has left", async () => {
    let observed: AbortSignal | undefined;
    const client = new TestClient({
      cache: false,
      fetch: (url, init) => {
        observed = init?.signal ?? undefined;
        return fetch(url, init);
      },
    });

    slowHandler(200);

    const first = new AbortController();
    const second = new AbortController();
    const requests = [
      client.with({ signal: first.signal }).get("/berry", 1),
      client.with({ signal: second.signal }).get("/berry", 1),
    ];

    await settle();

    first.abort(new Error("first"));
    expect(observed?.aborted).toBe(false);

    second.abort(new Error("second"));
    expect(observed?.aborted).toBe(true);

    await expect(Promise.allSettled(requests)).resolves.toHaveLength(2);
  });

  it("should share the cache and the in-flight request with the client it came from", async () => {
    const calls = countingHandler(BERRY_URL);
    const client = new TestClient();
    const scoped = client.with({ timeout: 1_000 });

    // Concurrent, so the second call can only be served by the in-flight map.
    await Promise.all([client.get("/berry", 1), scoped.get("/berry", 1)]);
    // Sequential, so this one can only be served by the shared cache.
    await scoped.get("/berry", 1);

    expect(calls.count).toBe(1);
    expect(client.cache).toBe(scoped.cache);
  });

  it("should merge what each derivation adds to the scope", async () => {
    slowHandler(200);

    const controller = new AbortController();
    const error = await new TestClient()
      .with({ signal: controller.signal })
      .with({ timeout: 10 })
      .get("/berry", 1)
      .catch((caught: unknown) => caught);

    expect((error as Error).name).toBe("TimeoutError");
  });

  it("should leave the client it was derived from unscoped", async () => {
    let received: RequestInit | undefined;
    const client = new TestClient({
      cache: false,
      fetch: (_url, init) => {
        received = init;
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });

    client.with({ timeout: 10 });
    await client.get("/berry", 1);

    expect(received?.signal).toBeUndefined();
  });
});

/**
 * Answers with an `ETag`, and with 304 whenever the request already carries it.
 * Records what each attempt sent, so a test can see the validator go out.
 */
const revalidatingHandler = (etag = 'W/"one"') => {
  const calls = { sent: [] as (string | null)[], bodies: 0, tag: etag };

  server.use(
    http.get(BERRY_URL, ({ request }) => {
      const sent = request.headers.get("If-None-Match");
      calls.sent.push(sent);

      if (sent === calls.tag) {
        return new HttpResponse(null, { status: 304, headers: { ETag: calls.tag } });
      }

      calls.bodies += 1;

      return HttpResponse.json({ id: 1 }, { headers: { ETag: calls.tag } });
    }),
  );

  return calls;
};

describe("BaseClient revalidation", () => {
  it("should send no validator when revalidation is off", async () => {
    const calls = revalidatingHandler();
    const client = new TestClient({ cache: false });

    await client.get("/berry", 1);
    await client.get("/berry", 1);

    expect(calls.sent).toEqual([null, null]);
    expect(calls.bodies).toBe(2);
  });

  it("should revalidate an expired entry instead of downloading it again", async () => {
    const calls = revalidatingHandler();
    // No cache, so every call reaches the transport — the same position an
    // expired entry leaves a client in, without waiting for a TTL.
    const client = new TestClient({ cache: false, revalidate: true });

    const first = await client.get("/berry", 1);
    const second = await client.get("/berry", 1);

    expect(calls.sent).toEqual([null, 'W/"one"']);
    // One body downloaded, two resolutions.
    expect(calls.bodies).toBe(1);
    expect(second).toEqual(first);
  });

  it("should report a revalidated response as such", async () => {
    revalidatingHandler();
    const sources: string[] = [];
    const client = new TestClient({
      cache: false,
      revalidate: true,
      logger: {
        debug: (payload) => {
          if (payload.event === "response") {
            sources.push(payload.source);
          }
        },
        error: () => {},
      },
    });

    await client.get("/berry", 1);
    await client.get("/berry", 1);

    expect(sources).toEqual(["network", "revalidated"]);
  });

  it("should take the new body when the validator no longer matches", async () => {
    const calls = revalidatingHandler();
    const client = new TestClient({ cache: false, revalidate: true });

    await client.get("/berry", 1);
    calls.tag = 'W/"two"';

    await expect(client.get("/berry", 1)).resolves.toEqual({ id: 1 });
    expect(calls.bodies).toBe(2);
    // The validator it learned the second time is the one it sends next.
    await client.get("/berry", 1);
    expect(calls.sent).toEqual([null, 'W/"one"', 'W/"two"']);
  });

  it("should write a revalidated body back to the cache", async () => {
    const calls = revalidatingHandler();
    // Every read misses, so the client always reaches the transport, and every
    // write is recorded — which is what a store sees when its entries expire.
    const store = new (class implements CacheStore {
      readonly writes: [string, unknown][] = [];
      get(): unknown {
        return undefined;
      }
      set(key: string, value: unknown): void {
        this.writes.push([key, value]);
      }
    })();

    const client = new TestClient({ cache: store, revalidate: true });

    await client.get("/berry", 1);
    await client.get("/berry", 1);

    expect(calls.bodies).toBe(1);
    // The second write came from the 304, and carries the body of the first.
    expect(store.writes).toEqual([
      [BERRY_URL, { id: 1 }],
      [BERRY_URL, { id: 1 }],
    ]);
  });

  it("should keep a body the cache has already dropped", async () => {
    const calls = revalidatingHandler();
    const client = new TestClient({ cache: new MemoryCache(), revalidate: true });

    await client.get("/berry", 1);
    await client.clearCache();

    await expect(client.get("/berry", 1)).resolves.toEqual({ id: 1 });
    // The cache lost it, the ETag store did not: revalidated, not downloaded.
    expect(calls.sent).toEqual([null, 'W/"one"']);
    expect(calls.bodies).toBe(1);
  });

  it("should share what it learned with a scoped client", async () => {
    const calls = revalidatingHandler();
    const client = new TestClient({ cache: false, revalidate: true });

    await client.get("/berry", 1);
    await client.with({ timeout: 1_000 }).get("/berry", 1);

    expect(calls.sent).toEqual([null, 'W/"one"']);
    expect(calls.bodies).toBe(1);
  });

  it("should forget the least recently used url once it is full", async () => {
    const calls = revalidatingHandler();

    server.use(
      http.get(`${BASE_URL.REST}/berry/2`, () =>
        HttpResponse.json({ id: 2 }, { headers: { ETag: 'W/"two"' } }),
      ),
    );

    const client = new TestClient({ cache: false, revalidate: new EtagStore({ maxEntries: 1 }) });

    await client.get("/berry", 1);
    await client.get("/berry", 2);
    await client.get("/berry", 1);

    // Berry 1 was evicted by berry 2, so its second call carried no validator.
    expect(calls.sent).toEqual([null, null]);
    expect(calls.bodies).toBe(2);
  });

  it("should say so when a 304 arrives with no stored response behind it", async () => {
    // An intermediary answering 304 to a request this client sent no validator
    // with: nothing here asked for it, so nothing here can satisfy it.
    server.use(http.get(BERRY_URL, () => new HttpResponse(null, { status: 304 })));

    const error = (await new TestClient({ cache: false, revalidate: true })
      .get("/berry", 1)
      .catch((caught: unknown) => caught)) as PokenodeError;

    expect(PokenodeError.isPokenodeError(error)).toBe(true);
    expect(error.status).toBe(304);
    expect(error.message).toMatch(/no response to reuse/);
  });
});

describe("BaseClient.resolve", () => {
  it("should fetch what a link points at from a section client", async () => {
    server.use(http.get(BERRY_URL, () => HttpResponse.json({ id: 1 })));

    // No `MainClient` and no `UtilityClient` in sight: a link names a resource,
    // not a section, so any client resolves any link.
    await expect(new TestClient().resolve(`${BERRY_URL}/`)).resolves.toEqual({ id: 1 });
  });

  it("should resolve a link through its own cache", async () => {
    let calls = 0;

    server.use(
      http.get(BERRY_URL, () => {
        calls += 1;
        return HttpResponse.json({ id: 1 });
      }),
    );

    const client = new TestClient();

    await client.get("/berry", 1);
    await client.resolve(`${BERRY_URL}/`);

    expect(calls).toBe(1);
  });

  it("should resolve many links in the order they were given", async () => {
    server.use(
      http.get(`${BASE_URL.REST}/berry/:id`, async ({ params }) => {
        const id = Number(params.id);
        // Answered slowest first, so completion order cannot be input order.
        await delay((4 - id) * 20);
        return HttpResponse.json({ id });
      }),
    );

    const links = [1, 2, 3].map((id) => `${BASE_URL.REST}/berry/${id}/`);
    const berries = await new TestClient({ cache: false }).resolveAll<{ id: number }>(links);

    expect(berries.map((berry) => berry.id)).toEqual([1, 2, 3]);
  });

  it("should fall back to the default when the concurrency is not a number", async () => {
    server.use(
      http.get(`${BASE_URL.REST}/berry/:id`, ({ params }) =>
        HttpResponse.json({ id: Number(params.id) }),
      ),
    );

    const links = [1, 2, 3].map((id) => `${BASE_URL.REST}/berry/${id}/`);

    // `Array.from({ length: NaN })` is empty, so a pool sized from a non-finite
    // count used to run no work at all and hand back a hole per link — the same
    // `Number(process.env.CONCURRENCY)` the retry attempt count guards against.
    const berries = await new TestClient({ cache: false }).resolveAll<{ id: number }>(links, {
      concurrency: Number.NaN,
    });

    expect(berries.map((berry) => berry.id)).toEqual([1, 2, 3]);
  });

  it("should carry the scope it was derived with", async () => {
    server.use(
      http.get(BERRY_URL, async () => {
        await delay(80);
        return HttpResponse.json({ id: 1 });
      }),
    );

    await expect(new TestClient().with({ timeout: 20 }).resolve(`${BERRY_URL}/`)).rejects.toThrow(
      /abort|time/i,
    );
  });
});

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
