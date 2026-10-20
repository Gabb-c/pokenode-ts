import type { NamedAPIResource, VersionEncounterDetail, VersionGameIndex } from "../common";
import type { Generation } from "../game/generation";
import type { Version, VersionGroup } from "../game/version";
import type { Item } from "../item/item";
import type { LocationArea } from "../location/location";
import type { Move, MoveLearnMethod } from "../move/move";
import type { Ability } from "./ability";
import type { PokemonForm } from "./pokemon-form";
import type { PokemonSpecies } from "./pokemon-species";
import type { PokemonSprites } from "./pokemon-sprites";
import type { Stat } from "./stat";
import type { Type } from "./type";

/**
 * ## Pokémon
 * Pokémon are the creatures that inhabit the world of the Pokémon games.
 * They can be caught using Pokéballs and trained by battling with other Pokémon.
 * Each Pokémon belongs to a specific species but may take on a variant
 * which makes it differ from other Pokémon of the same species, such as base stats, available abilities and typings.
 *
 * - See [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_(species)) for greater detail.
 */
export interface Pokemon {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: string;
  /** The base experience gained for defeating this Pokémon. */
  base_experience: number;
  /** The height of this Pokémon in decimetres. */
  height: number;
  /** Set for exactly one Pokémon used as the default for each species. */
  is_default: boolean;
  /** Order for sorting. Almost national order, except families are grouped together. */
  order: number;
  /** The weight of this Pokémon in hectograms. */
  weight: number;
  /** A list of abilities this Pokémon could potentially have. */
  abilities: PokemonAbility[];
  /** A list of forms this Pokémon can take on. */
  forms: NamedAPIResource<PokemonForm>[];
  /** A list of game indices relevant to this Pokémon by generation. */
  game_indices: VersionGameIndex[];
  /** A list of items this Pokémon may be holding when encountered. */
  held_items: PokemonHeldItem[];
  /** A link to a list of location areas, as well as encounter details pertaining to specific versions. */
  location_area_encounters: string;
  /** A list of moves along with learn methods and level details pertaining to specific version groups. */
  moves: PokemonMove[];
  /** A set of sprites used to depict this Pokémon in the game. */
  sprites: PokemonSprites;
  /** A set of cries used to depict this Pokémon in the game. */
  cries: PokemonCries;
  /** The species this Pokémon belongs to. */
  species: NamedAPIResource<PokemonSpecies>;
  /** A list of base stat values for this Pokémon. */
  stats: PokemonStat[];
  /** A list of details showing types this Pokémon has. */
  types: PokemonType[];
  /** Data describing a Pokémon's types in a previous generation. */
  past_types: PokemonPastType[];
  /** Data describing a Pokémon's abilities in a previous generation. */
  past_abilities: PokemonPastAbility[];
  /** Data describing a Pokémon's stats in a previous generation. */
  past_stats: PokemonPastStat[];
}

/** The cries used to depict a Pokémon in the games. */
export type PokemonCries = {
  /** The legacy depiction of this Pokémon's cry. */
  legacy: string;
  /** The latest depiction of this Pokémon's cry. */
  latest: string;
};

/**
 * Abilities the given Pokémon could potentially have.
 */
export interface PokemonAbility {
  /** Whether or not this is a hidden ability. */
  is_hidden: boolean;
  /** The slot this ability occupies in this Pokémon species. */
  slot: number;
  /** The ability the Pokémon may have. */
  ability: NamedAPIResource<Ability>;
}

/**
 * Details showing types the given Pokémon has.
 */
export interface PokemonType {
  /** The order the Pokémon's types are listed in. */
  slot: number;
  /** The type the referenced Pokémon has. */
  type: NamedAPIResource<Type>;
}

/**
 * Data describing a Pokémon's types in a previous generation.
 */
export interface PokemonPastType {
  /** The generation of this Pokémon Type. */
  generation: NamedAPIResource<Generation>;
  /** The types this Pokémon had in a previous generation. */
  types: PokemonType[];
}

/** An ability slot as it stood in a previous generation. */
export interface PokemonPastAbilitySlot {
  /** Whether or not this was a hidden ability. */
  is_hidden: boolean;
  /** The slot this ability occupied in this Pokémon species. */
  slot: number;
  /** The ability that occupied the slot, or `null` when the slot was empty. */
  ability: NamedAPIResource<Ability> | null;
}

/** Data describing a Pokémon's abilities in a previous generation. */
export interface PokemonPastAbility {
  /** The last generation in which the referenced Pokémon had the listed abilities. */
  generation: NamedAPIResource<Generation>;
  /** The abilities the referenced Pokémon had up to and including the listed generation. */
  abilities: PokemonPastAbilitySlot[];
}

/** Data describing a Pokémon's stats in a previous generation. */
export interface PokemonPastStat {
  /** The last generation in which the referenced Pokémon had the listed stats. */
  generation: NamedAPIResource<Generation>;
  /** The stats the Pokémon had up to and including the listed generation. */
  stats: PokemonStat[];
}

/**
 * Items the given Pokémon may be holding when encountered.
 */
export interface PokemonHeldItem {
  /** The item the referenced Pokémon holds. */
  item: NamedAPIResource<Item>;
  /** The details of the different versions in which the item is held. */
  version_details: PokemonHeldItemVersion[];
}

/**
 * The details of the different versions in which the item is held.
 */
export interface PokemonHeldItemVersion {
  /** The version in which the item is held. */
  version: NamedAPIResource<Version>;
  /** How often the item is held. */
  rarity: number;
}

/**
 * A Move along with learn methods and level details pertaining to specific version groups.
 */
export interface PokemonMove {
  /** The move the Pokémon can learn. */
  move: NamedAPIResource<Move>;
  /** The details of the version in which the Pokémon can learn the move. */
  version_group_details: PokemonMoveVersion[];
}

/**
 * The details of the version in which the Pokémon can learn the move.
 */
export interface PokemonMoveVersion {
  /** The method by which the move is learned. */
  move_learn_method: NamedAPIResource<MoveLearnMethod>;
  /** The version group in which the move is learned. */
  version_group: NamedAPIResource<VersionGroup>;
  /** The minimum level to learn the move. */
  level_learned_at: number;
  /**
   * Order by which the Pokémon will learn the move. A newly learnt move replaces the move with
   * the lowest order.
   */
  order: number | null;
}

/**
 * Base stat values for the given Pokémon.
 */
export interface PokemonStat {
  /** The stat the Pokémon has. */
  stat: NamedAPIResource<Stat>;
  /** The effort points (EV) the Pokémon has in the stat. */
  effort: number;
  /** The base value of the stat. */
  base_stat: number;
}

/**
 * ## Location Area Encounter
 * Pokémon location areas where Pokémon can be found.
 */
export interface LocationAreaEncounter {
  /** The location area the referenced Pokémon can be encountered in. */
  location_area: NamedAPIResource<LocationArea>;
  /** A list of versions and encounters with the referenced Pokémon that might happen. */
  version_details: VersionEncounterDetail[];
}
