import { Name, NamedAPIResource } from '../Common';

/**
 * ## Version
 * Versions of the games, e.g., Red, Blue or Yellow,
 * - Check out [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Core_series) for greater details.
 */
export interface Version {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** The name of this resource listed in different languages */
  names: Name[];
  /** The version group this version belongs to */
  version_group: NamedAPIResource;
}

/**
 * ## Version Group
 * Version groups categorize highly similar versions of the games
 */
export interface VersionGroup {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** Order for sorting. Almost by date of release, except similar versions are grouped together */
  order: number;
  /** The generation this version was introduced in */
  generation: NamedAPIResource;
  /** A list of methods in which Pokémon can learn moves in this version group */
  move_learn_methods: NamedAPIResource[];
  /** A list of Pokédexes introduces in this version group */
  pokedexes: NamedAPIResource[];
  /** A list of regions that can be visited in this version group */
  regions: NamedAPIResource[];
  /** The versions this version group owns */
  versions: NamedAPIResource[];
}
