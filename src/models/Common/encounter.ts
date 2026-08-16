import type { NamedAPIResource } from "./resource";

/**
 * How the encountered Pokémon itself is generated, where a game constrains it.
 *
 * Only the games that impose such constraints populate this — guaranteed
 * perfect IVs, forced or forbidden shininess, and Legends: Arceus alphas.
 */
export interface EncounterPokemonDetail {
  /** How many IVs are guaranteed to be perfect, if the game guarantees any. */
  min_perfect_ivs: number | null;
  /** Whether the encountered Pokémon is always shiny. */
  always_shiny: boolean;
  /** Whether the encountered Pokémon can never be shiny. */
  never_shiny: boolean;
  /** Whether the encountered Pokémon is an alpha. */
  is_alpha: boolean;
}

/** Information about a Pokémon encounter. */
export interface Encounter {
  /** The lowest level the Pokémon could be encountered at. */
  min_level: number;
  /** The highest level the Pokémon could be encountered at. */
  max_level: number;
  /** A list of condition values that must be in effect for this encounter to occur. */
  condition_values: NamedAPIResource[];
  /** Percent chance that this encounter will occur. */
  chance: number;
  /** The method by which this encounter happens. */
  method: NamedAPIResource;
  /** How the encountered Pokémon is generated, where the game constrains it. */
  pokemon_details: EncounterPokemonDetail | null;
}
