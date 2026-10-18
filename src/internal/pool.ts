import { finiteOr } from "./options";

/** Low on purpose: the PokéAPI fair-use policy. */
export const DEFAULT_CONCURRENCY = 4;

/**
 * `Promise.all` capped at `concurrency`, results in input order. The first
 * failure stops workers taking more items.
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

  const requested = Math.floor(finiteOr(concurrency, DEFAULT_CONCURRENCY));
  const workers = Array.from({ length: Math.min(Math.max(requested, 1), items.length) }, () =>
    worker(),
  );

  await Promise.all(workers);

  return results;
};
