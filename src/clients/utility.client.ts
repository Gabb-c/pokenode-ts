import { ENDPOINTS } from "@constants";
import type { Language, NamedAPIResourceList } from "@models";
import { BaseClient } from "./base";

/**
 * ### Utility Client
 *
 * Client used to access the Utility Endpoints:
 *  - [Languages](https://pokeapi.co/docs/v2#utility-section)
 *  - Resources
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#utility-section)
 */
export class UtilityClient extends BaseClient {
  /**
   * Get a Language by it's ID
   * @param id The Language ID
   * @returns Language
   */
  public async getLanguageById(id: number): Promise<Language> {
    return this.getResource(ENDPOINTS.LANGUAGE, id);
  }

  /**
   * Get a Language by it's name
   * @param name The Language name
   * @returns Language
   */
  public async getLanguageByName(name: string): Promise<Language> {
    return this.getResource(ENDPOINTS.LANGUAGE, name);
  }

  /**
   * Get a Resource by it's url
   * @param url The Resource url
   * @returns Resource
   */
  public async getResourceByUrl<T>(url: string): Promise<T> {
    return this.getResourceByURL<T>(url);
  }

  /**
   * List Languages
   * @param offset The first item that you will get
   * @param limit How many Languages per page
   * @returns A list of Languages
   */
  public listLanguages(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.LANGUAGE, offset, limit);
  }
}
