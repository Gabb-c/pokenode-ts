import { ENDPOINTS } from "@constants";
import type { Generation, NamedAPIResourceList, Pokedex, Version, VersionGroup } from "@models";
import { BaseClient } from "./base";

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
    return this.getResource(ENDPOINTS.GENERATION, name);
  }

  /**
   * Get a Generation by it's ID
   * @param id The generation ID
   * @returns A Generation
   */
  public async getGenerationById(id: number): Promise<Generation> {
    return this.getResource(ENDPOINTS.GENERATION, id);
  }

  /**
   * Get a Pokedex by it's name
   * @param name The pokedex name
   * @returns A Pokedex
   */
  public async getPokedexByName(name: string): Promise<Pokedex> {
    return this.getResource(ENDPOINTS.POKEDEX, name);
  }

  /**
   * Get a Pokedex by it's ID
   * @param id The pokedex ID
   * @returns A Pokedex
   */
  public async getPokedexById(id: number): Promise<Pokedex> {
    return this.getResource(ENDPOINTS.POKEDEX, id);
  }

  /**
   * Get a Version by it's name
   * @param name The version name
   * @returns A Version
   */
  public async getVersionByName(name: string): Promise<Version> {
    return this.getResource(ENDPOINTS.VERSION, name);
  }

  /**
   * Get a Version by it's ID
   * @param id The version ID
   * @returns A Version
   */
  public async getVersionById(id: number): Promise<Version> {
    return this.getResource(ENDPOINTS.VERSION, id);
  }

  /**
   * Get a Version Group by it's name
   * @param name The version group name
   * @returns A Version Group
   */
  public async getVersionGroupByName(name: string): Promise<VersionGroup> {
    return this.getResource(ENDPOINTS.VERSION_GROUP, name);
  }

  /**
   * Get a Version Group by it's ID
   * @param id The version group ID
   * @returns A Version Group
   */
  public async getVersionGroupById(id: number): Promise<VersionGroup> {
    return this.getResource(ENDPOINTS.VERSION_GROUP, id);
  }

  /**
   * List Generations
   * @param offset The first item that you will get
   * @param limit How many Generations per page
   * @returns A list of Generations
   */
  public async listGenerations(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.GENERATION, offset, limit);
  }

  /**
   * List Pokedexes
   * @param offset The first item that you will get
   * @param limit How many Pokedexes per page
   * @returns A list of Pokedexes
   */
  public async listPokedexes(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.POKEDEX, offset, limit);
  }

  /**
   * List Versions
   * @param offset The first item that you will get
   * @param limit How many Versions per page
   * @returns A list of Versions
   */
  public async listVersions(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.VERSION, offset, limit);
  }

  /**
   * List Version Groups
   * @param offset The first item that you will get
   * @param limit How many Version Groups per page
   * @returns A list of Version Groups
   */
  public async listVersionGroups(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.VERSION_GROUP, offset, limit);
  }
}
