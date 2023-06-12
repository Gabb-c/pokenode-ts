import { Endpoints } from "../constants";
import { Location, LocationArea, NamedAPIResourceList, PalParkArea, Region } from "../models";
import { BaseClient } from "../structures/base";
import { getListURL } from "../utils/request-params";
import { AxiosError, AxiosResponse } from "axios";

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
    return new Promise<Location>((resolve, reject) => {
      this.api
        .get<Location>(`${Endpoints.LOCATION}/${name}`)
        .then((response: AxiosResponse<Location>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Location by it's ID
   * @param id The Location ID
   * @returns A location
   */
  public async getLocationById(id: number): Promise<Location> {
    return new Promise<Location>((resolve, reject) => {
      this.api
        .get<Location>(`${Endpoints.LOCATION}/${id}`)
        .then((response: AxiosResponse<Location>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Location Area by it's name
   * @param name The Location Area name
   * @returns A Location Area
   */
  public async getLocationAreaByName(name: string): Promise<LocationArea> {
    return new Promise<LocationArea>((resolve, reject) => {
      this.api
        .get<LocationArea>(`${Endpoints.LOCATION_AREA}/${name}`)
        .then((response: AxiosResponse<LocationArea>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Location Area by it's ID
   * @param id The Location Area ID
   * @returns A Location Area
   */
  public async getLocationAreaById(id: number): Promise<LocationArea> {
    return new Promise<LocationArea>((resolve, reject) => {
      this.api
        .get<LocationArea>(`${Endpoints.LOCATION_AREA}/${id}`)
        .then((response: AxiosResponse<LocationArea>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Pal Park Area by it's name
   * @param name The Pal Park Area name
   * @returns A Pal Park Area
   */
  public async getPalParkAreaByName(name: string): Promise<PalParkArea> {
    return new Promise<PalParkArea>((resolve, reject) => {
      this.api
        .get<PalParkArea>(`${Endpoints.PALPARK_AREA}/${name}`)
        .then((response: AxiosResponse<PalParkArea>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Pal Park Area by it's ID
   * @param id The Pal Park Area ID
   * @returns A Pal Park Area
   */
  public async getPalParkAreaById(id: number): Promise<PalParkArea> {
    return new Promise<PalParkArea>((resolve, reject) => {
      this.api
        .get<PalParkArea>(`${Endpoints.PALPARK_AREA}/${id}`)
        .then((response: AxiosResponse<PalParkArea>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Region by it's name
   * @param name The Region name
   * @returns A Region
   */
  public async getRegionByName(name: string): Promise<Region> {
    return new Promise<Region>((resolve, reject) => {
      this.api
        .get<Region>(`${Endpoints.REGION}/${name}`)
        .then((response: AxiosResponse<Region>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Region by it's ID
   * @param id The Region ID
   * @returns A Region
   */
  public async getRegionById(id: number): Promise<Region> {
    return new Promise<Region>((resolve, reject) => {
      this.api
        .get<Region>(`${Endpoints.REGION}/${id}`)
        .then((response: AxiosResponse<Region>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Locations
   * @param offset The first item that you will get
   * @param limit How many Locations per page
   * @returns A list of Locations
   */
  public async listLocations(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = getListURL(Endpoints.LOCATION, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Location Areas
   * @param offset The first item that you will get
   * @param limit How many Locations per page
   * @returns A list of Location Areas
   */
  public async listLocationAreas(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = getListURL(Endpoints.LOCATION_AREA, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Pal Park Areas
   * @param offset The first item that you will get
   * @param limit How many Pal Park Areas per page
   * @returns A list of Pal Park Areas
   */
  public async listPalParkAreas(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = getListURL(Endpoints.PALPARK_AREA, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Regions
   * @param offset The first item that you will get
   * @param limit How many Regions per page
   * @returns A list of Regions
   */
  public async listRegions(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = getListURL(Endpoints.REGION, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }
}
