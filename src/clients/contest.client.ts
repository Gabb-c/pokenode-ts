import { ENDPOINTS } from "@constants";
import type { ContestEffect, ContestType, NamedAPIResourceList, SuperContestEffect } from "@models";
import { BaseClient } from "./base";

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
   * Get a Contest Type by its name.
   * @param name The Contest Type name.
   * @returns The matching Contest Type.
   */
  public async getContestTypeByName(name: string): Promise<ContestType> {
    return this.getResource(ENDPOINTS.CONTEST_TYPE, name);
  }

  /**
   * Get a Contest Type by its ID.
   * @param id The Contest Type ID.
   * @returns The matching Contest Type.
   */
  public async getContestTypeById(id: number): Promise<ContestType> {
    return this.getResource(ENDPOINTS.CONTEST_TYPE, id);
  }

  /**
   * Get a Contest Effect by its ID.
   * @param id The Contest Effect ID.
   * @returns The matching Contest Effect.
   */
  public async getContestEffectById(id: number): Promise<ContestEffect> {
    return this.getResource(ENDPOINTS.CONTEST_EFFECT, id);
  }

  /**
   * Get a Super Contest Effect by its ID.
   * @param id The Super Contest Effect ID.
   * @returns The matching Super Contest Effect.
   */
  public async getSuperContestEffectById(id: number): Promise<SuperContestEffect> {
    return this.getResource(ENDPOINTS.SUPER_CONTEST_EFFECT, id);
  }

  /**
   * List Contest Types.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Contest Types.
   */
  public async listContestTypes(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<ContestType>> {
    return this.getListResource<ContestType>(ENDPOINTS.CONTEST_TYPE, offset, limit);
  }

  /**
   * List Contest Effects.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Contest Effects.
   */
  public async listContestEffects(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<ContestEffect>> {
    return this.getListResource<ContestEffect>(ENDPOINTS.CONTEST_EFFECT, offset, limit);
  }

  /**
   * List Super Contest Effects.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Super Contest Effects.
   */
  public async listSuperContestEffects(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<SuperContestEffect>> {
    return this.getListResource<SuperContestEffect>(ENDPOINTS.SUPER_CONTEST_EFFECT, offset, limit);
  }
}
