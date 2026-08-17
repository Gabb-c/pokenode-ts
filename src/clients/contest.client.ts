import { ENDPOINTS } from "@constants";
import type {
  APIResourceList,
  ContestEffect,
  ContestType,
  NamedAPIResourceList,
  SuperContestEffect,
} from "@models";
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
  /** Get a Contest Type by its name. */
  public async getContestTypeByName(name: string): Promise<ContestType> {
    return this.getResource(ENDPOINTS.CONTEST_TYPE, name);
  }

  /** Get a Contest Type by its ID. */
  public async getContestTypeById(id: number): Promise<ContestType> {
    return this.getResource(ENDPOINTS.CONTEST_TYPE, id);
  }

  /** Get a Contest Effect by its ID. */
  public async getContestEffectById(id: number): Promise<ContestEffect> {
    return this.getResource(ENDPOINTS.CONTEST_EFFECT, id);
  }

  /** Get a Super Contest Effect by its ID. */
  public async getSuperContestEffectById(id: number): Promise<SuperContestEffect> {
    return this.getResource(ENDPOINTS.SUPER_CONTEST_EFFECT, id);
  }

  /** List Contest Types. Page defaults to 20 entries from offset 0. */
  public async listContestTypes(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<ContestType>> {
    return this.getListResource<ContestType>(ENDPOINTS.CONTEST_TYPE, offset, limit);
  }

  /** List Contest Effects. Page defaults to 20 entries from offset 0. */
  public async listContestEffects(
    offset?: number,
    limit?: number,
  ): Promise<APIResourceList<ContestEffect>> {
    return this.getUnnamedListResource<ContestEffect>(ENDPOINTS.CONTEST_EFFECT, offset, limit);
  }

  /** List Super Contest Effects. Page defaults to 20 entries from offset 0. */
  public async listSuperContestEffects(
    offset?: number,
    limit?: number,
  ): Promise<APIResourceList<SuperContestEffect>> {
    return this.getUnnamedListResource<SuperContestEffect>(
      ENDPOINTS.SUPER_CONTEST_EFFECT,
      offset,
      limit,
    );
  }
}
