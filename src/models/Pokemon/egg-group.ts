/* eslint-disable camelcase */

import { Name, NamedAPIResource } from '../Common';

export interface EggGroup {
  id: number;
  name: string;
  names: Name[];
  pokemon_species: NamedAPIResource[];
}
