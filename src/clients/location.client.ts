import { ENDPOINTS } from "@constants";
import type { Location, LocationArea, NamedAPIResourceList, PalParkArea, Region } from "@models";
import { BaseClient } from "./base";

/**
 * ### Location Client
 *
 * Client used to access the Location Endpoints:
 *  - [Locations](https://pokeapi.co/docs/v2#locations)
 *  - [Location Areas](https://pokeapi.co/docs/v2#location-areas)
 *  - [Pal Park Areas](https://pokeapi.co/docs/v2#pal-park-areas)
 *  - [Regions](https://pokeapi.co/docs/v2#regions)
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#locations-section)
 */
export class LocationClient extends BaseClient {
  /**
   * Get a Location by its name.
   * @param name The Location name.
   * @returns The matching Location.
   */
  public async getLocationByName(name: string): Promise<Location> {
    return this.getResource(ENDPOINTS.LOCATION, name);
  }

  /**
   * Get a Location by its ID.
   * @param id The Location ID.
   * @returns The matching Location.
   */
  public async getLocationById(id: number): Promise<Location> {
    return this.getResource(ENDPOINTS.LOCATION, id);
  }

  /**
   * Get a Location Area by its name.
   * @param name The Location Area name.
   * @returns The matching Location Area.
   */
  public async getLocationAreaByName(name: string): Promise<LocationArea> {
    return this.getResource(ENDPOINTS.LOCATION_AREA, name);
  }

  /**
   * Get a Location Area by its ID.
   * @param id The Location Area ID.
   * @returns The matching Location Area.
   */
  public async getLocationAreaById(id: number): Promise<LocationArea> {
    return this.getResource(ENDPOINTS.LOCATION_AREA, id);
  }

  /**
   * Get a Pal Park Area by its name.
   * @param name The Pal Park Area name.
   * @returns The matching Pal Park Area.
   */
  public async getPalParkAreaByName(name: string): Promise<PalParkArea> {
    return this.getResource(ENDPOINTS.PALPARK_AREA, name);
  }

  /**
   * Get a Pal Park Area by its ID.
   * @param id The Pal Park Area ID.
   * @returns The matching Pal Park Area.
   */
  public async getPalParkAreaById(id: number): Promise<PalParkArea> {
    return this.getResource(ENDPOINTS.PALPARK_AREA, id);
  }

  /**
   * Get a Region by its name.
   * @param name The Region name.
   * @returns The matching Region.
   */
  public async getRegionByName(name: string): Promise<Region> {
    return this.getResource(ENDPOINTS.REGION, name);
  }

  /**
   * Get a Region by its ID.
   * @param id The Region ID.
   * @returns The matching Region.
   */
  public async getRegionById(id: number): Promise<Region> {
    return this.getResource(ENDPOINTS.REGION, id);
  }

  /**
   * List Locations.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Locations.
   */
  public async listLocations(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<Location>> {
    return this.getListResource<Location>(ENDPOINTS.LOCATION, offset, limit);
  }

  /**
   * List Location Areas.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Location Areas.
   */
  public async listLocationAreas(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<LocationArea>> {
    return this.getListResource<LocationArea>(ENDPOINTS.LOCATION_AREA, offset, limit);
  }

  /**
   * List Pal Park Areas.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Pal Park Areas.
   */
  public async listPalParkAreas(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<PalParkArea>> {
    return this.getListResource<PalParkArea>(ENDPOINTS.PALPARK_AREA, offset, limit);
  }

  /**
   * List Regions.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Regions.
   */
  public async listRegions(offset?: number, limit?: number): Promise<NamedAPIResourceList<Region>> {
    return this.getListResource<Region>(ENDPOINTS.REGION, offset, limit);
  }
}
