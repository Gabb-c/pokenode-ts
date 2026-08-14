/** Five minutes, matching the default the previous cache layer shipped with. */
const DEFAULT_TTL = 300_000;
const DEFAULT_MAX_ENTRIES = 500;

/**
 * ## Cache Store
 * The contract a client uses to cache responses, keyed by request URL.
 *
 * Every method may return a promise, so remote backends (Redis, KV stores) work
 * as-is. Expiry is the store's own business: nothing is passed in, because a
 * backend that has its own TTL support should use it.
 *
 * Values cross this boundary as parsed objects rather than strings, so an
 * in-memory store stays zero-copy. A remote store serializes on its own.
 */
export interface CacheStore {
  get(key: string): unknown | Promise<unknown>;
  set(key: string, value: unknown): void | Promise<void>;
  delete?(key: string): void | Promise<void>;
  clear?(): void | Promise<void>;
}

/**
 * ## Memory Cache Options
 * Used to configure the default in-memory store.
 */
export interface MemoryCacheOptions {
  /** How long a cached response stays fresh, in milliseconds. Defaults to 5 minutes. */
  ttl?: number;
  /** Maximum number of responses kept. The least recently used entry is evicted. Defaults to 500. */
  maxEntries?: number;
}

interface CacheEntry {
  value: unknown;
  expiresAt: number;
}

/**
 * ## Memory Cache
 * The default {@link CacheStore}: a bounded, time-to-live cache held in memory.
 *
 * Values are stored and returned by reference: mutating a response also mutates
 * what later cache hits return. Treat responses as read-only.
 */
export class MemoryCache implements CacheStore {
  private readonly entries = new Map<string, CacheEntry>();
  private readonly ttl: number;
  private readonly maxEntries: number;

  constructor(options?: MemoryCacheOptions) {
    this.ttl = options?.ttl ?? DEFAULT_TTL;
    this.maxEntries = options?.maxEntries ?? DEFAULT_MAX_ENTRIES;
  }

  get(key: string): unknown {
    const entry = this.entries.get(key);

    if (!entry) {
      return undefined;
    }

    if (entry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      return undefined;
    }

    // Re-insert so `entries` stays ordered least- to most-recently used.
    this.entries.delete(key);
    this.entries.set(key, entry);

    return entry.value;
  }

  set(key: string, value: unknown): void {
    // Delete first so an update moves the key to the most-recently-used end.
    this.entries.delete(key);

    if (this.entries.size >= this.maxEntries) {
      const oldest = this.entries.keys().next();
      if (!oldest.done) {
        this.entries.delete(oldest.value);
      }
    }

    this.entries.set(key, { value, expiresAt: Date.now() + this.ttl });
  }

  delete(key: string): void {
    this.entries.delete(key);
  }

  clear(): void {
    this.entries.clear();
  }
}
