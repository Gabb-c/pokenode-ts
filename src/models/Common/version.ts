/* eslint-disable camelcase */

import { Encounter } from './encounter';
import { NamedAPIResource } from './resource';

export interface VersionEncounterDetail {
  version: NamedAPIResource;
  max_chance: number;
  encounter_details: Encounter[];
}

export interface VersionGameIndex {
  game_index: number;
  version: NamedAPIResource;
}

export interface VersionGroupFlavorText {
  text: string;
  language: NamedAPIResource;
  version_group: NamedAPIResource;
}
