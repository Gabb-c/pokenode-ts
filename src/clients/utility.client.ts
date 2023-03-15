import { AxiosError, AxiosResponse } from 'axios';
import { Language, NamedAPIResourceList } from '../models';
import { Endpoints } from '../constants';
import { BaseClient, ClientArgs } from '../structures/base';

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
  constructor(clientOptions?: ClientArgs) {
    super(clientOptions);
  }

  /**
   * Get a Language by it's ID
   * @param id The Language ID
   * @returns Language
   */
  public async getLanguageById(id: number): Promise<Language> {
    return new Promise<Language>((resolve, reject) => {
      this.api
        .get<Language>(`${Endpoints.Language}/${id}`)
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
        .get<Language>(`${Endpoints.Language}/${name}`)
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
        .get(url, { baseURL: '' })
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
      this.api
        .get<NamedAPIResourceList>(
          `${Endpoints.Language}?offset=${offset || 0}&limit=${limit || 20}`
        )
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }
}
