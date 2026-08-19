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

/** How many URLs an {@link EtagStore} remembers before evicting the oldest. */
const DEFAULT_ETAG_ENTRIES = 500;

/**
 * ## Etag Entry
 * What a URL last answered with, and the validator that says so.
 */
export interface EtagEntry {
  /** The `ETag` the response carried. */
  etag: string;
  /** The parsed body that `etag` identifies. */
  value: unknown;
}

/**
 * ## Etag Store Options
 * Used to configure an {@link EtagStore}.
 */
export interface EtagStoreOptions {
  /** How many URLs to remember. The least recently used is evicted. Defaults to 500. */
  maxEntries?: number;
}

/**
 * ## Etag Store
 * Remembers the `ETag` each URL answered with, and the body it identified, so an
 * expired cache entry can be revalidated instead of downloaded again.
 *
 * Deliberately not a {@link CacheStore}: the two answer different questions. A
 * `CacheStore` says "this response is still fresh, use it"; this says "here is
 * what the response was last time, ask the server whether it still holds". They
 * are kept apart so that a store someone else owns — a shared Redis — is never
 * given a second key shape, and `cache.get(url)` keeps returning the resource
 * itself.
 *
 * Entries live in memory and are never persisted: an `ETag` is only worth what
 * the body beside it is, and the body is what would cost memory to keep.
 */
export class EtagStore {
  private readonly entries = new Map<string, EtagEntry>();
  private readonly maxEntries: number;

  constructor(options?: EtagStoreOptions) {
    this.maxEntries = options?.maxEntries ?? DEFAULT_ETAG_ENTRIES;
  }

  get(url: string): EtagEntry | undefined {
    const entry = this.entries.get(url);

    if (!entry) {
      return undefined;
    }

    // Re-insert so `entries` stays ordered least- to most-recently used.
    this.entries.delete(url);
    this.entries.set(url, entry);

    return entry;
  }

  set(url: string, entry: EtagEntry): void {
    this.entries.delete(url);

    if (this.entries.size >= this.maxEntries) {
      const oldest = this.entries.keys().next();

      if (!oldest.done) {
        this.entries.delete(oldest.value);
      }
    }

    this.entries.set(url, entry);
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
 *
 * Every method may return a promise, so a React Native `AsyncStorage` works as-is.
 * Key enumeration is the one place the two shapes differ: `Storage` exposes
 * `length` and `key(index)`, `AsyncStorage` exposes `getAllKeys`, and a property
 * cannot be awaited — so both are accepted, and a storage offering neither still
 * caches; it just never evicts or clears.
 */
export interface WebStorageLike {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
  /** Every key held, this store's and the application's alike. */
  getAllKeys?(): readonly string[] | Promise<readonly string[]>;
  key?(index: number): string | null;
  readonly length?: number;
}

/**
 * ## Web Storage Cache Options
 * Used to configure a store backed by `localStorage` or `sessionStorage`.
 */
export interface WebStorageCacheOptions {
  /**
   * Where entries are kept. Pass `localStorage`, `sessionStorage`, a React Native
   * `AsyncStorage`, or anything else matching {@link WebStorageLike}.
   */
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
 *
 * A storage that throws instead of answering is treated as empty: a read is a miss
 * and a write is dropped, because neither is worth failing the request that
 * triggered it over.
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

  async get(key: string): Promise<unknown> {
    const entry = await this.read(this.prefix + key);

    if (!entry) {
      return undefined;
    }

    if (entry.expiresAt <= Date.now()) {
      await this.remove(this.prefix + key);
      return undefined;
    }

    return entry.value;
  }

  async set(key: string, value: unknown): Promise<void> {
    const entry = JSON.stringify({ value, expiresAt: Date.now() + this.ttl });

    try {
      await this.storage.setItem(this.prefix + key, entry);
    } catch {
      // Out of quota, most likely. Make room among this store's own keys and try
      // once more; a cache write that cannot land must not fail the request that
      // triggered it, so a second failure is dropped.
      await this.evict();

      try {
        await this.storage.setItem(this.prefix + key, entry);
      } catch {
        return;
      }
    }
  }

  async delete(key: string): Promise<void> {
    await this.storage.removeItem(this.prefix + key);
  }

  async clear(): Promise<void> {
    for (const key of await this.ownKeys()) {
      await this.remove(key);
    }
  }

  /** Reads a namespaced key, treating unreadable content as a miss. */
  private async read(key: string): Promise<CacheEntry | undefined> {
    let stored: string | null;

    try {
      stored = await this.storage.getItem(key);
    } catch {
      // A storage that refuses to be read — Safari with storage blocked, a shim
      // that throws — is a cache miss, not a failed request. The response the
      // caller asked for is still one fetch away.
      return undefined;
    }

    if (stored === null) {
      return undefined;
    }

    try {
      return JSON.parse(stored) as CacheEntry;
    } catch {
      // Written by an older version, or by something else under the same prefix.
      await this.remove(key);
      return undefined;
    }
  }

  /**
   * Frees space by dropping expired entries, falling back to the ones closest to
   * expiring when nothing has expired yet.
   */
  private async evict(): Promise<void> {
    const keys = await this.ownKeys();
    const entries = await Promise.all(
      keys.map(async (key) => ({ key, expiresAt: (await this.read(key))?.expiresAt })),
    );
    const now = Date.now();
    const expired = entries.filter(({ expiresAt }) => expiresAt === undefined || expiresAt <= now);

    if (expired.length > 0) {
      for (const { key } of expired) {
        await this.remove(key);
      }

      return;
    }

    const soonest = entries.sort((a, b) => (a.expiresAt ?? 0) - (b.expiresAt ?? 0));

    for (const { key } of soonest.slice(0, Math.ceil(soonest.length / 4))) {
      await this.remove(key);
    }
  }

  /**
   * Collects this store's keys before any removal: `key(index)` walks a list that
   * shifts underneath a loop that deletes as it goes.
   */
  private async ownKeys(): Promise<string[]> {
    return (await this.allKeys()).filter((key) => key.startsWith(this.prefix));
  }

  /**
   * Every key the storage holds, however it is willing to list them. A storage
   * offering no enumeration at all reports none, which leaves eviction and
   * `clear` as no-ops rather than an error on a path that only tidies up.
   */
  private async allKeys(): Promise<string[]> {
    try {
      if (this.storage.getAllKeys !== undefined) {
        return [...(await this.storage.getAllKeys())];
      }

      const { key, length } = this.storage;

      if (key === undefined || length === undefined) {
        return [];
      }

      const keys: string[] = [];

      for (let index = 0; index < length; index += 1) {
        const found = key.call(this.storage, index);

        if (found !== null) {
          keys.push(found);
        }
      }

      return keys;
    } catch {
      return [];
    }
  }

  /** Removes a key on a path that is only tidying up, where a refusal is moot. */
  private async remove(key: string): Promise<void> {
    try {
      await this.storage.removeItem(key);
    } catch {
      // The entry stays until the storage lets it go; a read of it is a miss
      // either way, since it is expired or unparseable.
    }
  }
}
