import type {
  APIResource,
  Description,
  Effect,
  GenerationGameIndex,
  MachineVersionDetail,
  Name,
  NamedAPIResource,
  VerboseEffect,
  VersionGroupFlavorText,
} from "../common";
import type { Currency } from "../currency/currency";
import type { EvolutionChain } from "../evolution/evolution";
import type { Version, VersionGroup } from "../game/version";
import type { Pokemon } from "../pokemon/pokemon";

/**
 * Sprites used to depict the given item in the game.
 */
export interface ItemSprites {
  /** The default depiction of this item. */
  default: string;
}

/**
 * Pokémon that might be found in the wild holding the given item.
 */
export interface ItemHolderPokemon {
  /** The Pokémon that holds this item. */
  pokemon: NamedAPIResource<Pokemon>;
  /** The details for the version that this item is held in by the Pokémon. */
  version_details: ItemHolderPokemonVersionDetail[];
}

/**
 * The details for the version that the given item is held in by the Pokémon.
 */
export interface ItemHolderPokemonVersionDetail {
  /** How often this Pokémon holds this item in this version. */
  rarity: number;
  /** The version that this item is held in by the Pokémon. */
  version: NamedAPIResource<Version>;
}

/**
 * ## Item Attribute
 * Item attributes define particular aspects of items, e.g. "usable in battle" or "consumable".
 */
export interface ItemAttribute {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: string;
  /** A list of items that have this attribute. */
  items: NamedAPIResource<Item>[];
  /** The name of this item attribute listed in different languages. */
  names: Name[];
  /** The description of this item attribute listed in different languages. */
  descriptions: Description[];
}

/**
 * ## Item Category
 * Item categories determine where items will be placed in the player's bag.
 */
export interface ItemCategory {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: string;
  /** A list of items that are a part of this category. */
  items: NamedAPIResource<Item>[];
  /** The name of this item category listed in different languages. */
  names: Name[];
  /** The pocket items in this category would be put in. */
  pocket: NamedAPIResource<ItemPocket>;
}

/**
 * ## Item Fling Effect
 * The various effects of the move "Fling" when used with different items.
 */
export interface ItemFlingEffect {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: string;
  /** The result of this fling effect listed in different languages. */
  effect_entries: Effect[];
  /** A list of items that have this fling effect. */
  items: NamedAPIResource<Item>[];
}

/**
 * ## Item Pocket
 * Pockets within the player's bag used for storing items by category.
 */
export interface ItemPocket {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: string;
  /** A list of item categories that are relevant to this item pocket. */
  categories: NamedAPIResource<ItemCategory>[];
  /** The name of this resource listed in different languages. */
  names: Name[];
}

/** The price of an item in a single version group. */
export interface ItemPrice {
  /** The currency used for this price. */
  currency: NamedAPIResource<Currency>;
  /** The purchase price of this item in this version group. Null if the item cannot be purchased. */
  purchase_price: number | null;
  /** The sell price of this item in this version group. Null if the item cannot be sold. */
  sell_price: number | null;
  /** The version group these prices apply to. */
  version_group: NamedAPIResource<VersionGroup>;
}

/**
 * ## Item
 * An item is an object in the games which the player can pick up, keep in their bag, and use in some manner.
 * They have various uses, including healing, powering up, helping catch Pokémon, or to access a new area.
 *
 * - See [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Item).
 */
export interface Item {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: string;
  /** The purchase and sell prices of this item for each version group. */
  prices: ItemPrice[];
  /** The power of the move Fling when used with this item. */
  fling_power: number | null;
  /** The effect of the move Fling when used with this item. */
  fling_effect: NamedAPIResource<ItemFlingEffect> | null;
  /** A list of attributes this item has. */
  attributes: NamedAPIResource<ItemAttribute>[];
  /** The category of items this item falls into. */
  category: NamedAPIResource<ItemCategory>;
  /** The effect of this ability listed in different languages. */
  effect_entries: VerboseEffect[];
  /** The flavor text of this ability listed in different languages. */
  flavor_text_entries: VersionGroupFlavorText[];
  /** A list of game indices relevant to this item by generation. */
  game_indices: GenerationGameIndex[];
  /** The name of this item listed in different languages. */
  names: Name[];
  /** A set of sprites used to depict this item in the game. */
  sprites: ItemSprites;
  /** A list of Pokémon that might be found in the wild holding this item. */
  held_by_pokemon: ItemHolderPokemon[];
  /** An evolution chain this item requires to produce a baby during mating. */
  baby_trigger_for: APIResource<EvolutionChain> | null;
  /** A list of the machines related to this item. */
  machines: MachineVersionDetail[];
}
