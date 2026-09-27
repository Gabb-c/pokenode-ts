import type { Description, Name, NamedAPIResource } from "../common";
import type { VersionGroup } from "../game/version";
import type { Item } from "../item/item";
import type { Location } from "../location/location";
import type { Region } from "../location/region";
import type { Move } from "../move/move";
import type { Nature } from "../pokemon/nature";
import type { PokemonForm, PokemonSpecies } from "../pokemon/pokemon";
import type { Type } from "../pokemon/type";

/**
 * ## Evolution Time Of Day
 * The times of day an evolution can be tied to, lower case as the API writes
 * them. `dusk` is Lycanroc's Dusk Form and `full-moon` is Ursaluna, so this is
 * wider than the day/night pair the endpoint documentation describes.
 */
export type EvolutionTimeOfDay = "day" | "night" | "dusk" | "full-moon";

/**
 * ## Evolution Detail
 * All details regarding the specific details of the referenced Pokémon species evolution.
 */
export interface EvolutionDetail {
  /** The item required to cause evolution into this Pokémon species. */
  item: NamedAPIResource<Item> | null;
  /** The type of event that triggers evolution into this Pokémon species. */
  trigger: NamedAPIResource<EvolutionTrigger>;
  /** The gender the evolving Pokémon species must be in order to evolve into this Pokémon species. */
  gender: number | null;
  /** The item the evolving Pokémon species must be holding during the evolution trigger event to evolve into this Pokémon species. */
  held_item: NamedAPIResource<Item> | null;
  /** The move that must be known by the evolving Pokémon species during the evolution trigger event in order to evolve into this Pokémon species. */
  known_move: NamedAPIResource<Move> | null;
  /** The evolving Pokémon species must know a move with this type during the evolution trigger event in order to evolve into this Pokémon species. */
  known_move_type: NamedAPIResource<Type> | null;
  /** The location the evolution must be triggered at. */
  location: NamedAPIResource<Location> | null;
  /** The minimum required level the evolving Pokémon species must reach to evolve into this Pokémon species. */
  min_level: number | null;
  /** The minimum required level of happiness the evolving Pokémon species must have to evolve into this Pokémon species. */
  min_happiness: number | null;
  /** The minimum required level of beauty the evolving Pokémon species must have to evolve into this Pokémon species. */
  min_beauty: number | null;
  /** The minimum required level of affection the evolving Pokémon species must have to evolve into this Pokémon species. */
  min_affection: number | null;
  /** Whether or not it must be raining in the overworld to cause evolution into this Pokémon species. */
  needs_overworld_rain: boolean;
  /** The Pokémon species that must be in the player's party in order for the evolving Pokémon species to evolve into this Pokémon species. */
  party_species: NamedAPIResource<PokemonSpecies> | null;
  /**
   * The player must have a Pokémon of this type in their party during the evolution trigger event
   * in order for the evolving Pokémon species to evolve into this Pokémon species.
   */
  party_type: NamedAPIResource<Type> | null;
  /** The required relation between the Pokémon's Attack and Defense stats. 1 means Attack > Defense. 0 means Attack = Defense. -1 means Attack < Defense. */
  relative_physical_stats: 1 | 0 | -1 | null;
  /** The required time of day, or `""` when any time will do. */
  time_of_day: EvolutionTimeOfDay | "";
  /** Pokémon species for which this one must be traded. */
  trade_species: NamedAPIResource<PokemonSpecies> | null;
  /** Whether or not the 3DS needs to be turned upside-down as this Pokémon levels up. */
  turn_upside_down: boolean;
  /** The version group in which the evolution was introduced. */
  version_group: NamedAPIResource<VersionGroup>;
  /**
   * Whether the evolution is the expected one in a main series game. Each Pokémon variety of a line
   * capable of evolution has exactly one default evolution per distinct variety it evolves into.
   */
  is_default: boolean;
  /** Whether or not the Pokémon must be near a Moss Rock or Icy Rock to evolve into this species. */
  near_special_rock: boolean;
  /** Whether or not multiplayer link play is needed to evolve into this species, e.g. Union Circle. */
  needs_multiplayer: boolean;
  /** The region this evolution must occur in. */
  region: NamedAPIResource<Region> | null;
  /** The form the evolving Pokémon must be in for this evolution to occur. */
  required_pokemon_form: NamedAPIResource<PokemonForm> | null;
  /** The form this evolution produces. */
  evolved_pokemon_form: NamedAPIResource<PokemonForm> | null;
  /**
   * The move that must be used by the evolving Pokémon species during the evolution trigger event
   * in order to evolve into this Pokémon species.
   */
  used_move: NamedAPIResource<Move> | null;
  /** The minimum number of times `used_move` must be used to evolve into this species. */
  min_move_count: number | null;
  /** The minimum number of steps that must be taken to evolve into this species. */
  min_steps: number | null;
  /**
   * The minimum amount of damage taken during the evolution trigger event to evolve into this
   * species.
   */
  min_damage_taken: number | null;
  /** The natures the evolving Pokémon must have one of, e.g. Toxtricity's Amped and Low Key forms. */
  allowed_natures: NamedAPIResource<Nature>[] | null;
  /**
   * A check over hidden values or the player's input the evolution must pass, e.g. Wurmple into
   * Silcoon or Cascoon, or how Milcery is spun.
   */
  condition_expression: EvolutionConditionExpression | null;
}

/**
 * ## Evolution Condition Expression
 * A check against values the games hide from the player, or against how the
 * player performed the evolution, which decides between evolutions that
 * otherwise share every requirement.
 */
export interface EvolutionConditionExpression {
  /**
   * The check in postfix notation over the variables' symbols, e.g.
   * `"EC 100 % 0 !="` — the encryption constant is not a multiple of 100.
   */
  expression: string;
  /**
   * The share of Pokémon, in percent, that pass the check. `null` when the check
   * reads the player's input, which the player chooses rather than rolls.
   */
  percentage_chance: number | null;
  /** The values the expression reads. */
  variables: NamedAPIResource<EvolutionVariable>[];
}

/**
 * ## Chain Link
 * Contains evolution details for a Pokémon in the chain.
 * Each link references the next Pokémon in the natural evolution order.
 */
export interface ChainLink {
  /** Whether or not this link is for a baby Pokémon. This would only ever be true on the base link. */
  is_baby: boolean;
  /** The Pokémon species at this point in the evolution chain. */
  species: NamedAPIResource<PokemonSpecies>;
  /** All details regarding the specific details of the referenced Pokémon species evolution. */
  evolution_details: EvolutionDetail[];
  /** A list of chain objects. */
  evolves_to: ChainLink[];
}

/**
 * ## Evolution Chain
 * Evolution chains are essentially family trees.
 * They start with the lowest stage within a family and detail
 * evolution conditions for each as well as Pokémon they can evolve
 * into up through the hierarchy.
 */
export interface EvolutionChain {
  /** The identifier for this resource. */
  id: number;
  /**
   * The item that a Pokémon would be holding when mating that would trigger
   * the egg hatching a baby Pokémon rather than a basic Pokémon.
   */
  baby_trigger_item: NamedAPIResource<Item> | null;
  /**
   * The base chain link object. Each link contains evolution details for a Pokémon in the chain.
   * Each link references the next Pokémon in the natural evolution order.
   */
  chain: ChainLink;
}

/**
 * ## Evolution Trigger Name
 * Every trigger the PokéAPI publishes, in the order `/evolution-trigger` lists
 * them — which is the order their ids run in, and the order
 * {@link EVOLUTION_TRIGGERS} mirrors.
 */
export type EvolutionTriggerName =
  | "level-up"
  | "trade"
  | "use-item"
  | "shed"
  | "spin"
  | "tower-of-darkness"
  | "tower-of-waters"
  | "three-critical-hits"
  | "take-damage"
  | "in-battle-level-up"
  | "agile-style-move"
  | "strong-style-move"
  | "recoil-damage"
  | "use-move"
  | "three-defeated-bisharp"
  | "gimmighoul-coins"
  | "meltan-candies"
  | "unclassified";

/**
 * ## Evolution Trigger
 * Evolution triggers are the events and conditions that cause a Pokémon to evolve.
 * There are numerous methods of evolution which define how and when Pokémon evolve.
 * Most Pokémon will evolve by leveling up while others evolve through specific means,
 * such as being traded, achieving a certain amount of friendship or leveling at certain times, among others.
 *
 * - See [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Methods_of_evolution) for greater detail.
 */
export interface EvolutionTrigger {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: EvolutionTriggerName;
  /** The name of this resource listed in different languages. */
  names: Name[];
  /** A list of Pokémon species that result from this evolution trigger. */
  pokemon_species: NamedAPIResource<PokemonSpecies>[];
}

/**
 * ## Evolution Variable Name
 * Every variable the PokéAPI publishes, in id order, the order
 * {@link EVOLUTION_VARIABLES} mirrors.
 */
export type EvolutionVariableName =
  | "encryption-constant"
  | "personality-value"
  | "spin-direction"
  | "spin-duration";

/**
 * ## Evolution Variable Source
 * Where a variable's value comes from: `pokemon` for data stored on the Pokémon,
 * such as its encryption constant, `player-input` for something the player does
 * while evolving it, such as spinning Milcery.
 */
export type EvolutionVariableSource = "pokemon" | "player-input";

/**
 * ## Evolution Variable
 * A value an {@link EvolutionConditionExpression} reads: either one the games
 * generate for each Pokémon and hide from the player, or one the player supplies
 * while evolving it.
 *
 * - See [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Personality_value) for greater detail.
 */
export interface EvolutionVariable {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: EvolutionVariableName;
  /** The symbol an expression refers to this variable by, e.g. `EC`. */
  symbol: string;
  /** The type the games store this value as, e.g. `uint32`. */
  data_type: string;
  /** Whether the value is stored on the Pokémon or supplied by the player. */
  source: EvolutionVariableSource;
  /** The version group this variable was introduced in. */
  version_group: NamedAPIResource<VersionGroup>;
  /** The name of this resource listed in different languages. */
  names: Name[];
  /** The description of this resource listed in different languages. */
  descriptions: Description[];
}
