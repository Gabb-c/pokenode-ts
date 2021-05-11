/* eslint-disable camelcase */

import { Name, NamedAPIResource } from '../Common';

export interface PokeathlonStat {
  id: number;
  name: string;
  names: Name[];
  affecting_natures: NaturePokeathlonStatAffectSets;
}

export interface NaturePokeathlonStatAffect {
  max_change: number;
  nature: NamedAPIResource;
}

export interface NaturePokeathlonStatAffectSets {
  increase: NaturePokeathlonStatAffect[];
  decrease: NaturePokeathlonStatAffect[];
}
