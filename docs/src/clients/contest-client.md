# Contest Client

Covers the PokéAPI's [contests section](https://pokeapi.co/docs/v2#contests-section): contest
types, and the effects moves have in normal and super contests.

```ts
import { ContestClient } from 'pokenode-ts';

const api = new ContestClient();

const tough = await api.getContestTypeByName('tough');

console.log(tough.berry_flavor.name); // "bitter"
```

## Methods

### Contest types

| Method | Returns |
| --- | --- |
| `getContestTypeByName(name)` | `ContestType` |
| `getContestTypeById(id)` | `ContestType` |
| `listContestTypes(offset?, limit?)` | `NamedAPIResourceList` |

### Contest effects

| Method | Returns |
| --- | --- |
| `getContestEffectById(id)` | `ContestEffect` |
| `listContestEffects(offset?, limit?)` | `NamedAPIResourceList` |

### Super contest effects

| Method | Returns |
| --- | --- |
| `getSuperContestEffectById(id)` | `SuperContestEffect` |
| `listSuperContestEffects(offset?, limit?)` | `NamedAPIResourceList` |

::: info
Contest effects have no names upstream — the PokéAPI only addresses them by id, which is why there
is no `getContestEffectByName`.
:::

## Using constants

```ts
import { ContestClient, CONTEST_TYPES } from 'pokenode-ts';

const api = new ContestClient();

const cool = await api.getContestTypeById(CONTEST_TYPES.COOL);
```
