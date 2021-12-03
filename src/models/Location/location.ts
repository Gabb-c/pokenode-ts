import { GenerationGameIndex, Name, NamedAPIResource } from '../Common';
import { EncounterMethodRate, PokemonEncounter } from './encounter';

/**
 * ## Location
 * Locations that can be visited within the games.
 * Locations make up sizable portions of regions, like cities or routes.
 * - Check the [List of Locations](https://bulbapedia.bulbagarden.net/wiki/List_of_locations_by_name)
 */
export interface Location {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** The region this location can be found in */
  region: NamedAPIResource | null;
  /** The name of this resource listed in different languages */
  names: Name[];
  /** A list of game indices relevent to this location by generation */
  game_indices: GenerationGameIndex[];
  /** Areas that can be found within this location */
  areas: NamedAPIResource[];
}

/**
 * ## Location Area
 * Location areas are sections of areas, such as floors in a building or cave.
 * Each area has its own set of possible Pokémon encounters.
 * - Check out [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Area) for more details.
 */
export interface LocationArea {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** The internal id of an API resource within game data */
  game_index: number;
  /** A list of methods in which Pokémon may be encountered in this area and how likely the method will occur depending on the version of the game */
  encounter_method_rates: EncounterMethodRate[];
  /** The region this location area can be found in */
  location: NamedAPIResource;
  /** The name of this resource listed in different languages */
  names: Name[];
  /** A list of Pokémon that can be encountered in this area along with version specific details about the encounter */
  pokemon_encounters: PokemonEncounter[];
}
