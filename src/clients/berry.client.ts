import { ENDPOINTS } from "../constants";
import { Berry, BerryFirmness, BerryFlavor, NamedAPIResourceList } from "../models";
import { BaseClient } from "../structures/base";
import { AxiosError, AxiosResponse } from "axios";

/**
 * ### Berry Client
 *
 * Client used to access the Berry Endpoints:
 *  - [Berries](https://pokeapi.co/docs/v2#berries)
 *  - [Berry Firmnesses](https://pokeapi.co/docs/v2#berry-firmnesses)
 *  - [Berry Flavors](https://pokeapi.co/docs/v2#berry-flavors)
 *
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#berries-section)
 */
export class BerryClient extends BaseClient {
  /**
   * Get a Berry by it's name
   * @param name The berry name
   * @returns A Berry
   */
  public async getBerryByName(name: string): Promise<Berry> {
    return new Promise<Berry>((resolve, reject) => {
      this.api
        .get<Berry>(`${ENDPOINTS.BERRY}/${name}`)
        .then((response: AxiosResponse<Berry>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Berry by it's ID
   * @param id The Berry ID
   * @returns A Berry
   */
  public async getBerryById(id: number): Promise<Berry> {
    return new Promise<Berry>((resolve, reject) => {
      this.api
        .get<Berry>(`${ENDPOINTS.BERRY}/${id}`)
        .then((response: AxiosResponse<Berry>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Berry Firmness by it's ID
   * @param id The Berry ID
   * @returns Berry Firmness
   */
  public async getBerryFirmnessById(id: number): Promise<BerryFirmness> {
    return new Promise<BerryFirmness>((resolve, reject) => {
      this.api
        .get<BerryFirmness>(`${ENDPOINTS.BERRY_FIRMNESS}/${id}`)
        .then((response: AxiosResponse<BerryFirmness>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Berry Firmness by it's ID
   * @param name The Berry name
   * @returns Berry Firmness
   */
  public async getBerryFirmnessByName(name: string): Promise<BerryFirmness> {
    return new Promise<BerryFirmness>((resolve, reject) => {
      this.api
        .get<BerryFirmness>(`${ENDPOINTS.BERRY_FIRMNESS}/${name}`)
        .then((response: AxiosResponse<BerryFirmness>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Flavors determine whether a Pokémon will benefit or suffer from eating a berry based on their nature.
   * Check out [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Flavor) for greater detail.
   * @param id The Berry Flavor ID
   * @returns Berry Flavor
   */
  public async getBerryFlavorById(id: number): Promise<BerryFlavor> {
    return new Promise<BerryFlavor>((resolve, reject) => {
      this.api
        .get<BerryFlavor>(`${ENDPOINTS.BERRY_FLAVOR}/${id}`)
        .then((response: AxiosResponse<BerryFlavor>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Flavors determine whether a Pokémon will benefit or suffer from eating a berry based on their nature.
   * Check out [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Flavor) for greater detail.
   * @param name The Berry Flavor name
   * @returns Berry Flavor
   */
  public async getBerryFlavorByName(name: string): Promise<BerryFlavor> {
    return new Promise<BerryFlavor>((resolve, reject) => {
      this.api
        .get<BerryFlavor>(`${ENDPOINTS.BERRY_FLAVOR}/${name}`)
        .then((response: AxiosResponse<BerryFlavor>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Berries
   * @param offset The first item that you will get
   * @param limit How many berries per page
   * @returns A list of berries
   */
  public listBerries(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = this.getListURL(ENDPOINTS.BERRY, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Berries
   * @param offset The first item that you will get
   * @param limit How many berry firmnesses per page
   * @returns A list of berry firmnesses
   */
  public listBerryFirmnesses(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = this.getListURL(ENDPOINTS.BERRY_FIRMNESS, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Berry Flavors
   * @param offset The first item that you will get
   * @param limit How many Berry Flavors per page
   * @returns A list of Berry Flavors
   */
  public listBerryFlavors(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = this.getListURL(ENDPOINTS.BERRY_FLAVOR, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }
}
