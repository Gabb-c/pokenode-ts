import type { Language, Name, NamedAPIResource } from "../common";
import type { PokemonSpecies } from "./pokemon-species";

/**
 * ## Pokémon Shape
 * Shapes used for sorting Pokémon in a Pokédex.
 */
export interface PokemonShape {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: string;
  /** The "scientific" name of this Pokémon shape listed in different languages. */
  awesome_names: AwesomeName[];
  /** The name of this resource listed in different languages. */
  names: Name[];
  /** A list of the Pokémon species that have this shape. */
  pokemon_species: NamedAPIResource<PokemonSpecies>[];
}

/**
 * The "scientific" name of the Pokémon shape listed in different languages.
 */
export interface AwesomeName {
  /** The localized "scientific" name for an API resource in a specific language. */
  awesome_name: string;
  /** The language this "scientific" name is in. */
  language: NamedAPIResource<Language>;
}
