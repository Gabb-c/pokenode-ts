import { type CacheStore, MemoryCache } from "../config/cache";
import { toPokenodeError } from "../config/errors";
import { type Logger, type LogResponsePayload, logMessage } from "../config/logger";
import { BASE_URL, type Endpoint } from "../constants";
import type {
  APIResource,
  APIResourceList,
  NamedAPIResource,
  NamedAPIResourceList,
} from "../models/Common/resource";
import { mapWithConcurrency } from "../utils/pool";

/**
 * Scanned rather than matched with `/\/+$/`: that pattern backtracks through
 * every slash of a long run that turns out not to end the string, which is
 * quadratic on a URL an untrusted caller supplies. This walks each character
 * once.
 */
const trimTrailingSlash = (url: string): string => {
  let end = url.length;

  while (end > 0 && url[end - 1] === "/") {
    end -= 1;
  }

  return url.slice(0, end);
};

/** Builds the paginated request path shared by both list methods. */
const listPath = (endpoint: Endpoint, offset: number, limit: number): string => {
  const query = new URLSearchParams({ offset: String(offset), limit: String(limit) });

  return `${endpoint}?${query}`;
};

/**
 * Drops the trailing slash from a request URL, leaving any query string alone.
 *
 * Both call paths must produce one cache key: `getResource` builds `/berry/1`,
 * while the PokéAPI's own links end in a slash.
 *
 * Split at the query rather than matched with a lookahead, for the reason given
 * on {@link trimTrailingSlash}.
 */
const normalizeURL = (url: string): string => {
  const queryAt = url.indexOf("?");

  if (queryAt === -1) {
    return trimTrailingSlash(url);
  }

  return trimTrailingSlash(url.slice(0, queryAt)) + url.slice(queryAt);
};

/** A path segment naming an API version, as in `/api/v2/berry/1`. */
const API_VERSION_SEGMENT = /^v\d+$/;

/** Base64-encodes userinfo as RFC 7617 wants it: UTF-8 bytes, percent-decoded. */
const toBasicAuth = (username: string, password: string): string => {
  const userinfo = `${decodeURIComponent(username)}:${decodeURIComponent(password)}`;
  const bytes = new TextEncoder().encode(userinfo);
  let latin1 = "";

  for (const byte of bytes) {
    latin1 += String.fromCharCode(byte);
  }

  return `Basic ${btoa(latin1)}`;
};

/** A request URL and the `Authorization` header its userinfo became, if any. */
interface CredentiallessURL {
  url: string;
  authorization: string | undefined;
}

/**
 * Moves any credentials a URL carries into an `Authorization` header.
 *
 * A self-hosted instance behind basic auth is configured as
 * `https://user:secret@host/api/v2`, and that password must not reach the wire
 * as userinfo: `fetch` rejects a credentialed URL outright, and everything
 * downstream of the URL — the log payload, the cache key — would carry it.
 *
 * A URL too malformed to parse cannot carry credentials in the first place, and
 * `fetch` is about to reject it anyway, so it is passed through untouched.
 */
const splitCredentials = (url: string): CredentiallessURL => {
  if (!url.includes("@")) {
    return { url, authorization: undefined };
  }

  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return { url, authorization: undefined };
  }

  if (!parsed.username && !parsed.password) {
    return { url, authorization: undefined };
  }

  const authorization = toBasicAuth(parsed.username, parsed.password);

  parsed.username = "";
  parsed.password = "";

  return { url: parsed.toString(), authorization };
};

/**
 * Reduces an absolute resource URL to the endpoint path to request.
 *
 * When the URL belongs to `baseURL`, the path is simply what follows it.
 * Otherwise — a link from pokeapi.co handed to a client aimed at a self-hosted
 * instance — the path after the API version segment is used, so the resource is
 * re-resolved against the client's own base rather than fetched from elsewhere.
 *
 * The version segment is matched on parsed URL components: a raw-string search
 * also matches a host like `api.v2.example.com`.
 */
const toEndpointPath = (resourceURL: string, baseURL: string): string => {
  const resource = new URL(resourceURL);
  const base = new URL(baseURL);
  const basePath = trimTrailingSlash(base.pathname);

  if (
    resource.origin === base.origin &&
    (resource.pathname === basePath || resource.pathname.startsWith(`${basePath}/`))
  ) {
    return `${resource.pathname.slice(basePath.length)}${resource.search}`;
  }

  const segments = resource.pathname.split("/");
  const version = segments.findIndex((segment) => API_VERSION_SEGMENT.test(segment));

  if (version === -1) {
    throw new TypeError(`Cannot resolve "${resourceURL}" against the base URL "${baseURL}"`);
  }

  return `/${segments.slice(version + 1).join("/")}${resource.search}`;
};

/**
 * ## Fetch Like
 * A `fetch` implementation taking a string URL, as every client call does.
 */
export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

/** A parsed response body and the status it arrived with. */
interface FetchedResource {
  data: unknown;
  status: number;
}

/**
 * A request already on the wire, and what it takes to cancel it.
 *
 * `waiters` counts the callers still interested. The request is aborted only
 * when the last of them has left, so one caller giving up does not cancel the
 * round trip the others are sharing.
 */
interface InFlightRequest {
  promise: Promise<FetchedResource>;
  /** Absent when the caller that started the request had nothing to cancel it with. */
  controller: AbortController | undefined;
  waiters: number;
}

/**
 * The PokéAPI's own default, and `getListResource`'s, so a walk pages the way a
 * hand-written loop would.
 */
const DEFAULT_PAGE_SIZE = 20;
/** Kept low on purpose: see the PokéAPI fair-use policy. */
const DEFAULT_CONCURRENCY = 4;

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
 * ## Request Scope
 * Cancellation applied to every request a client makes.
 *
 * Passed to {@link BaseClient.with}, not to the constructor: a signal belongs to
 * one unit of work, while a client outlives many, and a client holding a signal
 * for its whole life is dead the first time that signal aborts.
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
   * Requests carry no timeout of their own: supply an `AbortSignal` here if you
   * want one.
   */
  fetch?: FetchLike;
}

/**
 * ## Base Client
 * Base class for every section client. Handles requests to the PokéAPI, along
 * with caching and logging.
 */
export class BaseClient {
  /** The store backing this client, or `undefined` when caching is disabled. */
  public readonly cache: CacheStore | undefined;

  private readonly baseURL: string;
  private readonly logger: Logger | undefined;
  private readonly fetch: FetchLike;
  private readonly scope: RequestScope = {};
  /** Requests already on the wire, so concurrent callers share one round trip. */
  private readonly inFlight = new Map<string, InFlightRequest>();

  constructor(clientOptions?: ClientOptions) {
    this.baseURL = trimTrailingSlash(clientOptions?.baseURL ?? BASE_URL.REST);
    this.cache =
      clientOptions?.cache === false ? undefined : (clientOptions?.cache ?? new MemoryCache());
    this.logger = clientOptions?.logger;
    this.fetch = clientOptions?.fetch ?? ((input, init) => globalThis.fetch(input, init));
  }

  /**
   * Derives a client whose requests carry a signal, a timeout, or both.
   *
   * The clone shares this client's cache and its in-flight requests, so a scoped
   * call still joins an identical unscoped one instead of repeating it. Cloning
   * is cheap, but not free: derive one per unit of work — a request handler, a
   * job — rather than one per call.
   *
   * ```ts
   * const scoped = api.with({ signal: request.signal, timeout: 2_000 });
   * ```
   */
  public with(scope: RequestScope): this {
    const clone = Object.create(Object.getPrototypeOf(this) as object) as this;

    return Object.assign(clone, this, { scope: { ...this.scope, ...scope } });
  }

  /**
   * Drops every cached response. A {@link CacheStore} that does not implement
   * `clear` is left alone.
   */
  public async clearCache(): Promise<void> {
    await this.cache?.clear?.();
  }

  /**
   * Resolves a resource through the cache, then through any identical request
   * already in flight, and only then over the network.
   *
   * The URL is joined by concatenation: `new URL(path, base)` would discard the
   * base's own `/api/v2` path.
   */
  private async request<T>(path: string, baseURL = this.baseURL): Promise<T> {
    // Credentials leave the URL before anything else sees it: `fetch` rejects a
    // credentialed URL, and the cache key and log payload are built from this.
    const { url, authorization } = splitCredentials(
      normalizeURL(`${trimTrailingSlash(baseURL)}${path.startsWith("/") ? path : `/${path}`}`),
    );

    const startedAt = performance.now();

    this.logger?.debug({
      event: "request",
      ...logMessage("pokeapi request"),
      method: "GET",
      url,
    });

    const cached = await this.cache?.get(url);

    if (cached !== undefined) {
      // A hit is timed like any other resolution: the number is small, but a
      // store on the far side of a network is not guaranteed to make it so.
      this.logResponse(url, 200, "cache", startedAt);
      return cached as T;
    }

    // Every caller reports its own outcome, including one that only joined a
    // request someone else started: a `request` event with no `response` to
    // close it would make concurrent traffic unreadable. `source` is what keeps
    // the count of round trips honest when several callers share one.
    const signal = this.requestSignal();
    const pending = this.inFlight.get(url);
    const entry = pending ?? this.dispatch(url, authorization, signal);

    try {
      const { data, status } = await this.join(url, entry, signal);

      this.logResponse(url, status, pending ? "in-flight" : "network", startedAt);

      return data as T;
    } catch (error) {
      this.logger?.error({
        event: "error",
        ...logMessage("pokeapi request failed"),
        url,
        err: error,
        error,
      });
      throw error;
    }
  }

  /**
   * The signal this scope puts on a request, or none when it has nothing to
   * cancel with. A timeout is created per request, not per scope: a scope is
   * derived once and used many times.
   */
  private requestSignal(): AbortSignal | undefined {
    const { signal, timeout } = this.scope;

    if (timeout === undefined) {
      return signal;
    }

    const expiry = AbortSignal.timeout(timeout);

    return signal ? AbortSignal.any([signal, expiry]) : expiry;
  }

  /** Issues a request and remembers it, so a concurrent caller can share it. */
  private dispatch(
    url: string,
    authorization: string | undefined,
    signal: AbortSignal | undefined,
  ): InFlightRequest {
    // The request is cancelled through a controller of its own rather than the
    // caller's signal: the callers sharing it come and go, and only the last one
    // to leave may cancel it.
    const controller = signal ? new AbortController() : undefined;
    const entry: InFlightRequest = {
      promise: this.fetchResource(url, authorization, controller?.signal),
      controller,
      waiters: 0,
    };

    entry.promise = entry.promise.finally(() => this.release(url, entry));

    // A request abandoned by every caller rejects with nobody left awaiting it.
    // This handler exists only so that rejection is not unhandled; each caller
    // still sees the failure through its own `join`.
    entry.promise.catch(() => {});

    this.inFlight.set(url, entry);

    return entry;
  }

  /**
   * Forgets a request, unless a later caller has already replaced it: a request
   * that was aborted leaves the map before it settles, and the one dispatched in
   * its place must survive its predecessor finishing.
   */
  private release(url: string, entry: InFlightRequest): void {
    if (this.inFlight.get(url) === entry) {
      this.inFlight.delete(url);
    }
  }

  /**
   * Awaits a request, cancelling it if this caller was the last one interested.
   *
   * A caller with no signal never leaves early, so it holds the request open for
   * everyone — including a scoped caller that joined later and gave up.
   */
  private join(
    url: string,
    entry: InFlightRequest,
    signal: AbortSignal | undefined,
  ): Promise<FetchedResource> {
    entry.waiters += 1;

    if (!signal) {
      return entry.promise;
    }

    return new Promise<FetchedResource>((resolve, reject) => {
      const leave = (): void => {
        entry.waiters -= 1;

        if (entry.waiters > 0) {
          return;
        }

        // Dropped from the map before the abort settles it: a caller arriving in
        // between would otherwise join a request already on its way out and
        // inherit an abort it never asked for.
        this.release(url, entry);
        entry.controller?.abort(signal.reason);
      };

      if (signal.aborted) {
        leave();
        reject(signal.reason);
        return;
      }

      const onAbort = (): void => {
        leave();
        reject(signal.reason);
      };

      signal.addEventListener("abort", onAbort, { once: true });

      entry.promise.then(
        (resource) => {
          signal.removeEventListener("abort", onAbort);
          resolve(resource);
        },
        (error: unknown) => {
          signal.removeEventListener("abort", onAbort);
          reject(error);
        },
      );
    });
  }

  private async fetchResource(
    url: string,
    authorization: string | undefined,
    signal: AbortSignal | undefined,
  ): Promise<FetchedResource> {
    const headers = authorization
      ? { Accept: "application/json", Authorization: authorization }
      : { Accept: "application/json" };
    const response = await this.fetch(url, signal ? { headers, signal } : { headers });

    if (!response.ok) {
      throw await toPokenodeError(response);
    }

    const data: unknown = await response.json();

    await this.cache?.set(url, data);

    return { data, status: response.status };
  }

  private logResponse(
    url: string,
    status: number,
    source: LogResponsePayload["source"],
    startedAt: number,
  ): void {
    this.logger?.debug({
      event: "response",
      ...logMessage("pokeapi response"),
      url,
      status,
      source,
      durationMs: performance.now() - startedAt,
    });
  }

  /**
   * Walks every page of a list endpoint, yielding one entry at a time.
   *
   * Pass the list method to walk; the offset and the limit are this method's to
   * manage.
   *
   * ```ts
   * for await (const berry of api.berry.paginate((offset, limit) =>
   *   api.berry.listBerries(offset, limit),
   * )) {
   *   console.log(berry.name);
   * }
   * ```
   *
   * With `resolve`, each link is fetched and the resource is yielded instead of
   * the link. Requests are capped at `concurrency` at a time — the default is
   * deliberately low, because walking a section is exactly the traffic the
   * PokéAPI's fair-use policy asks clients to keep gentle.
   *
   * ```ts
   * for await (const berry of api.berry.paginate(
   *   (offset, limit) => api.berry.listBerries(offset, limit),
   *   { resolve: true },
   * )) {
   *   console.log(berry.growth_time);
   * }
   * ```
   */
  public paginate<L extends APIResource<unknown>>(
    list: ListFn<L>,
    options?: PaginateOptions & { resolve?: false },
  ): AsyncGenerator<L>;
  public paginate<T>(
    list: ListFn<APIResource<T>>,
    options: PaginateOptions & { resolve: true },
  ): AsyncGenerator<T>;
  public paginate<T>(
    list: ListFn<APIResource<T>>,
    options?: PaginateOptions,
  ): AsyncGenerator<APIResource<T> | T> {
    return this.walk(list, options);
  }

  private async *walk<T>(
    list: ListFn<APIResource<T>>,
    options?: PaginateOptions,
  ): AsyncGenerator<APIResource<T> | T> {
    const pageSize = options?.pageSize ?? DEFAULT_PAGE_SIZE;
    const concurrency = options?.concurrency ?? DEFAULT_CONCURRENCY;
    let offset = 0;

    while (true) {
      const page = await list(offset, pageSize);

      if (page.results.length === 0) {
        return;
      }

      if (options?.resolve) {
        // Resolved a page at a time: the order callers see stays the order the
        // API listed, however the requests within a page happen to finish.
        const resources = await mapWithConcurrency(page.results, concurrency, (link) =>
          this.getResourceByURL(link),
        );

        yield* resources;
      } else {
        yield* page.results;
      }

      offset += page.results.length;

      // A short page ends the walk on its own: `count` is upstream's word for how
      // much there is, and the results are the client's own evidence.
      if (page.results.length < pageSize || offset >= page.count) {
        return;
      }
    }
  }

  /**
   * Retrieves a single resource from the PokéAPI by its endpoint and identifier.
   *
   * @param identifier - The identifier of the resource, or a path below the endpoint.
   *   Omit it to address the endpoint itself.
   */
  protected async getResource<T>(endpoint: Endpoint, identifier?: string | number): Promise<T> {
    return this.request<T>(identifier === undefined ? endpoint : `${endpoint}/${identifier}`);
  }

  /**
   * Retrieves a resource by its URL, or by a link taken from another response.
   *
   * A link knows what it points at, so passing one infers `T`; a bare string
   * does not, and needs `T` named.
   *
   * @throws {TypeError} If the URL is not valid, or names no endpoint under `baseURL`.
   */
  protected async getResourceByURL<T>(
    resource: string | NamedAPIResource<T> | APIResource<T>,
    baseURL = this.baseURL,
  ): Promise<T> {
    const url = typeof resource === "string" ? resource : resource.url;

    return this.request<T>(toEndpointPath(url, baseURL), baseURL);
  }

  /**
   * Retrieves a list of resources from the PokéAPI with pagination support.
   *
   * @template T - What the listed links resolve to.
   */
  protected async getListResource<T = unknown>(
    endpoint: Endpoint,
    offset = 0,
    limit = 20,
  ): Promise<NamedAPIResourceList<T>> {
    return this.request<NamedAPIResourceList<T>>(listPath(endpoint, offset, limit));
  }

  /**
   * Retrieves a list of resources that have no name to list, with pagination support.
   *
   * @template T - What the listed links resolve to.
   */
  protected async getUnnamedListResource<T = unknown>(
    endpoint: Endpoint,
    offset = 0,
    limit = 20,
  ): Promise<APIResourceList<T>> {
    return this.request<APIResourceList<T>>(listPath(endpoint, offset, limit));
  }
}
