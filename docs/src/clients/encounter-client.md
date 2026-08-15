# Encounter Client

Covers the PokéAPI's [encounters section](https://pokeapi.co/docs/v2#encounters-section): how a
Pokémon can be met, and the conditions that change what appears.

```ts
import { EncounterClient } from 'pokenode-ts';

const api = new EncounterClient();

const surf = await api.getEncounterMethodByName('surf');

console.log(surf.order); // ordering used when displaying methods
```

## Methods

### Encounter methods

| Method | Returns |
| --- | --- |
| `getEncounterMethodByName(name)` | `EncounterMethod` |
| `getEncounterMethodById(id)` | `EncounterMethod` |
| `listEncounterMethods(offset?, limit?)` | `NamedAPIResourceList` |

### Encounter conditions

| Method | Returns |
| --- | --- |
| `getEncounterConditionByName(name)` | `EncounterCondition` |
| `getEncounterConditionById(id)` | `EncounterCondition` |
| `listEncounterConditions(offset?, limit?)` | `NamedAPIResourceList` |

### Encounter condition values

| Method | Returns |
| --- | --- |
| `getEncounterConditionValueByName(name)` | `EncounterConditionValue` |
| `getEncounterConditionValueById(id)` | `EncounterConditionValue` |
| `listEncounterConditionValues(offset?, limit?)` | `NamedAPIResourceList` |

::: info Conditions vs. condition values
A **condition** is the variable — `time`, `season`, `swarm`. A **condition value** is one setting
of it — `time-day`, `season-winter`, `swarm-yes`. Encounters are described in terms of values.
:::

## Using constants

```ts
import { EncounterClient, ENCOUNTER_METHODS } from 'pokenode-ts';

const api = new EncounterClient();

const surf = await api.getEncounterMethodById(ENCOUNTER_METHODS.SURF);
```

`ENCOUNTER_CONDITIONS` and `ENCOUNTER_CONDITION_VALUES` are available too.

## Where a Pokémon can be found

Encounters for a specific Pokémon live on the [Pokemon Client](/clients/pokemon-client), not here:

```ts
import { PokemonClient } from 'pokenode-ts';

const encounters = await new PokemonClient().getPokemonLocationAreaById(25);

console.log(encounters[0].location_area.name);
```
