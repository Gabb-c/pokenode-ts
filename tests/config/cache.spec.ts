import { MemoryCache, WebStorageCache, type WebStorageLike } from "@config/cache";

describe("MemoryCache", () => {
  it("should store and return a value", () => {
    const cache = new MemoryCache();

    cache.set("a", { id: 1 });

    expect(cache.get("a")).toEqual({ id: 1 });
  });

  it("should miss on unknown keys", () => {
    expect(new MemoryCache().get("nope")).toBeUndefined();
  });

  it("should expire entries once the ttl elapses", () => {
    vi.useFakeTimers();

    const cache = new MemoryCache({ ttl: 1000 });
    cache.set("a", 1);

    vi.advanceTimersByTime(999);
    expect(cache.get("a")).toBe(1);

    vi.advanceTimersByTime(1);
    expect(cache.get("a")).toBeUndefined();

    vi.useRealTimers();
  });

  it("should evict the least recently used entry past maxEntries", () => {
    const cache = new MemoryCache({ maxEntries: 2 });

    cache.set("a", 1);
    cache.set("b", 2);
    // Reading "a" makes "b" the least recently used.
    cache.get("a");
    cache.set("c", 3);

    expect(cache.get("b")).toBeUndefined();
    expect(cache.get("a")).toBe(1);
    expect(cache.get("c")).toBe(3);
  });

  it("should not grow past maxEntries when a key is overwritten", () => {
    const cache = new MemoryCache({ maxEntries: 2 });

    cache.set("a", 1);
    cache.set("a", 2);
    cache.set("b", 3);

    expect(cache.get("a")).toBe(2);
    expect(cache.get("b")).toBe(3);
  });

  it("should keep nothing when maxEntries is zero", () => {
    // An eviction with nothing to evict left the entry that triggered it behind,
    // so a store asked to hold none held one.
    const cache = new MemoryCache({ maxEntries: 0 });

    cache.set("a", 1);

    expect(cache.get("a")).toBeUndefined();
  });

  it("should fall back to the default when maxEntries is not a number", () => {
    // `size >= NaN` is never true, and a bound never reached is not a bound —
    // the option that arrives as `Number(process.env.CACHE_SIZE)` unset. Proven
    // by filling past the default of 500, which an unbounded store would keep.
    const cache = new MemoryCache({ maxEntries: Number.NaN });

    for (let index = 0; index < 501; index += 1) {
      cache.set(String(index), index);
    }

    expect(cache.get("0")).toBeUndefined();
    expect(cache.get("500")).toBe(500);
  });

  it("should drop a single entry on delete", () => {
    const cache = new MemoryCache();

    cache.set("a", 1);
    cache.set("b", 2);
    cache.delete("a");

    expect(cache.get("a")).toBeUndefined();
    expect(cache.get("b")).toBe(2);
  });

  it("should drop everything on clear", () => {
    const cache = new MemoryCache();

    cache.set("a", 1);
    cache.clear();

    expect(cache.get("a")).toBeUndefined();
  });
});

/** A `Storage` stand-in whose capacity can be capped to trigger the quota path. */
class FakeStorage implements WebStorageLike {
  readonly entries = new Map<string, string>();
  /** How many entries `setItem` accepts before it throws. */
  quota = Number.POSITIVE_INFINITY;

  get length(): number {
    return this.entries.size;
  }

  key(index: number): string | null {
    return [...this.entries.keys()][index] ?? null;
  }

  getItem(key: string): string | null {
    return this.entries.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    if (!this.entries.has(key) && this.entries.size >= this.quota) {
      throw new Error("QuotaExceededError");
    }

    this.entries.set(key, value);
  }

  removeItem(key: string): void {
    this.entries.delete(key);
  }
}

/** An `AsyncStorage` stand-in: promise-returning, and enumerated by `getAllKeys`. */
class FakeAsyncStorage implements WebStorageLike {
  readonly entries = new Map<string, string>();

  async getAllKeys(): Promise<readonly string[]> {
    return [...this.entries.keys()];
  }

  async getItem(key: string): Promise<string | null> {
    return this.entries.get(key) ?? null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.entries.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.entries.delete(key);
  }
}

describe("WebStorageCache", () => {
  it("should store and return a value", async () => {
    const storage = new FakeStorage();
    const cache = new WebStorageCache({ storage });

    await cache.set("a", { id: 1 });

    expect(await cache.get("a")).toEqual({ id: 1 });
  });

  it("should namespace the keys it writes", async () => {
    const storage = new FakeStorage();

    await new WebStorageCache({ storage, prefix: "custom:" }).set("a", 1);

    expect([...storage.entries.keys()]).toEqual(["custom:a"]);
  });

  it("should miss on unknown keys", async () => {
    expect(await new WebStorageCache({ storage: new FakeStorage() }).get("nope")).toBeUndefined();
  });

  it("should ignore an unprefixed key of the same name", async () => {
    const storage = new FakeStorage();
    storage.setItem("a", JSON.stringify({ value: 1, expiresAt: Date.now() + 1000 }));

    expect(await new WebStorageCache({ storage }).get("a")).toBeUndefined();
  });

  it("should return a copy rather than a reference", async () => {
    const cache = new WebStorageCache({ storage: new FakeStorage() });
    const value = { nested: { id: 1 } };

    await cache.set("a", value);
    value.nested.id = 2;

    expect(await cache.get("a")).toEqual({ nested: { id: 1 } });
  });

  it("should expire entries once the ttl elapses", async () => {
    vi.useFakeTimers();

    const storage = new FakeStorage();
    const cache = new WebStorageCache({ storage, ttl: 1000 });
    await cache.set("a", 1);

    vi.advanceTimersByTime(999);
    expect(await cache.get("a")).toBe(1);

    vi.advanceTimersByTime(1);
    expect(await cache.get("a")).toBeUndefined();
    expect(storage.length).toBe(0);

    vi.useRealTimers();
  });

  it("should treat unreadable content as a miss and drop it", async () => {
    const storage = new FakeStorage();
    storage.setItem("pokenode:a", "not json");

    expect(await new WebStorageCache({ storage }).get("a")).toBeUndefined();
    expect(storage.length).toBe(0);
  });

  it("should make room by dropping expired entries when the quota is hit", async () => {
    vi.useFakeTimers();

    const storage = new FakeStorage();
    const cache = new WebStorageCache({ storage, ttl: 1000 });

    await cache.set("a", 1);
    await cache.set("b", 2);
    storage.quota = 2;

    vi.advanceTimersByTime(2000);
    await cache.set("c", 3);

    expect(await cache.get("c")).toBe(3);
    expect([...storage.entries.keys()]).toEqual(["pokenode:c"]);

    vi.useRealTimers();
  });

  it("should drop the entries closest to expiring when nothing has expired", async () => {
    vi.useFakeTimers();

    const storage = new FakeStorage();
    const cache = new WebStorageCache({ storage, ttl: 10_000 });

    for (const key of ["a", "b", "c", "d"]) {
      await cache.set(key, key);
      vi.advanceTimersByTime(1);
    }

    storage.quota = 4;
    await cache.set("e", "e");

    expect(await cache.get("a")).toBeUndefined();
    expect(await cache.get("b")).toBe("b");
    expect(await cache.get("e")).toBe("e");

    vi.useRealTimers();
  });

  it("should give up quietly when the entry cannot be stored at all", async () => {
    const storage = new FakeStorage();
    storage.quota = 0;

    const cache = new WebStorageCache({ storage });

    await expect(cache.set("a", 1)).resolves.toBeUndefined();
    expect(await cache.get("a")).toBeUndefined();
  });

  it("should drop a single entry on delete", async () => {
    const storage = new FakeStorage();
    const cache = new WebStorageCache({ storage });

    await cache.set("a", 1);
    await cache.set("b", 2);
    await cache.delete("a");

    expect(await cache.get("a")).toBeUndefined();
    expect(await cache.get("b")).toBe(2);
  });

  it("should clear only its own keys", async () => {
    const storage = new FakeStorage();
    storage.setItem("app:session", "keep me");

    const cache = new WebStorageCache({ storage });
    await cache.set("a", 1);
    await cache.clear();

    expect(await cache.get("a")).toBeUndefined();
    expect(storage.getItem("app:session")).toBe("keep me");
  });

  it("should tolerate a storage that refuses to drop a key on clear", async () => {
    const storage = new FakeStorage();
    const cache = new WebStorageCache({ storage });

    await cache.set("a", 1);
    storage.removeItem = () => {
      throw new Error("SecurityError");
    };

    // Every other path treats a refusing storage as empty; clearing is no
    // different, and `clearCache()` must not fail over a store it cannot tidy.
    await expect(cache.clear()).resolves.toBeUndefined();
  });

  it("should treat a storage that refuses to be read as a miss", async () => {
    const storage = new FakeStorage();
    const cache = new WebStorageCache({ storage });

    await cache.set("a", 1);
    storage.getItem = () => {
      throw new Error("SecurityError");
    };

    await expect(cache.get("a")).resolves.toBeUndefined();
  });

  it("should tolerate a storage that refuses to be enumerated", async () => {
    const storage = new FakeStorage();
    const cache = new WebStorageCache({ storage });

    await cache.set("a", 1);
    Object.defineProperty(storage, "length", {
      get: () => {
        throw new Error("SecurityError");
      },
    });

    await expect(cache.clear()).resolves.toBeUndefined();
  });

  it("should work against a promise-based storage", async () => {
    const storage = new FakeAsyncStorage();
    const cache = new WebStorageCache({ storage });

    await cache.set("a", { id: 1 });

    expect(await cache.get("a")).toEqual({ id: 1 });
  });

  it("should clear only its own keys on a promise-based storage", async () => {
    const storage = new FakeAsyncStorage();
    await storage.setItem("app:session", "keep me");

    const cache = new WebStorageCache({ storage });
    await cache.set("a", 1);
    await cache.clear();

    expect(await cache.get("a")).toBeUndefined();
    expect(await storage.getItem("app:session")).toBe("keep me");
  });

  it("should keep caching when the storage cannot be enumerated at all", async () => {
    const entries = new Map<string, string>();
    const storage: WebStorageLike = {
      getItem: (key) => entries.get(key) ?? null,
      setItem: (key, value) => {
        entries.set(key, value);
      },
      removeItem: (key) => {
        entries.delete(key);
      },
    };
    const cache = new WebStorageCache({ storage });

    await cache.set("a", 1);
    expect(await cache.get("a")).toBe(1);

    // Nothing to walk, so `clear` reaches no keys and leaves the entry in place.
    await cache.clear();
    expect(await cache.get("a")).toBe(1);
  });
});
