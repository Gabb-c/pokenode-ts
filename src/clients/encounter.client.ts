import { ENDPOINTS } from "@constants";
import type {
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
   * Get an Encounter Method by its name.
   * @param name The Encounter Method name.
   * @returns The matching Encounter Method.
   */
  public async getEncounterMethodByName(name: string): Promise<EncounterMethod> {
    return this.getResource<EncounterMethod>(ENDPOINTS.ENCOUNTER_METHOD, name);
  }

  /**
   * Get an Encounter Method by its ID.
   * @param id The Encounter Method ID.
   * @returns The matching Encounter Method.
   */
  public async getEncounterMethodById(id: number): Promise<EncounterMethod> {
    return this.getResource<EncounterMethod>(ENDPOINTS.ENCOUNTER_METHOD, id);
  }

  /**
   * Get an Encounter Condition by its ID.
   * @param id The Encounter Condition ID.
   * @returns The matching Encounter Condition.
   */
  public async getEncounterConditionById(id: number): Promise<EncounterCondition> {
    return this.getResource<EncounterCondition>(ENDPOINTS.ENCOUNTER_CONDITION, id);
  }

  /**
   * Get an Encounter Condition by its name.
   * @param name The Encounter Condition name.
   * @returns The matching Encounter Condition.
   */
  public async getEncounterConditionByName(name: string): Promise<EncounterCondition> {
    return this.getResource<EncounterCondition>(ENDPOINTS.ENCOUNTER_CONDITION, name);
  }

  /**
   * Get an Encounter Condition Value by its name.
   * @param name The Encounter Condition Value name.
   * @returns The matching Encounter Condition Value.
   */
  public async getEncounterConditionValueByName(name: string): Promise<EncounterConditionValue> {
    return this.getResource<EncounterConditionValue>(ENDPOINTS.ENCOUNTER_CONDITION_VALUE, name);
  }

  /**
   * Get an Encounter Condition Value by its ID.
   * @param id The Encounter Condition Value ID.
   * @returns The matching Encounter Condition Value.
   */
  public async getEncounterConditionValueById(id: number): Promise<EncounterConditionValue> {
    return this.getResource<EncounterConditionValue>(ENDPOINTS.ENCOUNTER_CONDITION_VALUE, id);
  }

  /**
   * List Encounter Methods.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Encounter Methods.
   */
  public async listEncounterMethods(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<EncounterMethod>> {
    return this.getListResource<EncounterMethod>(ENDPOINTS.ENCOUNTER_METHOD, offset, limit);
  }

  /**
   * List Encounter Conditions.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Encounter Conditions.
   */
  public async listEncounterConditions(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<EncounterCondition>> {
    return this.getListResource<EncounterCondition>(ENDPOINTS.ENCOUNTER_CONDITION, offset, limit);
  }

  /**
   * List Encounter Condition Values.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Encounter Condition Values.
   */
  public async listEncounterConditionValues(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<EncounterConditionValue>> {
    return this.getListResource<EncounterConditionValue>(
      ENDPOINTS.ENCOUNTER_CONDITION_VALUE,
      offset,
      limit,
    );
  }
}
