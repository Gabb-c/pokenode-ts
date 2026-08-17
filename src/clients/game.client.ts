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
  /** Get a Generation by its name. */
  public async getGenerationByName(name: string): Promise<Generation> {
    return this.getResource(ENDPOINTS.GENERATION, name);
  }

  /** Get a Generation by its ID. */
  public async getGenerationById(id: number): Promise<Generation> {
    return this.getResource(ENDPOINTS.GENERATION, id);
  }

  /** Get a Pokédex by its name. */
  public async getPokedexByName(name: string): Promise<Pokedex> {
    return this.getResource(ENDPOINTS.POKEDEX, name);
  }

  /** Get a Pokédex by its ID. */
  public async getPokedexById(id: number): Promise<Pokedex> {
    return this.getResource(ENDPOINTS.POKEDEX, id);
  }

  /** Get a Version by its name. */
  public async getVersionByName(name: string): Promise<Version> {
    return this.getResource(ENDPOINTS.VERSION, name);
  }

  /** Get a Version by its ID. */
  public async getVersionById(id: number): Promise<Version> {
    return this.getResource(ENDPOINTS.VERSION, id);
  }

  /** Get a Version Group by its name. */
  public async getVersionGroupByName(name: string): Promise<VersionGroup> {
    return this.getResource(ENDPOINTS.VERSION_GROUP, name);
  }

  /** Get a Version Group by its ID. */
  public async getVersionGroupById(id: number): Promise<VersionGroup> {
    return this.getResource(ENDPOINTS.VERSION_GROUP, id);
  }

  /** List Generations. Page defaults to 20 entries from offset 0. */
  public async listGenerations(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<Generation>> {
    return this.getListResource<Generation>(ENDPOINTS.GENERATION, offset, limit);
  }

  /** List Pokédexes. Page defaults to 20 entries from offset 0. */
  public async listPokedexes(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<Pokedex>> {
    return this.getListResource<Pokedex>(ENDPOINTS.POKEDEX, offset, limit);
  }

  /** List Versions. Page defaults to 20 entries from offset 0. */
  public async listVersions(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<Version>> {
    return this.getListResource<Version>(ENDPOINTS.VERSION, offset, limit);
  }

  /** List Version Groups. Page defaults to 20 entries from offset 0. */
  public async listVersionGroups(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<VersionGroup>> {
    return this.getListResource<VersionGroup>(ENDPOINTS.VERSION_GROUP, offset, limit);
  }
}
