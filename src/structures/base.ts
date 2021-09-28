import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Logger, LoggerOptions } from 'pino';
import { IAxiosCacheAdapterOptions, setup } from 'axios-cache-adapter';
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
  logOptions?: LoggerOptions;
  /**
   * ## Axios Cache Options
   * Options for cache.
   * @see https://github.com/RasCarlito/axios-cache-adapter
   */
  cacheOptions?: IAxiosCacheAdapterOptions;
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
  public api: AxiosInstance;

  public logger: Logger;

  /**
   *
   */
  constructor(clientOptions?: ClientArgs) {
    this.api = setup({
      baseURL: clientOptions?.baseURL ?? BaseURL.REST,
      headers: {
        'Content-Type': 'application/json',
      },
      cache: {
        maxAge: clientOptions?.cacheOptions?.maxAge || 0,
        ...clientOptions?.cacheOptions,
      },
    });

    this.logger = createLogger({
      enabled: !(
        clientOptions?.logOptions?.enabled === undefined ||
        clientOptions?.logOptions.enabled === false
      ),
      ...clientOptions?.logOptions,
    });

    this.api.interceptors.request.use(
      (config: AxiosRequestConfig) => handleRequest(config, this.logger),
      (error: AxiosError<string>) => handleRequestError(error, this.logger)
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => handleResponse(response, this.logger),
      (error: AxiosError<string>) => handleResponseError(error, this.logger)
    );
  }
}
