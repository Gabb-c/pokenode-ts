# Items

## Item Sprites

Sprites used to depict the given item in the game.

```ts
export interface ItemSprites {
  /** The default depiction of this item */
  default: string;
}
```

## Item Holder Pokemon

Pokémon that might be found in the wild holding the given item.

```ts
export interface ItemHolderPokemon {
  /** The Pokémon that holds this item */
  pokemon: NamedAPIResource;
  /** The details for the version that this item is held in by the Pokémon */
  version_details: ItemHolderPokemonVersionDetail[];
}
```

## Item Holder Pokemon Version Detail

The details for the version that the given item is held in by the Pokémon.

```ts
export interface ItemHolderPokemonVersionDetail {
  /** How often this Pokémon holds this item in this version */
  rarity: number;
  /** The version that this item is held in by the Pokémon */
  version: NamedAPIResource;
}
```

## Item Attribute

Item attributes define particular aspects of items, e.g. "usable in battle" or "consumable".

```ts
export interface ItemAttribute {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** A list of items that have this attribute */
  items: NamedAPIResource[];
  /** The name of this item attribute listed in different languages */
  names: Name[];
  /** The description of this item attribute listed in different languages */
  descriptions: Description[];
}
```

## Item Category

Item categories determine where items will be placed in the players bag.

```ts
export interface ItemCategory {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** A list of items that are a part of this category */
  items: NamedAPIResource[];
  /** The name of this item category listed in different languages */
  names: Name[];
  /** The pocket items in this category would be put in */
  pocket: NamedAPIResource;
}
```

## Item Fling Effect

The various effects of the move "Fling" when used with different items.

```ts
export interface ItemFlingEffect {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** The result of this fling effect listed in different languages */
  effect_entries: Effect[];
  /** A list of items that have this fling effect */
  items: NamedAPIResource[];
}
```

## Item Pocket

Pockets within the players bag used for storing items by category.

```ts
export interface ItemPocket {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** A list of item categories that are relevant to this item pocket */
  categories: NamedAPIResource[];
  /** The name of this resource listed in different languages */
  names: Name[];
}
```

## Item

An item is an object in the games which the player can pick up, keep in their bag, and use in some manner.
They have various uses, including healing, powering up, helping catch Pokémon, or to access a new area.

```ts
export interface Item {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** The price of this item in stores */
  cost: number;
  /** The power of the move Fling when used with this item. */
  fling_power: number;
  /** The effect of the move Fling when used with this item */
  fling_effect: NamedAPIResource;
  /** A list of attributes this item has */
  attributes: NamedAPIResource[];
  /** The category of items this item falls into */
  category: NamedAPIResource;
  /** The effect of this ability listed in different languages */
  effect_entries: VerboseEffect[];
  /** The flavor text of this ability listed in different languages */
  flavor_text_entries: VersionGroupFlavorText[];
  /** A list of game indices relevent to this item by generation */
  game_indices: GenerationGameIndex[];
  /** The name of this item listed in different languages */
  names: Name[];
  /** A set of sprites used to depict this item in the game */
  sprites: ItemSprites;
  /** A list of Pokémon that might be found in the wild holding this item */
  held_by_pokemon: ItemHolderPokemon[];
  /** An evolution chain this item requires to produce a bay during mating */
  baby_trigger_for: APIResource;
  /** A list of the machines related to this item */
  machines: MachineVersionDetail[];
}
```

> Check out [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Item) for greater detail.
