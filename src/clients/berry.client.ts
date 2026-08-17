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
  /** Get a Berry by its name. */
  public async getBerryByName(name: string): Promise<Berry> {
    return this.getResource(ENDPOINTS.BERRY, name);
  }

  /** Get a Berry by its ID. */
  public async getBerryById(id: number): Promise<Berry> {
    return this.getResource(ENDPOINTS.BERRY, id);
  }

  /** Get a Berry Firmness by its ID. */
  public async getBerryFirmnessById(id: number): Promise<BerryFirmness> {
    return this.getResource(ENDPOINTS.BERRY_FIRMNESS, id);
  }

  /** Get a Berry Firmness by its name. */
  public async getBerryFirmnessByName(name: string): Promise<BerryFirmness> {
    return this.getResource(ENDPOINTS.BERRY_FIRMNESS, name);
  }

  /** Get a Berry Flavor by its ID. */
  public async getBerryFlavorById(id: number): Promise<BerryFlavor> {
    return this.getResource(ENDPOINTS.BERRY_FLAVOR, id);
  }

  /** Get a Berry Flavor by its name. */
  public async getBerryFlavorByName(name: string): Promise<BerryFlavor> {
    return this.getResource(ENDPOINTS.BERRY_FLAVOR, name);
  }

  /** List Berries. Page defaults to 20 entries from offset 0. */
  public async listBerries(offset?: number, limit?: number): Promise<NamedAPIResourceList<Berry>> {
    return this.getListResource<Berry>(ENDPOINTS.BERRY, offset, limit);
  }

  /** List Berry Firmnesses. Page defaults to 20 entries from offset 0. */
  public async listBerryFirmnesses(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<BerryFirmness>> {
    return this.getListResource<BerryFirmness>(ENDPOINTS.BERRY_FIRMNESS, offset, limit);
  }

  /** List Berry Flavors. Page defaults to 20 entries from offset 0. */
  public async listBerryFlavors(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<BerryFlavor>> {
    return this.getListResource<BerryFlavor>(ENDPOINTS.BERRY_FLAVOR, offset, limit);
  }
}
