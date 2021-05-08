/* eslint-disable camelcase */

import { NamedAPIResource } from '../Common';

export interface Gender {
  id: number;
  name: string;
  pokemon_species_details: PokemonSpeciesGender[];
  required_for_evolution: NamedAPIResource[];
}

export interface PokemonSpeciesGender {
  rate: number;
  pokemon_species: NamedAPIResource[];
}
