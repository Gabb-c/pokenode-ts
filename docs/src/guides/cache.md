---
description: "Configure response caching in pokenode-ts — the default in-memory LRU store, TTL and size tuning, or your own CacheStore backed by Redis or a KV namespace."
---

# Cache

Every client caches the responses it has already fetched, so repeated lookups of the same resource
skip the network. Requests are keyed by their fully resolved URL.

## Basic Usage

Caching is `enabled by default` with an in-memory store. Use the `cache` property to configure it:

```js
import { BerryClient, MemoryCache } from 'pokenode-ts';

// Defaults: 5 minute TTL, 500 entries
const api = new BerryClient();

// Tuned
const tuned = new BerryClient({
  cache: new MemoryCache({ ttl: 60000, maxEntries: 100 }),
});

// Disabled
const uncached = new BerryClient({ cache: false });
```

## Bring your own store

Pass anything that implements `CacheStore` — Redis, a KV namespace, a file on disk. Every method
may return a promise, so remote backends work without any adapter from us:

```ts
interface CacheStore {
  get(key: string): unknown | Promise<unknown>;
  set(key: string, value: unknown): void | Promise<void>;
  delete?(key: string): void | Promise<void>;
  clear?(): void | Promise<void>;
}
```

Expiry belongs to the store, not to the client — a backend with its own TTL support should use it.
Values arrive as parsed objects, so a remote store serializes them itself:

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

Return `undefined` from `get` for a miss.

## Revalidation

A cache entry expiring does not mean the resource changed — and Pokémon data changes about as rarely
as anything on the web does. With `revalidate`, an expired entry is checked rather than downloaded
again:

```ts
const api = new MainClient({ revalidate: true });
```

The client remembers the `ETag` each URL answered with, and the body it identified. When the cache
misses, it asks the API whether that validator still holds. A `304 Not Modified` means the body it
already has is still the answer — no payload crosses the wire, and the cache is refilled from memory.
A `200` replaces both.

```ts
// Sized: how many URLs to remember, 500 by default.
const api = new MainClient({ revalidate: new EtagStore({ maxEntries: 2000 }) });
```

`MainClient` builds one store for all twelve sections, the same way it builds one cache, so an
`ETag` learned through `api.pokemon` is used by `api.utility`. Both live on the single transport it
hands to every section.

::: tip
`EtagStore` is deliberately **not** a `CacheStore`. The two answer different questions — "is this
still fresh?" versus "here is what it was, is that still current?" — and keeping them apart means a
store you own, a shared Redis, is never given a second key shape. `cache.get(url)` keeps returning
the resource itself.
:::

::: warning
The store holds bodies, in memory, for as long as their URLs stay in it. That is the trade:
bandwidth and latency for memory. Size it for what you actually re-read, and leave `revalidate` off
if a cache miss is already rare.
:::

A revalidated response is reported to the [logger](./logging) with `source: 'revalidated'`, so it can
be counted separately from a full download — it is a round trip, just a cheap one.

A `304` answering a request the client sent no validator with — a proxy adding one of its own — is a
response with no body and nothing here to pair it with. It rejects with a `PokenodeError` of status
`304` saying so, rather than being reported as a plain failed status.

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
    ttl: 60000,
    prefix: 'pokedex:',
  }),
});
```

`storage` is required — there is no browser global to fall back to on the server. Anything matching
`WebStorageLike` works, and every method may return a promise, so React Native's `AsyncStorage`
goes in directly:

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = new PokemonClient({
  cache: new WebStorageCache({ storage: AsyncStorage }),
});
```

Key enumeration is the one place the two shapes differ: `Storage` has `length` and `key(index)`,
`AsyncStorage` has `getAllKeys()`, and `WebStorageCache` accepts either. A storage offering neither
still caches — it just never evicts or clears.

The store only ever touches keys under its `prefix` (`pokenode:` by default). Eviction and
`clearCache()` leave the rest of the storage alone, and a full quota is handled by dropping this
store's own entries — expired ones first — rather than by throwing into your request. A storage that
throws on read instead of answering — Safari with storage blocked, a shim that gives up — is treated
as a cache miss for the same reason: neither is worth failing the request over.

Values round-trip through JSON here, so every hit returns a fresh copy and the mutation warning
below does not apply.

## Clearing the cache

Every client exposes the store it is using as `cache`, and `clearCache()` empties it — including the
one a client built for itself:

```ts
const api = new BerryClient();

await api.getBerryByName('cheri'); // network
await api.getBerryByName('cheri'); // cache

await api.clearCache();

await api.getBerryByName('cheri'); // network again
```

`cache` is `undefined` when caching is disabled, and `clearCache()` is then a no-op. `clear` is
optional on `CacheStore`, so a store that does not implement it — a shared Redis instance you would
rather the library not flush — is left untouched.

## How it works

- Only successful responses are cached — a failed request is never stored, so a retry genuinely
  retries. See [Errors](/guides/errors).
- Concurrent calls for the same URL share a single request, so a cold cache under load produces
  one round trip rather than many. Under a `MainClient` this holds across sections too: `api.berry`
  and `api.pokemon` asking for the same URL at once make one request between them.
- `MemoryCache` evicts the least recently used entry once `maxEntries` is reached.
- A store is per client instance unless you share one between clients yourself. `MainClient` is the
  exception: its sub-clients share one transport, so a resource fetched through `api.pokemon` is
  served from memory by `api.utility`.
- A resource has one cache entry however it is reached. `getBerryById(1)` and `getResourceByUrl` on
  the PokéAPI's own slash-terminated link resolve to the same key.

:::warning
`MemoryCache` returns responses **by reference**. Mutating a response also mutates what later cache
hits return, so treat the objects you get back as read-only.
:::
