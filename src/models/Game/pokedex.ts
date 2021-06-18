import { Description, Name, NamedAPIResource } from '../Common';
import { PokemonEntry } from './pokemon-entry';

/**
 * ## Pokedex
 * A Pokédex is a handheld electronic encyclopedia device;
 * one which is capable of recording and retaining information of the various Pokémon in a given region
 * with the exception of the national dex and some smaller dexes related to portions of a region.
 * - See [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9dex) for greater detail
 */
export interface Pokedex {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** Whether or not this Pokédex originated in the main series of the video games */
  is_main_series: boolean;
  /** The description of this resource listed in different languages */
  descriptions: Description[];
  /** The name of this resource listed in different languages */
  names: Name[];
  /** A list of Pokémon catalogued in this Pokédex and their indexes */
  pokemon_entries: PokemonEntry[];
  /** The region this Pokédex catalogues Pokémon for */
  region: NamedAPIResource | null;
  /** A list of version groups this Pokédex is relevant to */
  version_groups: NamedAPIResource[];
}
