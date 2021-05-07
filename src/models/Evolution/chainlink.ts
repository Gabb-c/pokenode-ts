/* eslint-disable camelcase */

import { NamedAPIResource } from '../Common';
import { EvolutionDetail } from './evolution';

export interface ChainLink {
  is_baby: boolean;
  species: NamedAPIResource;
  evolution_detail: EvolutionDetail[];
  envolves_to: ChainLink[];
}
