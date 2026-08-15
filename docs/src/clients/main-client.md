# Main Client

Bundles all eleven clients behind one object, and gives them a **single shared cache**.

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

This is the reason to use `MainClient` over constructing clients yourself. All eleven share one
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

## Options

`MainClient` takes the same [options](/guides/getting-started#configuring-a-client) as any client
and passes them to all eleven:

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
A shared store fills up faster than a per-client one, since eleven clients now compete for the same
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
eleven independent caches, so a resource fetched through `api.pokemon` was fetched again by
`api.utility`, and no request was ever deduplicated across them.
:::
