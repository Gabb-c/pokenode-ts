import type { Name, NamedAPIResource } from "../common";
import type { Generation } from "../game/generation";
import type { Pokedex } from "../game/pokedex";
import type { VersionGroup } from "../game/version";
import type { Location } from "./location";

/**
 * ## Region
 * A region is an organized area of the Pokémon world.
 * Most often, the main difference between regions is
 * the species of Pokémon that can be encountered within them.
 *
 * - See [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Region) for greater detail.
 */
export type Region = {
  /** The identifier for this resource. */
  id: number;
  /** A list of locations that can be found in this region. */
  locations: NamedAPIResource<Location>[];
  /** The name for this resource. */
  name: string;
  /** The name of this resource listed in different languages. */
  names: Name[];
  /** The generation this region was introduced in. */
  main_generation: NamedAPIResource<Generation>;
  /** A list of Pokédexes that catalogue Pokémon in this region. */
  pokedexes: NamedAPIResource<Pokedex>[];
  /** A list of version groups where this region can be visited. */
  version_groups: NamedAPIResource<VersionGroup>[];
};
