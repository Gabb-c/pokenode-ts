---
description: "MainClient bundles all twelve pokenode-ts clients behind one object, sharing one transport so a resource fetched through one is served from cache by the rest."
---

# Main Client

Bundles all twelve clients behind one object, and gives them a **single shared transport**.

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

Each is the same class you'd construct directly, with the same methods.

## One transport for everything

This is the reason to reach for `MainClient`. All twelve share one cache, one set of `ETag`
validators, and one set of requests already on the wire:

```ts
const api = new MainClient();

const species = await api.pokemon.getPokemonSpeciesByName('eevee');

// Already cached by the call above — no second request.
const same = await api.utility.getResourceByUrl(
  'https://pokeapi.co/api/v2/pokemon-species/eevee',
);
```

Two sections asking for the same URL at the same time make one round trip:

```ts
const url = 'https://pokeapi.co/api/v2/berry/1';

// One request. The second call joins the first.
await Promise.all([api.berry.resolve(url), api.pokemon.resolve(url)]);
```

Construct clients separately and each gets its own transport, which is usually not what you want:

```ts
// Two transports. The same berry is fetched twice.
const berry = new BerryClient();
const main = new MainClient();
```

## Resolving links

Most of what the PokéAPI returns is links. `resolve()` fetches what one points at, through the same
shared cache, and the link carries its own type:

```ts
const pokemon = await api.pokemon.getPokemonByName('luxray');

const species = await api.resolve(pokemon.species);
//    ^? PokemonSpecies
```

`resolveAll()` takes many and returns them in the order you gave them:

```ts
const types = await api.resolveAll(pokemon.types.map((slot) => slot.type));
//    ^? Type[]
```

At most four run at a time, since a Pokémon's worth of links is a lot of requests at once and the
[PokéAPI fair-use policy](https://pokeapi.co/docs/v2#fairuse) asks clients to go easy. Raise it
against a local instance:

```ts
await api.resolveAll(links, { concurrency: 16 });
```

The first failure rejects and no further link is fetched. To walk a whole list instead of a known
set of links, see [Pagination](/guides/pagination).

::: tip
Within one `MainClient`, `api.resolve(link)`, `api.utility.getResourceByUrl(link)` and
`api.pokemon.resolve(link)` all go through the same transport, so it makes no difference which you
call. Construct a section client yourself and it carries its own transport — then the receiver does
decide the cache, the scope and the `baseURL`.
:::

## Scoping a request

`with()` derives a client whose requests carry a signal, a timeout, or both, across all twelve
sections at once:

```ts
const scoped = api.with({ signal: request.signal, timeout: 2000 });

const pokemon = await scoped.pokemon.getPokemonByName('luxray');
const species = await scoped.resolve(pokemon.species);
```

The derived client shares this one's transport and leaves it untouched. Derive one per unit of work
rather than per call — see [Cancellation](/guides/cancellation).

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

Pass a `cache` and every sub-client uses that store. Pass `cache: false` and caching is off
everywhere.

::: tip
A shared store fills up faster than a per-client one, since twelve clients compete for the same
`maxEntries`. Raise it if you use `MainClient` heavily.
:::

## Clearing the cache

`clearCache()` empties the shared store, so it clears for every sub-client at once:

```ts
await api.clearCache();
```

`api.berry.clearCache()` does the same thing for the same reason. Prefer `api.clearCache()`, which
says what actually happens.

The store is exposed as `api.cache` — the same object as `api.berry.cache`, and `undefined` when
caching is disabled. See the [Cache guide](/guides/cache).

::: warning Changed in 2.2
`api.cache` is now an accessor rather than a stored property. Reading it is unchanged, but it no
longer appears in `Object.keys(api)` or survives a `{ ...api }` spread.
:::

## Not a BaseClient

::: warning Changed in 2.0
`MainClient` no longer extends `BaseClient`, so `mainClient instanceof BaseClient` is now `false`.

It composes its sub-clients instead of inheriting from them. Under the old arrangement it built
twelve independent caches, so a resource fetched through `api.pokemon` was fetched again by
`api.utility`, and no request was ever deduplicated across them.
:::
