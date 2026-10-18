import { type CacheStore, EtagStore, MemoryCache } from "@config/cache";
import { PokenodeError } from "@config/errors";
import { BASE_URL } from "@constants";
import { HttpResponse, http } from "msw/http";
import { server } from "../../helpers/setup";
import { BERRY_URL, revalidatingHandler, TestClient } from "../../helpers/transport";

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

  it("should keep the validator a 304 carried", async () => {
    const sent: (string | null)[] = [];
    let tag = 'W/"one"';

    server.use(
      http.get(BERRY_URL, ({ request }) => {
        const validator = request.headers.get("If-None-Match");
        sent.push(validator);

        if (validator === null) {
          return HttpResponse.json({ id: 1 }, { headers: { ETag: tag } });
        }

        // RFC 9110 lets a 304 carry a validator of its own, and rotating one is
        // how a server that re-encodes an unchanged body says so.
        tag = 'W/"two"';

        return new HttpResponse(null, { status: 304, headers: { ETag: tag } });
      }),
    );

    const client = new TestClient({ cache: false, revalidate: true });

    await client.get("/berry", 1);
    await client.get("/berry", 1);
    await client.get("/berry", 1);

    // The third request carries what the second was answered with. Holding the
    // stale one instead costs a full body on the next miss.
    expect(sent).toEqual([null, 'W/"one"', 'W/"two"']);
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

  it("should forget its validators when the cache is cleared", async () => {
    const calls = revalidatingHandler();
    const client = new TestClient({ cache: new MemoryCache(), revalidate: true });

    await client.get("/berry", 1);
    await client.clearCache();

    await expect(client.get("/berry", 1)).resolves.toEqual({ id: 1 });
    // Keeping the validator would answer with the body `clearCache` dropped, and
    // hold it in memory besides. An entry lost to its TTL still revalidates.
    expect(calls.sent).toEqual([null, null]);
    expect(calls.bodies).toBe(2);
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

  it("should remember nothing when the store has no room", async () => {
    const calls = revalidatingHandler();
    const client = new TestClient({ cache: false, revalidate: new EtagStore({ maxEntries: 0 }) });

    await client.get("/berry", 1);
    await client.get("/berry", 1);

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
