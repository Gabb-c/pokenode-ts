import { AxiosError, AxiosResponse } from 'axios';
import { DestinationObjectOptions, LoggerOptions } from 'pino';
import { IAxiosCacheAdapterOptions } from 'axios-cache-adapter';
import {
  Move,
  MoveAilment,
  MoveBattleStyle,
  MoveCategory,
  MoveDamageClass,
  MoveLearnMethod,
  MoveTarget,
  NamedAPIResourceList,
} from '../models';
import { Endpoints } from '../constants';
import { BaseClient } from '../structures/base';

/**
 * ### Move Client
 *
 * Client used to access the Move Endpoints:
 *  - Moves
 *  - Move Ailments
 *  - Move Battle Styles
 *  - Move Categories
 *  - Move Damage Classes
 *  - Move Learn Methods
 *  - Move Move Targets
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#moves-section)
 */
export class MoveClient extends BaseClient {
  /**
   * @param logOptions Options for the logger.
   * @param logDestination Options for the logs destination.
   * @param cacheOptions Options for the axios-cache.
   */
  constructor(
    logOptions?: LoggerOptions,
    logDestination?: DestinationObjectOptions,
    cacheOptions?: IAxiosCacheAdapterOptions
  ) {
    super(logOptions, logDestination, cacheOptions);
  }

  /**
   * Get a Move by it's name
   * @param name The move name
   * @returns A Move
   */
  public getMoveByName(name: string): Promise<Move> {
    return new Promise<Move>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Move}/${name}`)
        .then((response: AxiosResponse<Move>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move by it's ID
   * @param id The Move ID
   * @returns A Move
   */
  public getMoveById(id: number): Promise<Move> {
    return new Promise<Move>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Move}/${id}`)
        .then((response: AxiosResponse<Move>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move Ailment by it's name
   * @param name The Move Ailment name
   * @returns A Move Ailment
   */
  public getMoveAilmentByName(name: string): Promise<MoveAilment> {
    return new Promise<MoveAilment>((resolve, reject) => {
      this.api
        .get(`${Endpoints.MoveAilment}/${name}`)
        .then((response: AxiosResponse<MoveAilment>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move Ailment by it's ID
   * @param id The Move Ailment ID
   * @returns A Move Ailment
   */
  public getMoveAilmentById(id: number): Promise<MoveAilment> {
    return new Promise<MoveAilment>((resolve, reject) => {
      this.api
        .get(`${Endpoints.MoveAilment}/${id}`)
        .then((response: AxiosResponse<MoveAilment>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move Battle Style by it's name
   * @param name The Move Battle Style name
   * @returns A Move Battle Style
   */
  public getMoveBattleStyleByName(name: string): Promise<MoveBattleStyle> {
    return new Promise<MoveBattleStyle>((resolve, reject) => {
      this.api
        .get(`${Endpoints.MoveBattleStyle}/${name}`)
        .then((response: AxiosResponse<MoveBattleStyle>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move Battle Style by it's ID
   * @param id The Move Battle Style ID
   * @returns A Move Battle Style
   */
  public getMoveBattleStyleById(id: number): Promise<MoveBattleStyle> {
    return new Promise<MoveBattleStyle>((resolve, reject) => {
      this.api
        .get(`${Endpoints.MoveBattleStyle}/${id}`)
        .then((response: AxiosResponse<MoveBattleStyle>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move Battle Category by it's name
   * @param name The Move Category name
   * @returns A Move Category
   */
  public getMoveCategoryByName(name: string): Promise<MoveCategory> {
    return new Promise<MoveCategory>((resolve, reject) => {
      this.api
        .get(`${Endpoints.MoveCategory}/${name}`)
        .then((response: AxiosResponse<MoveCategory>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move Battle Category by it's ID
   * @param id The Move Category ID
   * @returns A Move Category
   */
  public getMoveCategoryById(id: number): Promise<MoveCategory> {
    return new Promise<MoveCategory>((resolve, reject) => {
      this.api
        .get(`${Endpoints.MoveCategory}/${id}`)
        .then((response: AxiosResponse<MoveCategory>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move Damage Class by it's name
   * @param name The Move Damage Class name
   * @returns A Move Damage Class
   */
  public getMoveDamageClassByName(name: string): Promise<MoveDamageClass> {
    return new Promise<MoveDamageClass>((resolve, reject) => {
      this.api
        .get(`${Endpoints.MoveDamageClass}/${name}`)
        .then((response: AxiosResponse<MoveDamageClass>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move Damage Class by it's ID
   * @param id The Move Damage Class ID
   * @returns A Move Damage Class
   */
  public getMoveDamageClassById(id: number): Promise<MoveDamageClass> {
    return new Promise<MoveDamageClass>((resolve, reject) => {
      this.api
        .get(`${Endpoints.MoveDamageClass}/${id}`)
        .then((response: AxiosResponse<MoveDamageClass>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move Learn Method by it's name
   * @param name The Move Learn Method name
   * @returns A Move Learn Method
   */
  public getMoveLearnMethodByName(name: string): Promise<MoveLearnMethod> {
    return new Promise<MoveLearnMethod>((resolve, reject) => {
      this.api
        .get(`${Endpoints.MoveLearnMethod}/${name}`)
        .then((response: AxiosResponse<MoveLearnMethod>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move Learn Method by it's ID
   * @param id The Move Learn Method ID
   * @returns A Move Learn Method
   */
  public getMoveLearnMethodById(id: number): Promise<MoveLearnMethod> {
    return new Promise<MoveLearnMethod>((resolve, reject) => {
      this.api
        .get(`${Endpoints.MoveLearnMethod}/${id}`)
        .then((response: AxiosResponse<MoveLearnMethod>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move Target by it's name
   * @param name The Move Target name
   * @returns A Move Target
   */
  public getMoveTargetByName(name: string): Promise<MoveTarget> {
    return new Promise<MoveTarget>((resolve, reject) => {
      this.api
        .get(`${Endpoints.MoveTarget}/${name}`)
        .then((response: AxiosResponse<MoveTarget>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Move Target by it's ID
   * @param id The Move Target ID
   * @returns A Move Target
   */
  public getMoveTargetById(id: number): Promise<MoveTarget> {
    return new Promise<MoveTarget>((resolve, reject) => {
      this.api
        .get(`${Endpoints.MoveTarget}/${id}`)
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
  public listMoves(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Move}?offset=${offset || 0}&limit=${limit || 20}`)
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
  public listMoveAilments(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.MoveAilment}?offset=${offset || 0}&limit=${limit || 20}`)
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
  public listMoveBattleStyles(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.MoveBattleStyle}?offset=${offset || 0}&limit=${limit || 20}`)
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
  public listMoveCategories(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.MoveCategory}?offset=${offset || 0}&limit=${limit || 20}`)
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
  public listMoveDamageClasses(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.MoveDamageClass}?offset=${offset || 0}&limit=${limit || 20}`)
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
  public listMoveLearnMethods(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.MoveLearnMethod}?offset=${offset || 0}&limit=${limit || 20}`)
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
  public listMoveTargets(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.MoveTarget}?offset=${offset || 0}&limit=${limit || 20}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }
}
