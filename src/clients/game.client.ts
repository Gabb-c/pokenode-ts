import { AxiosError, AxiosResponse } from 'axios';
import { DestinationObjectOptions, LoggerOptions } from 'pino';
import { IAxiosCacheAdapterOptions } from 'axios-cache-adapter';
import { Generation, NamedAPIResourceList, Pokedex, Version, VersionGroup } from '../models';
import { Endpoints } from '../constants';
import { BaseClient } from '../structures/base';

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
export class GameClient extends BaseClient {
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
    super(logOptions, logDestination, cacheOptions);
  }

  /**
   * Get a Generation by it's name
   * @param name The generation name
   * @returns A Generation
   */
  public async getGenerationByName(name: string): Promise<Generation> {
    return new Promise<Generation>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Generation}/${name}`)
        .then((response: AxiosResponse<Generation>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Generation by it's ID
   * @param id The generation ID
   * @returns A Generation
   */
  public async getGenerationById(id: number): Promise<Generation> {
    return new Promise<Generation>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Generation}/${id}`)
        .then((response: AxiosResponse<Generation>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Pokedex by it's name
   * @param name The pokedex name
   * @returns A Pokedex
   */
  public async getPokedexByName(name: string): Promise<Pokedex> {
    return new Promise<Pokedex>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Pokedex}/${name}`)
        .then((response: AxiosResponse<Pokedex>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Pokedex by it's ID
   * @param id The pokedex ID
   * @returns A Pokedex
   */
  public async getPokedexById(id: number): Promise<Pokedex> {
    return new Promise<Pokedex>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Pokedex}/${id}`)
        .then((response: AxiosResponse<Pokedex>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Version by it's name
   * @param name The version name
   * @returns A Version
   */
  public async getVersionByName(name: string): Promise<Version> {
    return new Promise<Version>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Version}/${name}`)
        .then((response: AxiosResponse<Version>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Version by it's ID
   * @param id The version ID
   * @returns A Version
   */
  public async getVersionById(id: number): Promise<Version> {
    return new Promise<Version>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Version}/${id}`)
        .then((response: AxiosResponse<Version>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Version Group by it's name
   * @param name The version group name
   * @returns A Version Group
   */
  public async getVersionGroupByName(name: string): Promise<VersionGroup> {
    return new Promise<VersionGroup>((resolve, reject) => {
      this.api
        .get(`${Endpoints.VersionGroup}/${name}`)
        .then((response: AxiosResponse<VersionGroup>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Version Group by it's ID
   * @param id The version group ID
   * @returns A Version Group
   */
  public async getVersionGroupById(id: number): Promise<VersionGroup> {
    return new Promise<VersionGroup>((resolve, reject) => {
      this.api
        .get(`${Endpoints.VersionGroup}/${id}`)
        .then((response: AxiosResponse<VersionGroup>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Generations
   * @param offset The first item that you will get
   * @param limit How many Generations per page
   * @returns A list of Generations
   */
  public async listGenerations(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Generation}?offset=${offset || 0}&limit=${limit || 20}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Pokedexes
   * @param offset The first item that you will get
   * @param limit How many Pokedexes per page
   * @returns A list of Pokedexes
   */
  public async listPokedexes(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Pokedex}?offset=${offset || 0}&limit=${limit || 20}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Versions
   * @param offset The first item that you will get
   * @param limit How many Versions per page
   * @returns A list of Versions
   */
  public async listVersions(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Version}?offset=${offset || 0}&limit=${limit || 20}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Version Groups
   * @param offset The first item that you will get
   * @param limit How many Version Groups per page
   * @returns A list of Version Groups
   */
  public async listVersionGroups(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.VersionGroup}?offset=${offset || 0}&limit=${limit || 20}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }
}
