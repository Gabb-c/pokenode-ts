import { BerryClient } from "@clients";
import { BASE_URL } from "@constants";
import type { Berry, BerryFirmness, Pokemon, Type } from "@models";
import { HttpResponse, http } from "msw/http";
import { delay } from "msw/utils/delay";
import { server } from "../../helpers/setup";
import { BERRY_URL, TestClient } from "../../helpers/transport";

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

describe("BaseClient.resolve types", () => {
  const api = new BerryClient();
  // Thunks, never invoked: `expectTypeOf` evaluates whatever it is handed.
  const follow = {
    link: () => api.resolve({} as Berry["firmness"]),
    links: () => api.resolveAll([] as Pokemon["types"][number]["type"][]),
    named: () => api.resolve<Berry>("https://pokeapi.co/api/v2/berry/1/"),
    bare: () => api.resolve("https://pokeapi.co/api/v2/berry/1/"),
  };

  it("should infer the resource a link resolves to", () => {
    expectTypeOf(follow.link).returns.resolves.toEqualTypeOf<BerryFirmness>();
    expectTypeOf(follow.links).returns.resolves.toEqualTypeOf<Type[]>();
  });

  it("should still take a bare url with the type named", () => {
    expectTypeOf(follow.named).returns.resolves.toEqualTypeOf<Berry>();
    expectTypeOf(follow.bare).returns.resolves.toEqualTypeOf<unknown>();
  });
});
