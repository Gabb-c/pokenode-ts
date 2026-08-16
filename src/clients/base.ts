import { type CacheStore, MemoryCache } from "../config/cache";
import { toPokenodeError } from "../config/errors";
import { type Logger, logMessage } from "../config/logger";
import { BASE_URL, type Endpoint } from "../constants";
import type { NamedAPIResourceList } from "../models/Common/resource";

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
  private readonly inFlight = new Map<string, Promise<unknown>>();

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
      this.logger?.debug({
        event: "response",
        ...logMessage("pokeapi response"),
        url: redactCredentials(url),
        status: 200,
        cached: true,
        durationMs: performance.now() - startedAt,
      });
      return cached as T;
    }

    const pending = this.inFlight.get(url);

    if (pending) {
      return pending as Promise<T>;
    }

    const request = this.fetchResource<T>(url, startedAt).finally(() => this.inFlight.delete(url));

    this.inFlight.set(url, request);

    return request;
  }

  private async fetchResource<T>(url: string, startedAt: number): Promise<T> {
    try {
      const response = await this.fetch(url, { headers: { Accept: "application/json" } });

      if (!response.ok) {
        throw await toPokenodeError(response);
      }

      const data = (await response.json()) as T;

      this.logger?.debug({
        event: "response",
        ...logMessage("pokeapi response"),
        url: redactCredentials(url),
        status: response.status,
        cached: false,
        durationMs: performance.now() - startedAt,
      });

      await this.cache?.set(url, data);

      return data;
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
   * Retrieves a resource by its URL.
   *
   * @template T - The type of the resource to be returned.
   * @param url - The URL of the resource.
   * @param baseURL - The base URL to use. Defaults to the one the client was built with.
   * @returns A promise that resolves to the requested resource.
   * @throws {TypeError} If `url` is not a valid URL, or names no endpoint under `baseURL`.
   */
  protected async getResourceByURL<T>(url: string, baseURL = this.baseURL): Promise<T> {
    return this.request<T>(toEndpointPath(url, baseURL), baseURL);
  }

  /**
   * Retrieves a list of resources from the PokéAPI with pagination support.
   *
   * @param endpoint - The endpoint of the resource.
   * @param offset - The offset for pagination. Defaults to 0.
   * @param limit - The limit for pagination. Defaults to 20.
   * @returns A promise that resolves to a list of named API resources.
   */
  protected async getListResource(
    endpoint: Endpoint,
    offset = 0,
    limit = 20,
  ): Promise<NamedAPIResourceList> {
    const query = new URLSearchParams({ offset: String(offset), limit: String(limit) });
    return this.request<NamedAPIResourceList>(`${endpoint}?${query}`);
  }
}
