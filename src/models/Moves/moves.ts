/* eslint-disable camelcase */

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

export interface Move {
  id: number;
  name: string;
  accuracy: number;
  effect_chance: number;
  pp: number;
  priority: number;
  power: number;
  contest_combos: ContestComboSets;
  contest_types: NamedAPIResource;
  contest_effect: APIResource;
  damage_class: NamedAPIResource;
  effect_entries: VerboseEffect[];
  effect_changes: AbilityEffectChange[];
  flavor_text_entries: MoveFlavorText[];
  generaton: NamedAPIResource;
  machines: MachineVersionDetail[];
  meta: MoveMetaData;
  names: Name[];
  past_values: PastMoveStatValues[];
  stat_changes: MoveStatChange[];
  super_contest_effect: APIResource;
  target: NamedAPIResource;
  type: NamedAPIResource;
}
