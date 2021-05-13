/* eslint-disable camelcase */

import { Name, NamedAPIResource } from '../Common';

/**
 * A region is an organized area of the Pokémon world.
 * Most often, the main difference between regions is
 * the species of Pokémon that can be encountered within them
 */
export interface Region {
  /** The identifier for this resource */
  id: number;
  /** A list of locations that can be found in this region */
  locations: NamedAPIResource[];
  /** The name for this resource */
  name: string;
  /** The name of this resource listed in different languages */
  names: Name[];
  /** The generation this region was introduced in */
  main_generation: NamedAPIResource;
  /** A list of pokédexes that catalogue Pokémon in this region */
  pokedexes: NamedAPIResource[];
  /** A list of version groups where this region can be visited */
  version_groups: NamedAPIResource[];
}
