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

describe("WebStorageCache", () => {
  it("should store and return a value", () => {
    const storage = new FakeStorage();
    const cache = new WebStorageCache({ storage });

    cache.set("a", { id: 1 });

    expect(cache.get("a")).toEqual({ id: 1 });
  });

  it("should namespace the keys it writes", () => {
    const storage = new FakeStorage();

    new WebStorageCache({ storage, prefix: "custom:" }).set("a", 1);

    expect([...storage.entries.keys()]).toEqual(["custom:a"]);
  });

  it("should miss on unknown keys", () => {
    expect(new WebStorageCache({ storage: new FakeStorage() }).get("nope")).toBeUndefined();
  });

  it("should ignore an unprefixed key of the same name", () => {
    const storage = new FakeStorage();
    storage.setItem("a", JSON.stringify({ value: 1, expiresAt: Date.now() + 1000 }));

    expect(new WebStorageCache({ storage }).get("a")).toBeUndefined();
  });

  it("should return a copy rather than a reference", () => {
    const cache = new WebStorageCache({ storage: new FakeStorage() });
    const value = { nested: { id: 1 } };

    cache.set("a", value);
    value.nested.id = 2;

    expect(cache.get("a")).toEqual({ nested: { id: 1 } });
  });

  it("should expire entries once the ttl elapses", () => {
    vi.useFakeTimers();

    const storage = new FakeStorage();
    const cache = new WebStorageCache({ storage, ttl: 1000 });
    cache.set("a", 1);

    vi.advanceTimersByTime(999);
    expect(cache.get("a")).toBe(1);

    vi.advanceTimersByTime(1);
    expect(cache.get("a")).toBeUndefined();
    expect(storage.length).toBe(0);

    vi.useRealTimers();
  });

  it("should treat unreadable content as a miss and drop it", () => {
    const storage = new FakeStorage();
    storage.setItem("pokenode:a", "not json");

    expect(new WebStorageCache({ storage }).get("a")).toBeUndefined();
    expect(storage.length).toBe(0);
  });

  it("should make room by dropping expired entries when the quota is hit", () => {
    vi.useFakeTimers();

    const storage = new FakeStorage();
    const cache = new WebStorageCache({ storage, ttl: 1000 });

    cache.set("a", 1);
    cache.set("b", 2);
    storage.quota = 2;

    vi.advanceTimersByTime(2000);
    cache.set("c", 3);

    expect(cache.get("c")).toBe(3);
    expect([...storage.entries.keys()]).toEqual(["pokenode:c"]);

    vi.useRealTimers();
  });

  it("should drop the entries closest to expiring when nothing has expired", () => {
    vi.useFakeTimers();

    const storage = new FakeStorage();
    const cache = new WebStorageCache({ storage, ttl: 10_000 });

    for (const key of ["a", "b", "c", "d"]) {
      cache.set(key, key);
      vi.advanceTimersByTime(1);
    }

    storage.quota = 4;
    cache.set("e", "e");

    expect(cache.get("a")).toBeUndefined();
    expect(cache.get("b")).toBe("b");
    expect(cache.get("e")).toBe("e");

    vi.useRealTimers();
  });

  it("should give up quietly when the entry cannot be stored at all", () => {
    const storage = new FakeStorage();
    storage.quota = 0;

    const cache = new WebStorageCache({ storage });

    expect(() => cache.set("a", 1)).not.toThrow();
    expect(cache.get("a")).toBeUndefined();
  });

  it("should drop a single entry on delete", () => {
    const storage = new FakeStorage();
    const cache = new WebStorageCache({ storage });

    cache.set("a", 1);
    cache.set("b", 2);
    cache.delete("a");

    expect(cache.get("a")).toBeUndefined();
    expect(cache.get("b")).toBe(2);
  });

  it("should clear only its own keys", () => {
    const storage = new FakeStorage();
    storage.setItem("app:session", "keep me");

    const cache = new WebStorageCache({ storage });
    cache.set("a", 1);
    cache.clear();

    expect(cache.get("a")).toBeUndefined();
    expect(storage.getItem("app:session")).toBe("keep me");
  });
});
