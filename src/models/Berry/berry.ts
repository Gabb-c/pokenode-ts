/* eslint-disable camelcase */

import { Name, NamedAPIResource } from '../Common';

export interface Berry {
  id: number;
  name: string;
  growth_time: string;
  max_harvest: number;
  natural_gift_power: number;
  size: number;
  smoothness: number;
  soil_dryness: number;
  firmness: NamedAPIResource;
  flavors: BerryFlavorMap[];
  item: NamedAPIResource;
  natural_gift_type: NamedAPIResource;
}

export interface BerryFlavorMap {
  potency: number;
  flavor: NamedAPIResource;
}

export interface BerryFirmness {
  id: number;
  name: string;
  berries: NamedAPIResource[];
  names: Name[];
}
