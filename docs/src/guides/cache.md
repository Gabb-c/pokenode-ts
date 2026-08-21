---
description: "Configure response caching in pokenode-ts — the default in-memory LRU store, TTL and size tuning, or your own CacheStore backed by Redis or a KV namespace."
---

# Cache

Clients cache what they've already fetched, keyed by fully resolved URL, so repeated lookups of the
same resource skip the network.

## Basic usage

Caching is on by default, backed by an in-memory store. Configure it with the `cache` option:

```js
import { BerryClient, MemoryCache } from 'pokenode-ts';

// Default: 5 minute TTL, 500 entries
const api = new BerryClient();

// Tuned
const tuned = new BerryClient({
  cache: new MemoryCache({ ttl: 60_000, maxEntries: 100 }),
});

// Disabled
const uncached = new BerryClient({ cache: false });
```

```ts
interface MemoryCacheOptions {
  ttl?: number; // ms an entry stays fresh, default 300_000
  maxEntries?: number; // LRU ceiling, default 500, zero keeps nothing
}
```

## Bring your own store

Pass anything implementing `CacheStore` — Redis, a KV namespace, a file on disk. Every method may
return a promise, so remote backends work without an adapter:

```ts
interface CacheStore {
  get(key: string): unknown | Promise<unknown>;
  set(key: string, value: unknown): void | Promise<void>;
  delete?(key: string): void | Promise<void>;
  clear?(): void | Promise<void>;
}
```

Return `undefined` from `get` for a miss. Values arrive as parsed objects, so a remote store
serializes them itself, and expiry is the store's job:

```ts
import { PokemonClient, type CacheStore } from 'pokenode-ts';
import type Redis from 'ioredis';

class RedisStore implements CacheStore {
  constructor(
    private readonly redis: Redis,
    private readonly ttlSeconds = 300,
  ) {}

  async get(key: string): Promise<unknown> {
    const hit = await this.redis.get(`pokenode:${key}`);
    return hit ? JSON.parse(hit) : undefined;
  }

  async set(key: string, value: unknown): Promise<void> {
    await this.redis.set(`pokenode:${key}`, JSON.stringify(value), 'EX', this.ttlSeconds);
  }
}

const api = new PokemonClient({ cache: new RedisStore(redis) });
```

## Revalidation

An entry expiring doesn't mean the resource changed, and Pokémon data changes about as rarely as
anything on the web. With `revalidate`, an expired entry is checked instead of downloaded again:

```ts
const api = new MainClient({ revalidate: true });

// Sized: how many URLs to remember, 500 by default.
const sized = new MainClient({ revalidate: new EtagStore({ maxEntries: 2000 }) });
```

The client remembers the `ETag` each URL answered with, plus the body it identified. On a cache miss
it asks the API whether that validator still holds:

| Answer | What happens |
| --- | --- |
| `304 Not Modified` | The remembered body is reused. Nothing crosses the wire, and the cache is refilled from memory. |
| `200` | Body and `ETag` are both replaced. |

A `304` carrying a new `ETag` replaces the remembered one. The [logger](./logging) reports the
response as `source: 'revalidated'`, so you can count it separately from a full download.

`MainClient` builds one store for all twelve sections, so an `ETag` learned through `api.pokemon` is
used by `api.utility`.

::: tip
`EtagStore` is deliberately **not** a `CacheStore`. They answer different questions — "is this still
fresh?" versus "here's what it was, is that still current?" Keeping them apart means a store you own,
like a shared Redis, never gets a second key shape, and `cache.get(url)` keeps returning the resource
itself.
:::

::: warning
The store holds bodies in memory for as long as their URLs stay in it. That's the trade: bandwidth
and latency for memory. Size it for what you re-read, and leave `revalidate` off if cache misses are
already rare.
:::

A `304` answering a request that carried no validator — a proxy adding one of its own — rejects with
a `PokenodeError` of status `304`, since there's no stored body to pair it with.

## Browser storage

`WebStorageCache` keeps responses in `localStorage` or `sessionStorage`, so they survive a page
reload:

```ts
import { PokemonClient, WebStorageCache } from 'pokenode-ts';

const api = new PokemonClient({
  cache: new WebStorageCache({ storage: localStorage }),
});

// Tuned
const tuned = new PokemonClient({
  cache: new WebStorageCache({
    storage: sessionStorage,
    ttl: 60_000,
    prefix: 'pokedex:',
  }),
});
```

`storage` is required, since there's no browser global to fall back to on the server. Anything
matching `WebStorageLike` works, and every method may return a promise, so React Native's
`AsyncStorage` goes in directly:

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = new PokemonClient({
  cache: new WebStorageCache({ storage: AsyncStorage }),
});
```

- **Key enumeration** is the one place the two shapes differ. `Storage` has `length` and
  `key(index)`, `AsyncStorage` has `getAllKeys()`, and both are accepted. A storage offering neither
  still caches, it just never evicts or clears.
- **Only keys under `prefix`** (`pokenode:` by default) are ever touched, so eviction and
  `clearCache()` leave the rest of the storage alone.
- **A full quota** drops this store's own entries, expired ones first, instead of throwing into your
  request.
- **A storage that throws on read** — Safari with storage blocked, say — counts as a cache miss, for
  the same reason.
- **Values round-trip through JSON**, so every hit returns a fresh copy and the mutation warning
  below doesn't apply.

## Clearing the cache

`clearCache()` empties the store, including the one a client built for itself:

```ts
const api = new BerryClient();

await api.getBerryByName('cheri'); // network
await api.getBerryByName('cheri'); // cache

await api.clearCache();

await api.getBerryByName('cheri'); // network again
```

Any `ETag` the client learned goes too, so the next request downloads rather than revalidating.

`cache` is `undefined` when caching is disabled, and `clearCache()` is then a no-op. `clear` is
optional on `CacheStore`, so a store that doesn't implement it — a shared Redis instance you'd rather
the library not flush — is left untouched.

## How it works

- Only successful responses are cached, so a retry genuinely retries. See [Errors](/guides/errors).
- Concurrent calls for the same URL share a single request, so a cold cache under load produces one
  round trip rather than many. Under a `MainClient` that holds across sections too.
- `MemoryCache` evicts the least recently used entry once `maxEntries` is reached.
- A store is per client instance unless you share one yourself. `MainClient` is the exception: its
  sub-clients share one transport, so a resource fetched through `api.pokemon` is served from memory
  by `api.utility`.
- A resource has one cache entry however you reach it. `getBerryById(1)` and `getResourceByUrl` on
  the PokéAPI's own slash-terminated link resolve to the same key.

:::warning
`MemoryCache` returns responses **by reference**. Mutating a response also mutates what later cache
hits return, so treat what you get back as read-only.
:::
