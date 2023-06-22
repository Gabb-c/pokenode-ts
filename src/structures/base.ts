import {
  handleRequest,
  handleRequestError,
  handleResponse,
  handleResponseError,
} from "../config/logger";
import { BaseURL } from "../constants";
import axios, { AxiosError } from "axios";
import {
  AxiosCacheInstance,
  CacheAxiosResponse,
  CacheOptions,
  InternalCacheRequestConfig,
  setupCache,
} from "axios-cache-interceptor";

import { ENDPOINTS } from "../constants";

type ObjectValue<T> = T[keyof T];
type Endpoint = ObjectValue<typeof ENDPOINTS>;

/**
 * ## Client Args
 * Used to pass optional configuration for logging and cache to the clients.
 */
export interface ClientArgs {
  /**
   * ## Enable logs
   */
  logs?: boolean;
  /**
   * ## Axios Cache Options
   * Options for cache.
   * @see https://axios-cache-interceptor.js.org/
   */
  cacheOptions?: CacheOptions;
  /**
   * ## Base URL
   * Location of the PokéAPI. Leave empty to use the official PokéAPI instance.
   */
  baseURL?: string;
}

/**
 * ### Base Client
 */
export class BaseClient {
  protected api: AxiosCacheInstance;

  constructor(clientOptions?: ClientArgs) {
    this.api = setupCache(
      axios.create({
        baseURL: clientOptions?.baseURL ?? BaseURL.REST,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      clientOptions?.cacheOptions,
    );

    this.api.interceptors.request.use(
      (config: InternalCacheRequestConfig) => handleRequest(config, clientOptions?.logs),
      (error: AxiosError<string>) => handleRequestError(error, clientOptions?.logs),
    );

    this.api.interceptors.response.use(
      (response: CacheAxiosResponse) => handleResponse(response, clientOptions?.logs),
      (error: AxiosError<string>) => handleResponseError(error, clientOptions?.logs),
    );
  }

  protected getListURL(endpoint: Endpoint, offset?: number, limit?: number): string {
    return `${endpoint}?offset=${offset ?? 0}&limit=${limit ?? 20}`;
  }
}
