import type { Name, NamedAPIResource } from "../common";
import type { PokemonSpecies } from "./pokemon-species";

/**
 * ## Pokémon Colors
 * Colors used for sorting Pokémon in a Pokédex.
 * The color listed in the Pokédex is usually the color most apparent or covering each Pokémon's body.
 * No orange category exists; Pokémon that are primarily orange are listed as red or brown.
 */
export interface PokemonColor {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name:
    | "black"
    | "blue"
    | "brown"
    | "gray"
    | "green"
    | "pink"
    | "purple"
    | "red"
    | "white"
    | "yellow";
  /** The name of this resource listed in different languages. */
  names: Name[];
  /** A list of the Pokémon species that have this color. */
  pokemon_species: NamedAPIResource<PokemonSpecies>[];
}
