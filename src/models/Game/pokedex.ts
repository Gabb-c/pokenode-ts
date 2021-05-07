/* eslint-disable camelcase */

import { Description, Name, NamedAPIResource } from '../Common';
import { PokemonEntry } from './pokemon-entry';

export interface Pokedex {
  id: number;
  name: string;
  is_main_series: boolean;
  descriptions: Description[];
  names: Name[];
  pokemon_entries: PokemonEntry[];
  region: NamedAPIResource;
  version_groups: NamedAPIResource[];
}
