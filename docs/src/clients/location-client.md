# Location Client

Covers the PokéAPI's [locations section](https://pokeapi.co/docs/v2#locations-section): regions,
locations, the areas inside them, and Pal Park.

```ts
import { LocationClient } from 'pokenode-ts';

const api = new LocationClient();

const kanto = await api.getRegionByName('kanto');

console.log(kanto.locations.length); // every location in Kanto
```

## Methods

### Regions

| Method | Returns |
| --- | --- |
| `getRegionByName(name)` | `Region` |
| `getRegionById(id)` | `Region` |
| `listRegions(offset?, limit?)` | `NamedAPIResourceList` |

### Locations

| Method | Returns |
| --- | --- |
| `getLocationByName(name)` | `Location` |
| `getLocationById(id)` | `Location` |
| `listLocations(offset?, limit?)` | `NamedAPIResourceList` |

### Location areas

| Method | Returns |
| --- | --- |
| `getLocationAreaByName(name)` | `LocationArea` |
| `getLocationAreaById(id)` | `LocationArea` |
| `listLocationAreas(offset?, limit?)` | `NamedAPIResourceList` |

### Pal Park areas

| Method | Returns |
| --- | --- |
| `getPalParkAreaByName(name)` | `PalParkArea` |
| `getPalParkAreaById(id)` | `PalParkArea` |
| `listPalParkAreas(offset?, limit?)` | `NamedAPIResourceList` |

::: info Locations vs. location areas
A **location** is a place on the map — `viridian-forest`. A **location area** is a subdivision of
it that encounters are actually keyed to — `viridian-forest-area`. Wild encounter tables hang off
areas, not locations.
:::

## Using constants

```ts
import { LocationClient, REGIONS, PAL_PARK_AREAS } from 'pokenode-ts';

const api = new LocationClient();

const kanto = await api.getRegionById(REGIONS.KANTO);
const forest = await api.getPalParkAreaById(PAL_PARK_AREAS.FOREST);
```

## Finding what appears in an area

`LocationArea.pokemon_encounters` lists the species met there, with the conditions and chance for
each version:

```ts
const area = await api.getLocationAreaByName('viridian-forest-area');

for (const encounter of area.pokemon_encounters) {
  console.log(encounter.pokemon.name);
}
```

Going the other way — from a Pokémon to where it is found — is
[`PokemonClient#getPokemonLocationAreaById`](/clients/pokemon-client#encounters).
