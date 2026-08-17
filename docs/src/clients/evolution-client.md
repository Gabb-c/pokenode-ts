---
description: "Fetch evolution chains and the triggers that advance them from the PokéAPI evolution section with the typed EvolutionClient."
---

# Evolution Client

Covers the PokéAPI's [evolution section](https://pokeapi.co/docs/v2#evolution-section): evolution
chains, and the triggers that advance them.

```ts
import { EvolutionClient } from 'pokenode-ts';

const api = new EvolutionClient();

const chain = await api.getEvolutionChainById(1);

console.log(chain.chain.species.name); // "bulbasaur"
console.log(chain.chain.evolves_to[0].species.name); // "ivysaur"
```

## Methods

### Evolution chains

| Method | Returns |
| --- | --- |
| `getEvolutionChainById(id)` | `EvolutionChain` |
| `listEvolutionChains(offset?, limit?)` | `APIResourceList` |

### Evolution triggers

| Method | Returns |
| --- | --- |
| `getEvolutionTriggerByName(name)` | `EvolutionTrigger` |
| `getEvolutionTriggerById(id)` | `EvolutionTrigger` |
| `listEvolutionTriggers(offset?, limit?)` | `NamedAPIResourceList` |

::: info
Evolution chains have no names upstream, so there is no `getEvolutionChainByName`. To go from a
Pokémon to its chain, read `evolution_chain.url` off its species and follow it — see below.
:::

## Walking a chain

`EvolutionChain.chain` is a recursive `ChainLink`: each link carries the species at that stage and
an `evolves_to` array of the links after it. Branching evolutions — Eevee — are why it is an array
rather than a single value.

```ts
import { EvolutionClient, type ChainLink } from 'pokenode-ts';

const names = (link: ChainLink): string[] => [
  link.species.name,
  ...link.evolves_to.flatMap(names),
];

const chain = await new EvolutionClient().getEvolutionChainById(67);

console.log(names(chain.chain)); // eevee and every evolution it branches into
```

## From a Pokémon to its chain

The chain id is not the Pokémon id. Go through the species:

```ts
import { PokemonClient, EvolutionClient, UtilityClient, type EvolutionChain } from 'pokenode-ts';

const species = await new PokemonClient().getPokemonSpeciesByName('eevee');

// The species carries a URL rather than an id, so follow it directly.
const chain = await new UtilityClient().getResourceByUrl<EvolutionChain>(
  species.evolution_chain.url,
);
```

## Using constants

```ts
import { EvolutionClient, EVOLUTION_TRIGGERS } from 'pokenode-ts';

const api = new EvolutionClient();

const levelUp = await api.getEvolutionTriggerById(EVOLUTION_TRIGGERS.LEVEL_UP);
```
