import { ENDPOINTS } from "@constants";
import type { APIResource, Language, NamedAPIResource, NamedAPIResourceList } from "@models";
import { BaseClient } from "./base";

/**
 * ### Utility Client
 *
 * Client used to access the Utility Endpoints:
 *  - [Languages](https://pokeapi.co/docs/v2#languages)
 *  - [Resources](https://pokeapi.co/docs/v2#resource-listspagination-section)
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#utility-section)
 */
export class UtilityClient extends BaseClient {
  /** Get a Language by its ID. */
  public async getLanguageById(id: number): Promise<Language> {
    return this.getResource(ENDPOINTS.LANGUAGE, id);
  }

  /** Get a Language by its name. */
  public async getLanguageByName(name: string): Promise<Language> {
    return this.getResource(ENDPOINTS.LANGUAGE, name);
  }

  /**
   * Get any resource by its URL, or by a link taken from another response.
   *
   * A link carries what it points at, so the result is typed without saying so:
   *
   * ```ts
   * const pokemon = await api.pokemon.getPokemonByName('luxray');
   * const species = await api.utility.getResourceByUrl(pokemon.species);
   * //    ^? PokemonSpecies
   * ```
   *
   * @param resource The absolute URL of the resource, or a link to it.
   * @returns The resource the URL points at.
   * @throws {TypeError} If the URL is not valid, or names no PokéAPI endpoint.
   */
  public async getResourceByUrl<T>(
    resource: string | NamedAPIResource<T> | APIResource<T>,
  ): Promise<T> {
    return this.getResourceByURL<T>(resource);
  }

  /** List Languages. Page defaults to 20 entries from offset 0. */
  public listLanguages(offset?: number, limit?: number): Promise<NamedAPIResourceList<Language>> {
    return this.getListResource<Language>(ENDPOINTS.LANGUAGE, offset, limit);
  }
}
