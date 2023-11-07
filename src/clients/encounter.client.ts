import { ENDPOINTS } from "@constants";
import {
  EncounterCondition,
  EncounterConditionValue,
  EncounterMethod,
  NamedAPIResourceList,
} from "@models";
import { BaseClient } from "./base";

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
    return this.getResource<EncounterMethod>(ENDPOINTS.ENCOUNTER_METHOD, name);
  }

  /**
   * Get an Encounter Method by it's ID
   * @param id The Encounter Method ID
   * @returns An Encounter Method
   */
  public async getEncounterMethodById(id: number): Promise<EncounterMethod> {
    return this.getResource<EncounterMethod>(ENDPOINTS.ENCOUNTER_METHOD, id);
  }

  /**
   * Get an Encounter Condition by it's ID
   * @param id The Encounter Condition ID
   * @returns An Encounter Condition
   */
  public async getEncounterConditionById(id: number): Promise<EncounterCondition> {
    return this.getResource<EncounterCondition>(ENDPOINTS.ENCOUNTER_CONDITION, id);
  }

  /**
   * Get an Encounter Condition by it's name
   * @param name The Encounter Condition name
   * @returns An Encounter Condition
   */
  public async getEncounterConditionByName(name: string): Promise<EncounterCondition> {
    return this.getResource<EncounterCondition>(ENDPOINTS.ENCOUNTER_CONDITION, name);
  }

  /**
   * Get an Encounter Condition Value by it's name
   * @param name The Encounter Condition Value name
   * @returns An Encounter Condition Value
   */
  public async getEncounterConditionValueByName(name: string): Promise<EncounterConditionValue> {
    return this.getResource<EncounterConditionValue>(ENDPOINTS.ENCOUNTER_CONDITION_VALUE, name);
  }

  /**
   * Get an Encounter Condition Value by it's ID
   * @param id The Encounter Condition Value ID
   * @returns An Encounter Condition Value
   */
  public async getEncounterConditionValueById(id: number): Promise<EncounterConditionValue> {
    return this.getResource<EncounterConditionValue>(ENDPOINTS.ENCOUNTER_CONDITION_VALUE, id);
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
    return this.getListResource(ENDPOINTS.ENCOUNTER_METHOD, offset, limit);
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
    return this.getListResource(ENDPOINTS.ENCOUNTER_CONDITION, offset, limit);
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
    return this.getListResource(ENDPOINTS.ENCOUNTER_CONDITION_VALUE, offset, limit);
  }
}
