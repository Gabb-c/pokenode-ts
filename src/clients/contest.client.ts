/* eslint-disable import/prefer-default-export */

import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { setup, IAxiosCacheAdapterOptions } from 'axios-cache-adapter';
import { DestinationObjectOptions, Logger, LoggerOptions } from 'pino';
import { ContestEffect, ContestType, NamedAPIResourceList, SuperContestEffect } from '../models';
import { BaseURL } from '../constants';
import { Endpoints } from '../constants/endpoints';
import {
  createLogger,
  handleRequest,
  handleRequestError,
  handleResponse,
  handleResponseError,
} from '../config/logger';

/**
 * ### Contest Client
 *
 * Client used to access the Contest Endpoints:
 *  - Contest Types
 *  - Contest Effects
 *  - Super Contest Effects
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#contests-section)
 */
export class ContestClient {
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
   * Get a Contest Type by it's name
   * @param name  The contest type name
   * @returns A Contest Type
   */
  public getContestTypeByName(name: string): Promise<ContestType> {
    return new Promise<ContestType>((resolve, reject) => {
      this.api
        .get(`${Endpoints.ContestType}/${name}`)
        .then((response: AxiosResponse<ContestType>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Contest Type by it's ID
   * @param id The Contest Type ID
   * @returns A Contest Type
   */
  public getContestTypeById(id: number): Promise<ContestType> {
    return new Promise<ContestType>((resolve, reject) => {
      this.api
        .get(`${Endpoints.ContestType}/${id}`)
        .then((response: AxiosResponse<ContestType>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Contest Effect by it's ID
   * @param id The Contest Effect ID
   * @returns Contest Effect
   */
  public getContestEffectById(id: number): Promise<ContestEffect> {
    return new Promise<ContestEffect>((resolve, reject) => {
      this.api
        .get(`${Endpoints.ContestEffect}/${id}`)
        .then((response: AxiosResponse<ContestEffect>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Super Contest Effect by it's ID
   * @param id The Super Contest Effect ID
   * @returns Super Contest Effect
   */
  public getSuperContestEffectById(id: number): Promise<SuperContestEffect> {
    return new Promise<SuperContestEffect>((resolve, reject) => {
      this.api
        .get(`${Endpoints.SuperContestEffect}/${id}`)
        .then((response: AxiosResponse<SuperContestEffect>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Contest Types
   * @param offset The first item that you will get
   * @param limit How many contest types per page
   * @returns A list of contest types
   */
  public listContestTypes(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.ContestType}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Contest Effects
   * @param offset The first item that you will get
   * @param limit How many contest effects per page
   * @returns A list of contest effects
   */
  public listContestEffects(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.ContestEffect}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Super Contest Effects
   * @param offset The first item that you will get
   * @param limit How many Super Contest Effect per page
   * @returns A list of Super Contest Effect
   */
  public listSuperContestEffects(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.SuperContestEffect}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }
}
