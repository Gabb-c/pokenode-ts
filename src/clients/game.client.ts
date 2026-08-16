import { ENDPOINTS } from "@constants";
import type { Generation, NamedAPIResourceList, Pokedex, Version, VersionGroup } from "@models";
import { BaseClient } from "./base";

/**
 * ### Game Client
 *
 * Client used to access the Game Endpoints:
 *  - [Generations](https://pokeapi.co/docs/v2#generations)
 *  - [Pokédexes](https://pokeapi.co/docs/v2#pokedexes)
 *  - [Versions](https://pokeapi.co/docs/v2#version)
 *  - [Version Groups](https://pokeapi.co/docs/v2#version-groups)
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#games-section)
 */
export class GameClient extends BaseClient {
  /**
   * Get a Generation by its name.
   * @param name The Generation name.
   * @returns The matching Generation.
   */
  public async getGenerationByName(name: string): Promise<Generation> {
    return this.getResource(ENDPOINTS.GENERATION, name);
  }

  /**
   * Get a Generation by its ID.
   * @param id The Generation ID.
   * @returns The matching Generation.
   */
  public async getGenerationById(id: number): Promise<Generation> {
    return this.getResource(ENDPOINTS.GENERATION, id);
  }

  /**
   * Get a Pokédex by its name.
   * @param name The Pokédex name.
   * @returns The matching Pokédex.
   */
  public async getPokedexByName(name: string): Promise<Pokedex> {
    return this.getResource(ENDPOINTS.POKEDEX, name);
  }

  /**
   * Get a Pokédex by its ID.
   * @param id The Pokédex ID.
   * @returns The matching Pokédex.
   */
  public async getPokedexById(id: number): Promise<Pokedex> {
    return this.getResource(ENDPOINTS.POKEDEX, id);
  }

  /**
   * Get a Version by its name.
   * @param name The Version name.
   * @returns The matching Version.
   */
  public async getVersionByName(name: string): Promise<Version> {
    return this.getResource(ENDPOINTS.VERSION, name);
  }

  /**
   * Get a Version by its ID.
   * @param id The Version ID.
   * @returns The matching Version.
   */
  public async getVersionById(id: number): Promise<Version> {
    return this.getResource(ENDPOINTS.VERSION, id);
  }

  /**
   * Get a Version Group by its name.
   * @param name The Version Group name.
   * @returns The matching Version Group.
   */
  public async getVersionGroupByName(name: string): Promise<VersionGroup> {
    return this.getResource(ENDPOINTS.VERSION_GROUP, name);
  }

  /**
   * Get a Version Group by its ID.
   * @param id The Version Group ID.
   * @returns The matching Version Group.
   */
  public async getVersionGroupById(id: number): Promise<VersionGroup> {
    return this.getResource(ENDPOINTS.VERSION_GROUP, id);
  }

  /**
   * List Generations.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Generations.
   */
  public async listGenerations(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<Generation>> {
    return this.getListResource<Generation>(ENDPOINTS.GENERATION, offset, limit);
  }

  /**
   * List Pokédexes.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Pokédexes.
   */
  public async listPokedexes(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<Pokedex>> {
    return this.getListResource<Pokedex>(ENDPOINTS.POKEDEX, offset, limit);
  }

  /**
   * List Versions.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Versions.
   */
  public async listVersions(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<Version>> {
    return this.getListResource<Version>(ENDPOINTS.VERSION, offset, limit);
  }

  /**
   * List Version Groups.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Version Groups.
   */
  public async listVersionGroups(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<VersionGroup>> {
    return this.getListResource<VersionGroup>(ENDPOINTS.VERSION_GROUP, offset, limit);
  }
}
