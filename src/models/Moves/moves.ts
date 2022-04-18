import {
  APIResource,
  Description,
  MachineVersionDetail,
  Name,
  NamedAPIResource,
  VerboseEffect,
} from '../Common';
import { AbilityEffectChange } from '../Pokemon';

/**
 * ## Move Target
 * Targets moves can be directed at during battle. Targets can be Pokémon, environments or even other moves.
 */
export interface MoveTarget {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: string;
  /** The description of this resource listed in different languages. */
  descriptions: Description[];
  /** A list of moves that that are directed at this target. */
  moves: NamedAPIResource[];
  /** The name of this resource listed in different languages. */
  names: Name[];
}

/**
 * ## Move Learn Method
 * Methods by which Pokémon can learn moves.
 */
export interface MoveLearnMethod {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: string;
  /** The description of this resource listed in different languages. */
  descriptions: Description[];
  /** The name of this resource listed in different languages. */
  names: Name[];
  /** A list of version groups where moves can be learned through this method. */
  version_groups: NamedAPIResource[];
}

/**
 * ## Move Damage Class
 * Damage classes moves can have, e.g. physical, special, or non-damaging.
 */
export interface MoveDamageClass {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: string;
  /** The description of this resource listed in different languages. */
  descriptions: Description[];
  /** A list of moves that fall into this damage class. */
  moves: NamedAPIResource[];
  /** The name of this resource listed in different languages. */
  names: Name[];
}

/**
 * ## Move Category
 * Very general categories that loosely group move effects.
 */
export interface MoveCategory {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: string;
  /** A list of moves that fall into this category. */
  moves: NamedAPIResource[];
  /** The description of this resource listed in different languages. */
  descriptions: Description[];
}

/**
 * ## Move Battle Style
 * Styles of moves when used in the Battle Palace.
 * - See [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Battle_Frontier_(Generation_III)) for greater details.
 */
export interface MoveBattleStyle {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: 'attack' | 'defense' | 'support';
  /** The name of this resource listed in different languages. */
  names: Name[];
}

/**
 * ## Move Ailment
 * Move Ailments are status conditions caused by moves used during battle.
 * - See [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Status_condition) for greater details.
 */
export interface MoveAilment {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: string;
  /** A list of moves that cause this ailment. */
  moves: NamedAPIResource[];
  /** The name of this resource listed in different languages. */
  names: Name[];
}

export interface PastMoveStatValues {
  /** The percent value of how likely this move is to be successful. */
  accuracy: number | null;
  /** The percent value of how likely it is this moves effect will take effect. */
  effect_chance: number | null;
  /** The base power of this move with a value of 0 if it does not have a base power. */
  power: number | null;
  /** Power points. The number of times this move can be used. */
  pp: number | null;
  /** The effect of this move listed in different languages. */
  effect_entries: VerboseEffect[];
  /** The elemental type of this move. */
  type: NamedAPIResource | null;
  /** The version group in which these move stat values were in effect. */
  version_group: NamedAPIResource;
}

/** */
export interface MoveStatChange {
  /** The amount of change. */
  change: number;
  /** The stat being affected. */
  stat: NamedAPIResource;
}

/**
 * Metadata about this move
 */
export interface MoveMetaData {
  /** The status ailment this move inflicts on its target. */
  ailment: NamedAPIResource;
  /** The category of move this move falls under, e.g. damage or ailment. */
  category: NamedAPIResource;
  /** The minimum number of times this move hits. Null if it always only hits once. */
  min_hits: number | null;
  /** The maximum number of times this move hits. Null if it always only hits once. */
  max_hits: number | null;
  /** The minimum number of turns this move continues to take effect. Null if it always only lasts one turn. */
  min_turns: number | null;
  /** The maximum number of turns this move continues to take effect. Null if it always only lasts one turn. */
  max_turns: number | null;
  /** HP drain (if positive) or Recoil damage (if negative), in percent of damage done. */
  drain: number;
  /** The amount of hp gained by the attacking Pokemon, in percent of it's maximum HP. */
  healing: number;
  /**  Critical hit rate bonus. */
  crit_rate: number;
  /** The likelihood this attack will cause an ailment. */
  ailment_chance: number;
  /** The likelihood this attack will cause the target Pokémon to flinch. */
  flinch_chance: number;
  /** The likelihood this attack will cause a stat change in the target Pokémon. */
  stat_chance: number;
}

/**
 * The flavor text of this move.
 */
export interface MoveFlavorText {
  /** The localized flavor text for an api resource in a specific language. */
  flavor_text: string;
  /** The language this name is in. */
  language: NamedAPIResource;
  /** The version group that uses this flavor text. */
  version_group: NamedAPIResource;
}

/**
 * A detail of moves this move can be used before or after, granting additional appeal points in super contests.
 */
export interface ContestComboDetail {
  /** A list of moves to use before this move. */
  use_before: NamedAPIResource[] | null;
  /** A list of moves to use after this move. */
  use_after: NamedAPIResource[] | null;
}

/**
 * A detail of normal and super contest combos that require this move.
 */
export interface ContestComboSets {
  /** A detail of moves this move can be used before or after, granting additional appeal points in contests. */
  normal: ContestComboDetail;
  /** A detail of moves this move can be used before or after, granting additional appeal points in super contests. */
  super: ContestComboDetail;
}

/**
 * ## Move
 * Moves are the skills of Pokémon in battle. In battle, a Pokémon uses one move each turn.
 * Some moves (including those learned by Hidden Machine) can be used outside of battle as well,
 * usually for the purpose of removing obstacles or exploring new areas.
 * - See [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Move) for greater detaill
 */
export interface Move {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** The percent value of how likely this move is to be successful */
  accuracy: number | null;
  /** The percent value of how likely it is this moves effect will happen */
  effect_chance: number | null;
  /** Power points. The number of times this move can be used */
  pp: number | null;
  /**
   * A value between -8 and 8. Sets the order in which moves are executed during battle.
   * See [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Priority) for greater detail
   */
  priority: -8 | -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  /** The base power of this move with a value of 0 if it does not have a base power */
  power: number | null;
  /** A detail of normal and super contest combos that require this move */
  contest_combos: ContestComboSets | null;
  /** The type of appeal this move gives a Pokémon when used in a contest */
  contest_types: NamedAPIResource | null;
  /** The effect the move has when used in a contest */
  contest_effect: APIResource | null;
  /** The type of damage the move inflicts on the target, e.g. physical */
  damage_class: NamedAPIResource | null;
  /** The effect of this move listed in different languages */
  effect_entries: VerboseEffect[];
  /** The list of previous effects this move has had across version groups of the games */
  effect_changes: AbilityEffectChange[];
  /** The flavor text of this move listed in different languages */
  flavor_text_entries: MoveFlavorText[];
  /** The generation in which this move was introduced */
  generation: NamedAPIResource;
  /** A list of the machines that teach this move */
  machines: MachineVersionDetail[];
  /** Metadata about this move */
  meta: MoveMetaData | null;
  /** The name of this resource listed in different languages */
  names: Name[];
  /** A list of move resource value changes across version groups of the game */
  past_values: PastMoveStatValues[];
  /** A list of stats this moves effects and how much it effects them */
  stat_changes: MoveStatChange[];
  /** The effect the move has when used in a super contest */
  super_contest_effect: APIResource | null;
  /** The type of target that will receive the effects of the attack */
  target: NamedAPIResource;
  /** The elemental type of this move */
  type: NamedAPIResource;
  /** A list of Pokémons that learned this move */
  learned_by_pokemon: NamedAPIResource[];
}
