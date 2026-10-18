import type { ListFn, PaginateOptions } from "../clients/types";
import type { APIResource } from "../models/common/resource";
import { DEFAULT_CONCURRENCY, mapWithConcurrency } from "./pool";

/** The PokéAPI's own default. */
export const DEFAULT_PAGE_SIZE = 20;

/**
 * Walks every page of a list, yielding one entry at a time.
 *
 * Takes `resolve` rather than a transport, which would be an import cycle.
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
      // a page at a time keeps listed order however requests finish
      const resources = await mapWithConcurrency(page.results, concurrency, resolve);

      yield* resources;
    } else {
      yield* page.results;
    }

    offset += page.results.length;

    // a short page ends the walk even if upstream's `count` says otherwise
    if (page.results.length < pageSize || offset >= page.count) {
      return;
    }
  }
}
