import { Endpoints } from "../constants";
import { Generation, NamedAPIResourceList, Pokedex, Version, VersionGroup } from "../models";
import { BaseClient } from "../structures/base";
import { getListURL } from "../utils/request-params";
import { AxiosError, AxiosResponse } from "axios";

/**
 * ### Game Client
 *
 * Client used to access the Game Endpoints:
 *  - [Generations](https://pokeapi.co/docs/v2#generations)
 *  - [Pokedexes](https://pokeapi.co/docs/v2#pokedexes)
 *  - [Versions](https://pokeapi.co/docs/v2#version)
 *  - [Version Groups](https://pokeapi.co/docs/v2#version-groups)
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#games-section)
 */
export class GameClient extends BaseClient {
  /**
   * Get a Generation by it's name
   * @param name The generation name
   * @returns A Generation
   */
  public async getGenerationByName(name: string): Promise<Generation> {
    return new Promise<Generation>((resolve, reject) => {
      this.api
        .get<Generation>(`${Endpoints.GENERATION}/${name}`)
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
        .get<Generation>(`${Endpoints.GENERATION}/${id}`)
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
        .get<Pokedex>(`${Endpoints.POKEDEX}/${name}`)
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
        .get<Pokedex>(`${Endpoints.POKEDEX}/${id}`)
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
        .get<Version>(`${Endpoints.VERSION}/${name}`)
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
        .get<Version>(`${Endpoints.VERSION}/${id}`)
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
        .get<VersionGroup>(`${Endpoints.VERSION_GROUP}/${name}`)
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
        .get<VersionGroup>(`${Endpoints.VERSION_GROUP}/${id}`)
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
      const url = getListURL(Endpoints.GENERATION, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
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
      const url = getListURL(Endpoints.POKEDEX, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
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
      const url = getListURL(Endpoints.VERSION, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
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
      const url = getListURL(Endpoints.VERSION_GROUP, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }
}
