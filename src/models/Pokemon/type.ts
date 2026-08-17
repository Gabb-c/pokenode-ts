import type { GenerationGameIndex, Name, NamedAPIResource } from "../Common";
import type { Generation } from "../Game/generation";
import type { Move, MoveDamageClass } from "../Moves/moves";
import type { Pokemon } from "./pokemon";

/**
 * Details of Pokémon for a specific type.
 */
export interface TypePokemon {
  /** The order the Pokémon's types are listed in. */
  slot: number;
  /** The Pokémon that has the referenced type. */
  pokemon: NamedAPIResource<Pokemon>;
}

/**
 * Detail of how effective a type is toward others and vice versa.
 */
export interface TypeRelations {
  /** A list of types this type has no effect on. */
  no_damage_to: NamedAPIResource<Type>[];
  /** A list of types this type is not very effective against. */
  half_damage_to: NamedAPIResource<Type>[];
  /** A list of types this type is very effective against. */
  double_damage_to: NamedAPIResource<Type>[];
  /** A list of types that have no effect on this type. */
  no_damage_from: NamedAPIResource<Type>[];
  /** A list of types that are not very effective against this type. */
  half_damage_from: NamedAPIResource<Type>[];
  /** A list of types that are very effective against this type. */
  double_damage_from: NamedAPIResource<Type>[];
}

/**
 * Details of how effective this type was toward others and vice versa in a previous generation.
 */
export interface TypeRelationsPast {
  /** The last generation in which the referenced type had the listed damage relations. */
  generation: NamedAPIResource<Generation>;
  /** The damage relations the referenced type had up to and including the listed generation. */
  damage_relations: TypeRelations;
}

/**
 * The pair of icons a single game uses to depict a type.
 *
 * `symbol_icon` is the type's bare glyph and `name_icon` spells the name out;
 * games that only ever shipped one of the two leave the other `null`.
 */
export interface TypeGameSprites {
  /** The icon spelling out the type's name. */
  name_icon: string | null;
  /** The icon showing the type's symbol alone. */
  symbol_icon: string | null;
}

/** Generation-III type icons, by game. */
export interface GenerationIIITypeSprites {
  colosseum: TypeGameSprites;
  emerald: TypeGameSprites;
  "firered-leafgreen": TypeGameSprites;
  "ruby-sapphire": TypeGameSprites;
  xd: TypeGameSprites;
}

/** Generation-IV type icons, by game. */
export interface GenerationIVTypeSprites {
  "diamond-pearl": TypeGameSprites;
  "heartgold-soulsilver": TypeGameSprites;
  platinum: TypeGameSprites;
}

/** Generation-V type icons, by game. */
export interface GenerationVTypeSprites {
  "black-2-white-2": TypeGameSprites;
  "black-white": TypeGameSprites;
}

/** Generation-VI type icons, by game. */
export interface GenerationVITypeSprites {
  "omega-ruby-alpha-sapphire": TypeGameSprites;
  "x-y": TypeGameSprites;
}

/** Generation-VII type icons, by game. */
export interface GenerationVIITypeSprites {
  "lets-go-pikachu-lets-go-eevee": TypeGameSprites;
  "sun-moon": TypeGameSprites;
  "ultra-sun-ultra-moon": TypeGameSprites;
}

/** Generation-VIII type icons, by game. */
export interface GenerationVIIITypeSprites {
  "brilliant-diamond-shining-pearl": TypeGameSprites;
  "legends-arceus": TypeGameSprites;
  "sword-shield": TypeGameSprites;
}

/** Generation-IX type icons, by game. */
export interface GenerationIXTypeSprites {
  "scarlet-violet": TypeGameSprites;
}

/**
 * The icons used to depict a type, by generation and game.
 *
 * Generations I and II are absent: neither displayed type icons in-game.
 */
export interface TypeSprites {
  /** Generation-III type icons. */
  "generation-iii": GenerationIIITypeSprites;
  /** Generation-IV type icons. */
  "generation-iv": GenerationIVTypeSprites;
  /** Generation-V type icons. */
  "generation-v": GenerationVTypeSprites;
  /** Generation-VI type icons. */
  "generation-vi": GenerationVITypeSprites;
  /** Generation-VII type icons. */
  "generation-vii": GenerationVIITypeSprites;
  /** Generation-VIII type icons. */
  "generation-viii": GenerationVIIITypeSprites;
  /** Generation-IX type icons. */
  "generation-ix": GenerationIXTypeSprites;
}

/**
 * ## Type
 * Types are properties for Pokémon and their moves.
 * Each type has three properties: which types of Pokémon it is super effective against,
 * which types of Pokémon it is not very effective against, and which types of Pokémon it is completely ineffective against.
 */
export interface Type {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: string;
  /** A detail of how effective this type is toward others and vice versa. */
  damage_relations: TypeRelations;
  /** A list of details of how effective this type was toward others and vice versa in previous generations. */
  past_damage_relations: TypeRelationsPast[];
  /** A list of game indices relevant to this item by generation. */
  game_indices: GenerationGameIndex[];
  /** The generation this type was introduced in. */
  generation: NamedAPIResource<Generation>;
  /** The class of damage inflicted by this type. */
  move_damage_class: NamedAPIResource<MoveDamageClass>;
  /** The name of this resource listed in different languages. */
  names: Name[];
  /** A list of details of Pokémon that have this type. */
  pokemon: TypePokemon[];
  /** A list of moves that have this type. */
  moves: NamedAPIResource<Move>[];
  /** The icons used to depict this type, by generation and game. */
  sprites: TypeSprites;
}
