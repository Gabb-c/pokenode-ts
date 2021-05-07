/* eslint-disable camelcase */

import { Name, NamedAPIResource } from '../Common';

export interface Version {
  id: number;
  name: string;
  names: Name[];
  version_group: NamedAPIResource;
}

export interface VersionGroup {
  id: number;
  name: string;
  order: number;
  generation: NamedAPIResource;
  move_learn_methods: NamedAPIResource[];
  pokedexes: NamedAPIResource[];
  regions: NamedAPIResource[];
  versions: NamedAPIResource[];
}
