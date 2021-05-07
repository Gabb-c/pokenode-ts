/* eslint-disable camelcase */

import { NamedAPIResource } from '../Common';

export interface PokemonEntry {
  entry_number: number;
  pokemon_species: NamedAPIResource[];
}
