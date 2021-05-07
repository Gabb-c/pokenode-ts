/* eslint-disable camelcase */

import { NamedAPIResource } from './resource';

export interface Encounter {
  min_level: number;
  max_level: number;
  condition_values: NamedAPIResource;
  chance: number;
  method: NamedAPIResource;
}
