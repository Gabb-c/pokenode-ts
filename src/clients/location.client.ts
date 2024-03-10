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
   * Get a Location by it's name
   * @param name The Location name
   * @returns A Location
   */
  public async getLocationByName(name: string): Promise<Location> {
    return this.getResource(ENDPOINTS.LOCATION, name);
  }

  /**
   * Get a Location by it's ID
   * @param id The Location ID
   * @returns A location
   */
  public async getLocationById(id: number): Promise<Location> {
    return this.getResource(ENDPOINTS.LOCATION, id);
  }

  /**
   * Get a Location Area by it's name
   * @param name The Location Area name
   * @returns A Location Area
   */
  public async getLocationAreaByName(name: string): Promise<LocationArea> {
    return this.getResource(ENDPOINTS.LOCATION_AREA, name);
  }

  /**
   * Get a Location Area by it's ID
   * @param id The Location Area ID
   * @returns A Location Area
   */
  public async getLocationAreaById(id: number): Promise<LocationArea> {
    return this.getResource(ENDPOINTS.LOCATION_AREA, id);
  }

  /**
   * Get a Pal Park Area by it's name
   * @param name The Pal Park Area name
   * @returns A Pal Park Area
   */
  public async getPalParkAreaByName(name: string): Promise<PalParkArea> {
    return this.getResource(ENDPOINTS.PALPARK_AREA, name);
  }

  /**
   * Get a Pal Park Area by it's ID
   * @param id The Pal Park Area ID
   * @returns A Pal Park Area
   */
  public async getPalParkAreaById(id: number): Promise<PalParkArea> {
    return this.getResource(ENDPOINTS.PALPARK_AREA, id);
  }

  /**
   * Get a Region by it's name
   * @param name The Region name
   * @returns A Region
   */
  public async getRegionByName(name: string): Promise<Region> {
    return this.getResource(ENDPOINTS.REGION, name);
  }

  /**
   * Get a Region by it's ID
   * @param id The Region ID
   * @returns A Region
   */
  public async getRegionById(id: number): Promise<Region> {
    return this.getResource(ENDPOINTS.REGION, id);
  }

  /**
   * List Locations
   * @param offset The first item that you will get
   * @param limit How many Locations per page
   * @returns A list of Locations
   */
  public async listLocations(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.LOCATION, offset, limit);
  }

  /**
   * List Location Areas
   * @param offset The first item that you will get
   * @param limit How many Locations per page
   * @returns A list of Location Areas
   */
  public async listLocationAreas(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.LOCATION_AREA, offset, limit);
  }

  /**
   * List Pal Park Areas
   * @param offset The first item that you will get
   * @param limit How many Pal Park Areas per page
   * @returns A list of Pal Park Areas
   */
  public async listPalParkAreas(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.PALPARK_AREA, offset, limit);
  }

  /**
   * List Regions
   * @param offset The first item that you will get
   * @param limit How many Regions per page
   * @returns A list of Regions
   */
  public async listRegions(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.REGION, offset, limit);
  }
}
