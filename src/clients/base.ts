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
  /** Requests already on the wire, so concurrent callers share one round trip. */
  private readonly inFlight = new Map<string, Promise<FetchedResource>>();

  constructor(clientOptions?: ClientOptions) {
    this.baseURL = trimTrailingSlash(clientOptions?.baseURL ?? BASE_URL.REST);
    this.cache =
      clientOptions?.cache === false ? undefined : (clientOptions?.cache ?? new MemoryCache());
    this.logger = clientOptions?.logger;
    this.fetch = clientOptions?.fetch ?? ((input, init) => globalThis.fetch(input, init));
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
    const pending = this.inFlight.get(url);
    const request = pending ?? this.dispatch(url, authorization);

    try {
      const { data, status } = await request;

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

  /** Issues a request and remembers it, so a concurrent caller can share it. */
  private dispatch(url: string, authorization?: string): Promise<FetchedResource> {
    const request = this.fetchResource(url, authorization).finally(() => this.inFlight.delete(url));

    this.inFlight.set(url, request);

    return request;
  }

  private async fetchResource(url: string, authorization?: string): Promise<FetchedResource> {
    const response = await this.fetch(url, {
      headers: authorization
        ? { Accept: "application/json", Authorization: authorization }
        : { Accept: "application/json" },
    });

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
