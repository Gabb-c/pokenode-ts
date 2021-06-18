import { Effect, FlavorText, NamedAPIResource } from '../Common';

/**
 * ## Contest Type
 * Contest types are categories judges used to weigh a Pokémon's condition in Pokémon contests.
 * - Check out [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Contest_condition) for greater detail
 */
export interface ContestType {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: 'cool' | 'beauty' | 'cute' | 'smart' | 'tough';
  /** The berry flavor that correlates with this contest type */
  berry_flavor: NamedAPIResource;
  /** The name of this contest type listed in different languages */
  names: ContestName[];
}

/**
 * The name of the given contest type
 */
export interface ContestName {
  /** The name for this contest */
  name: string;
  /** The color associated with this contest's name */
  color: string;
  /** The language that this name is in */
  language: NamedAPIResource;
}

/**
 * ## Contest Effect
 * Contest effects refer to the effects of moves when used in contests
 */
export interface ContestEffect {
  /** The identifier for this resource */
  id: number;
  /** The base number of hearts the user of this move gets */
  appeal: number;
  /** The base number of hearts the user's opponent loses */
  jam: number;
  /** The result of this contest effect listed in different languages */
  effect_entries: Effect[];
  /** The flavor text of this contest effect listed in different languages */
  flavor_text_entries: FlavorText[];
}

/**
 * ## Super Contest Effect
 * Super contest effects refer to the effects of moves when used in super contests.
 * A Pokémon Super Contest is an expanded format of the [Pokémon Contests](https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_Contest)
 * for the Generation IV games,
 * specifically in [Diamond, Pearl](https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_Diamond_and_Pearl_Versions),
 * and [Platinum](https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_Platinum_Version).
 * In it, Pokémon are rated on their appearance and performance, rather than strength.
 * - Check out [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_Super_Contest)
 */
export interface SuperContestEffect {
  /** The identifier for this resource */
  id: number;
  /** The level of appeal this super contest effect has */
  appeal: number;
  /** The flavor text of this super contest effect listed in different languages */
  flavor_text_entries: FlavorText[];
  /** A list of moves that have the effect when used in super contests */
  moves: NamedAPIResource[];
}
