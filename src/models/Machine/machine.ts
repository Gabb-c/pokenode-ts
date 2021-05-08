/* eslint-disable camelcase */

import { NamedAPIResource } from '../Common';

export interface Machine {
  id: number;
  item: NamedAPIResource;
  move: NamedAPIResource;
  version_group: NamedAPIResource;
}
