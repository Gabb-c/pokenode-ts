/* eslint-disable camelcase */

import { Description, NamedAPIResource } from '../Common';

export interface GrowthRateExperienceLevel {
  level: number;
  experience: number;
}

export interface GrowthRate {
  id: number;
  name: string;
  formula: string;
  descriptions: Description[];
  levels: GrowthRateExperienceLevel[];
  pokemon_species: NamedAPIResource[];
}
