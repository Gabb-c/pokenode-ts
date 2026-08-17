import { BASE_URL } from "@constants";
import type { Berry, NamedAPIResource } from "@models";
import { delay, HttpResponse, http } from "msw";

import { MainClient } from "../../src/clients/main.client";
import { MemoryCache } from "../../src/config/cache";
import { server } from "../helpers/setup";

const BERRY_URL = `${BASE_URL.REST}/berry/1`;

/** Registers a handler for `BERRY_URL` and returns a counter of how often it ran. */
const countBerryCalls = () => {
  const calls = { count: 0 };

  server.use(
    http.get(BERRY_URL, () => {
      calls.count += 1;
      return HttpResponse.json({ id: 1 });
    }),
  );

  return calls;
};

describe("MainClient", () => {
  it("should share one cache across its clients", async () => {
    const calls = countBerryCalls();
    const client = new MainClient();

    await client.berry.getBerryById(1);
    await client.utility.getResourceByUrl(BERRY_URL);

    expect(calls.count).toBe(1);
  });

  it("should serve a slash-terminated resource URL from the cache", async () => {
    const calls = countBerryCalls();
    const client = new MainClient();

    await client.berry.getBerryById(1);
    // The shape the PokéAPI uses for its own links.
    await client.utility.getResourceByUrl(`${BERRY_URL}/`);

    expect(calls.count).toBe(1);
  });

  it("should share a caller-supplied store across its clients", async () => {
    const calls = countBerryCalls();
    const client = new MainClient({ cache: new MemoryCache() });

    await client.berry.getBerryById(1);
    await client.utility.getResourceByUrl(BERRY_URL);

    expect(calls.count).toBe(1);
  });

  it("should keep caching disabled across its clients", async () => {
    const calls = countBerryCalls();
    const client = new MainClient({ cache: false });

    await client.berry.getBerryById(1);
    await client.utility.getResourceByUrl(BERRY_URL);

    expect(calls.count).toBe(2);
  });

  it("should not share a cache between two main clients", async () => {
    const calls = countBerryCalls();

    await new MainClient().berry.getBerryById(1);
    await new MainClient().berry.getBerryById(1);

    expect(calls.count).toBe(2);
  });

  it("should expose the store its clients share", async () => {
    countBerryCalls();
    const client = new MainClient();

    await client.berry.getBerryById(1);

    expect(client.cache).toBe(client.berry.cache);
    expect(client.cache).toBe(client.utility.cache);
  });

  it("should expose no store when caching is disabled", () => {
    expect(new MainClient({ cache: false }).cache).toBeUndefined();
  });

  it("should clear the cache for every client at once", async () => {
    const calls = countBerryCalls();
    const client = new MainClient();

    await client.berry.getBerryById(1);
    await client.clearCache();
    await client.utility.getResourceByUrl(BERRY_URL);

    expect(calls.count).toBe(2);
  });

  it("should pass the remaining options to its clients", async () => {
    const calls: string[] = [];
    const client = new MainClient({
      baseURL: "https://example.test/api/v2",
      fetch: (url) => {
        calls.push(url);
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });

    await client.berry.getBerryById(1);

    expect(calls).toEqual(["https://example.test/api/v2/berry/1"]);
  });

  it("should resolve a link through the shared cache", async () => {
    const calls = countBerryCalls();
    const client = new MainClient();

    const berry = await client.berry.getBerryById(1);
    const resolved = await client.resolve<Berry>(`${BERRY_URL}/`);

    expect(resolved).toEqual(berry);
    expect(calls.count).toBe(1);
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

    const client = new MainClient({ cache: false });
    const links: NamedAPIResource<Berry>[] = [1, 2, 3].map((id) => ({
      name: `berry-${id}`,
      url: `${BASE_URL.REST}/berry/${id}/`,
    }));

    const berries = await client.resolveAll(links);

    expect(berries.map((berry) => berry.id)).toEqual([1, 2, 3]);
  });

  it("should resolve no more links at a time than it was allowed", async () => {
    let inFlight = 0;
    let peak = 0;

    const client = new MainClient({
      cache: false,
      fetch: async () => {
        inFlight += 1;
        peak = Math.max(peak, inFlight);
        await delay(10);
        inFlight -= 1;
        return Response.json({ id: 1 });
      },
    });

    const links = Array.from(
      { length: 6 },
      (_link, index) => `${BASE_URL.REST}/berry/${index + 1}`,
    );

    await client.resolveAll<Berry>(links, { concurrency: 2 });

    expect(peak).toBe(2);
  });

  it("should scope every one of its clients at once", async () => {
    server.use(
      http.get(BERRY_URL, async () => {
        await delay(200);
        return HttpResponse.json({ id: 1 });
      }),
      http.get(`${BASE_URL.REST}/pokemon/1`, async () => {
        await delay(200);
        return HttpResponse.json({ id: 1 });
      }),
    );

    const scoped = new MainClient().with({ timeout: 10 });

    await expect(scoped.berry.getBerryById(1)).rejects.toThrow(/abort|time/i);
    await expect(scoped.pokemon.getPokemonById(1)).rejects.toThrow(/abort|time/i);
  });

  it("should share its cache with the client it scoped", async () => {
    const calls = countBerryCalls();
    const client = new MainClient();
    const scoped = client.with({ timeout: 1_000 });

    await client.berry.getBerryById(1);
    await scoped.utility.getResourceByUrl(BERRY_URL);

    expect(calls.count).toBe(1);
    expect(scoped.cache).toBe(client.cache);
  });

  it("should leave the client it was derived from unscoped", async () => {
    countBerryCalls();
    const client = new MainClient();

    client.with({ timeout: 1 });

    await expect(client.berry.getBerryById(1)).resolves.toEqual({ id: 1 });
  });
});
