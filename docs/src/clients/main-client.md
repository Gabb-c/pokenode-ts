---
description: "MainClient bundles all twelve pokenode-ts clients behind one object, sharing a single cache so a resource fetched through one is served from cache by the rest."
---

# Main Client

Bundles all twelve clients behind one object, and gives them a **single shared cache**.

```ts
import { MainClient } from 'pokenode-ts';

const api = new MainClient();

const pikachu = await api.pokemon.getPokemonByName('pikachu');
const cheri = await api.berry.getBerryByName('cheri');
const surf = await api.move.getMoveByName('surf');
```

## Sub-clients

| Property | Client |
| --- | --- |
| `api.berry` | [`BerryClient`](/clients/berry-client) |
| `api.contest` | [`ContestClient`](/clients/contest-client) |
| `api.currency` | [`CurrencyClient`](/clients/currency-client) |
| `api.encounter` | [`EncounterClient`](/clients/encounter-client) |
| `api.evolution` | [`EvolutionClient`](/clients/evolution-client) |
| `api.game` | [`GameClient`](/clients/game-client) |
| `api.item` | [`ItemClient`](/clients/item-client) |
| `api.location` | [`LocationClient`](/clients/location-client) |
| `api.machine` | [`MachineClient`](/clients/machine-client) |
| `api.move` | [`MoveClient`](/clients/move-client) |
| `api.pokemon` | [`PokemonClient`](/clients/pokemon-client) |
| `api.utility` | [`UtilityClient`](/clients/utility-client) |

Each is the same class you would construct directly, with the same methods.

## One cache for everything

This is the reason to use `MainClient` over constructing clients yourself. All twelve share one
store, so a resource fetched through any of them is served from memory by the rest:

```ts
const api = new MainClient();

const species = await api.pokemon.getPokemonSpeciesByName('eevee');

// Already in the cache from the call above — no second request.
const same = await api.utility.getResourceByUrl(
  'https://pokeapi.co/api/v2/pokemon-species/eevee',
);
```

Construct the clients separately and you get a separate cache each, which is usually not what you
want:

```ts
// Two caches. The same berry is fetched twice.
const berry = new BerryClient();
const main = new MainClient();
```

## Resolving links

Most of what the PokéAPI returns is links. `resolve()` fetches what one points at, through the same
shared cache — and the link carries its own type, so nothing needs to be named:

```ts
const pokemon = await api.pokemon.getPokemonByName('luxray');

const species = await api.resolve(pokemon.species);
//    ^? PokemonSpecies
```

`resolveAll()` takes many, and hands them back in the order you gave them:

```ts
const types = await api.resolveAll(pokemon.types.map((slot) => slot.type));
//    ^? Type[]
```

At most four run at a time, because a Pokémon's worth of links is a lot of requests at once and the
[PokéAPI fair-use policy](https://pokeapi.co/docs/v2#fairuse) asks clients to be gentle. Raise it
when you are pointed at a local instance:

```ts
await api.resolveAll(links, { concurrency: 16 });
```

The first failure rejects and no further link is fetched. To walk a whole list rather than a known
set of links, see [Pagination](/guides/pagination).

::: tip
`api.resolve(link)` and `api.utility.getResourceByUrl(link)` do the same thing — the first is just
where you would look for it.
:::

## Scoping a request

`with()` derives a client whose requests carry a signal, a timeout, or both — across all twelve
sections at once, which is usually what a server handler wants:

```ts
const scoped = api.with({ signal: request.signal, timeout: 2000 });

const pokemon = await scoped.pokemon.getPokemonByName('luxray');
const species = await scoped.resolve(pokemon.species);
```

The derived client shares this one's cache and its in-flight requests, and leaves it untouched.
Derive one per unit of work rather than per call. See [Cancellation](/guides/cancellation).

## Options

`MainClient` takes the same [options](/guides/getting-started#configuring-a-client) as any client
and passes them to all twelve:

```ts
import { MainClient, MemoryCache, consoleLogger } from 'pokenode-ts';

const api = new MainClient({
  cache: new MemoryCache({ ttl: 60_000, maxEntries: 1000 }),
  logger: consoleLogger,
});
```

Pass a `cache` and every sub-client uses that one store. Pass `cache: false` and caching is off
everywhere.

::: tip
A shared store fills up faster than a per-client one, since twelve clients now compete for the same
`maxEntries`. If you use `MainClient` heavily, raise it.
:::

## Clearing the cache

`clearCache()` empties the shared store, so it clears for every sub-client at once:

```ts
await api.clearCache();
```

The store itself is exposed as `api.cache` — it is the same object as `api.berry.cache`, and it is
`undefined` when caching is disabled. See the [Cache guide](/guides/cache).

## Not a BaseClient

::: warning Changed in 2.0
`MainClient` no longer extends `BaseClient`, so `mainClient instanceof BaseClient` is now `false`.

It composes its sub-clients instead of inheriting from them. Under the old arrangement it built
twelve independent caches, so a resource fetched through `api.pokemon` was fetched again by
`api.utility`, and no request was ever deduplicated across them.
:::
