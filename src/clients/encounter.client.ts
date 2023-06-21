import { ENDPOINTS } from "../constants";
import {
  EncounterCondition,
  EncounterConditionValue,
  EncounterMethod,
  NamedAPIResourceList,
} from "../models";
import { BaseClient } from "../structures/base";
import { getListURL } from "../utils/request-params";
import { AxiosError, AxiosResponse } from "axios";

/**
 * ### Encounter Client
 *
 * Client used to access the Encounter Endpoints:
 *  - [Encounter Methods](https://pokeapi.co/docs/v2#encounter-methods)
 *  - [Encounter Conditions](https://pokeapi.co/docs/v2#encounter-conditions)
 *  - [Encounter Condition Values](https://pokeapi.co/docs/v2#encounter-condition-values)
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#encounters-section)
 */
export class EncounterClient extends BaseClient {
  /**
   * Get an Encounter Method by it's name
   * @param name The Encounter Method name
   * @returns An Encounter Method
   */
  public async getEncounterMethodByName(name: string): Promise<EncounterMethod> {
    return new Promise<EncounterMethod>((resolve, reject) => {
      this.api
        .get<EncounterMethod>(`${ENDPOINTS.ENCOUNTER_METHOD}/${name}`)
        .then((response: AxiosResponse<EncounterMethod>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get an Encounter Method by it's ID
   * @param id The Encounter Method ID
   * @returns An Encounter Method
   */
  public async getEncounterMethodById(id: number): Promise<EncounterMethod> {
    return new Promise<EncounterMethod>((resolve, reject) => {
      this.api
        .get<EncounterMethod>(`${ENDPOINTS.ENCOUNTER_METHOD}/${id}`)
        .then((response: AxiosResponse<EncounterMethod>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get an Encounter Condition by it's ID
   * @param id The Encounter Condition ID
   * @returns An Encounter Condition
   */
  public async getEncounterConditionById(id: number): Promise<EncounterCondition> {
    return new Promise<EncounterCondition>((resolve, reject) => {
      this.api
        .get<EncounterCondition>(`${ENDPOINTS.ENCOUNTER_CONDITION}/${id}`)
        .then((response: AxiosResponse<EncounterCondition>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get an Encounter Condition by it's name
   * @param name The Encounter Condition name
   * @returns An Encounter Condition
   */
  public async getEncounterConditionByName(name: string): Promise<EncounterCondition> {
    return new Promise<EncounterCondition>((resolve, reject) => {
      this.api
        .get<EncounterCondition>(`${ENDPOINTS.ENCOUNTER_CONDITION}/${name}`)
        .then((response: AxiosResponse<EncounterCondition>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get an Encounter Condition Value by it's name
   * @param name The Encounter Condition Value name
   * @returns An Encounter Condition Value
   */
  public async getEncounterConditionValueByName(name: string): Promise<EncounterConditionValue> {
    return new Promise<EncounterConditionValue>((resolve, reject) => {
      this.api
        .get<EncounterConditionValue>(`${ENDPOINTS.ENCOUNTER_CONDITION_VALUE}/${name}`)
        .then((response: AxiosResponse<EncounterConditionValue>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get an Encounter Condition Value by it's ID
   * @param id The Encounter Condition Value ID
   * @returns An Encounter Condition Value
   */
  public async getEncounterConditionValueById(id: number): Promise<EncounterConditionValue> {
    return new Promise<EncounterConditionValue>((resolve, reject) => {
      this.api
        .get<EncounterConditionValue>(`${ENDPOINTS.ENCOUNTER_CONDITION_VALUE}/${id}`)
        .then((response: AxiosResponse<EncounterConditionValue>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Encounter Methods
   * @param offset The first item that you will get
   * @param limit How many Encounter Methods per page
   * @returns A list of Encounter Methods
   */
  public async listEncounterMethods(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = getListURL(ENDPOINTS.ENCOUNTER_METHOD, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Encounter Conditions
   * @param offset The first item that you will get
   * @param limit How many Encounter Conditions per page
   * @returns A list of Encounter Methods
   */
  public async listEncounterConditions(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = getListURL(ENDPOINTS.ENCOUNTER_CONDITION, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Encounter Condition Values
   * @param offset The first item that you will get
   * @param limit How many Encounter Condition Values per page
   * @returns A list of Encounter Condition Values
   */
  public async listEncounterConditionValues(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = getListURL(ENDPOINTS.ENCOUNTER_CONDITION_VALUE, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }
}
