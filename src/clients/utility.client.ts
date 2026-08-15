import { ENDPOINTS } from "@constants";
import type { Language, NamedAPIResourceList } from "@models";
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
  /**
   * Get a Language by its ID.
   * @param id The Language ID.
   * @returns The matching Language.
   */
  public async getLanguageById(id: number): Promise<Language> {
    return this.getResource(ENDPOINTS.LANGUAGE, id);
  }

  /**
   * Get a Language by its name.
   * @param name The Language name.
   * @returns The matching Language.
   */
  public async getLanguageByName(name: string): Promise<Language> {
    return this.getResource(ENDPOINTS.LANGUAGE, name);
  }

  /**
   * Get any resource by its URL, as returned inside a PokéAPI response.
   * @param url The absolute URL of the resource.
   * @returns The resource the URL points at.
   * @throws {TypeError} If `url` is not a valid URL, or names no PokéAPI endpoint.
   */
  public async getResourceByUrl<T>(url: string): Promise<T> {
    return this.getResourceByURL<T>(url);
  }

  /**
   * List Languages.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Languages.
   */
  public listLanguages(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.LANGUAGE, offset, limit);
  }
}
