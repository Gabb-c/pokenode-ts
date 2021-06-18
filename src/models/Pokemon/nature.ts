import { Name, NamedAPIResource } from '../Common';

/**
 * ## Nature
 * Natures influence how a Pokémon's stats grow.
 * - See [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Nature) for greater detail
 */
export interface Nature {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** The stat decreased by 10% in Pokémon with this nature */
  decreased_stat: NamedAPIResource | null;
  /** The stat increased by 10% in Pokémon with this nature */
  increased_stat: NamedAPIResource | null;
  /** The flavor hated by Pokémon with this nature */
  hates_flavor: NamedAPIResource | null;
  /** The flavor liked by Pokémon with this nature */
  likes_flavor: NamedAPIResource | null;
  /** A list of Pokéathlon stats this nature effects and how much it effects them */
  pokeathlon_stat_changes: NatureStatChange[];
  /** A list of battle styles and how likely a Pokémon with this nature is to use them in the Battle Palace or Battle Tent */
  move_battle_style_preferences: MoveBattleStylePreference[];
  /** The name of this resource listed in different languages */
  names: Name[];
}

/**
 * Pokéathlon stats a nature effects and how much it effects it
 */
export interface NatureStatChange {
  /** The amount of change */
  max_change: -1 | 1 | -2 | 2;
  /** The stat being affected */
  pokeathlon_stat: NamedAPIResource;
}

/**
 * Battle Style and how likely a Pokémon with the given nature is to use them
 * in the Battle Palace or Battle Tent
 */
export interface MoveBattleStylePreference {
  /** Chance of using the move, in percent, if HP is under one half */
  low_hp_preference: number;
  /** Chance of using the move, in percent, if HP is over one half */
  high_hp_preference: number;
  /** The move battle style */
  move_battle_style: NamedAPIResource;
}
