import { Endpoints } from "../constants";
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
import { BaseClient } from "../structures/base";
import { getListURL } from "../utils/request-params";
import { AxiosError, AxiosResponse } from "axios";

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
    return new Promise<Move>((resolve, reject) => {
      this.api
        .get<Move>(`${Endpoints.MOVE}/${name}`)
        .then((response: AxiosResponse<Move>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move by it's ID
   * @param id The Move ID
   * @returns A Move
   */
  public async getMoveById(id: number): Promise<Move> {
    return new Promise<Move>((resolve, reject) => {
      this.api
        .get<Move>(`${Endpoints.MOVE}/${id}`)
        .then((response: AxiosResponse<Move>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move Ailment by it's name
   * @param name The Move Ailment name
   * @returns A Move Ailment
   */
  public async getMoveAilmentByName(name: string): Promise<MoveAilment> {
    return new Promise<MoveAilment>((resolve, reject) => {
      this.api
        .get<MoveAilment>(`${Endpoints.MOVE_AILMENT}/${name}`)
        .then((response: AxiosResponse<MoveAilment>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move Ailment by it's ID
   * @param id The Move Ailment ID
   * @returns A Move Ailment
   */
  public async getMoveAilmentById(id: number): Promise<MoveAilment> {
    return new Promise<MoveAilment>((resolve, reject) => {
      this.api
        .get<MoveAilment>(`${Endpoints.MOVE_AILMENT}/${id}`)
        .then((response: AxiosResponse<MoveAilment>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move Battle Style by it's name
   * @param name The Move Battle Style name
   * @returns A Move Battle Style
   */
  public async getMoveBattleStyleByName(name: string): Promise<MoveBattleStyle> {
    return new Promise<MoveBattleStyle>((resolve, reject) => {
      this.api
        .get<MoveBattleStyle>(`${Endpoints.MOVE_BATTLE_STYLE}/${name}`)
        .then((response: AxiosResponse<MoveBattleStyle>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move Battle Style by it's ID
   * @param id The Move Battle Style ID
   * @returns A Move Battle Style
   */
  public async getMoveBattleStyleById(id: number): Promise<MoveBattleStyle> {
    return new Promise<MoveBattleStyle>((resolve, reject) => {
      this.api
        .get<MoveBattleStyle>(`${Endpoints.MOVE_BATTLE_STYLE}/${id}`)
        .then((response: AxiosResponse<MoveBattleStyle>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move Battle Category by it's name
   * @param name The Move Category name
   * @returns A Move Category
   */
  public async getMoveCategoryByName(name: string): Promise<MoveCategory> {
    return new Promise<MoveCategory>((resolve, reject) => {
      this.api
        .get<MoveCategory>(`${Endpoints.MOVE_CATEGORY}/${name}`)
        .then((response: AxiosResponse<MoveCategory>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move Battle Category by it's ID
   * @param id The Move Category ID
   * @returns A Move Category
   */
  public async getMoveCategoryById(id: number): Promise<MoveCategory> {
    return new Promise<MoveCategory>((resolve, reject) => {
      this.api
        .get<MoveCategory>(`${Endpoints.MOVE_CATEGORY}/${id}`)
        .then((response: AxiosResponse<MoveCategory>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move Damage Class by it's name
   * @param name The Move Damage Class name
   * @returns A Move Damage Class
   */
  public async getMoveDamageClassByName(name: string): Promise<MoveDamageClass> {
    return new Promise<MoveDamageClass>((resolve, reject) => {
      this.api
        .get<MoveDamageClass>(`${Endpoints.MOVE_DAMAGE_CLASS}/${name}`)
        .then((response: AxiosResponse<MoveDamageClass>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move Damage Class by it's ID
   * @param id The Move Damage Class ID
   * @returns A Move Damage Class
   */
  public async getMoveDamageClassById(id: number): Promise<MoveDamageClass> {
    return new Promise<MoveDamageClass>((resolve, reject) => {
      this.api
        .get<MoveDamageClass>(`${Endpoints.MOVE_DAMAGE_CLASS}/${id}`)
        .then((response: AxiosResponse<MoveDamageClass>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move Learn Method by it's name
   * @param name The Move Learn Method name
   * @returns A Move Learn Method
   */
  public async getMoveLearnMethodByName(name: string): Promise<MoveLearnMethod> {
    return new Promise<MoveLearnMethod>((resolve, reject) => {
      this.api
        .get<MoveLearnMethod>(`${Endpoints.MOVE_LEARN_METHOD}/${name}`)
        .then((response: AxiosResponse<MoveLearnMethod>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move Learn Method by it's ID
   * @param id The Move Learn Method ID
   * @returns A Move Learn Method
   */
  public async getMoveLearnMethodById(id: number): Promise<MoveLearnMethod> {
    return new Promise<MoveLearnMethod>((resolve, reject) => {
      this.api
        .get<MoveLearnMethod>(`${Endpoints.MOVE_LEARN_METHOD}/${id}`)
        .then((response: AxiosResponse<MoveLearnMethod>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move Target by it's name
   * @param name The Move Target name
   * @returns A Move Target
   */
  public async getMoveTargetByName(name: string): Promise<MoveTarget> {
    return new Promise<MoveTarget>((resolve, reject) => {
      this.api
        .get<MoveTarget>(`${Endpoints.MOVE_TARGET}/${name}`)
        .then((response: AxiosResponse<MoveTarget>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move Target by it's ID
   * @param id The Move Target ID
   * @returns A Move Target
   */
  public async getMoveTargetById(id: number): Promise<MoveTarget> {
    return new Promise<MoveTarget>((resolve, reject) => {
      this.api
        .get<MoveTarget>(`${Endpoints.MOVE_TARGET}/${id}`)
        .then((response: AxiosResponse<MoveTarget>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Moves
   * @param offset The first item that you will get
   * @param limit How many Moves per page
   * @returns A list of Moves
   */
  public async listMoves(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = getListURL(Endpoints.MOVE, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Move Ailments
   * @param offset The first item that you will get
   * @param limit How many Move Ailments per page
   * @returns A list of Move Ailments
   */
  public async listMoveAilments(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = getListURL(Endpoints.MOVE_AILMENT, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
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
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = getListURL(Endpoints.MOVE_BATTLE_STYLE, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Move Categories
   * @param offset The first item that you will get
   * @param limit How many Move Categories per page
   * @returns A list of Move Categories
   */
  public async listMoveCategories(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = getListURL(Endpoints.MOVE_CATEGORY, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
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
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = getListURL(Endpoints.MOVE_DAMAGE_CLASS, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
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
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = getListURL(Endpoints.MOVE_LEARN_METHOD, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Move Targets
   * @param offset The first item that you will get
   * @param limit How many Move Targets per page
   * @returns A list of Move Targets
   */
  public async listMoveTargets(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = getListURL(Endpoints.MOVE_TARGET, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }
}
