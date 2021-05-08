/* eslint-disable camelcase */

import { GenerationGameIndex, Name, NamedAPIResource } from '../Common';
import { EncounterMethodRate } from './encounter';

export interface Location {
  id: number;
  name: string;
  region: NamedAPIResource;
  names: Name[];
  game_indices: GenerationGameIndex[];
  areas: NamedAPIResource[];
}

export interface LocationArea {
  id: number;
  name: string;
  game_index: number;
  encounter_method_rates: EncounterMethodRate;
}
