import { NamedAPIResource, VersionEncounterDetail } from '../Common';

/**
 * Method in which Pokémon may be encountered in the given area
 * and how likely the method will occur depending on the version of the game
 */
export interface EncounterMethodRate {
  /** The method in which Pokémon may be encountered in an area */
  encounter_method: NamedAPIResource;
  /** The chance of the encounter to occur on a version of the game */
  version_details: EncounterVersionDetails[];
}

/**
 * The chance of the encounter to occur on a version of the game
 */
export interface EncounterVersionDetails {
  /** The chance of an encounter to occur */
  rate: number;
  /** The version of the game in which the encounter can occur with the given chance */
  version: NamedAPIResource;
}

/**
 * Describes a pokémon encounter in a given area
 */
export interface PokemonEncounter {
  /** The Pokémon being encountered */
  pokemon: NamedAPIResource;
  /** A list of versions and encounters with Pokémon that might happen in the referenced location area */
  version_details: VersionEncounterDetail[];
}
