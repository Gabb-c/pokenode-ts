/**
 * ## LRU Map
 * A map bounded to `maxEntries`, evicting the least recently used key.
 *
 * Relies on `Map` keeping insertion order: a key is re-inserted on every touch,
 * so the first key is always the coldest.
 */
export class LruMap<V> {
  private readonly entries = new Map<string, V>();

  constructor(private readonly maxEntries: number) {}

  get(key: string): V | undefined {
    const value = this.entries.get(key);

    if (value === undefined) {
      return undefined;
    }

    this.entries.delete(key);
    this.entries.set(key, value);

    return value;
  }

  set(key: string, value: V): void {
    this.entries.delete(key);

    // with no room, evicting the oldest would still leave this one behind
    if (this.maxEntries === 0) {
      return;
    }

    if (this.entries.size >= this.maxEntries) {
      const oldest = this.entries.keys().next();

      if (!oldest.done) {
        this.entries.delete(oldest.value);
      }
    }

    this.entries.set(key, value);
  }

  delete(key: string): void {
    this.entries.delete(key);
  }

  clear(): void {
    this.entries.clear();
  }
}
