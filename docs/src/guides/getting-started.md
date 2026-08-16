---
description: "Install pokenode-ts and make your first typed PokéAPI request — zero runtime dependencies, native fetch, and types that ship with the package."
---

# Getting Started

Pokenode-ts is a typed client for the [PokéAPI](https://pokeapi.co/docs/v2). It has no runtime
dependencies — requests go through the platform's native `fetch`.

## Requirements

A runtime with a global `fetch`: Node 22 or newer, Deno, Bun, any current browser, or an edge
runtime such as Cloudflare Workers or Vercel Edge.

TypeScript is optional. The types ship with the package, so JavaScript users get editor
autocomplete without installing anything extra.

## Installation

::: code-group

```bash [npm]
npm install pokenode-ts
```

```bash [pnpm]
pnpm add pokenode-ts
```

```bash [yarn]
yarn add pokenode-ts
```

```bash [bun]
bun add pokenode-ts
```

:::

## Your first request

```ts
import { PokemonClient } from 'pokenode-ts';

const api = new PokemonClient();

const pokemon = await api.getPokemonByName('luxray');

console.log(pokemon.name); // "luxray"
console.log(pokemon.types.map((slot) => slot.type.name)); // ["electric"]
```

`pokemon` is a fully typed `Pokemon` — every field is checked at compile time, so a typo in
`base_experience` is a build error rather than `undefined` at runtime.

## Picking a client

There are twelve focused clients, one per section of the PokéAPI:

| Client | Covers |
| --- | --- |
| [`PokemonClient`](/clients/pokemon-client) | Pokémon, species, forms, abilities, types, stats, natures |
| [`BerryClient`](/clients/berry-client) | Berries, firmnesses, flavors |
| [`ContestClient`](/clients/contest-client) | Contest types and effects |
| [`CurrencyClient`](/clients/currency-client) | Currencies items are priced in |
| [`EncounterClient`](/clients/encounter-client) | Encounter methods and conditions |
| [`EvolutionClient`](/clients/evolution-client) | Evolution chains and triggers |
| [`GameClient`](/clients/game-client) | Generations, pokédexes, versions |
| [`ItemClient`](/clients/item-client) | Items, categories, pockets, attributes |
| [`LocationClient`](/clients/location-client) | Locations, areas, regions, Pal Park |
| [`MachineClient`](/clients/machine-client) | TMs and HMs |
| [`MoveClient`](/clients/move-client) | Moves, ailments, damage classes, targets |
| [`UtilityClient`](/clients/utility-client) | Languages, and following any resource URL |

Import only the one you need — the rest is tree-shaken away.

If you need several sections, [`MainClient`](/clients/main-client) bundles all twelve and gives
them a **single shared cache**, so a Pokémon fetched through one is served from memory by another:

```ts
import { MainClient } from 'pokenode-ts';

const api = new MainClient();

const pokemon = await api.pokemon.getPokemonByName('luxray');
const berry = await api.berry.getBerryByName('cheri');
```

## Fetching a list

Every list method takes an optional `offset` and `limit`, matching the PokéAPI's own pagination.
It returns references, not full resources:

```ts
const page = await api.listPokemons(0, 20);

console.log(page.count); // total number of Pokémon
console.log(page.results[0]); // { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
```

To turn a reference into the resource it points at, hand its `url` to the
[`UtilityClient`](/clients/utility-client):

```ts
import { UtilityClient, type Pokemon } from 'pokenode-ts';

const utility = new UtilityClient();
const bulbasaur = await utility.getResourceByUrl<Pokemon>(page.results[0].url);
```

## Using constants

The PokéAPI addresses most resources by name *or* by numeric id. Pokenode-ts ships the ids as
named constants so you don't have to look them up:

```ts
import { BerryClient, BERRIES } from 'pokenode-ts';

const api = new BerryClient();

console.log(BERRIES.ASPEAR); // 5

const aspear = await api.getBerryById(BERRIES.ASPEAR);
```

Every constant is also reachable under a single `CONSTANTS` namespace, which keeps your imports
short when you use several:

```ts
import { CONSTANTS } from 'pokenode-ts';

CONSTANTS.BERRIES.ASPEAR; // 5
CONSTANTS.TYPES.FIRE; // 10
CONSTANTS.LANGUAGES.EN; // 9
```

## Handling failures

A non-2xx response rejects with a `PokenodeError` carrying the status and body:

```ts
import { PokemonClient, PokenodeError } from 'pokenode-ts';

try {
  await new PokemonClient().getPokemonByName('missingno');
} catch (error) {
  if (PokenodeError.isPokenodeError(error)) {
    console.log(error.status); // 404
  }
}
```

See the [Errors guide](/guides/errors) for the full shape, and for why `isPokenodeError` is
preferred over `instanceof`.

## Configuring a client

Every client takes the same options object:

```ts
import { PokemonClient, MemoryCache, consoleLogger } from 'pokenode-ts';

const api = new PokemonClient({
  cache: new MemoryCache({ ttl: 60_000, maxEntries: 100 }),
  logger: consoleLogger,
  baseURL: 'https://pokeapi.co/api/v2',
  fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(5000) }),
});
```

| Option | Default | Guide |
| --- | --- | --- |
| `cache` | An in-memory LRU store, 5 minute TTL | [Cache](/guides/cache) |
| `logger` | None — nothing is logged | [Logging](/guides/logging) |
| `fetch` | The global `fetch` | [Custom Fetch](/guides/fetch) |
| `baseURL` | `https://pokeapi.co/api/v2` | Point at a self-hosted PokéAPI |

::: tip Self-hosting the API
The PokéAPI asks that you cache aggressively and, for anything heavy, [run your own
instance](https://github.com/PokeAPI/pokeapi#docker). `baseURL` is how you point at it.
:::

## Following links

PokéAPI responses reference other resources instead of nesting them — `{ name, url }` pairs. Those
links know what they point at, so following one is typed without you naming anything:

```ts
import { MainClient } from 'pokenode-ts';

const api = new MainClient();

const pokemon = await api.pokemon.getPokemonByName('luxray');
const species = await api.utility.getResourceByUrl(pokemon.species);
//    ^? PokemonSpecies

const chain = await api.utility.getResourceByUrl(species.evolution_chain);
//    ^? EvolutionChain
```

Because `MainClient` shares one cache across its twelve sub-clients, a resource reached this way is
served from memory if any of them fetched it already. See the
[Utility Client](/clients/utility-client) for the details, including what happens with a bare URL
string.

## Coming from 1.x?

Version 2.0 replaced Axios with native `fetch`. Method names, arguments, and return types are
unchanged; options and error handling are not. See [Migrating to 2.0](/guides/migration).

## Leave your feedback

- Did you like pokenode-ts? [Give us a star ⭐](https://github.com/Gabb-c/pokenode-ts)
- Found a problem? Let us know by [creating an issue 🔎📑](https://github.com/Gabb-c/pokenode-ts/issues)
- Want to contribute? [Read the contributing guide](/guides/contributing)
