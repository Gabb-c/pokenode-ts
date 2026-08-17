import type { Name, NamedAPIResource } from "../Common";
import type { Region } from "../Location/region";
import type { Move } from "../Moves/moves";
import type { Ability } from "../Pokemon/ability";
import type { PokemonSpecies } from "../Pokemon/pokemon";
import type { Type } from "../Pokemon/type";
import type { VersionGroup } from "./version";

/**
 * ## Generation
 * A generation is a grouping of the Pokémon games that separates them based on the Pokémon they include.
 * In each generation, a new set of Pokémon, Moves, Abilities and Types that did not exist in the previous generation are released.
 * - See [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Generation) for greater detail.
 */
export interface Generation {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: string;
  /** A list of abilities that were introduced in this generation. */
  abilities: NamedAPIResource<Ability>[];
  /** The name of this resource listed in different languages. */
  names: Name[];
  /** The main region travelled in this generation. */
  main_region: NamedAPIResource<Region>;
  /** A list of moves that were introduced in this generation. */
  moves: NamedAPIResource<Move>[];
  /** A list of Pokémon species that were introduced in this generation. */
  pokemon_species: NamedAPIResource<PokemonSpecies>[];
  /** A list of types that were introduced in this generation. */
  types: NamedAPIResource<Type>[];
  /** A list of version groups that were introduced in this generation. */
  version_groups: NamedAPIResource<VersionGroup>[];
}
