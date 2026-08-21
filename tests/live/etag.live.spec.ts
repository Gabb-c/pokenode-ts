import { BASE_URL } from "@constants";

/**
 * Tier 3, alongside `drift.live.spec.ts`: the `revalidate` option is worth
 * exactly as much as the PokéAPI's support for conditional requests, and that
 * support is a promise nobody here controls.
 *
 * The unit suite proves the client sends `If-None-Match` and handles a 304. Only
 * a real request proves the API still answers one, so an upstream change that
 * quietly turns revalidation into a full download every time surfaces as drift
 * rather than as a bill nobody notices.
 *
 * One resource per endpoint shape: a single resource, a paginated list, and one
 * of the sections whose entries have no name.
 */

const cases: [name: string, path: string][] = [
  ["a single resource", "/berry/1"],
  ["a paginated list", "/berry?offset=0&limit=20"],
  ["an unnamed resource", "/machine/1"],
];

describe("conditional requests", () => {
  it.each(cases)("should answer 304 for %s", async (_name, path) => {
    const url = `${BASE_URL.REST}${path}`;
    const first = await fetch(url, { headers: { Accept: "application/json" } });
    const etag = first.headers.get("ETag");

    expect(etag, `${url} sent no ETag`).not.toBeNull();

    const second = await fetch(url, {
      headers: { Accept: "application/json", "If-None-Match": etag as string },
    });

    expect(second.status, url).toBe(304);
  });
});
