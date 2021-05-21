import {
  APIResource,
  Description,
  MachineVersionDetail,
  Name,
  NamedAPIResource,
  VerboseEffect,
} from '../Common';
import { AbilityEffectChange } from '../Pokemon';

export interface MoveTarget {
  id: number;
  name: string;
  descriptions: Description[];
  moves: NamedAPIResource[];
  names: Name[];
}

export interface MoveLearnMethod {
  id: number;
  name: string;
  descriptions: Description[];
  names: Name[];
  version_groups: NamedAPIResource[];
}

export interface MoveDamageClass {
  id: number;
  name: string;
  descriptions: Description[];
  moves: NamedAPIResource[];
  names: Name[];
}

export interface MoveCategory {
  id: number;
  name: string;
  moves: NamedAPIResource[];
  descriptions: Description[];
}

export interface MoveBattleStyle {
  id: number;
  name: string;
  names: Name[];
}

export interface MoveAilment {
  id: number;
  name: string;
  moves: NamedAPIResource[];
  names: Name[];
}

export interface PastMoveStatValues {
  accuracy: number;
  effect_chance: number;
  power: number;
  pp: number;
  effect_entries: VerboseEffect[];
  type: NamedAPIResource[];
  version_group: NamedAPIResource[];
}

export interface MoveStatChange {
  change: number;
  stat: NamedAPIResource;
}

export interface MoveMetaData {
  ailment: NamedAPIResource;
  category: NamedAPIResource;
  min_hints: number;
  max_hints: number;
  min_turns: number;
  max_turns: number;
  drain: number;
  healing: number;
  crit_rate: number;
  ailment_chance: number;
  flinch_chance: number;
  stat_chance: number;
}

export interface MoveFlavorText {
  flavor_text: string;
  language: NamedAPIResource;
  version_group: NamedAPIResource;
}

export interface ContestComboDetail {
  use_before: NamedAPIResource[];
  use_after: NamedAPIResource[];
}

export interface ContestComboSets {
  normal: ContestComboDetail;
  super: ContestComboDetail;
}

/**
 * Moves are the skills of Pokémon in battle. In battle, a Pokémon uses one move each turn.
 * Some moves (including those learned by Hidden Machine) can be used outside of battle as well,
 * usually for the purpose of removing obstacles or exploring new areas.
 * See [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Move) for greater detaill
 */
export interface Move {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** The percent value of how likely this move is to be successful */
  accuracy: number;
  /** The percent value of how likely it is this moves effect will happen */
  effect_chance: number;
  /** Power points. The number of times this move can be used */
  pp: number;
  /**
   * A value between -8 and 8. Sets the order in which moves are executed during battle.
   * See [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Priority) for greater detail
   */
  priority: number;
  /** The base power of this move with a value of 0 if it does not have a base power */
  power: number;
  /** A detail of normal and super contest combos that require this move */
  contest_combos: ContestComboSets;
  /** The type of appeal this move gives a Pokémon when used in a contest */
  contest_types: NamedAPIResource;
  /** The effect the move has when used in a contest */
  contest_effect: APIResource;
  /** The type of damage the move inflicts on the target, e.g. physical */
  damage_class: NamedAPIResource;
  /** The effect of this move listed in different languages */
  effect_entries: VerboseEffect[];
  /** The list of previous effects this move has had across version groups of the games */
  effect_changes: AbilityEffectChange[];
  /** The flavor text of this move listed in different languages */
  flavor_text_entries: MoveFlavorText[];
  /** The generation in which this move was introduced */
  generaton: NamedAPIResource;
  /** A list of the machines that teach this move */
  machines: MachineVersionDetail[];
  /** Metadata about this move */
  meta: MoveMetaData;
  /** The name of this resource listed in different languages */
  names: Name[];
  /** A list of move resource value changes across version groups of the game */
  past_values: PastMoveStatValues[];
  /** A list of stats this moves effects and how much it effects them */
  stat_changes: MoveStatChange[];
  /** The effect the move has when used in a super contest */
  super_contest_effect: APIResource;
  /** The type of target that will receive the effects of the attack */
  target: NamedAPIResource;
  /** The elemental type of this move */
  type: NamedAPIResource;
}
