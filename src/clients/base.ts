import axios, { type AxiosError } from "axios";
import {
  type AxiosCacheInstance,
  type CacheAxiosResponse,
  type CacheOptions,
  type InternalCacheRequestConfig,
  setupCache,
} from "axios-cache-interceptor";

import {
  handleRequest,
  handleRequestError,
  handleResponse,
  handleResponseError,
} from "../config/logger";
import { BASE_URL, type Endpoint } from "../constants";
import type { NamedAPIResourceList } from "../models/Common/resource";

/**
 * ## Client Args
 * Used to pass optional configuration for logging and cache to the clients.
 */
export interface ClientArgs {
  /** Enables or disables logging. */
  logs?: boolean;
  /**
   * Options for cache configuration.
   * @see https://axios-cache-interceptor.js.org/
   */
  cacheOptions?: CacheOptions;
  /** Location of the PokéAPI. Leave empty to use the official PokéAPI instance. */
  baseURL?: string;
}

/**
 * ## Base Client
 * Base class for interacting with the PokéAPI. Provides methods for resource retrieval with caching and logging capabilities.
 */
export class BaseClient {
  private readonly api: AxiosCacheInstance;

  constructor(clientOptions?: ClientArgs) {
    this.api = setupCache(
      axios.create({
        baseURL: clientOptions?.baseURL ?? BASE_URL.REST,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      clientOptions?.cacheOptions,
    );

    // Setting up request and response interceptors for logging
    this.api.interceptors.request.use(
      (config: InternalCacheRequestConfig) => handleRequest(config, clientOptions?.logs),
      (error: AxiosError<string>) => handleRequestError(error, clientOptions?.logs),
    );

    this.api.interceptors.response.use(
      (response: CacheAxiosResponse) => handleResponse(response, clientOptions?.logs),
      (error: AxiosError<string>) => handleResponseError(error, clientOptions?.logs),
    );
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
    return (
      await this.api.get<T>(`${endpoint}/${identifier || identifier === 0 ? identifier : ""}`)
    ).data;
  }

  /**
   * Retrieves a resource by its URL.
   *
   * @template T - The type of the resource to be returned.
   * @param url - The URL of the resource.
   * @param baseURL - The base URL to use. Defaults to BASE_URL.REST.
   * @returns A promise that resolves to the requested resource.
   */
  protected async getResourceByURL<T>(url: string, baseURL = BASE_URL.REST): Promise<T> {
    const ENDPOINT = url.split("v2")[1] as string;
    return (await this.api.get<T>(ENDPOINT, { baseURL })).data;
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
    return (await this.api.get<NamedAPIResourceList>(`${endpoint}?offset=${offset}&limit=${limit}`))
      .data;
  }
}
