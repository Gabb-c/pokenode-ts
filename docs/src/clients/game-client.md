---
description: "Fetch generations, pokédexes, and game versions from the PokéAPI games section with the typed GameClient."
---

# Game Client

Covers the PokéAPI's [games section](https://pokeapi.co/docs/v2#games-section): generations,
pokédexes, and game versions.

```ts
import { GameClient } from 'pokenode-ts';

const api = new GameClient();

const national = await api.getPokedexByName('national');

console.log(national.pokemon_entries.length); // every species, in national order
```

## Methods

### Generations

| Method | Returns |
| --- | --- |
| `getGenerationByName(name)` | `Generation` |
| `getGenerationById(id)` | `Generation` |
| `listGenerations(offset?, limit?)` | `NamedAPIResourceList` |

### Pokédexes

| Method | Returns |
| --- | --- |
| `getPokedexByName(name)` | `Pokedex` |
| `getPokedexById(id)` | `Pokedex` |
| `listPokedexes(offset?, limit?)` | `NamedAPIResourceList` |

### Versions

| Method | Returns |
| --- | --- |
| `getVersionByName(name)` | `Version` |
| `getVersionById(id)` | `Version` |
| `listVersions(offset?, limit?)` | `NamedAPIResourceList` |

### Version groups

| Method | Returns |
| --- | --- |
| `getVersionGroupByName(name)` | `VersionGroup` |
| `getVersionGroupById(id)` | `VersionGroup` |
| `listVersionGroups(offset?, limit?)` | `NamedAPIResourceList` |

::: info Versions vs. version groups
A **version** is one game — `red`, `scarlet`. A **version group** is the set released together and
sharing mechanics — `red-blue`, `scarlet-violet`. Move learnsets and encounters are keyed by
version group, so that is usually the one you want.
:::

## Using constants

```ts
import { GameClient, GENERATIONS, POKEDEXES, VERSIONS, VERSION_GROUPS } from 'pokenode-ts';

const api = new GameClient();

const kanto = await api.getGenerationById(GENERATIONS.GENERATION_I);
const national = await api.getPokedexById(POKEDEXES.NATIONAL);
```
