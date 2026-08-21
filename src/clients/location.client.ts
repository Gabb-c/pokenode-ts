import { ENDPOINTS } from "@constants";
import type { Location, LocationArea, NamedAPIResourceList, PalParkArea, Region } from "@models";
import { BaseClient } from "./base";

/**
 * ### Location Client
 *
 * Client used to access the Location Endpoints:
 *
 * - [Locations](https://pokeapi.co/docs/v2#locations)
 * - [Location Areas](https://pokeapi.co/docs/v2#location-areas)
 * - [Pal Park Areas](https://pokeapi.co/docs/v2#pal-park-areas)
 * - [Regions](https://pokeapi.co/docs/v2#regions)
 *
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#locations-section)
 */
export class LocationClient extends BaseClient {
  /** Get a Location by its name. */
  public async getLocationByName(name: string): Promise<Location> {
    return this.getResource(ENDPOINTS.LOCATION, name);
  }

  /** Get a Location by its ID. */
  public async getLocationById(id: number): Promise<Location> {
    return this.getResource(ENDPOINTS.LOCATION, id);
  }

  /** Get a Location Area by its name. */
  public async getLocationAreaByName(name: string): Promise<LocationArea> {
    return this.getResource(ENDPOINTS.LOCATION_AREA, name);
  }

  /** Get a Location Area by its ID. */
  public async getLocationAreaById(id: number): Promise<LocationArea> {
    return this.getResource(ENDPOINTS.LOCATION_AREA, id);
  }

  /** Get a Pal Park Area by its name. */
  public async getPalParkAreaByName(name: string): Promise<PalParkArea> {
    return this.getResource(ENDPOINTS.PALPARK_AREA, name);
  }

  /** Get a Pal Park Area by its ID. */
  public async getPalParkAreaById(id: number): Promise<PalParkArea> {
    return this.getResource(ENDPOINTS.PALPARK_AREA, id);
  }

  /** Get a Region by its name. */
  public async getRegionByName(name: string): Promise<Region> {
    return this.getResource(ENDPOINTS.REGION, name);
  }

  /** Get a Region by its ID. */
  public async getRegionById(id: number): Promise<Region> {
    return this.getResource(ENDPOINTS.REGION, id);
  }

  /** List Locations. Page defaults to 20 entries from offset 0. */
  public async listLocations(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<Location>> {
    return this.getListResource<Location>(ENDPOINTS.LOCATION, offset, limit);
  }

  /** List Location Areas. Page defaults to 20 entries from offset 0. */
  public async listLocationAreas(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<LocationArea>> {
    return this.getListResource<LocationArea>(ENDPOINTS.LOCATION_AREA, offset, limit);
  }

  /** List Pal Park Areas. Page defaults to 20 entries from offset 0. */
  public async listPalParkAreas(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<PalParkArea>> {
    return this.getListResource<PalParkArea>(ENDPOINTS.PALPARK_AREA, offset, limit);
  }

  /** List Regions. Page defaults to 20 entries from offset 0. */
  public async listRegions(offset?: number, limit?: number): Promise<NamedAPIResourceList<Region>> {
    return this.getListResource<Region>(ENDPOINTS.REGION, offset, limit);
  }
}
