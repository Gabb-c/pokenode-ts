import { BaseClient } from "@clients/base";
import type { RetryOptions } from "@clients/types";
import type { CacheStore } from "@config/cache";
import { BASE_URL, type Endpoint } from "@constants";
import type { JsonBodyType } from "msw";
import { HttpResponse, http } from "msw/http";
import { delay } from "msw/utils/delay";

import { server } from "./setup";

/** Exposes the protected request helpers so they can be exercised directly. */
export class TestClient extends BaseClient {
  get<T>(endpoint: Endpoint, ...segments: (string | number)[]): Promise<T> {
    return this.getResource<T>(endpoint, ...segments);
  }

  getByURL<T>(url: string, baseURL?: string): Promise<T> {
    return this.getResourceByURL<T>(url, baseURL);
  }

  list(endpoint: "/berry", offset?: number, limit?: number) {
    return this.getListResource(endpoint, offset, limit);
  }
}

export const BERRY_URL = `${BASE_URL.REST}/berry/1`;

/** A `CacheStore` that records what the client asked of it. */
export class RecordingStore implements CacheStore {
  readonly reads: string[] = [];
  readonly writes: [string, unknown][] = [];

  private readonly entries = new Map<string, unknown>();
  private readonly async: boolean;

  constructor(options?: { async?: boolean }) {
    this.async = options?.async ?? false;
  }

  get(key: string): unknown | Promise<unknown> {
    this.reads.push(key);
    const value = this.entries.get(key);
    return this.async ? Promise.resolve(value) : value;
  }

  set(key: string, value: unknown): void | Promise<void> {
    this.writes.push([key, value]);
    this.entries.set(key, value);
    return this.async ? Promise.resolve() : undefined;
  }
}

/** Registers a handler for `url` and returns a counter of how often it ran. */
export const countingHandler = (url: string, body: JsonBodyType = { id: 1 }) => {
  const calls = { count: 0, urls: [] as string[] };

  server.use(
    http.get(url, ({ request }) => {
      calls.count += 1;
      calls.urls.push(request.url);
      return HttpResponse.json(body);
    }),
  );

  return calls;
};

/**
 * Answers with each status in turn, then `{ id: 1 }`, and counts the attempts.
 * `Retry-After` rides along on every failure when given.
 */
export const failingHandler = (statuses: number[], retryAfter?: string) => {
  const calls = { count: 0 };

  server.use(
    http.get(BERRY_URL, () => {
      const status = statuses[calls.count];
      calls.count += 1;

      if (status === undefined) {
        return HttpResponse.json({ id: 1 });
      }

      return HttpResponse.json(
        { detail: "no" },
        retryAfter === undefined ? { status } : { status, headers: { "Retry-After": retryAfter } },
      );
    }),
  );

  return calls;
};

/** Retries with no wait worth measuring, so a test asserts attempts, not timing. */
export const IMMEDIATE: RetryOptions = { attempts: 3, initialDelay: 0 };

/**
 * Lets every pending callback run, so a request has reached the transport and
 * every concurrent caller has joined it before a test aborts anything.
 */
export const settle = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

/** Answers `BERRY_URL` after `ms`, so a scope has something to give up on. */
export const slowHandler = (ms: number): void => {
  server.use(
    http.get(BERRY_URL, async () => {
      await delay(ms);
      return HttpResponse.json({ id: 1 });
    }),
  );
};

/**
 * Answers with an `ETag`, and with 304 whenever the request already carries it.
 * Records what each attempt sent, so a test can see the validator go out.
 */
export const revalidatingHandler = (etag = 'W/"one"') => {
  const calls = { sent: [] as (string | null)[], bodies: 0, tag: etag };

  server.use(
    http.get(BERRY_URL, ({ request }) => {
      const sent = request.headers.get("If-None-Match");
      calls.sent.push(sent);

      if (sent === calls.tag) {
        return new HttpResponse(null, { status: 304, headers: { ETag: calls.tag } });
      }

      calls.bodies += 1;

      return HttpResponse.json({ id: 1 }, { headers: { ETag: calls.tag } });
    }),
  );

  return calls;
};
