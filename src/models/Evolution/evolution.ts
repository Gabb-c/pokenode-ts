import type { Name, NamedAPIResource } from "../Common";

/**
 * ## Evolution Detail
 * All details regarding the specific details of the referenced Pokémon species evolution.
 */
export interface EvolutionDetail {
  /** The item required to cause evolution into this Pokémon species. */
  item: NamedAPIResource | null;
  /** The type of event that triggers evolution into this Pokémon species. */
  trigger: NamedAPIResource;
  /** The gender the evolving Pokémon species must be in order to evolve into this Pokémon species. */
  gender: number | null;
  /** The item the evolving Pokémon species must be holding during the evolution trigger event to evolve into this Pokémon species. */
  held_item: NamedAPIResource | null;
  /** The move that must be known by the evolving Pokémon species during the evolution trigger event in order to evolve into this Pokémon species. */
  known_move: NamedAPIResource | null;
  /** The evolving Pokémon species must know a move with this type during the evolution trigger event in order to evolve into this Pokémon species. */
  known_move_type: NamedAPIResource | null;
  /** The location the evolution must be triggered at. */
  location: NamedAPIResource | null;
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
  party_species: NamedAPIResource | null;
  /**
   * The player must have a Pokémon of this type in their party during the evolution trigger event
   * in order for the evolving Pokémon species to evolve into this Pokémon species.
   */
  party_type: NamedAPIResource | null;
  /** The required relation between the Pokémon's Attack and Defense stats. 1 means Attack > Defense. 0 means Attack = Defense. -1 means Attack < Defense. */
  relative_physical_stats: 1 | 0 | -1 | null;
  /** The required time of day. Day or night. */
  time_of_day: "Day" | "Night" | "";
  /** Pokémon species for which this one must be traded. */
  trade_species: NamedAPIResource | null;
  /** Whether or not the 3DS needs to be turned upside-down as this Pokémon levels up. */
  turn_upside_down: boolean;
  /** The version group in which the evolution was introduced. */
  version_group: NamedAPIResource;
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
  region: NamedAPIResource | null;
  /** The form the evolving Pokémon must be in for this evolution to occur. */
  base_form: NamedAPIResource | null;
  /** The form this evolution produces. */
  evolved_form: NamedAPIResource | null;
  /**
   * The move that must be used by the evolving Pokémon species during the evolution trigger event
   * in order to evolve into this Pokémon species.
   */
  used_move: NamedAPIResource | null;
  /** The minimum number of times `used_move` must be used to evolve into this species. */
  min_move_count: number | null;
  /** The minimum number of steps that must be taken to evolve into this species. */
  min_steps: number | null;
  /**
   * The minimum amount of damage taken during the evolution trigger event to evolve into this
   * species.
   */
  min_damage_taken: number | null;
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
  species: NamedAPIResource;
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
  baby_trigger_item: NamedAPIResource | null;
  /**
   * The base chain link object. Each link contains evolution details for a Pokémon in the chain.
   * Each link references the next Pokémon in the natural evolution order.
   */
  chain: ChainLink;
}

/**
 * ## Evolution Trigger
 * Evolution triggers are the events and conditions that cause a Pokémon to evolve.
 * There are numerous methods of evolution which define how and when Pokémon evolve.
 * Most Pokémon will evolve by leveling up while others evolve through specific means,
 * such as being traded, achieving a certain amount of friendship or leveling at certain times, among others.
 * - See [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Methods_of_evolution) for greater detail.
 */
export interface EvolutionTrigger {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: "level-up" | "trade" | "use-item" | "shed" | "other";
  /** The name of this resource listed in different languages. */
  names: Name[];
  /** A list of Pokémon species that result from this evolution trigger. */
  pokemon_species: NamedAPIResource[];
}
