/* eslint-disable import/prefer-default-export */

import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { DestinationObjectOptions, Logger, LoggerOptions } from 'pino';
import { IAxiosCacheAdapterOptions, setup } from 'axios-cache-adapter';
import { Generation, NamedAPIResourceList, Pokedex, Version, VersionGroup } from '../models';
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
 * ### Game Client
 *
 * Client used to access the Game Endpoints:
 *  - Generations
 *  - Pokedexes
 *  - Versions
 *  - Version Groups
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#games-section)
 */
export class GameClient {
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
   * Get a Generation by it's name
   * @param name The generation name
   * @returns A Generation
   */
  public getGenerationByName(name: string): Promise<Generation> {
    return new Promise<Generation>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Generation}/${name}`)
        .then((response: AxiosResponse<Generation>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Generation by it's ID
   * @param id The generation ID
   * @returns A Generation
   */
  public getGenerationById(id: number): Promise<Generation> {
    return new Promise<Generation>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Generation}/${id}`)
        .then((response: AxiosResponse<Generation>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Pokedex by it's name
   * @param name The pokedex name
   * @returns A Pokedex
   */
  public getPokedexByName(name: string): Promise<Pokedex> {
    return new Promise<Pokedex>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Pokedex}/${name}`)
        .then((response: AxiosResponse<Pokedex>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Pokedex by it's ID
   * @param id The pokedex ID
   * @returns A Pokedex
   */
  public getPokedexById(id: number): Promise<Pokedex> {
    return new Promise<Pokedex>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Pokedex}/${id}`)
        .then((response: AxiosResponse<Pokedex>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Version by it's name
   * @param name The version name
   * @returns A Version
   */
  public getVersionByName(name: string): Promise<Version> {
    return new Promise<Version>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Version}/${name}`)
        .then((response: AxiosResponse<Version>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Version by it's ID
   * @param id The version ID
   * @returns A Version
   */
  public getVersionById(id: number): Promise<Version> {
    return new Promise<Version>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Version}/${id}`)
        .then((response: AxiosResponse<Version>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Version Group by it's name
   * @param name The version group name
   * @returns A Version Group
   */
  public getVersionGroupByName(name: string): Promise<VersionGroup> {
    return new Promise<VersionGroup>((resolve, reject) => {
      this.api
        .get(`${Endpoints.VersionGroup}/${name}`)
        .then((response: AxiosResponse<VersionGroup>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Version Group by it's ID
   * @param id The version group ID
   * @returns A Version Group
   */
  public getVersionGroupById(id: number): Promise<VersionGroup> {
    return new Promise<VersionGroup>((resolve, reject) => {
      this.api
        .get(`${Endpoints.VersionGroup}/${id}`)
        .then((response: AxiosResponse<VersionGroup>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Generations
   * @param offset The first item that you will get
   * @param limit How many Generations per page
   * @returns A list of Generations
   */
  public listGenerations(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Generation}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Pokedexes
   * @param offset The first item that you will get
   * @param limit How many Pokedexes per page
   * @returns A list of Pokedexes
   */
  public listPokedexes(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Pokedex}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Versions
   * @param offset The first item that you will get
   * @param limit How many Versions per page
   * @returns A list of Versions
   */
  public listVersions(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Version}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Version Groups
   * @param offset The first item that you will get
   * @param limit How many Version Groups per page
   * @returns A list of Version Groups
   */
  public listVersionGroups(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.VersionGroup}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }
}
