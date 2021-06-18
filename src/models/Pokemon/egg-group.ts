import { Name, NamedAPIResource } from '../Common';

/**
 * ## Egg Group
 * Egg Groups are categories which determine which Pokémon are able to interbreed.
 * Pokémon may belong to either one or two Egg Groups.
 * - Check out [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Egg_Group) for greater details.
 */
export interface EggGroup {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name:
    | 'monster'
    | 'water1'
    | 'water2'
    | 'water3'
    | 'bug'
    | 'flying'
    | 'ground'
    | 'fairy'
    | 'plant'
    | 'humanshape'
    | 'mineral'
    | 'indeterminate'
    | 'ditto'
    | 'dragon'
    | 'no-eggs';
  /** The name of this resource listed in different languages */
  names: Name[];
  /** A list of all Pokémon species that are members of this egg group */
  pokemon_species: NamedAPIResource[];
}
