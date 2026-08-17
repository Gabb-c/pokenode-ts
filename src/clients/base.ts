import { type CacheStore, MemoryCache } from "../config/cache";
import { toPokenodeError } from "../config/errors";
import { type Logger, type LogResponsePayload, logMessage } from "../config/logger";
import { BASE_URL, type Endpoint } from "../constants";
import type {
  APIResource,
  NamedAPIResource,
  NamedAPIResourceList,
} from "../models/Common/resource";

const trimTrailingSlash = (url: string): string => url.replace(/\/+$/, "");

/**
 * Drops the trailing slash from a request URL, leaving any query string alone.
 *
 * Both call paths must produce one cache key: `getResource` builds `/berry/1`,
 * while the PokéAPI's own links end in a slash.
 */
const normalizeURL = (url: string): string => url.replace(/\/+(?=\?|$)/, "");

/** A path segment naming an API version, as in `/api/v2/berry/1`. */
const API_VERSION_SEGMENT = /^v\d+$/;

/**
 * Drops any credentials a URL carries before it is handed to a {@link Logger}.
 *
 * A self-hosted instance behind basic auth is configured as
 * `https://user:secret@host/api/v2`, and a log sink is the last place that
 * password should end up. The request itself still goes out with it.
 *
 * A URL too malformed to parse cannot carry credentials in the first place, and
 * `fetch` is about to reject it anyway, so it is passed through untouched.
 */
const redactCredentials = (url: string): string => {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  if (!parsed.username && !parsed.password) {
    return url;
  }

  parsed.username = "";
  parsed.password = "";

  return parsed.toString();
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
    const url = normalizeURL(
      `${trimTrailingSlash(baseURL)}${path.startsWith("/") ? path : `/${path}`}`,
    );

    const startedAt = performance.now();

    this.logger?.debug({
      event: "request",
      ...logMessage("pokeapi request"),
      method: "GET",
      url: redactCredentials(url),
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
    const request = pending ?? this.dispatch(url);

    try {
      const { data, status } = await request;

      this.logResponse(url, status, pending ? "in-flight" : "network", startedAt);

      return data as T;
    } catch (error) {
      this.logger?.error({
        event: "error",
        ...logMessage("pokeapi request failed"),
        url: redactCredentials(url),
        err: error,
        error,
      });
      throw error;
    }
  }

  /** Issues a request and remembers it, so a concurrent caller can share it. */
  private dispatch(url: string): Promise<FetchedResource> {
    const request = this.fetchResource(url).finally(() => this.inFlight.delete(url));

    this.inFlight.set(url, request);

    return request;
  }

  private async fetchResource(url: string): Promise<FetchedResource> {
    const response = await this.fetch(url, { headers: { Accept: "application/json" } });

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
      url: redactCredentials(url),
      status,
      source,
      durationMs: performance.now() - startedAt,
    });
  }

  /**
   * Retrieves a single resource from the PokéAPI by its endpoint and identifier.
   *
   * @template T - The type of the resource to be returned.
   * @param endpoint - The endpoint of the resource.
   * @param identifier - The identifier of the resource, or a path below the endpoint.
   *   Omit it to address the endpoint itself.
   * @returns A promise that resolves to the requested resource.
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
   * @template T - The type of the resource to be returned.
   * @param resource - The URL of the resource, or a link to it.
   * @param baseURL - The base URL to use. Defaults to the one the client was built with.
   * @returns A promise that resolves to the requested resource.
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
   * @param endpoint - The endpoint of the resource.
   * @param offset - The offset for pagination. Defaults to 0.
   * @param limit - The limit for pagination. Defaults to 20.
   * @returns A promise that resolves to a list of named API resources.
   */
  protected async getListResource<T = unknown>(
    endpoint: Endpoint,
    offset = 0,
    limit = 20,
  ): Promise<NamedAPIResourceList<T>> {
    const query = new URLSearchParams({ offset: String(offset), limit: String(limit) });
    return this.request<NamedAPIResourceList<T>>(`${endpoint}?${query}`);
  }
}
