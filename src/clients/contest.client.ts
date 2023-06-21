import { ENDPOINTS } from "../constants";
import { ContestEffect, ContestType, NamedAPIResourceList, SuperContestEffect } from "../models";
import { BaseClient } from "../structures/base";
import { getListURL } from "../utils/request-params";
import { AxiosError, AxiosResponse } from "axios";

/**
 * ### Contest Client
 *
 * Client used to access the Contest Endpoints:
 *  - [Contest Types](https://pokeapi.co/docs/v2#contest-types)
 *  - [Contest Effects](https://pokeapi.co/docs/v2#contest-effects)
 *  - [Super Contest Effects](https://pokeapi.co/docs/v2#super-contest-effects)
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#contests-section)
 */
export class ContestClient extends BaseClient {
  /**
   * Get a Contest Type by it's name
   * @param name  The contest type name
   * @returns A Contest Type
   */
  public async getContestTypeByName(name: string): Promise<ContestType> {
    return new Promise<ContestType>((resolve, reject) => {
      this.api
        .get<ContestType>(`${ENDPOINTS.CONTEST_TYPE}/${name}`)
        .then((response: AxiosResponse<ContestType>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Contest Type by it's ID
   * @param id The Contest Type ID
   * @returns A Contest Type
   */
  public async getContestTypeById(id: number): Promise<ContestType> {
    return new Promise<ContestType>((resolve, reject) => {
      this.api
        .get<ContestType>(`${ENDPOINTS.CONTEST_TYPE}/${id}`)
        .then((response: AxiosResponse<ContestType>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Contest Effect by it's ID
   * @param id The Contest Effect ID
   * @returns Contest Effect
   */
  public async getContestEffectById(id: number): Promise<ContestEffect> {
    return new Promise<ContestEffect>((resolve, reject) => {
      this.api
        .get<ContestEffect>(`${ENDPOINTS.CONTEST_EFFECT}/${id}`)
        .then((response: AxiosResponse<ContestEffect>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Super Contest Effect by it's ID
   * @param id The Super Contest Effect ID
   * @returns Super Contest Effect
   */
  public async getSuperContestEffectById(id: number): Promise<SuperContestEffect> {
    return new Promise<SuperContestEffect>((resolve, reject) => {
      this.api
        .get<SuperContestEffect>(`${ENDPOINTS.SUPER_CONTEST_EFFECT}/${id}`)
        .then((response: AxiosResponse<SuperContestEffect>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Contest Types
   * @param offset The first item that you will get
   * @param limit How many contest types per page
   * @returns A list of contest types
   */
  public async listContestTypes(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = getListURL(ENDPOINTS.CONTEST_TYPE, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Contest Effects
   * @param offset The first item that you will get
   * @param limit How many contest effects per page
   * @returns A list of contest effects
   */
  public async listContestEffects(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = getListURL(ENDPOINTS.CONTEST_EFFECT, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Super Contest Effects
   * @param offset The first item that you will get
   * @param limit How many Super Contest Effect per page
   * @returns A list of Super Contest Effect
   */
  public async listSuperContestEffects(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = getListURL(ENDPOINTS.SUPER_CONTEST_EFFECT, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }
}
