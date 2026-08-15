# Move Client

Covers the PokéAPI's [moves section](https://pokeapi.co/docs/v2#moves-section): moves, and the
ailments, categories, damage classes, learn methods, targets, and battle styles that describe them.

```ts
import { MoveClient } from 'pokenode-ts';

const api = new MoveClient();

const surf = await api.getMoveByName('surf');

console.log(surf.type.name); // "water"
console.log(surf.power); // base power, or null for a status move
console.log(surf.damage_class?.name); // "special"
```

::: warning
`power`, `accuracy`, `pp`, and `damage_class` are nullable — a status move has no power, and some
older entries have no damage class. The types say so, so `strictNullChecks` will make you handle it.
:::

## Methods

### Moves

| Method | Returns |
| --- | --- |
| `getMoveByName(name)` | `Move` |
| `getMoveById(id)` | `Move` |
| `listMoves(offset?, limit?)` | `NamedAPIResourceList` |

### Ailments

| Method | Returns |
| --- | --- |
| `getMoveAilmentByName(name)` | `MoveAilment` |
| `getMoveAilmentById(id)` | `MoveAilment` |
| `listMoveAilments(offset?, limit?)` | `NamedAPIResourceList` |

### Categories

| Method | Returns |
| --- | --- |
| `getMoveCategoryByName(name)` | `MoveCategory` |
| `getMoveCategoryById(id)` | `MoveCategory` |
| `listMoveCategories(offset?, limit?)` | `NamedAPIResourceList` |

### Damage classes

| Method | Returns |
| --- | --- |
| `getMoveDamageClassByName(name)` | `MoveDamageClass` |
| `getMoveDamageClassById(id)` | `MoveDamageClass` |
| `listMoveDamageClasses(offset?, limit?)` | `NamedAPIResourceList` |

### Learn methods

| Method | Returns |
| --- | --- |
| `getMoveLearnMethodByName(name)` | `MoveLearnMethod` |
| `getMoveLearnMethodById(id)` | `MoveLearnMethod` |
| `listMoveLearnMethods(offset?, limit?)` | `NamedAPIResourceList` |

### Targets

| Method | Returns |
| --- | --- |
| `getMoveTargetByName(name)` | `MoveTarget` |
| `getMoveTargetById(id)` | `MoveTarget` |
| `listMoveTargets(offset?, limit?)` | `NamedAPIResourceList` |

### Battle styles

| Method | Returns |
| --- | --- |
| `getMoveBattleStyleByName(name)` | `MoveBattleStyle` |
| `getMoveBattleStyleById(id)` | `MoveBattleStyle` |
| `listMoveBattleStyles(offset?, limit?)` | `NamedAPIResourceList` |

::: info Categories vs. damage classes
A **damage class** is how the damage is calculated — `physical`, `special`, `status`. A **category**
is what the move is for — `damage`, `ailment`, `damage-heal`, `swagger`. They are independent.
:::

## Using constants

```ts
import { MoveClient, MOVE_DAMAGE_CLASSES, MOVE_CATEGORIES, MOVE_AILMENTS } from 'pokenode-ts';

const api = new MoveClient();

const special = await api.getMoveDamageClassById(MOVE_DAMAGE_CLASSES.SPECIAL);
```

`MOVE_LEARN_METHODS`, `MOVE_TARGETS`, and `MOVE_BATTLE_STYLES` are available too.

## Which Pokémon learn a move

`Move.learned_by_pokemon` is a list of references. Going the other way — every move one Pokémon
learns, with the level and method — is `Pokemon.moves` on the
[Pokemon Client](/clients/pokemon-client).

```ts
const thunderbolt = await api.getMoveByName('thunderbolt');

console.log(thunderbolt.learned_by_pokemon.map((pokemon) => pokemon.name));
```
