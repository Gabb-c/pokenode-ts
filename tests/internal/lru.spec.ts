import { LruMap } from "../../src/internal/lru";

describe("LruMap", () => {
  it("should evict the least recently used key", () => {
    const map = new LruMap<number>(2);

    map.set("a", 1);
    map.set("b", 2);
    map.get("a");
    map.set("c", 3);

    expect(map.get("a")).toBe(1);
    expect(map.get("b")).toBeUndefined();
    expect(map.get("c")).toBe(3);
  });

  it("should treat an update as a use", () => {
    const map = new LruMap<number>(2);

    map.set("a", 1);
    map.set("b", 2);
    map.set("a", 10);
    map.set("c", 3);

    expect(map.get("a")).toBe(10);
    expect(map.get("b")).toBeUndefined();
  });

  it("should keep nothing at zero capacity", () => {
    const map = new LruMap<number>(0);

    map.set("a", 1);

    expect(map.get("a")).toBeUndefined();
  });

  it("should delete one key and clear all of them", () => {
    const map = new LruMap<number>(3);

    map.set("a", 1);
    map.set("b", 2);
    map.delete("a");

    expect(map.get("a")).toBeUndefined();
    expect(map.get("b")).toBe(2);

    map.clear();

    expect(map.get("b")).toBeUndefined();
  });
});
