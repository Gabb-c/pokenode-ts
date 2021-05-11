/* eslint-disable camelcase */

import { APIResource, Name, NamedAPIResource } from '../Common';

export interface Stat {
  id: number;
  name: string;
  game_index: number;
  is_battle_only: boolean;
  affecting_moves: MoveStatAffectSets;
  affecting_natures: NatureStatAffectSets;
  characteristics: APIResource[];
  move_damage_class: NamedAPIResource[];
  names: Name[];
}

export interface NatureStatAffectSets {
  increase: NamedAPIResource[];
  decrease: NamedAPIResource[];
}
/**
 * @interface MoveStatAffect
 */
export interface MoveStatAffect {
  /** The maximum amount of change to the referenced stat */
  change: number;
  /** The move causing the change */
  move: NamedAPIResource;
}

export interface MoveStatAffectSets {
  increase: MoveStatAffect[];
  decrease: MoveStatAffect[];
}
