import type { APIResource, Name, NamedAPIResource } from "../common";
import type { Item } from "../item/item";
import type { Move, MoveDamageClass } from "../move/move";
import type { Characteristic } from "./characteristic";
import type { Nature } from "./nature";

/**
 * ## Stat
 * Stats determine certain aspects of battles. Each Pokémon has a value for each stat
 * which grows as they gain levels and can be altered momentarily by effects in battles.
 */
export interface Stat {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name:
    | "hp"
    | "attack"
    | "defense"
    | "special-attack"
    | "special-defense"
    | "speed"
    | "accuracy"
    | "evasion";
  /** ID the games use for this stat. */
  game_index: number;
  /** Whether this stat only exists within a battle. */
  is_battle_only: boolean;
  /** A detail of moves which affect this stat positively or negatively. */
  affecting_moves: MoveStatAffectSets;
  /** A detail of natures which affect this stat positively or negatively. */
  affecting_natures: NatureStatAffectSets;
  /** A list of items which affect this stat. */
  affecting_items: NamedAPIResource<Item>[];
  /** A list of characteristics that are set on a Pokémon when its highest base stat is this stat. */
  characteristics: APIResource<Characteristic>[];
  /** The class of damage this stat is directly related to. */
  move_damage_class: NamedAPIResource<MoveDamageClass> | null;
  /** The name of this resource listed in different languages. */
  names: Name[];
}

/**
 * A detail of natures which affect the given stat positively or negatively.
 */
export interface NatureStatAffectSets {
  /** A list of natures and how they change the referenced stat. */
  increase: NamedAPIResource<Nature>[];
  /** A list of natures and how they change the referenced stat. */
  decrease: NamedAPIResource<Nature>[];
}
/**
 * A move and how it changes the referenced stat.
 */
export interface MoveStatAffect {
  /** The maximum amount of change to the referenced stat. */
  change: -1 | -2 | 1 | 2;
  /** The move causing the change. */
  move: NamedAPIResource<Move>;
}

/**
 * A detail of moves which affect a stat positively or negatively.
 */
export interface MoveStatAffectSets {
  /** A list of moves and how they change the referenced stat. */
  increase: MoveStatAffect[];
  /** A list of moves and how they change the referenced stat. */
  decrease: MoveStatAffect[];
}
