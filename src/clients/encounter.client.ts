/* eslint-disable import/prefer-default-export */

import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { DestinationObjectOptions, Logger, LoggerOptions } from 'pino';
import { IAxiosCacheAdapterOptions, setup } from 'axios-cache-adapter';
import {
  EncounterCondition,
  EncounterConditionValue,
  EncounterMethod,
  NamedAPIResourceList,
} from '../models';
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
 * ### Encounter Client
 *
 * Client used to access the Encounter Endpoints:
 *  - Encounter Methods
 *  - Encounter Conditions
 *  - Encounter Condition Values
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#encounters-section)
 */
export class EncounterClient {
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
   * Get an Encounter Method by it's name
   * @param name The Encounter Method name
   * @returns An Encounter Method
   */
  public getEncounterMethodByName(name: string): Promise<EncounterMethod> {
    return new Promise<EncounterMethod>((resolve, reject) => {
      this.api
        .get(`${Endpoints.EncouterMethod}/${name}`)
        .then((response: AxiosResponse<EncounterMethod>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get an Encounter Method by it's ID
   * @param id The Encounter Method ID
   * @returns An Encounter Method
   */
  public getEncounterMethodById(id: number): Promise<EncounterMethod> {
    return new Promise<EncounterMethod>((resolve, reject) => {
      this.api
        .get(`${Endpoints.EncouterMethod}/${id}`)
        .then((response: AxiosResponse<EncounterMethod>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get an Encounter Condition by it's ID
   * @param id The Encounter Condition ID
   * @returns An Encounter Condition
   */
  public getEncounterConditionById(id: number): Promise<EncounterCondition> {
    return new Promise<EncounterCondition>((resolve, reject) => {
      this.api
        .get(`${Endpoints.EncounterCondition}/${id}`)
        .then((response: AxiosResponse<EncounterCondition>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get an Encounter Condition by it's name
   * @param name The Encounter Condition name
   * @returns An Encounter Condition
   */
  public getEncounterConditionByName(name: string): Promise<EncounterCondition> {
    return new Promise<EncounterCondition>((resolve, reject) => {
      this.api
        .get(`${Endpoints.EncounterCondition}/${name}`)
        .then((response: AxiosResponse<EncounterCondition>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get an Encounter Condition Value by it's name
   * @param name The Encounter Condition Value name
   * @returns An Encounter Condition Value
   */
  public getEncounterConditionValueByName(name: string): Promise<EncounterConditionValue> {
    return new Promise<EncounterConditionValue>((resolve, reject) => {
      this.api
        .get(`${Endpoints.EncouterConditionValue}/${name}`)
        .then((response: AxiosResponse<EncounterConditionValue>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get an Encounter Condition Value by it's ID
   * @param id The Encounter Condition Value ID
   * @returns An Encounter Condition Value
   */
  public getEncounterConditionValueById(id: number): Promise<EncounterConditionValue> {
    return new Promise<EncounterConditionValue>((resolve, reject) => {
      this.api
        .get(`${Endpoints.EncouterConditionValue}/${id}`)
        .then((response: AxiosResponse<EncounterConditionValue>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Encounter Methods
   * @param offset The first item that you will get
   * @param limit How many Encounter Methods per page
   * @returns A list of Encounter Methods
   */
  public listEncounterMethods(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.EncouterMethod}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Encounter Conditions
   * @param offset The first item that you will get
   * @param limit How many Encounter Conditions per page
   * @returns A list of Encounter Methods
   */
  public listEncounterConditions(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.EncounterCondition}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Encounter Condition Values
   * @param offset The first item that you will get
   * @param limit How many Encounter Condition Values per page
   * @returns A list of Encounter Condition Values
   */
  public listEncounterConditionValues(
    offset?: number,
    limit?: number
  ): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.EncouterConditionValue}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }
}
