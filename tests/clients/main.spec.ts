import { BASE_URL } from "@constants";
import { HttpResponse, http } from "msw";

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
});
