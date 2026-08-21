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
 *
 * - [Encounter Methods](https://pokeapi.co/docs/v2#encounter-methods)
 * - [Encounter Conditions](https://pokeapi.co/docs/v2#encounter-conditions)
 * - [Encounter Condition Values](https://pokeapi.co/docs/v2#encounter-condition-values)
 *
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#encounters-section)
 */
export class EncounterClient extends BaseClient {
  /** Get an Encounter Method by its name. */
  public async getEncounterMethodByName(name: string): Promise<EncounterMethod> {
    return this.getResource<EncounterMethod>(ENDPOINTS.ENCOUNTER_METHOD, name);
  }

  /** Get an Encounter Method by its ID. */
  public async getEncounterMethodById(id: number): Promise<EncounterMethod> {
    return this.getResource<EncounterMethod>(ENDPOINTS.ENCOUNTER_METHOD, id);
  }

  /** Get an Encounter Condition by its ID. */
  public async getEncounterConditionById(id: number): Promise<EncounterCondition> {
    return this.getResource<EncounterCondition>(ENDPOINTS.ENCOUNTER_CONDITION, id);
  }

  /** Get an Encounter Condition by its name. */
  public async getEncounterConditionByName(name: string): Promise<EncounterCondition> {
    return this.getResource<EncounterCondition>(ENDPOINTS.ENCOUNTER_CONDITION, name);
  }

  /** Get an Encounter Condition Value by its name. */
  public async getEncounterConditionValueByName(name: string): Promise<EncounterConditionValue> {
    return this.getResource<EncounterConditionValue>(ENDPOINTS.ENCOUNTER_CONDITION_VALUE, name);
  }

  /** Get an Encounter Condition Value by its ID. */
  public async getEncounterConditionValueById(id: number): Promise<EncounterConditionValue> {
    return this.getResource<EncounterConditionValue>(ENDPOINTS.ENCOUNTER_CONDITION_VALUE, id);
  }

  /** List Encounter Methods. Page defaults to 20 entries from offset 0. */
  public async listEncounterMethods(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<EncounterMethod>> {
    return this.getListResource<EncounterMethod>(ENDPOINTS.ENCOUNTER_METHOD, offset, limit);
  }

  /** List Encounter Conditions. Page defaults to 20 entries from offset 0. */
  public async listEncounterConditions(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<EncounterCondition>> {
    return this.getListResource<EncounterCondition>(ENDPOINTS.ENCOUNTER_CONDITION, offset, limit);
  }

  /** List Encounter Condition Values. Page defaults to 20 entries from offset 0. */
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
