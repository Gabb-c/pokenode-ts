import { type CacheStore, MemoryCache } from "../config/cache";
import { toPokenodeError } from "../config/errors";
import { logError, logRequest, logResponse } from "../config/logger";
import { BASE_URL, type Endpoint } from "../constants";
import type { NamedAPIResourceList } from "../models/Common/resource";

const trimTrailingSlash = (url: string): string => url.replace(/\/+$/, "");

/**
 * ## Fetch Like
 * A `fetch` implementation. Narrower than the global signature on purpose: the
 * client only ever passes a string URL, and the wider type would reject an
 * ordinary `(url: string, init?: RequestInit) => ...` wrapper.
 */
export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

/**
 * ## Client Args
 * Used to pass optional configuration for logging and cache to the clients.
 */
export interface ClientArgs {
  /** Enables or disables logging. */
  logs?: boolean;
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
 * Base class for interacting with the PokéAPI. Provides methods for resource retrieval with caching and logging capabilities.
 */
export class BaseClient {
  private readonly baseURL: string;
  private readonly cache: CacheStore | undefined;
  private readonly logs: boolean;
  private readonly fetch: FetchLike;
  /** Requests already on the wire, so concurrent callers share one round trip. */
  private readonly inFlight = new Map<string, Promise<unknown>>();

  constructor(clientOptions?: ClientArgs) {
    this.baseURL = trimTrailingSlash(clientOptions?.baseURL ?? BASE_URL.REST);
    this.cache =
      clientOptions?.cache === false ? undefined : (clientOptions?.cache ?? new MemoryCache());
    this.logs = clientOptions?.logs ?? false;
    // Bound: an unbound reference to the global throws "Illegal invocation".
    this.fetch = clientOptions?.fetch ?? globalThis.fetch.bind(globalThis);
  }

  /**
   * Resolves a resource through the cache, then through any identical request
   * already in flight, and only then over the network.
   *
   * The URL is joined by concatenation rather than with `new URL(path, base)`:
   * the base carries a path of its own (`/api/v2`) that URL resolution would
   * discard for any root-relative endpoint.
   */
  private async request<T>(path: string, baseURL = this.baseURL): Promise<T> {
    const url = `${trimTrailingSlash(baseURL)}${path.startsWith("/") ? path : `/${path}`}`;

    logRequest("get", url, this.logs);

    const cached = await this.cache?.get(url);

    if (cached !== undefined) {
      logResponse(200, true, this.logs);
      return cached as T;
    }

    const pending = this.inFlight.get(url);

    if (pending) {
      return pending as Promise<T>;
    }

    const request = this.fetchResource<T>(url).finally(() => this.inFlight.delete(url));

    this.inFlight.set(url, request);

    return request;
  }

  private async fetchResource<T>(url: string): Promise<T> {
    try {
      const response = await this.fetch(url, { headers: { Accept: "application/json" } });

      if (!response.ok) {
        throw await toPokenodeError(response);
      }

      const data = (await response.json()) as T;

      logResponse(response.status, false, this.logs);

      await this.cache?.set(url, data);

      return data;
    } catch (error) {
      logError(error, this.logs);
      throw error;
    }
  }

  /**
   * Retrieves a single resource from the PokéAPI by its endpoint and identifier.
   *
   * @template T - The type of the resource to be returned.
   * @param endpoint - The endpoint of the resource.
   * @param identifier - The identifier of the resource. If not provided, an empty string will be used.
   * @returns A promise that resolves to the requested resource.
   */
  protected async getResource<T>(endpoint: string, identifier?: string | number): Promise<T> {
    return this.request<T>(`${endpoint}/${identifier || identifier === 0 ? identifier : ""}`);
  }

  /**
   * Retrieves a resource by its URL.
   *
   * @template T - The type of the resource to be returned.
   * @param url - The URL of the resource.
   * @param baseURL - The base URL to use. Defaults to the one the client was built with.
   * @returns A promise that resolves to the requested resource.
   */
  protected async getResourceByURL<T>(url: string, baseURL = this.baseURL): Promise<T> {
    const ENDPOINT = url.split("v2")[1] as string;
    return this.request<T>(ENDPOINT, baseURL);
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
