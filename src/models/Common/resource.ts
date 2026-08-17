/**
 * Marks what a link points at.
 *
 * A type parameter that appears nowhere in an interface is not inferable, and
 * every instantiation of it stays mutually assignable — so `NamedAPIResource<T>`
 * needs somewhere to carry `T`. This key exists only in the type system: it is
 * never present at runtime, and reading it is not the point.
 *
 * A `unique symbol` is nominal per declaration, and the package emits one set of
 * declarations per module format — so a link crossing the ESM/CJS boundary keeps
 * assigning structurally but stops carrying `T`, and comes back as `unknown`.
 * Documented in `docs/src/clients/utility-client.md`, alongside the same split
 * behind `PokenodeError.isPokenodeError`.
 */
declare const RESOURCE_TYPE: unique symbol;

/**
 * The name and the URL of the referenced resource.
 *
 * @template T - What the URL resolves to. Defaults to `unknown`, so a link whose
 *   target has not been declared still type-checks; pass it to
 *   {@link UtilityClient.getResourceByUrl} and the resource comes back typed.
 */
export interface NamedAPIResource<T = unknown> {
  /** The name of the referenced resource. */
  name: string;
  /** The URL of the referenced resource. */
  url: string;
  /** Phantom. Never present at runtime. */
  readonly [RESOURCE_TYPE]?: T;
}

/**
 * Calling any API endpoint without a resource ID or name will return a paginated list of available resources for that API.
 * By default, a list "page" will contain up to 20 resources. If you would like to change this just add a 'limit' query parameter
 * to the GET request, e.g. ?=60. You can use 'offset' to move to the next page, e.g. ?limit=60&offset=60.
 *
 * @template T - What the listed links resolve to.
 */
export interface NamedAPIResourceList<T = unknown> {
  /** The total number of resources available from this API. */
  count: number;
  /** The URL for the next page in the list. */
  next: string | null;
  /** The URL for the previous page in the list. */
  previous: string | null;
  /** A list of named API resources. */
  results: NamedAPIResource<T>[];
}

/**
 * A URL for another resource in the API.
 *
 * @template T - What the URL resolves to.
 */
export interface APIResource<T = unknown> {
  /** The URL of the referenced resource. */
  url: string;
  /** Phantom. Never present at runtime. */
  readonly [RESOURCE_TYPE]?: T;
}

/**
 * A paginated list whose entries are identified by URL alone.
 *
 * The `machine`, `contest-effect`, `super-contest-effect`, `evolution-chain` and
 * `characteristic` sections have no names to list, so their entries carry a `url`
 * and nothing else.
 *
 * @template T - What the listed links resolve to.
 */
export interface APIResourceList<T = unknown> {
  /** The total number of resources available from this API. */
  count: number;
  /** The URL for the next page in the list. */
  next: string | null;
  /** The URL for the previous page in the list. */
  previous: string | null;
  /** A list of unnamed API resources. */
  results: APIResource<T>[];
}
