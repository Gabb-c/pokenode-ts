import type { BerryFlavor } from "../berry/berry";
import type { Name, NamedAPIResource } from "../common";
import type { MoveBattleStyle } from "../move/move";
import type { PokeathlonStat } from "./pokeathlon-stat";
import type { Stat } from "./stat";

/**
 * ## Nature
 * Natures influence how a Pokémon's stats grow.
 * - See [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Nature) for greater detail.
 */
export interface Nature {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: string;
  /** The stat decreased by 10% in Pokémon with this nature. */
  decreased_stat: NamedAPIResource<Stat> | null;
  /** The stat increased by 10% in Pokémon with this nature. */
  increased_stat: NamedAPIResource<Stat> | null;
  /** The flavor hated by Pokémon with this nature. */
  hates_flavor: NamedAPIResource<BerryFlavor> | null;
  /** The flavor liked by Pokémon with this nature. */
  likes_flavor: NamedAPIResource<BerryFlavor> | null;
  /** A list of Pokéathlon stats this nature affects and by how much. */
  pokeathlon_stat_changes: NatureStatChange[];
  /** A list of battle styles and how likely a Pokémon with this nature is to use them in the Battle Palace or Battle Tent. */
  move_battle_style_preferences: MoveBattleStylePreference[];
  /** The name of this resource listed in different languages. */
  names: Name[];
}

/**
 * A Pokéathlon stat a nature affects, and by how much.
 */
export interface NatureStatChange {
  /** The amount of change. */
  max_change: -1 | 1 | -2 | 2;
  /** The stat being affected. */
  pokeathlon_stat: NamedAPIResource<PokeathlonStat>;
}

/**
 * Battle Style and how likely a Pokémon with the given nature is to use them
 * in the Battle Palace or Battle Tent.
 */
export interface MoveBattleStylePreference {
  /** Chance of using the move, in percent, if HP is under one half. */
  low_hp_preference: number;
  /** Chance of using the move, in percent, if HP is over one half. */
  high_hp_preference: number;
  /** The move battle style. */
  move_battle_style: NamedAPIResource<MoveBattleStyle>;
}
