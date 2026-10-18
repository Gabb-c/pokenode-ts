import type { CacheStore, EtagStore } from "../config/cache";
import type { Logger } from "../config/logger";
import type { APIResource, NamedAPIResource } from "../models/common/resource";

/**
 * ## Fetch Like
 * A `fetch` implementation taking a string URL, as every client call does.
 */
export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

/**
 * ## Resource Link
 * Something naming a single resource: a link taken from a response, or its URL
 * as a bare string.
 *
 * A link carries what it points at, so passing one infers `T`; a string does
 * not, and needs `T` named.
 */
export type ResourceLink<T> = string | NamedAPIResource<T> | APIResource<T>;

/**
 * ## Retry Options
 * When a failed request is worth attempting again.
 *
 * Retrying is off unless this is given — a client that quietly triples its own
 * traffic is not something to opt out of after the fact.
 */
export interface RetryOptions {
  /** Attempts in total, the first one included. Defaults to 3. */
  attempts?: number;
  /** Statuses worth another attempt. Defaults to 429, 500, 502, 503 and 504. */
  statuses?: number[];
  /** The first wait, in milliseconds, doubling from there. Defaults to 300. */
  initialDelay?: number;
  /** The longest this client will ever wait between attempts. Defaults to 5000. */
  maxDelay?: number;
}

/**
 * ## Request Scope
 * Cancellation applied to every request a client makes.
 *
 * Passed to {@link ClientFacade.with}, not to the constructor: a signal belongs
 * to one unit of work, while a client outlives many, and a client holding a
 * signal for its whole life is dead the first time that signal aborts.
 */
export interface RequestScope {
  /** Aborts the requests made through this scope. */
  signal?: AbortSignal;
  /** How long a request may take, in milliseconds, before it is aborted. */
  timeout?: number;
}

/**
 * ## Client Options
 * Optional configuration accepted by every client.
 */
export interface ClientOptions {
  /**
   * Where the request lifecycle is reported. Leave empty to log nothing, or pass
   * {@link consoleLogger} to write it to the console.
   */
  logger?: Logger;
  /**
   * Response cache. Leave empty for an in-memory {@link MemoryCache}, pass `false`
   * to disable caching, or supply your own {@link CacheStore}.
   */
  cache?: CacheStore | false;
  /** Location of the PokéAPI. Leave empty to use the official PokéAPI instance. */
  baseURL?: string;
  /**
   * Custom `fetch` implementation, for proxies, retries, cancellation or
   * instrumentation. Defaults to the global `fetch`.
   *
   * Requests carry no timeout of their own: derive a scoped client with
   * {@link ClientFacade.with} if you want one.
   */
  fetch?: FetchLike;
  /**
   * When to attempt a failed request again. Leave empty to attempt each request
   * exactly once.
   */
  retry?: RetryOptions;
  /**
   * Ask the PokéAPI whether a response has changed, rather than downloading it
   * again, once the {@link CacheStore} entry for it has expired.
   *
   * Pass `true` for a default {@link EtagStore}, or one of your own to size it.
   * Leave empty and every expired entry is refetched in full.
   */
  revalidate?: boolean | EtagStore;
}

/**
 * ## Client Stats
 * How many resolutions came from where, since the client was built.
 *
 * One count per `source` a {@link LogResponsePayload} reports, which is the only
 * thing that tells a cache hit from a revalidation from a real round trip once
 * the promise has settled. A failed request is counted by neither: it resolved
 * nothing, and it is the logger's `error` event that has it.
 */
export interface ClientStats {
  /** Responses downloaded in full. */
  network: number;
  /** Responses answered from the {@link CacheStore}, with no request made. */
  cache: number;
  /** Callers that joined a request already on the wire rather than repeating it. */
  inFlight: number;
  /** Responses the PokéAPI answered `304` for, served from the {@link EtagStore}. */
  revalidated: number;
  /**
   * Requests that left the process — what the PokéAPI actually saw.
   *
   * Not `network + revalidated`. A revalidation is a round trip that saved a
   * body rather than a request that never happened, so it is in here; and a
   * resolution the `retry` option attempted three times is one `network` and
   * three of these. The attempts are the half a caller cannot see, and they are
   * the half that shows up in someone else's rate limit.
   */
  roundTrips: number;
}

/**
 * ## List Page
 * The part of a resource list a walk needs: how much there is, and this page of
 * it. Both {@link NamedAPIResourceList} and {@link APIResourceList} qualify.
 */
export interface ListPage<L> {
  count: number;
  results: L[];
}

/**
 * ## List Fn
 * A list method, called with the offset and the limit of the page to fetch.
 */
export type ListFn<L> = (offset: number, limit: number) => Promise<ListPage<L>>;

/**
 * ## List Method
 * The shape every `list*` method on a section client has.
 */
export type ListMethod = (
  offset?: number,
  limit?: number,
) => Promise<ListPage<APIResource<unknown>>>;

/**
 * ## List Method Name
 * The names of `C`'s own list methods, and nothing else — so naming one to
 * {@link BaseClient.paginate} is checked and completed by the compiler.
 */
export type ListMethodName<C> = {
  [K in keyof C]: C[K] extends ListMethod ? K : never;
}[keyof C];

/** What a list method's page is made of. */
export type Listed<F> = F extends (offset?: number, limit?: number) => Promise<ListPage<infer L>>
  ? L
  : never;

/** What a listed link resolves to. */
export type Resolves<L> = L extends APIResource<infer T> ? T : never;

/**
 * ## Paginate Options
 * How {@link BaseClient.paginate} walks a list endpoint.
 */
export interface PaginateOptions {
  /** Entries fetched per request. Defaults to 20. */
  pageSize?: number;
  /** Fetch each link and yield the resource instead. Defaults to `false`. */
  resolve?: boolean;
  /** Links resolved at a time, when `resolve` is set. Defaults to 4. */
  concurrency?: number;
}

/**
 * ## Resolve Options
 * How {@link ClientFacade.resolveAll} fetches the links it was given.
 */
export interface ResolveOptions {
  /** Links fetched at a time. Defaults to 4. */
  concurrency?: number;
}
