---
description: "Install pokenode-ts and make your first typed PokéAPI request — zero runtime dependencies, native fetch, and types that ship with the package."
---

# Getting Started

Pokenode-ts is a typed client for the [PokéAPI](https://pokeapi.co/docs/v2), with no runtime
dependencies. Requests go through the platform's native `fetch`.

## Requirements

A runtime with a global `fetch`: Node 22 or newer, Deno, Bun, any current browser, or an edge
runtime such as Cloudflare Workers or Vercel Edge.

TypeScript is optional. Types ship with the package, so JavaScript users get editor autocomplete
without installing anything extra.

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

`pokemon` is a fully typed `Pokemon`, so a typo in `base_experience` is a build error rather than
`undefined` at runtime.

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

Working across sections? [`MainClient`](/clients/main-client) bundles all twelve and gives them a
**single shared cache**, so a Pokémon fetched through one is served from memory by another:

```ts
import { MainClient } from 'pokenode-ts';

const api = new MainClient();

const pokemon = await api.pokemon.getPokemonByName('luxray');
const berry = await api.berry.getBerryByName('cheri');
```

## Following links

PokéAPI responses reference other resources instead of nesting them, as `{ name, url }` pairs. Links
know what they point at, so following one is typed without you naming anything:

```ts
const pokemon = await api.pokemon.getPokemonByName('luxray');

const species = await api.resolve(pokemon.species);
//    ^? PokemonSpecies

const types = await api.resolveAll(pokemon.types.map((slot) => slot.type));
//    ^? Type[]
```

`resolve()` and `resolveAll()` are on every client, not just `MainClient`. See the
[Utility Client](/clients/utility-client).

## Fetching a list

List methods take an optional `offset` and `limit`, and return links rather than full resources:

```ts
const page = await api.pokemon.listPokemons(0, 20);

page.count; // total number of Pokémon
page.results[0]; // { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
```

`paginate()` walks every page for you, and can resolve each link as it goes. See
[Pagination](/guides/pagination).

## Using constants

The PokéAPI addresses most resources by name *or* numeric id. Pokenode-ts ships the ids as named
constants:

```ts
import { BerryClient, BERRIES } from 'pokenode-ts';

const api = new BerryClient();

BERRIES.ASPEAR; // 5

const aspear = await api.getBerryById(BERRIES.ASPEAR);
```

Every constant is also under a single `CONSTANTS` namespace, which keeps imports short when you use
several:

```ts
import { CONSTANTS } from 'pokenode-ts';

CONSTANTS.BERRIES.ASPEAR; // 5
CONSTANTS.TYPES.FIRE; // 10
CONSTANTS.LANGUAGES.EN; // 9
```

::: tip
Names and ids are percent-encoded on the way into the URL, so a value taken straight off a request —
`getPokemonByName(req.query.name)` — can only address the resource it names. A name carrying a `?`
or a `/` comes back as a 404 rather than as some other endpoint's response.
:::

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

Use the `isPokenodeError` guard rather than `instanceof`. See [Errors](/guides/errors) for why, and
for what isn't wrapped.

## Configuring a client

Every client takes the same options object:

```ts
import { PokemonClient, MemoryCache, consoleLogger } from 'pokenode-ts';

const api = new PokemonClient({
  cache: new MemoryCache({ ttl: 60_000, maxEntries: 100 }),
  logger: consoleLogger,
  baseURL: 'https://pokeapi.co/api/v2',
  retry: { attempts: 3 },
  revalidate: true,
});
```

| Option | Default | Guide |
| --- | --- | --- |
| `cache` | An in-memory LRU store, 5 minute TTL | [Cache](/guides/cache) |
| `logger` | None — nothing is logged | [Logging](/guides/logging) |
| `fetch` | The global `fetch` | [Custom Fetch](/guides/fetch) |
| `retry` | Off — each request is attempted once | [Retries](/guides/fetch#retries) |
| `revalidate` | Off — an expired entry is downloaded again in full | [Revalidation](/guides/cache#revalidation) |
| `baseURL` | `https://pokeapi.co/api/v2` | Point at a self-hosted PokéAPI |

Timeouts and signals aren't on this list. They belong to a unit of work rather than to a
long-lived client, so you attach them with `with()`:

```ts
const scoped = api.with({ signal: request.signal, timeout: 2000 });

const pokemon = await scoped.getPokemonByName('luxray');
```

The derived client shares the original's cache and in-flight requests, so scoping costs no extra
round trips. See [Cancellation](/guides/cancellation).

::: tip Self-hosting the API
The PokéAPI asks that you cache aggressively and, for anything heavy, [run your own
instance](https://github.com/PokeAPI/pokeapi#docker). `baseURL` is how you point at it.
:::

## Coming from 1.x?

Version 2.0 replaced Axios with native `fetch`. Method names, arguments, and return types are
unchanged; options and error handling are not. See [Migrating to 2.0](/guides/migration).

## Leave your feedback

- Did you like pokenode-ts? [Give us a star ⭐](https://github.com/Gabb-c/pokenode-ts)
- Found a problem? Let us know by [creating an issue 🔎📑](https://github.com/Gabb-c/pokenode-ts/issues)
- Want to contribute? [Read the contributing guide](/guides/contributing)
