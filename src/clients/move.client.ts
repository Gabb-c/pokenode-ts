import { ENDPOINTS } from "../constants";
import {
  Move,
  MoveAilment,
  MoveBattleStyle,
  MoveCategory,
  MoveDamageClass,
  MoveLearnMethod,
  MoveTarget,
  NamedAPIResourceList,
} from "../models";
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
 *  - [Move Move Targets](https://pokeapi.co/docs/v2#move-targets)
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#moves-section)
 */
export class MoveClient extends BaseClient {
  /**
   * Get a Move by it's name
   * @param name The move name
   * @returns A Move
   */
  public async getMoveByName(name: string): Promise<Move> {
    return this.getResource(ENDPOINTS.MOVE, name);
  }

  /**
   * Get a Move by it's ID
   * @param id The Move ID
   * @returns A Move
   */
  public async getMoveById(id: number): Promise<Move> {
    return this.getResource(ENDPOINTS.MOVE, id);
  }

  /**
   * Get a Move Ailment by it's name
   * @param name The Move Ailment name
   * @returns A Move Ailment
   */
  public async getMoveAilmentByName(name: string): Promise<MoveAilment> {
    return this.getResource(ENDPOINTS.MOVE_AILMENT, name);
  }

  /**
   * Get a Move Ailment by it's ID
   * @param id The Move Ailment ID
   * @returns A Move Ailment
   */
  public async getMoveAilmentById(id: number): Promise<MoveAilment> {
    return this.getResource(ENDPOINTS.MOVE_AILMENT, id);
  }

  /**
   * Get a Move Battle Style by it's name
   * @param name The Move Battle Style name
   * @returns A Move Battle Style
   */
  public async getMoveBattleStyleByName(name: string): Promise<MoveBattleStyle> {
    return this.getResource(ENDPOINTS.MOVE_BATTLE_STYLE, name);
  }

  /**
   * Get a Move Battle Style by it's ID
   * @param id The Move Battle Style ID
   * @returns A Move Battle Style
   */
  public async getMoveBattleStyleById(id: number): Promise<MoveBattleStyle> {
    return this.getResource(ENDPOINTS.MOVE_BATTLE_STYLE, id);
  }

  /**
   * Get a Move Battle Category by it's name
   * @param name The Move Category name
   * @returns A Move Category
   */
  public async getMoveCategoryByName(name: string): Promise<MoveCategory> {
    return this.getResource(ENDPOINTS.MOVE_CATEGORY, name);
  }

  /**
   * Get a Move Battle Category by it's ID
   * @param id The Move Category ID
   * @returns A Move Category
   */
  public async getMoveCategoryById(id: number): Promise<MoveCategory> {
    return this.getResource(ENDPOINTS.MOVE_CATEGORY, id);
  }

  /**
   * Get a Move Damage Class by it's name
   * @param name The Move Damage Class name
   * @returns A Move Damage Class
   */
  public async getMoveDamageClassByName(name: string): Promise<MoveDamageClass> {
    return this.getResource(ENDPOINTS.MOVE_DAMAGE_CLASS, name);
  }

  /**
   * Get a Move Damage Class by it's ID
   * @param id The Move Damage Class ID
   * @returns A Move Damage Class
   */
  public async getMoveDamageClassById(id: number): Promise<MoveDamageClass> {
    return this.getResource(ENDPOINTS.MOVE_DAMAGE_CLASS, id);
  }

  /**
   * Get a Move Learn Method by it's name
   * @param name The Move Learn Method name
   * @returns A Move Learn Method
   */
  public async getMoveLearnMethodByName(name: string): Promise<MoveLearnMethod> {
    return this.getResource(ENDPOINTS.MOVE_LEARN_METHOD, name);
  }

  /**
   * Get a Move Learn Method by it's ID
   * @param id The Move Learn Method ID
   * @returns A Move Learn Method
   */
  public async getMoveLearnMethodById(id: number): Promise<MoveLearnMethod> {
    return this.getResource(ENDPOINTS.MOVE_LEARN_METHOD, id);
  }

  /**
   * Get a Move Target by it's name
   * @param name The Move Target name
   * @returns A Move Target
   */
  public async getMoveTargetByName(name: string): Promise<MoveTarget> {
    return this.getResource(ENDPOINTS.MOVE_TARGET, name);
  }

  /**
   * Get a Move Target by it's ID
   * @param id The Move Target ID
   * @returns A Move Target
   */
  public async getMoveTargetById(id: number): Promise<MoveTarget> {
    return this.getResource(ENDPOINTS.MOVE_TARGET, id);
  }

  /**
   * List Moves
   * @param offset The first item that you will get
   * @param limit How many Moves per page
   * @returns A list of Moves
   */
  public async listMoves(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.MOVE, offset, limit);
  }

  /**
   * List Move Ailments
   * @param offset The first item that you will get
   * @param limit How many Move Ailments per page
   * @returns A list of Move Ailments
   */
  public async listMoveAilments(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.MOVE_AILMENT, offset, limit);
  }

  /**
   * List Move Battle Styles
   * @param offset The first item that you will get
   * @param limit How many Move Battle Styles per page
   * @returns A list of Move Battle Styles
   */
  public async listMoveBattleStyles(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.MOVE_BATTLE_STYLE, offset, limit);
  }

  /**
   * List Move Categories
   * @param offset The first item that you will get
   * @param limit How many Move Categories per page
   * @returns A list of Move Categories
   */
  public async listMoveCategories(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.MOVE_CATEGORY, offset, limit);
  }

  /**
   * List Move Damage Classes
   * @param offset The first item that you will get
   * @param limit How many Move Damage Classes per page
   * @returns A list of Move Damage Classes
   */
  public async listMoveDamageClasses(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.MOVE_DAMAGE_CLASS, offset, limit);
  }

  /**
   * List Move Learn Methods
   * @param offset The first item that you will get
   * @param limit How many Move Learn Methods per page
   * @returns A list of Move Learn Methods
   */
  public async listMoveLearnMethods(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.MOVE_LEARN_METHOD, offset, limit);
  }

  /**
   * List Move Targets
   * @param offset The first item that you will get
   * @param limit How many Move Targets per page
   * @returns A list of Move Targets
   */
  public async listMoveTargets(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.MOVE_TARGET, offset, limit);
  }
}
