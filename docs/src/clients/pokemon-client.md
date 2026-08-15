---
description: "Fetch Pokémon, their species and forms, plus abilities, types, stats, and natures from the PokéAPI's largest section with the typed PokemonClient."
---

# Pokemon Client

Covers the PokéAPI's [Pokémon section](https://pokeapi.co/docs/v2#pokemon-section) — the largest
one. Pokémon themselves, their species and forms, plus abilities, types, stats, natures, and
everything else that describes them.

```ts
import { PokemonClient } from 'pokenode-ts';

const api = new PokemonClient();

const luxray = await api.getPokemonByName('luxray');

console.log(luxray.types.map((slot) => slot.type.name)); // ["electric"]
console.log(luxray.stats.map((stat) => `${stat.stat.name}: ${stat.base_stat}`));
```

## Methods

### Pokémon

| Method | Returns |
| --- | --- |
| `getPokemonByName(name)` | `Pokemon` |
| `getPokemonById(id)` | `Pokemon` |
| `listPokemons(offset?, limit?)` | `NamedAPIResourceList` |

### Species, forms, and classification

| Method | Returns |
| --- | --- |
| `getPokemonSpeciesByName(name)` | `PokemonSpecies` |
| `getPokemonSpeciesById(id)` | `PokemonSpecies` |
| `listPokemonSpecies(offset?, limit?)` | `NamedAPIResourceList` |
| `getPokemonFormByName(name)` | `PokemonForm` |
| `getPokemonFormById(id)` | `PokemonForm` |
| `listPokemonForms(offset?, limit?)` | `NamedAPIResourceList` |
| `getPokemonColorByName(name)` | `PokemonColor` |
| `getPokemonColorById(id)` | `PokemonColor` |
| `listPokemonColors(offset?, limit?)` | `NamedAPIResourceList` |
| `getPokemonHabitatByName(name)` | `PokemonHabitat` |
| `getPokemonHabitatById(id)` | `PokemonHabitat` |
| `listPokemonHabitats(offset?, limit?)` | `NamedAPIResourceList` |
| `getPokemonShapeByName(name)` | `PokemonShape` |
| `getPokemonShapeById(id)` | `PokemonShape` |
| `listPokemonShapes(offset?, limit?)` | `NamedAPIResourceList` |

### Abilities

| Method | Returns |
| --- | --- |
| `getAbilityByName(name)` | `Ability` |
| `getAbilityById(id)` | `Ability` |
| `listAbilities(offset?, limit?)` | `NamedAPIResourceList` |

### Types

| Method | Returns |
| --- | --- |
| `getTypeByName(name)` | `Type` |
| `getTypeById(id)` | `Type` |
| `listTypes(offset?, limit?)` | `NamedAPIResourceList` |

### Stats and characteristics

| Method | Returns |
| --- | --- |
| `getStatByName(name)` | `Stat` |
| `getStatById(id)` | `Stat` |
| `listStats(offset?, limit?)` | `NamedAPIResourceList` |
| `getCharacteristicById(id)` | `Characteristic` |
| `listCharacteristics(offset?, limit?)` | `NamedAPIResourceList` |
| `getPokeathlonStatByName(name)` | `PokeathlonStat` |
| `getPokeathlonStatById(id)` | `PokeathlonStat` |
| `listPokeathlonStats(offset?, limit?)` | `NamedAPIResourceList` |

### Breeding and growth

| Method | Returns |
| --- | --- |
| `getNatureByName(name)` | `Nature` |
| `getNatureById(id)` | `Nature` |
| `listNatures(offset?, limit?)` | `NamedAPIResourceList` |
| `getEggGroupByName(name)` | `EggGroup` |
| `getEggGroupById(id)` | `EggGroup` |
| `listEggGroups(offset?, limit?)` | `NamedAPIResourceList` |
| `getGenderByName(name)` | `Gender` |
| `getGenderById(id)` | `Gender` |
| `listGenders(offset?, limit?)` | `NamedAPIResourceList` |
| `getGrowthRateByName(name)` | `GrowthRate` |
| `getGrowthRateById(id)` | `GrowthRate` |
| `listGrowthRates(offset?, limit?)` | `NamedAPIResourceList` |

### Encounters

| Method | Returns |
| --- | --- |
| `getPokemonLocationAreaById(id)` | `LocationAreaEncounter[]` |

::: info
`getCharacteristicById` has no name counterpart — characteristics are unnamed upstream and are
addressed by id only.
:::

## Pokémon vs. species

This trips people up. A **species** is the conceptual creature and holds the flavor data:
evolution chain, egg groups, pokédex entries, whether it is legendary. A **Pokémon** is one
concrete variety of it and holds the battle data: stats, types, abilities, sprites, moves.

For most creatures they map one to one. For Deoxys, Rotom, or a regional form they don't — one
species, several Pokémon.

```ts
const species = await api.getPokemonSpeciesByName('deoxys');

console.log(species.varieties.map((variety) => variety.pokemon.name));
// deoxys-normal, deoxys-attack, deoxys-defense, deoxys-speed
```

Fields such as `evolution_chain`, `egg_groups`, `flavor_text_entries`, and `generation` live on the
species. Reach for `getPokemonSpeciesByName` when `getPokemonByName` doesn't have what you need.

## Encounters

`getPokemonLocationAreaById` is the odd one out — it returns an **array** rather than a single
resource, because it answers "where is this found" rather than "give me this thing":

```ts
const encounters = await api.getPokemonLocationAreaById(25);

for (const encounter of encounters) {
  console.log(encounter.location_area.name);
}
```

It only takes an id, matching the underlying `/pokemon/{id}/encounters` route.

::: warning
In 1.x this route was also reachable via `ENDPOINTS.POKEMON_LOCATION_AREA`. That constant is gone
in 2.0 — it held a `/pokemon/:id/encounters` template that never worked without a string
replacement. This method was always the supported route.
:::

## Using constants

```ts
import { PokemonClient, TYPES, STATS, NATURES, EGG_GROUPS } from 'pokenode-ts';

const api = new PokemonClient();

const fire = await api.getTypeById(TYPES.FIRE);
const speed = await api.getStatById(STATS.SPEED);
```

`GENDERS`, `GROWTH_RATES`, `POKEATHLON_STATS`, `POKEMON_COLORS`, `POKEMON_HABITATS`, and
`POKEMON_SHAPES` are available too.

## Sprites

`Pokemon.sprites` carries URLs to images, not the images themselves. Most fields are nullable —
not every Pokémon has every sprite, and older generations have fewer:

```ts
const pokemon = await api.getPokemonByName('luxray');

console.log(pokemon.sprites.front_default); // string | null
console.log(pokemon.sprites.other?.['official-artwork']?.front_default);
```
