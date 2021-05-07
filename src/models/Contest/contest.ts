/* eslint-disable camelcase */

import { Effect, FlavorText, NamedAPIResource } from '../Common';

export interface ContestType {
  id: number;
  name: string;
  berry_flavor: NamedAPIResource;
  names: ContestName[];
}

export interface ContestName {
  name: string;
  color: string;
  language: NamedAPIResource;
}

export interface ContestEffect {
  id: number;
  appeal: number;
  jam: number;
  effect_entries: Effect[];
  flavor_text_entries: FlavorText[];
}

export interface SuperContestEffect {
  id: number;
  appeal: number;
  flavor_text_entries: FlavorText[];
  moves: NamedAPIResource[];
}
