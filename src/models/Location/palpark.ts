/* eslint-disable camelcase */

import { Name, NamedAPIResource } from '../Common';

export interface PalParkArea {
  id: number;
  name: string;
  names: Name[];
  pokemon_encounters: PalParkEncounterSpecies[];
}

export interface PalParkEncounterSpecies {
  base_score: number;
  rate: number;
  pokemon_species: NamedAPIResource;
}
