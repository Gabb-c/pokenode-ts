/* eslint-disable camelcase */

import { Effect, NamedAPIResource } from '../Common';

export interface AbilityEffectChange {
  effect_entries: Effect;
  version_group: NamedAPIResource;
}
export interface AbilityFlavorText {
  flavor_text: string;
  language: NamedAPIResource;
  version_group: NamedAPIResource;
}

export interface AbilityPokemon {
  is_hidden: boolean;
  slot: number;
  pokemon: NamedAPIResource;
}
