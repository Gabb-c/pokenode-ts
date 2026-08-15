import type { Name, NamedAPIResource } from "../Common";

/**
 * ## Pal Park Area
 * Areas used for grouping Pokémon encounters in Pal Park.
 * They're like habitats that are specific to Pal Park.
 * Pal Park is divided into five separate areas:
 * ---
 * - [Field](https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_Pal_Park_location#Field)
 * - [Forest](https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_Pal_Park_location#Forest)
 * - [Mountain](https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_Pal_Park_location#Mountain)
 * - [Pond](https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_Pal_Park_location#Pound)
 * - [Sea](https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_Pal_Park_location#Sea)
 * - [Trivia](https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_Pal_Park_location#Trivia)
 * ---
 * See [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Pal_Park) for greater detail.
 */
export interface PalParkArea {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: string;
  /** The name of this resource listed in different languages. */
  names: Name[];
  /** A list of Pokémon encountered in this pal park area along with details. */
  pokemon_encounters: PalParkEncounterSpecies[];
}

/**
 * Details of a Pokémon encountered in this Pal Park area.
 */
export interface PalParkEncounterSpecies {
  /** The base score given to the player when this Pokémon is caught during a pal park run. */
  base_score: number;
  /** The base rate for encountering this Pokémon in this pal park area. */
  rate: number;
  /** The Pokémon species being encountered. */
  pokemon_species: NamedAPIResource;
}
