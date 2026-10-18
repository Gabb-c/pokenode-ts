import type { ClientOptions } from "@clients/types";
import { BASE_URL } from "@constants";

/**
 * Builds a client whose `fetch` records the URL and answers from memory.
 *
 * Section clients delegate straight to `BaseClient`, so what is worth asserting
 * is the URL a method builds, not the payload it hands back — the payload is
 * whatever the transport returned, and its shape is a compile-time concern.
 *
 * Caching is off so repeated calls in one table are independent.
 */
const stubClient = <T>(
  Client: new (options?: ClientOptions) => T,
): { client: T; urls: string[] } => {
  const urls: string[] = [];

  const client = new Client({
    cache: false,
    fetch: (url) => {
      urls.push(url);
      return Promise.resolve(Response.json({ id: 1 }));
    },
  });

  return { client, urls };
};

/**
 * One row of an endpoint table: the method under test, the path it must request
 * relative to {@link BASE_URL.REST}, and the call that requests it.
 *
 * The path comes before the call so `it.each`'s positional interpolation lands
 * on the two strings and never prints the callback source in the test title.
 */
export type EndpointCase<T> = [method: string, path: string, call: (client: T) => Promise<unknown>];

/**
 * Asserts one endpoint-table row: the call requests exactly one URL, and it is
 * `path` under {@link BASE_URL.REST}.
 *
 * The `it.each` that drives the table stays in the spec file so each file
 * declares its own tests.
 */
export const expectEndpoint = async <T>(
  Client: new (options?: ClientOptions) => T,
  path: string,
  call: (client: T) => Promise<unknown>,
): Promise<void> => {
  const { client, urls } = stubClient(Client);

  await call(client);

  expect(urls).toEqual([`${BASE_URL.REST}${path}`]);
};

/**
 * Asserts an endpoint table names every `get*` and `list*` method the client
 * declares, so a method added without a row fails instead of going untested.
 */
export const expectEveryMethodCovered = <T>(
  Client: new (options?: ClientOptions) => T,
  cases: readonly EndpointCase<T>[],
): void => {
  const declared = Object.getOwnPropertyNames(Client.prototype).filter((name) =>
    /^(?:get|list)[A-Z]/.test(name),
  );
  const tested = new Set(cases.map(([method]) => method));

  expect([...tested].sort()).toEqual(declared.sort());
};
