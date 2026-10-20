import type { Name, NamedAPIResource } from "../common";
import type { PokemonSpecies } from "./pokemon-species";

/**
 * ## Pokémon Habitat
 * Habitats are generally different terrain Pokémon can be found in
 * but can also be areas designated for rare or legendary Pokémon.
 */
export interface PokemonHabitat {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name:
    | "cave"
    | "forest"
    | "grassland"
    | "mountain"
    | "rare"
    | "rough-terrain"
    | "sea"
    | "urban"
    | "waters-edge";
  /** The name of this resource listed in different languages. */
  names: Name[];
  /** A list of the Pokémon species that can be found in this habitat. */
  pokemon_species: NamedAPIResource<PokemonSpecies>[];
}
