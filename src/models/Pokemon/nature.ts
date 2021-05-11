/* eslint-disable camelcase */

import { Name, NamedAPIResource } from '../Common';

export interface Nature {
  id: number;
  name: string;
  decreased_stat: NamedAPIResource;
  increased_stat: NamedAPIResource;
  hates_flavor: NamedAPIResource;
  likes_flavor: NamedAPIResource;
  pokeathlon_stat_changes: NatureStatChange[];
  move_battle_style_preferences: MoveBattleStylePreference[];
  names: Name[];
}

export interface NatureStatChange {
  max_change: number;
  pokeathlon_stat: NamedAPIResource;
}

export interface MoveBattleStylePreference {
  low_hp_preference: number;
  high_hp_preference: number;
  move_battle_style: NamedAPIResource;
}
