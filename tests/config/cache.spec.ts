import { MemoryCache } from "@config/cache";

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
