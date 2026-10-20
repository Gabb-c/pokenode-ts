import { BerryClient, MainClient, type PokemonClient } from "@clients";
import { PokenodeError } from "@config/errors";
import { BASE_URL } from "@constants";
import { HttpResponse, http } from "msw/http";
import { delay } from "msw/utils/delay";
import { server } from "../../helpers/setup";
import {
  BERRY_URL,
  countingHandler,
  settle,
  slowHandler,
  TestClient,
} from "../../helpers/transport";

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
    // pending until aborted, so nothing but the callers leaving can settle it
    const client = new TestClient({
      cache: false,
      fetch: (_url, init) => {
        const signal = init?.signal ?? undefined;
        observed = signal;
        return new Promise<Response>((_resolve, reject) => {
          signal?.addEventListener("abort", () => reject(signal.reason), { once: true });
        });
      },
    });

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

  it("should not hand an abandoned request's cancellation to a later caller", async () => {
    let calls = 0;
    const { promise: reached, resolve: reach } = Promise.withResolvers<void>();

    // A URL of its own: requests earlier tests left on the wire must not reach
    // this handler and skew the count.
    server.use(
      http.get(`${BASE_URL.REST}/berry/abandoned`, async () => {
        calls += 1;
        reach();
        await delay(50);
        return HttpResponse.json({ id: 1 });
      }),
    );

    const client = new TestClient({ cache: false });
    const controller = new AbortController();
    const abandoned = client.with({ signal: controller.signal }).get("/berry", "abandoned");

    await reached;
    controller.abort(new Error("caller left"));

    // Dispatched in the window between the abort and the round trip it cancels
    // settling: joining the dying request here inherits an abort it never asked
    // for.
    const later = client.get("/berry", "abandoned");

    await expect(abandoned).rejects.toThrow("caller left");
    await expect(later).resolves.toEqual({ id: 1 });
    expect(calls).toBe(2);
  });

  it("should keep sharing the request that replaced an abandoned one", async () => {
    // Hand-settled, so the abandoned round trip is still on the wire when its
    // replacement is dispatched — the order the identity check in `release`
    // exists for.
    const started: ((response: Response) => void)[] = [];
    let dispatched = 0;
    const answer = (id: number): void => started.shift()?.(Response.json({ id }));
    const client = new TestClient({
      cache: false,
      fetch: () =>
        new Promise<Response>((resolve) => {
          dispatched += 1;
          started.push(resolve);
        }),
    });

    const controller = new AbortController();
    const abandoned = client.with({ signal: controller.signal }).get("/berry", 1);

    await settle();
    controller.abort(new Error("caller left"));
    await expect(abandoned).rejects.toThrow("caller left");

    const replacement = client.get("/berry", 1);
    await settle();

    answer(0);
    await settle();

    // Joins the replacement rather than dispatching a third round trip, which
    // is what the abandoned request finishing would have cost.
    const joined = client.get("/berry", 1);
    await settle();
    expect(dispatched).toBe(2);

    answer(1);

    await expect(replacement).resolves.toEqual({ id: 1 });
    await expect(joined).resolves.toEqual({ id: 1 });
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

describe("BaseClient.with types", () => {
  it("should derive a client of the class it was called on", () => {
    // Thunks, never invoked: `expectTypeOf` evaluates whatever it is handed.
    const main = () => new MainClient().with({ timeout: 1 });
    const berry = () => new BerryClient().with({ timeout: 1 });

    expectTypeOf(main).returns.toEqualTypeOf<MainClient>();
    expectTypeOf(main).returns.toHaveProperty("pokemon").toEqualTypeOf<PokemonClient>();
    expectTypeOf(berry).returns.toEqualTypeOf<BerryClient>();
  });
});
