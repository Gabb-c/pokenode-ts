/* eslint-disable camelcase */

import { Name, NamedAPIResource } from '../Common';

/**
 * Areas used for grouping Pokémon encounters in Pal Park.
 * They're like habitats that are specific to Pal Park.
 * See [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Pal_Park) for greater details
 */
export interface PalParkArea {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** The name of this resource listed in different languages */
  names: Name[];
  /** A list of Pokémon encountered in thi pal park area along with details */
  pokemon_encounters: PalParkEncounterSpecies[];
}

/**
 * Detais of a Pokémon encountered in thi Pal Park area
 */
export interface PalParkEncounterSpecies {
  /** The base score given to the player when this Pokémon is caught during a pal park run */
  base_score: number;
  /** The base rate for encountering this Pokémon in this pal park area */
  rate: number;
  /** The Pokémon species being encountered */
  pokemon_species: NamedAPIResource;
}
