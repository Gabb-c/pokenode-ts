/* eslint-disable import/prefer-default-export */

import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { DestinationObjectOptions, Logger, LoggerOptions } from 'pino';
import { IAxiosCacheAdapterOptions, setup } from 'axios-cache-adapter';
import { EvolutionChain, EvolutionTrigger, NamedAPIResourceList } from '../models';
import { Endpoints } from '../constants/endpoints';
import { BaseURL } from '../constants';
import {
  createLogger,
  handleRequest,
  handleRequestError,
  handleResponse,
  handleResponseError,
} from '../config/logger';

/**
 * ### Evolution Client
 *
 * Client used to access the Berry Endpoints:
 *  - Evolution Chains
 *  - Evolution Triggers
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#evolution-section)
 */
export class EvolutionClient {
  private api: AxiosInstance;

  private logger: Logger;

  /**
   * @param logOptions Options for the logger.
   * @param logDestination Options for the logs destination.
   * @param cacheOptions Options for the axios-cache.
   */
  constructor(
    logOptions?: LoggerOptions,
    logDestination?: DestinationObjectOptions,
    cacheOptions?: IAxiosCacheAdapterOptions
  ) {
    this.api = setup({
      baseURL: BaseURL.REST,
      headers: {
        'Content-Type': 'application/json',
      },
      cache: cacheOptions,
    });

    this.logger = createLogger(
      {
        enabled: !(logOptions?.enabled === undefined || logOptions.enabled === false),
        ...logOptions,
      },
      logDestination
    );

    this.api.interceptors.request.use(
      (config: AxiosRequestConfig) => handleRequest(config, this.logger),
      (error: AxiosError<string>) => handleRequestError(error, this.logger)
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => handleResponse(response, this.logger),
      (error: AxiosError<string>) => handleResponseError(error, this.logger)
    );
  }

  /**
   * Get an Evolution Chain by it's ID
   * @param id The Evolution Chain ID
   * @returns An Evolution Chain
   */
  public getEvolutionChainById(id: number): Promise<EvolutionChain> {
    return new Promise<EvolutionChain>((resolve, reject) => {
      this.api
        .get(`${Endpoints.EvolutionChain}/${id}`)
        .then((response: AxiosResponse<EvolutionChain>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get an Evolution Trigger by it's ID
   * @param id The Evolution Trigger ID
   * @returns An Evolution Trigger
   */
  public getEvolutionTriggerById(id: number): Promise<EvolutionTrigger> {
    return new Promise<EvolutionTrigger>((resolve, reject) => {
      this.api
        .get(`${Endpoints.EvolutionTrigger}/${id}`)
        .then((response: AxiosResponse<EvolutionTrigger>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get an Evolution Trigger by it's name
   * @param name The Evolution Trigger name
   * @returns An Evolution Trigger
   */
  public getEvolutionTriggerByName(name: string): Promise<EvolutionTrigger> {
    return new Promise<EvolutionTrigger>((resolve, reject) => {
      this.api
        .get(`${Endpoints.EvolutionTrigger}/${name}`)
        .then((response: AxiosResponse<EvolutionTrigger>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Evolution Chains
   * @param offset The first item that you will get
   * @param limit How many Evolution Chains per page
   * @returns A list of Evolution Chains
   */
  public listEvolutionChains(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.EvolutionChain}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Evolution Triggers
   * @param offset The first item that you will get
   * @param limit How many Evolution Triggers per page
   * @returns A list of Evolution Triggers
   */
  public listEvolutionTriggers(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.EvolutionTrigger}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }
}
