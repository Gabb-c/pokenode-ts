import { BASE_URL } from "@constants";

import type { ClientOptions } from "../../src/clients/base";

/**
 * Builds a client whose `fetch` records the URL and answers from memory.
 *
 * Section clients delegate straight to `BaseClient`, so what is worth asserting
 * is the URL a method builds, not the payload it hands back — the payload is
 * whatever the transport returned, and its shape is a compile-time concern.
 *
 * Caching is off so repeated calls in one table are independent.
 */
export const stubClient = <T>(
  Client: new (options?: ClientOptions) => T,
  body: unknown = { id: 1 },
): { client: T; urls: string[] } => {
  const urls: string[] = [];

  const client = new Client({
    cache: false,
    fetch: (url) => {
      urls.push(url);
      return Promise.resolve(Response.json(body));
    },
  });

  return { client, urls };
};

/**
 * One row of an endpoint table: the method under test, the call, and the path
 * it must request relative to {@link BASE_URL.REST}.
 */
export type EndpointCase<T> = [method: string, call: (client: T) => Promise<unknown>, path: string];

/**
 * Runs an endpoint table, asserting each method requests exactly one URL.
 *
 * Registered in a loop rather than with `it.each`, whose positional
 * interpolation would print the callback source in the test title.
 */
export const testEndpoints = <T>(
  Client: new (options?: ClientOptions) => T,
  cases: EndpointCase<T>[],
): void => {
  for (const [method, call, path] of cases) {
    it(`${method} should request ${path}`, async () => {
      const { client, urls } = stubClient(Client);

      await call(client);

      expect(urls).toEqual([`${BASE_URL.REST}${path}`]);
    });
  }
};
