import { ENDPOINTS } from "@constants";
import type { Berry, BerryFirmness, BerryFlavor, NamedAPIResourceList } from "@models";
import { BaseClient } from "./base";

/**
 * ### Berry Client
 *
 * Client used to access the Berry Endpoints:
 *  - [Berries](https://pokeapi.co/docs/v2#berries)
 *  - [Berry Firmnesses](https://pokeapi.co/docs/v2#berry-firmnesses)
 *  - [Berry Flavors](https://pokeapi.co/docs/v2#berry-flavors)
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#berries-section)
 */
export class BerryClient extends BaseClient {
  /**
   * Get a Berry by its name.
   * @param name The Berry name.
   * @returns The matching Berry.
   */
  public async getBerryByName(name: string): Promise<Berry> {
    return this.getResource(ENDPOINTS.BERRY, name);
  }

  /**
   * Get a Berry by its ID.
   * @param id The Berry ID.
   * @returns The matching Berry.
   */
  public async getBerryById(id: number): Promise<Berry> {
    return this.getResource(ENDPOINTS.BERRY, id);
  }

  /**
   * Get a Berry Firmness by its ID.
   * @param id The Berry Firmness ID.
   * @returns The matching Berry Firmness.
   */
  public async getBerryFirmnessById(id: number): Promise<BerryFirmness> {
    return this.getResource(ENDPOINTS.BERRY_FIRMNESS, id);
  }

  /**
   * Get a Berry Firmness by its name.
   * @param name The Berry Firmness name.
   * @returns The matching Berry Firmness.
   */
  public async getBerryFirmnessByName(name: string): Promise<BerryFirmness> {
    return this.getResource(ENDPOINTS.BERRY_FIRMNESS, name);
  }

  /**
   * Get a Berry Flavor by its ID.
   *
   * Flavors determine whether a Pokémon benefits or suffers from eating a berry,
   * based on its nature. See
   * [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Flavor) for greater detail.
   * @param id The Berry Flavor ID.
   * @returns The matching Berry Flavor.
   */
  public async getBerryFlavorById(id: number): Promise<BerryFlavor> {
    return this.getResource(ENDPOINTS.BERRY_FLAVOR, id);
  }

  /**
   * Get a Berry Flavor by its name.
   *
   * Flavors determine whether a Pokémon benefits or suffers from eating a berry,
   * based on its nature. See
   * [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Flavor) for greater detail.
   * @param name The Berry Flavor name.
   * @returns The matching Berry Flavor.
   */
  public async getBerryFlavorByName(name: string): Promise<BerryFlavor> {
    return this.getResource(ENDPOINTS.BERRY_FLAVOR, name);
  }

  /**
   * List Berries.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Berries.
   */
  public async listBerries(offset?: number, limit?: number): Promise<NamedAPIResourceList<Berry>> {
    return this.getListResource<Berry>(ENDPOINTS.BERRY, offset, limit);
  }

  /**
   * List Berry Firmnesses.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Berry Firmnesses.
   */
  public async listBerryFirmnesses(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<BerryFirmness>> {
    return this.getListResource<BerryFirmness>(ENDPOINTS.BERRY_FIRMNESS, offset, limit);
  }

  /**
   * List Berry Flavors.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Berry Flavors.
   */
  public async listBerryFlavors(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<BerryFlavor>> {
    return this.getListResource<BerryFlavor>(ENDPOINTS.BERRY_FLAVOR, offset, limit);
  }
}
