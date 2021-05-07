/* eslint-disable camelcase */

import { NamedAPIResource } from './resource';

export interface FlavorText {
  flavor_text: string;
  language: NamedAPIResource;
  version: NamedAPIResource;
}
