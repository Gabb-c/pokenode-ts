/* eslint-disable camelcase */

import { NamedAPIResource } from './resource';

export interface VerboseEffect {
  effect: string;
  short_effect: string;
  language: NamedAPIResource;
}
