/**
 * How many requests the helpers that fetch many resources at once will run in
 * parallel. Kept low on purpose: see the PokéAPI fair-use policy.
 */
export const DEFAULT_CONCURRENCY = 4;

/**
 * Runs `task` over `items` with at most `concurrency` of them in flight, and
 * returns the results in the order the items came in.
 *
 * Internal: the PokéAPI's fair-use policy asks clients not to flood it, so the
 * places that resolve many links at once go through here rather than
 * `Promise.all`.
 *
 * The first failure stops the pool — workers check before taking more work, so
 * a rejection does not leave a tail of requests running for a result nobody will
 * read.
 */
export const mapWithConcurrency = async <I, O>(
  items: readonly I[],
  concurrency: number,
  task: (item: I) => Promise<O>,
): Promise<O[]> => {
  const results = new Array<O>(items.length);
  let cursor = 0;
  let failed = false;

  const worker = async (): Promise<void> => {
    while (cursor < items.length && !failed) {
      const index = cursor;
      cursor += 1;

      try {
        results[index] = await task(items[index] as I);
      } catch (error) {
        failed = true;
        throw error;
      }
    }
  };

  const workers = Array.from({ length: Math.min(Math.max(concurrency, 1), items.length) }, () =>
    worker(),
  );

  await Promise.all(workers);

  return results;
};
