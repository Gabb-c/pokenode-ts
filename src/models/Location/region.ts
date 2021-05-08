/* eslint-disable camelcase */

import { Name, NamedAPIResource } from '../Common';

export interface Region {
  id: number;
  locations: NamedAPIResource[];
  name: string;
  names: Name[];
  main_generation: NamedAPIResource[];
  pokedexes: NamedAPIResource[];
  version_groups: NamedAPIResource[];
}
