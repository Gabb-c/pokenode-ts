---
description: "Fetch berries, their firmness, and their flavors from the PokéAPI berries section with the typed BerryClient."
---

# Berry Client

Covers the PokéAPI's [berries section](https://pokeapi.co/docs/v2#berries-section): berries
themselves, their firmness, and their flavors.

```ts
import { BerryClient } from 'pokenode-ts';

const api = new BerryClient();

const cheri = await api.getBerryByName('cheri');

console.log(cheri.firmness.name); // "soft"
console.log(cheri.growth_time); // 3
```

## Methods

### Berries

| Method | Returns |
| --- | --- |
| `getBerryByName(name)` | `Berry` |
| `getBerryById(id)` | `Berry` |
| `listBerries(offset?, limit?)` | `NamedAPIResourceList` |

### Firmnesses

| Method | Returns |
| --- | --- |
| `getBerryFirmnessByName(name)` | `BerryFirmness` |
| `getBerryFirmnessById(id)` | `BerryFirmness` |
| `listBerryFirmnesses(offset?, limit?)` | `NamedAPIResourceList` |

### Flavors

| Method | Returns |
| --- | --- |
| `getBerryFlavorByName(name)` | `BerryFlavor` |
| `getBerryFlavorById(id)` | `BerryFlavor` |
| `listBerryFlavors(offset?, limit?)` | `NamedAPIResourceList` |

## Using constants

`BERRIES`, `BERRY_FIRMNESSES`, and `BERRY_FLAVORS` map names to their ids, so you can address a
berry by id without looking it up:

```ts
import { BerryClient, BERRIES } from 'pokenode-ts';

const api = new BerryClient();

const aspear = await api.getBerryById(BERRIES.ASPEAR); // BERRIES.ASPEAR === 5
```

::: tip
Fields like `firmness` and `item` are references, not full resources — `{ name, url }`. To follow
one, hand its `url` to
[`UtilityClient#getResourceByUrl`](/clients/utility-client#following-a-resource-url).
:::
