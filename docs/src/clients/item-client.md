# Item Client

Covers the PokéAPI's [items section](https://pokeapi.co/docs/v2#items-section): items, and the
categories, pockets, attributes, and fling effects that classify them.

```ts
import { ItemClient } from 'pokenode-ts';

const api = new ItemClient();

const masterBall = await api.getItemByName('master-ball');

console.log(masterBall.cost); // 0 — it can't be bought
console.log(masterBall.category.name); // "standard-balls"
```

## Methods

### Items

| Method | Returns |
| --- | --- |
| `getItemByName(name)` | `Item` |
| `getItemById(id)` | `Item` |
| `listItems(offset?, limit?)` | `NamedAPIResourceList` |

### Categories

| Method | Returns |
| --- | --- |
| `getItemCategoryByName(name)` | `ItemCategory` |
| `getItemCategoryById(id)` | `ItemCategory` |
| `listItemCategories(offset?, limit?)` | `NamedAPIResourceList` |

### Pockets

| Method | Returns |
| --- | --- |
| `getItemPocketByName(name)` | `ItemPocket` |
| `getItemPocketById(id)` | `ItemPocket` |
| `listItemPockets(offset?, limit?)` | `NamedAPIResourceList` |

### Attributes

| Method | Returns |
| --- | --- |
| `getItemAttributeByName(name)` | `ItemAttribute` |
| `getItemAttributeById(id)` | `ItemAttribute` |
| `listItemAttributes(offset?, limit?)` | `NamedAPIResourceList` |

### Fling effects

| Method | Returns |
| --- | --- |
| `getItemFlingEffectByName(name)` | `ItemFlingEffect` |
| `getItemFlingEffectById(id)` | `ItemFlingEffect` |
| `listItemFlingEffects(offset?, limit?)` | `NamedAPIResourceList` |

::: info Categories vs. pockets
A **pocket** is a bag tab — `misc`, `medicine`, `pokeballs`. A **category** is finer grained —
`standard-balls`, `healing`, `vitamins` — and every category belongs to a pocket.
:::

## Using constants

```ts
import { ItemClient, ITEM_POCKETS, ITEM_CATEGORIES, ITEM_ATTRIBUTES } from 'pokenode-ts';

const api = new ItemClient();

const pocket = await api.getItemPocketById(ITEM_POCKETS.MISC);
```

`ITEM_FLING_EFFECTS` is available too.
