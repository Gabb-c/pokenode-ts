import { ENDPOINTS } from "../constants";
import type { Berry, BerryFirmness, BerryFlavor, NamedAPIResourceList } from "../models";
import { BaseClient } from "./base";

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
    return this.getResource<Berry>(ENDPOINTS.BERRY, name);
  }

  /**
   * Get a Berry by it's ID
   * @param id The Berry ID
   * @returns A Berry
   */
  public async getBerryById(id: number): Promise<Berry> {
    return this.getResource<Berry>(ENDPOINTS.BERRY, id);
  }

  /**
   * Get a Berry Firmness by it's ID
   * @param id The Berry ID
   * @returns Berry Firmness
   */
  public async getBerryFirmnessById(id: number): Promise<BerryFirmness> {
    return this.getResource<BerryFirmness>(ENDPOINTS.BERRY_FIRMNESS, id);
  }

  /**
   * Get a Berry Firmness by it's ID
   * @param name The Berry name
   * @returns Berry Firmness
   */
  public async getBerryFirmnessByName(name: string): Promise<BerryFirmness> {
    return this.getResource<BerryFirmness>(ENDPOINTS.BERRY_FIRMNESS, name);
  }

  /**
   * Flavors determine whether a Pokémon will benefit or suffer from eating a berry based on their nature.
   * Check out [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Flavor) for greater detail.
   * @param id The Berry Flavor ID
   * @returns Berry Flavor
   */
  public async getBerryFlavorById(id: number): Promise<BerryFlavor> {
    return this.getResource<BerryFlavor>(ENDPOINTS.BERRY_FLAVOR, id);
  }

  /**
   * Flavors determine whether a Pokémon will benefit or suffer from eating a berry based on their nature.
   * Check out [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Flavor) for greater detail.
   * @param name The Berry Flavor name
   * @returns Berry Flavor
   */
  public async getBerryFlavorByName(name: string): Promise<BerryFlavor> {
    return this.getResource<BerryFlavor>(ENDPOINTS.BERRY_FLAVOR, name);
  }

  /**
   * List Berries
   * @param offset The first item that you will get
   * @param limit How many berries per page
   * @returns A list of berries
   */
  public async listBerries(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.BERRY, offset, limit);
  }

  /**
   * List Berries
   * @param offset The first item that you will get
   * @param limit How many berry firmnesses per page
   * @returns A list of berry firmnesses
   */
  public async listBerryFirmnesses(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.BERRY_FIRMNESS, offset, limit);
  }

  /**
   * List Berry Flavors
   * @param offset The first item that you will get
   * @param limit How many Berry Flavors per page
   * @returns A list of Berry Flavors
   */
  public async listBerryFlavors(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.BERRY_FLAVOR, offset, limit);
  }
}
