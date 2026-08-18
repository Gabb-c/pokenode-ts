import type { Name, NamedAPIResource } from "../common";
import type { Region } from "../location/region";
import type { MoveLearnMethod } from "../moves/moves";
import type { Generation } from "./generation";
import type { Pokedex } from "./pokedex";

/**
 * ## Version
 * Versions of the games, e.g. Red, Blue or Yellow.
 * - See [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Core_series) for greater detail.
 */
export interface Version {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: string;
  /** The name of this resource listed in different languages. */
  names: Name[];
  /** The version group this version belongs to. */
  version_group: NamedAPIResource<VersionGroup>;
}

/**
 * ## Version Group
 * Version groups categorize highly similar versions of the games.
 */
export interface VersionGroup {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: string;
  /** Order for sorting. Almost by date of release, except similar versions are grouped together. */
  order: number;
  /** The generation this version was introduced in. */
  generation: NamedAPIResource<Generation>;
  /** A list of methods in which Pokémon can learn moves in this version group. */
  move_learn_methods: NamedAPIResource<MoveLearnMethod>[];
  /** A list of Pokédexes introduced in this version group. */
  pokedexes: NamedAPIResource<Pokedex>[];
  /** A list of regions that can be visited in this version group. */
  regions: NamedAPIResource<Region>[];
  /** The versions this version group owns. */
  versions: NamedAPIResource<Version>[];
}
