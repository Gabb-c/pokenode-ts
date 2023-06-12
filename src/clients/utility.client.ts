import { Endpoints } from "../constants";
import { Language, NamedAPIResourceList } from "../models";
import { BaseClient } from "../structures/base";
import { getListURL } from "../utils/request-params";
import { AxiosError, AxiosResponse } from "axios";

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
    return new Promise<Language>((resolve, reject) => {
      this.api
        .get<Language>(`${Endpoints.LANGUAGE}/${id}`)
        .then((response: AxiosResponse<Language>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Language by it's name
   * @param name The Language name
   * @returns Language
   */
  public async getLanguageByName(name: string): Promise<Language> {
    return new Promise<Language>((resolve, reject) => {
      this.api
        .get<Language>(`${Endpoints.LANGUAGE}/${name}`)
        .then((response: AxiosResponse<Language>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Resource by it's url
   * @param url The Resource url
   * @returns Resource
   */
  public async getResourceByUrl<T>(url: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.api
        .get(url, { baseURL: "" })
        .then((response: AxiosResponse<T>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Languages
   * @param offset The first item that you will get
   * @param limit How many Languages per page
   * @returns A list of Languages
   */
  public listLanguages(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = getListURL(Endpoints.LANGUAGE, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }
}
