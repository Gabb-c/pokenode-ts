import type { ListFn, PaginateOptions } from "../clients/base";
import type { APIResource } from "../models/common/resource";
import { DEFAULT_CONCURRENCY, mapWithConcurrency } from "./pool";

/**
 * The PokéAPI's own default, and `Transport.list`'s, so a walk pages the way a
 * hand-written loop would.
 */
export const DEFAULT_PAGE_SIZE = 20;

/**
 * Walks every page of a list, yielding one entry at a time.
 *
 * `resolve` is passed in rather than a transport: this module would otherwise
 * have to import the one that imports it.
 */
export async function* walk<T>(
  list: ListFn<APIResource<T>>,
  resolve: (link: APIResource<T>) => Promise<T>,
  options?: PaginateOptions,
): AsyncGenerator<APIResource<T> | T> {
  const pageSize = options?.pageSize ?? DEFAULT_PAGE_SIZE;
  const concurrency = options?.concurrency ?? DEFAULT_CONCURRENCY;
  let offset = 0;

  while (true) {
    const page = await list(offset, pageSize);

    if (page.results.length === 0) {
      return;
    }

    if (options?.resolve) {
      // Resolved a page at a time: the order callers see stays the order the
      // API listed, however the requests within a page happen to finish.
      const resources = await mapWithConcurrency(page.results, concurrency, resolve);

      yield* resources;
    } else {
      yield* page.results;
    }

    offset += page.results.length;

    // A short page ends the walk on its own: `count` is upstream's word for how
    // much there is, and the results are the client's own evidence.
    if (page.results.length < pageSize || offset >= page.count) {
      return;
    }
  }
}
