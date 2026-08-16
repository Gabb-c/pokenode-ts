/** Five minutes. */
const DEFAULT_TTL = 300_000;
const DEFAULT_MAX_ENTRIES = 500;

/**
 * ## Cache Store
 * The contract a client uses to cache responses, keyed by request URL.
 *
 * Every method may return a promise, so remote backends (Redis, KV stores) work
 * as-is. Values cross this boundary as parsed objects; expiry is the store's own
 * business.
 */
export interface CacheStore {
  get(key: string): unknown | Promise<unknown>;
  set(key: string, value: unknown): void | Promise<void>;
  delete?(key: string): void | Promise<void>;
  clear?(): void | Promise<void>;
}

/** Default namespace for the keys {@link WebStorageCache} owns. */
const DEFAULT_PREFIX = "pokenode:";

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
 * Values are stored and returned by reference — mutating a response also mutates
 * what later cache hits return, so treat responses as read-only.
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

/**
 * ## Web Storage Like
 * The part of the browser's `Storage` interface a {@link WebStorageCache} uses.
 *
 * Declared structurally rather than as the DOM's `Storage`: the package compiles
 * without `lib.dom`, and stays usable anywhere the same shape exists.
 */
export interface WebStorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  key(index: number): string | null;
  readonly length: number;
}

/**
 * ## Web Storage Cache Options
 * Used to configure a store backed by `localStorage` or `sessionStorage`.
 */
export interface WebStorageCacheOptions {
  /** Where entries are kept. Pass `localStorage`, `sessionStorage`, or any equivalent. */
  storage: WebStorageLike;
  /** How long a cached response stays fresh, in milliseconds. Defaults to 5 minutes. */
  ttl?: number;
  /** Namespace for the keys this store writes. Defaults to `pokenode:`. */
  prefix?: string;
}

/**
 * ## Web Storage Cache
 * A {@link CacheStore} backed by `localStorage` or `sessionStorage`, so a cached
 * response survives a page reload.
 *
 * ```ts
 * const api = new PokemonClient({ cache: new WebStorageCache({ storage: localStorage }) });
 * ```
 *
 * Only keys under {@link WebStorageCacheOptions.prefix} are ever read, evicted or
 * cleared — the storage is assumed to be shared with the surrounding application.
 *
 * Values round-trip through JSON, so unlike {@link MemoryCache} every hit returns a
 * fresh copy. Anything a `JSON.stringify` cannot represent does not survive, which
 * covers every PokéAPI response.
 */
export class WebStorageCache implements CacheStore {
  private readonly storage: WebStorageLike;
  private readonly ttl: number;
  private readonly prefix: string;

  constructor(options: WebStorageCacheOptions) {
    this.storage = options.storage;
    this.ttl = options.ttl ?? DEFAULT_TTL;
    this.prefix = options.prefix ?? DEFAULT_PREFIX;
  }

  get(key: string): unknown {
    const entry = this.read(this.prefix + key);

    if (!entry) {
      return undefined;
    }

    if (entry.expiresAt <= Date.now()) {
      this.storage.removeItem(this.prefix + key);
      return undefined;
    }

    return entry.value;
  }

  set(key: string, value: unknown): void {
    const entry = JSON.stringify({ value, expiresAt: Date.now() + this.ttl });

    try {
      this.storage.setItem(this.prefix + key, entry);
    } catch {
      // Out of quota, most likely. Make room among this store's own keys and try
      // once more; a cache write that cannot land must not fail the request that
      // triggered it, so a second failure is dropped.
      this.evict();

      try {
        this.storage.setItem(this.prefix + key, entry);
      } catch {
        return;
      }
    }
  }

  delete(key: string): void {
    this.storage.removeItem(this.prefix + key);
  }

  clear(): void {
    for (const key of this.ownKeys()) {
      this.storage.removeItem(key);
    }
  }

  /** Reads a namespaced key, treating unreadable content as a miss. */
  private read(key: string): CacheEntry | undefined {
    const stored = this.storage.getItem(key);

    if (stored === null) {
      return undefined;
    }

    try {
      return JSON.parse(stored) as CacheEntry;
    } catch {
      // Written by an older version, or by something else under the same prefix.
      this.storage.removeItem(key);
      return undefined;
    }
  }

  /**
   * Frees space by dropping expired entries, falling back to the ones closest to
   * expiring when nothing has expired yet.
   */
  private evict(): void {
    const entries = this.ownKeys().map((key) => ({ key, expiresAt: this.read(key)?.expiresAt }));
    const now = Date.now();
    const expired = entries.filter(({ expiresAt }) => expiresAt === undefined || expiresAt <= now);

    if (expired.length > 0) {
      for (const { key } of expired) {
        this.storage.removeItem(key);
      }

      return;
    }

    const soonest = entries.sort((a, b) => (a.expiresAt ?? 0) - (b.expiresAt ?? 0));

    for (const { key } of soonest.slice(0, Math.ceil(soonest.length / 4))) {
      this.storage.removeItem(key);
    }
  }

  /**
   * Collects this store's keys before any removal: `key(index)` walks a list that
   * shifts underneath a loop that deletes as it goes.
   */
  private ownKeys(): string[] {
    const keys: string[] = [];

    for (let index = 0; index < this.storage.length; index += 1) {
      const key = this.storage.key(index);

      if (key?.startsWith(this.prefix)) {
        keys.push(key);
      }
    }

    return keys;
  }
}
