import { mapWithConcurrency } from "../../src/internal/pool";

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** A task that records how many calls overlap. */
const tracked = () => {
  const stats = { active: 0, peak: 0, calls: [] as number[] };

  const task = async (item: number): Promise<number> => {
    stats.calls.push(item);
    stats.active += 1;
    stats.peak = Math.max(stats.peak, stats.active);
    await wait(item);
    stats.active -= 1;
    return item * 10;
  };

  return { stats, task };
};

describe("mapWithConcurrency", () => {
  it("should return results in input order however they finish", async () => {
    const { task } = tracked();

    await expect(mapWithConcurrency([5, 1, 3], 3, task)).resolves.toEqual([50, 10, 30]);
  });

  it("should run at most `concurrency` tasks at once", async () => {
    const { stats, task } = tracked();

    await mapWithConcurrency([2, 2, 2, 2, 2], 2, task);

    expect(stats.peak).toBe(2);
  });

  it("should stop taking items after the first failure", async () => {
    const calls: number[] = [];
    const task = async (item: number): Promise<number> => {
      calls.push(item);
      if (item === 2) {
        throw new Error("boom");
      }
      return item;
    };

    await expect(mapWithConcurrency([1, 2, 3, 4], 1, task)).rejects.toThrow("boom");
    expect(calls).toEqual([1, 2]);
  });

  it.each([
    ["NaN", Number.NaN],
    ["zero", 0],
    ["a fraction", 1.5],
  ])("should still run every item with %s concurrency", async (_label, concurrency) => {
    const { task } = tracked();

    await expect(mapWithConcurrency([1, 1, 1], concurrency, task)).resolves.toEqual([10, 10, 10]);
  });

  it("should resolve an empty list without running anything", async () => {
    const { stats, task } = tracked();

    await expect(mapWithConcurrency([], 4, task)).resolves.toEqual([]);
    expect(stats.calls).toEqual([]);
  });
});
