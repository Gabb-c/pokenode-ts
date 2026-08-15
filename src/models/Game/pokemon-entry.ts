import type { NamedAPIResource } from "../Common";

/**
 * A Pokémon catalogued in a Pokédex.
 */
export interface PokemonEntry {
  /** The index of this Pokémon species entry within the Pokédex. */
  entry_number: number;
  /** The Pokémon species being encountered. */
  pokemon_species: NamedAPIResource;
}
