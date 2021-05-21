import { Name, NamedAPIResource } from '../Common';

/**
 * Egg Groups are categories which determine which Pokémon are able to interbreed.
 * Pokémon may belong to either one or two Egg Groups.
 * Check out [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Egg_Group) for greater detail
 */
export interface EggGroup {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** The name of this resource listed in different languages */
  names: Name[];
  /** A list of all Pokémon species that are members of this egg group */
  pokemon_species: NamedAPIResource[];
}
