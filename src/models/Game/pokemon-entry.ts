import type { NamedAPIResource } from "../Common";
import type { PokemonSpecies } from "../Pokemon/pokemon";

/**
 * A Pokémon catalogued in a Pokédex.
 */
export interface PokemonEntry {
  /** The index of this Pokémon species entry within the Pokédex. */
  entry_number: number;
  /** The Pokémon species being encountered. */
  pokemon_species: NamedAPIResource<PokemonSpecies>;
}
