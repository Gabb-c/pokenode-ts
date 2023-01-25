import axios, { AxiosError } from 'axios';
import pino from 'pino';
import {
  setupCache,
  AxiosCacheInstance,
  CacheAxiosResponse,
  CacheRequestConfig,
  CacheOptions,
} from 'axios-cache-interceptor';
import { BaseURL } from '../constants';
import {
  createLogger,
  handleRequest,
  handleRequestError,
  handleResponse,
  handleResponseError,
} from '../config/logger';

/**
 * ## Client Args
 * Used to pass optional configuration for logging and cache to the clients.
 */
export interface ClientArgs {
  /**
   * ## Logger Options
   * Options for the client logger.
   * @see https://getpino.io/#/docs/api?id=options
   */
  logOptions?: pino.LoggerOptions;
  /**
   * ## Axios Cache Options
   * Options for cache.
   * @see https://github.com/RasCarlito/axios-cache-adapter
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

  private logger: pino.Logger;

  /**
   *
   */
  constructor(clientOptions?: ClientArgs) {
    this.api = setupCache(
      axios.create({
        baseURL: clientOptions?.baseURL ?? BaseURL.REST,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      clientOptions?.cacheOptions
    );

    this.logger = createLogger({
      enabled: !(
        clientOptions?.logOptions?.enabled === undefined ||
        clientOptions?.logOptions.enabled === false
      ),
      ...clientOptions?.logOptions,
    });

    this.api.interceptors.request.use(
      (config: CacheRequestConfig) => handleRequest(config, this.logger),
      (error: AxiosError<string>) => handleRequestError(error, this.logger)
    );

    this.api.interceptors.response.use(
      (response: CacheAxiosResponse) => handleResponse(response, this.logger),
      (error: AxiosError<string>) => handleResponseError(error, this.logger)
    );
  }
}
