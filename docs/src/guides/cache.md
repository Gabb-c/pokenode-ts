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

## How it works

- Only successful responses are cached — a failed request is never stored.
- Concurrent calls for the same URL share a single request, so a cold cache under load produces
  one round trip rather than many.
- `MemoryCache` evicts the least recently used entry once `maxEntries` is reached.
- A store is per client instance unless you share one between clients yourself.

:::warning
`MemoryCache` returns responses **by reference**. Mutating a response also mutates what later cache
hits return, so treat the objects you get back as read-only.
:::
