/* eslint-disable camelcase */

import { NamedAPIResource, VersionEncounterDetail } from '../Common';

export interface EncounterMethodRate {
  encounter_method: NamedAPIResource;
  version_details: EncounterVersionDetails;
}

export interface EncounterVersionDetails {
  rate: number;
  version: NamedAPIResource;
}

export interface PokemonEncounter {
  pokemon: NamedAPIResource;
  version_details: VersionEncounterDetail[];
}
