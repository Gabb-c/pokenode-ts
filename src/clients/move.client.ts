import { ENDPOINTS } from "@constants";
import type {
  Move,
  MoveAilment,
  MoveBattleStyle,
  MoveCategory,
  MoveDamageClass,
  MoveLearnMethod,
  MoveTarget,
  NamedAPIResourceList,
} from "@models";
import { BaseClient } from "./base";

/**
 * ### Move Client
 *
 * Client used to access the Move Endpoints:
 *  - [Moves](https://pokeapi.co/docs/v2#moves)
 *  - [Move Ailments](https://pokeapi.co/docs/v2#move-ailments)
 *  - [Move Battle Styles](https://pokeapi.co/docs/v2#move-battle-styles)
 *  - [Move Categories](https://pokeapi.co/docs/v2#move-categories)
 *  - [Move Damage Classes](https://pokeapi.co/docs/v2#move-damage-classes)
 *  - [Move Learn Methods](https://pokeapi.co/docs/v2#move-learn-methods)
 *  - [Move Targets](https://pokeapi.co/docs/v2#move-targets)
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#moves-section)
 */
export class MoveClient extends BaseClient {
  /** Get a Move by its name. */
  public async getMoveByName(name: string): Promise<Move> {
    return this.getResource(ENDPOINTS.MOVE, name);
  }

  /** Get a Move by its ID. */
  public async getMoveById(id: number): Promise<Move> {
    return this.getResource(ENDPOINTS.MOVE, id);
  }

  /** Get a Move Ailment by its name. */
  public async getMoveAilmentByName(name: string): Promise<MoveAilment> {
    return this.getResource(ENDPOINTS.MOVE_AILMENT, name);
  }

  /** Get a Move Ailment by its ID. */
  public async getMoveAilmentById(id: number): Promise<MoveAilment> {
    return this.getResource(ENDPOINTS.MOVE_AILMENT, id);
  }

  /** Get a Move Battle Style by its name. */
  public async getMoveBattleStyleByName(name: string): Promise<MoveBattleStyle> {
    return this.getResource(ENDPOINTS.MOVE_BATTLE_STYLE, name);
  }

  /** Get a Move Battle Style by its ID. */
  public async getMoveBattleStyleById(id: number): Promise<MoveBattleStyle> {
    return this.getResource(ENDPOINTS.MOVE_BATTLE_STYLE, id);
  }

  /** Get a Move Category by its name. */
  public async getMoveCategoryByName(name: string): Promise<MoveCategory> {
    return this.getResource(ENDPOINTS.MOVE_CATEGORY, name);
  }

  /** Get a Move Category by its ID. */
  public async getMoveCategoryById(id: number): Promise<MoveCategory> {
    return this.getResource(ENDPOINTS.MOVE_CATEGORY, id);
  }

  /** Get a Move Damage Class by its name. */
  public async getMoveDamageClassByName(name: string): Promise<MoveDamageClass> {
    return this.getResource(ENDPOINTS.MOVE_DAMAGE_CLASS, name);
  }

  /** Get a Move Damage Class by its ID. */
  public async getMoveDamageClassById(id: number): Promise<MoveDamageClass> {
    return this.getResource(ENDPOINTS.MOVE_DAMAGE_CLASS, id);
  }

  /** Get a Move Learn Method by its name. */
  public async getMoveLearnMethodByName(name: string): Promise<MoveLearnMethod> {
    return this.getResource(ENDPOINTS.MOVE_LEARN_METHOD, name);
  }

  /** Get a Move Learn Method by its ID. */
  public async getMoveLearnMethodById(id: number): Promise<MoveLearnMethod> {
    return this.getResource(ENDPOINTS.MOVE_LEARN_METHOD, id);
  }

  /** Get a Move Target by its name. */
  public async getMoveTargetByName(name: string): Promise<MoveTarget> {
    return this.getResource(ENDPOINTS.MOVE_TARGET, name);
  }

  /** Get a Move Target by its ID. */
  public async getMoveTargetById(id: number): Promise<MoveTarget> {
    return this.getResource(ENDPOINTS.MOVE_TARGET, id);
  }

  /** List Moves. Page defaults to 20 entries from offset 0. */
  public async listMoves(offset?: number, limit?: number): Promise<NamedAPIResourceList<Move>> {
    return this.getListResource<Move>(ENDPOINTS.MOVE, offset, limit);
  }

  /** List Move Ailments. Page defaults to 20 entries from offset 0. */
  public async listMoveAilments(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<MoveAilment>> {
    return this.getListResource<MoveAilment>(ENDPOINTS.MOVE_AILMENT, offset, limit);
  }

  /** List Move Battle Styles. Page defaults to 20 entries from offset 0. */
  public async listMoveBattleStyles(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<MoveBattleStyle>> {
    return this.getListResource<MoveBattleStyle>(ENDPOINTS.MOVE_BATTLE_STYLE, offset, limit);
  }

  /** List Move Categories. Page defaults to 20 entries from offset 0. */
  public async listMoveCategories(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<MoveCategory>> {
    return this.getListResource<MoveCategory>(ENDPOINTS.MOVE_CATEGORY, offset, limit);
  }

  /** List Move Damage Classes. Page defaults to 20 entries from offset 0. */
  public async listMoveDamageClasses(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<MoveDamageClass>> {
    return this.getListResource<MoveDamageClass>(ENDPOINTS.MOVE_DAMAGE_CLASS, offset, limit);
  }

  /** List Move Learn Methods. Page defaults to 20 entries from offset 0. */
  public async listMoveLearnMethods(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<MoveLearnMethod>> {
    return this.getListResource<MoveLearnMethod>(ENDPOINTS.MOVE_LEARN_METHOD, offset, limit);
  }

  /** List Move Targets. Page defaults to 20 entries from offset 0. */
  public async listMoveTargets(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<MoveTarget>> {
    return this.getListResource<MoveTarget>(ENDPOINTS.MOVE_TARGET, offset, limit);
  }
}
