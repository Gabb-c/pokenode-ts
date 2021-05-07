/* eslint-disable camelcase */

import {
  APIResource,
  Description,
  Effect,
  GenerationGameIndex,
  MachineVersionDetail,
  Name,
  NamedAPIResource,
  VerboseEffect,
  VersionGroupFlavorText,
} from '../Common';

export interface ItemSprites {
  default: string;
}

export interface ItemHolderPokemon {
  pokemon: NamedAPIResource;
  version_details: ItemHolderPokemonVersionDetail[];
}

export interface ItemHolderPokemonVersionDetail {
  rarity: number;
  version: NamedAPIResource;
}

export interface ItemAttribute {
  id: number;
  name: string;
  items: NamedAPIResource;
  names: Name[];
  descriptions: Description[];
}

export interface ItemCategory {
  id: number;
  name: string;
  items: NamedAPIResource[];
  names: Name[];
  pocket: NamedAPIResource;
}

export interface ItemFlingEffect {
  id: number;
  name: string;
  effect_entries: Effect[];
  items: NamedAPIResource[];
}

export interface ItemPocket {
  id: number;
  name: string;
  categories: NamedAPIResource[];
  names: Name[];
}

export interface Item {
  id: number;
  name: string;
  cost: number;
  fling_power: number;
  fling_effect: NamedAPIResource;
  attributes: NamedAPIResource[];
  category: NamedAPIResource;
  effect_entries: VerboseEffect[];
  flavor_text_entries: VersionGroupFlavorText[];
  game_index: GenerationGameIndex[];
  names: Name[];
  sprites: ItemSprites;
  held_by_pokemon: ItemHolderPokemon[];
  baby_trigger_for: APIResource;
  machines: MachineVersionDetail[];
}
