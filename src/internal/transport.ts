import type {
  ClientOptions,
  FetchLike,
  ListFn,
  PaginateOptions,
  RequestScope,
  RetryOptions,
} from "../clients/base";
import { type CacheStore, type EtagEntry, EtagStore, MemoryCache } from "../config/cache";
import { toPokenodeError } from "../config/errors";
import { type Logger, type LogResponsePayload, logMessage } from "../config/logger";
import { BASE_URL, type Endpoint } from "../constants";
import type { APIResource, NamedAPIResource } from "../models/common/resource";
import { DEFAULT_PAGE_SIZE, walk as walkPages } from "./paginate";
import { DEFAULT_CONCURRENCY, mapWithConcurrency } from "./pool";
import { attemptCount, backoff, isAbort, retryDelay } from "./retry";
import { listPath, normalizeURL, splitCredentials, toEndpointPath, trimTrailingSlash } from "./url";

/** A parsed response body and the status it arrived with. */
interface FetchedResource {
  data: unknown;
  status: number;
  /** Whether the body came from an {@link EtagStore} rather than off the wire. */
  revalidated?: boolean;
}

/** Where a resolution came from, as the response log reports it. */
const responseSource = (
  pending: boolean,
  revalidated: boolean | undefined,
): LogResponsePayload["source"] => {
  if (pending) {
    return "in-flight";
  }

  return revalidated === true ? "revalidated" : "network";
};

/**
 * A request already on the wire, and what it takes to cancel it.
 *
 * `waiters` counts the callers still interested. The request is aborted only
 * when the last of them has left, so one caller giving up does not cancel the
 * round trip the others are sharing.
 */
interface InFlightRequest {
  promise: Promise<FetchedResource>;
  /** Absent when the caller that started the request had nothing to cancel it with. */
  controller: AbortController | undefined;
  waiters: number;
}

/** Resolves the `revalidate` option to the store the client will keep, if any. */
const toEtagStore = (revalidate: boolean | EtagStore | undefined): EtagStore | undefined => {
  if (!revalidate) {
    return undefined;
  }

  return revalidate === true ? new EtagStore() : revalidate;
};

/** What a {@link Transport} was configured with, and never changes thereafter. */
interface TransportConfig {
  baseURL: string;
  fetch: FetchLike;
  logger: Logger | undefined;
  retry: RetryOptions | undefined;
}

/**
 * What a {@link Transport} shares with every transport derived from it.
 *
 * Held in one object and passed by reference, so a scoped transport joins the
 * cache, the validators and the requests already on the wire rather than
 * starting its own.
 */
interface TransportState {
  cache: CacheStore | undefined;
  etags: EtagStore | undefined;
  /** Requests already on the wire, so concurrent callers share one round trip. */
  inFlight: Map<string, InFlightRequest>;
}

/**
 * ## Transport
 * Everything a client does that is not naming an endpoint: requests, caching,
 * request coalescing, retries, revalidation and logging. The URL, retry and
 * pagination rules it works to live beside it in `./url`, `./retry` and
 * `./paginate`.
 *
 * Internal. One transport is built per {@link MainClient} and handed to all
 * twelve of its section clients, which is what makes a resource fetched through
 * one of them cached — and coalesced — for the rest.
 */
export class Transport {
  constructor(
    private readonly config: TransportConfig,
    private readonly state: TransportState,
    private readonly scope: RequestScope = {},
  ) {}

  /** Builds a transport, and the state it will share, from public options. */
  static create(clientOptions?: ClientOptions): Transport {
    return new Transport(
      {
        baseURL: trimTrailingSlash(clientOptions?.baseURL ?? BASE_URL.REST),
        fetch: clientOptions?.fetch ?? ((input, init) => globalThis.fetch(input, init)),
        logger: clientOptions?.logger,
        retry: clientOptions?.retry,
      },
      {
        cache:
          clientOptions?.cache === false ? undefined : (clientOptions?.cache ?? new MemoryCache()),
        etags: toEtagStore(clientOptions?.revalidate),
        inFlight: new Map(),
      },
    );
  }

  /** The store backing this transport, or `undefined` when caching is disabled. */
  get cache(): CacheStore | undefined {
    return this.state.cache;
  }

  /**
   * Derives a transport whose requests carry a signal, a timeout, or both.
   *
   * The derived transport shares this one's state, so a scoped call still joins
   * an identical unscoped one instead of repeating it.
   */
  with(scope: RequestScope): Transport {
    return new Transport(this.config, this.state, { ...this.scope, ...scope });
  }

  /**
   * Drops every cached response. A {@link CacheStore} that does not implement
   * `clear` is left alone.
   */
  async clear(): Promise<void> {
    await this.state.cache?.clear?.();
  }

  /**
   * Retrieves a single resource by its endpoint and identifier.
   *
   * Every segment is percent-encoded. A name reaches here as whatever the caller
   * passed — `getBerryByName(req.query.name)` is the shape that call takes — and
   * unencoded a `?` in it becomes a query, a `/` another endpoint, and a `#` a
   * fragment that is dropped before the wire but not before the cache key. A
   * path below the endpoint is given as separate segments for that reason.
   */
  async resource<T>(endpoint: Endpoint, ...segments: (string | number)[]): Promise<T> {
    const path = segments.map((segment) => encodeURIComponent(segment)).join("/");

    return this.request<T>(path === "" ? endpoint : `${endpoint}/${path}`);
  }

  /** Retrieves a resource by its URL, or by a link taken from another response. */
  async byURL<T>(
    resource: string | NamedAPIResource<T> | APIResource<T>,
    baseURL = this.config.baseURL,
  ): Promise<T> {
    const url = typeof resource === "string" ? resource : resource.url;

    return this.request<T>(toEndpointPath(url, baseURL), baseURL);
  }

  /** Retrieves one page of a list endpoint. */
  async list<T>(endpoint: Endpoint, offset = 0, limit = DEFAULT_PAGE_SIZE): Promise<T> {
    return this.request<T>(listPath(endpoint, offset, limit));
  }

  /** Fetches what several links point at, in the order they were given. */
  async resolveAll<T>(
    resources: readonly (string | NamedAPIResource<T> | APIResource<T>)[],
    concurrency = DEFAULT_CONCURRENCY,
  ): Promise<T[]> {
    return mapWithConcurrency(resources, concurrency, (resource) => this.byURL<T>(resource));
  }

  /** Walks every page of a list endpoint, yielding one entry at a time. */
  walk<T>(
    list: ListFn<APIResource<T>>,
    options?: PaginateOptions,
  ): AsyncGenerator<APIResource<T> | T> {
    return walkPages(list, (link) => this.byURL(link), options);
  }

  /**
   * Resolves a resource through the cache, then through any identical request
   * already in flight, and only then over the network.
   *
   * The URL is joined by concatenation: `new URL(path, base)` would discard the
   * base's own `/api/v2` path.
   */
  private async request<T>(path: string, baseURL = this.config.baseURL): Promise<T> {
    // Credentials leave the URL before anything else sees it: `fetch` rejects a
    // credentialed URL, and the cache key and log payload are built from this.
    const { url, authorization } = splitCredentials(
      normalizeURL(`${trimTrailingSlash(baseURL)}${path.startsWith("/") ? path : `/${path}`}`),
    );

    const startedAt = performance.now();

    this.config.logger?.debug({
      event: "request",
      ...logMessage("pokeapi request"),
      method: "GET",
      url,
    });

    const signal = this.requestSignal();

    try {
      // Checked before anything else happens, and before the cache is consulted:
      // a call made through a scope that has already aborted must not reach the
      // network, and must not depend on what happens to be cached either.
      if (signal?.aborted) {
        throw signal.reason;
      }

      const cached = await this.state.cache?.get(url);

      if (cached !== undefined) {
        // A hit is timed like any other resolution: the number is small, but a
        // store on the far side of a network is not guaranteed to make it so.
        this.logResponse(url, 200, "cache", startedAt);
        return cached as T;
      }

      // Every caller reports its own outcome, including one that only joined a
      // request someone else started: a `request` event with no `response` to
      // close it would make concurrent traffic unreadable. `source` is what keeps
      // the count of round trips honest when several callers share one.
      const pending = this.state.inFlight.get(url);
      const entry = pending ?? this.dispatch(url, authorization, signal);
      const { data, status, revalidated } = await this.join(url, entry, signal);

      this.logResponse(url, status, responseSource(pending !== undefined, revalidated), startedAt);

      return data as T;
    } catch (error) {
      this.config.logger?.error({
        event: "error",
        ...logMessage("pokeapi request failed"),
        url,
        err: error,
        error,
      });
      throw error;
    }
  }

  /**
   * The signal this scope puts on a request, or none when it has nothing to
   * cancel with. A timeout is created per request, not per scope: a scope is
   * derived once and used many times.
   */
  private requestSignal(): AbortSignal | undefined {
    const { signal, timeout } = this.scope;

    if (timeout === undefined) {
      return signal;
    }

    const expiry = AbortSignal.timeout(timeout);

    return signal ? AbortSignal.any([signal, expiry]) : expiry;
  }

  /** Issues a request and remembers it, so a concurrent caller can share it. */
  private dispatch(
    url: string,
    authorization: string | undefined,
    signal: AbortSignal | undefined,
  ): InFlightRequest {
    // The request is cancelled through a controller of its own rather than the
    // caller's signal: the callers sharing it come and go, and only the last one
    // to leave may cancel it.
    const controller = signal ? new AbortController() : undefined;
    const entry: InFlightRequest = {
      promise: this.fetchResource(url, authorization, controller?.signal),
      controller,
      waiters: 0,
    };

    entry.promise = entry.promise.finally(() => this.release(url, entry));

    // A request abandoned by every caller rejects with nobody left awaiting it.
    // This handler exists only so that rejection is not unhandled; each caller
    // still sees the failure through its own `join`.
    entry.promise.catch(() => {});

    this.state.inFlight.set(url, entry);

    return entry;
  }

  /**
   * Forgets a request, unless a later caller has already replaced it: a request
   * that was aborted leaves the map before it settles, and the one dispatched in
   * its place must survive its predecessor finishing.
   */
  private release(url: string, entry: InFlightRequest): void {
    if (this.state.inFlight.get(url) === entry) {
      this.state.inFlight.delete(url);
    }
  }

  /**
   * Awaits a request, cancelling it if this caller was the last one interested.
   *
   * A caller with no signal never leaves early, so it holds the request open for
   * everyone — including a scoped caller that joined later and gave up.
   */
  private join(
    url: string,
    entry: InFlightRequest,
    signal: AbortSignal | undefined,
  ): Promise<FetchedResource> {
    entry.waiters += 1;

    if (!signal) {
      return entry.promise;
    }

    return new Promise<FetchedResource>((resolve, reject) => {
      const leave = (): void => {
        entry.waiters -= 1;

        if (entry.waiters > 0) {
          return;
        }

        // Dropped from the map before the abort settles it: a caller arriving in
        // between would otherwise join a request already on its way out and
        // inherit an abort it never asked for.
        this.release(url, entry);
        entry.controller?.abort(signal.reason);
      };

      if (signal.aborted) {
        leave();
        reject(signal.reason);
        return;
      }

      const onAbort = (): void => {
        leave();
        reject(signal.reason);
      };

      signal.addEventListener("abort", onAbort, { once: true });

      entry.promise.then(
        (resource) => {
          signal.removeEventListener("abort", onAbort);
          resolve(resource);
        },
        (error: unknown) => {
          signal.removeEventListener("abort", onAbort);
          reject(error);
        },
      );
    });
  }

  private async fetchResource(
    url: string,
    authorization: string | undefined,
    signal: AbortSignal | undefined,
  ): Promise<FetchedResource> {
    // Read once, before any attempt: an entry evicted while the request is in
    // flight must not turn a 304 into a response with no body to go with it.
    const known = this.state.etags?.get(url);
    const headers = {
      Accept: "application/json",
      ...(authorization === undefined ? {} : { Authorization: authorization }),
      ...(known === undefined ? {} : { "If-None-Match": known.etag }),
    };
    const init = signal ? { headers, signal } : { headers };
    const { retry, logger } = this.config;
    const attempts = attemptCount(retry);

    for (let attempt = 1; ; attempt += 1) {
      const isLast = attempt >= attempts;
      let response: Response;

      try {
        response = await this.config.fetch(url, init);
      } catch (error) {
        // A cancelled request is not a failed one, so no attempt follows it.
        if (isLast || isAbort(error, signal)) {
          throw error;
        }

        await backoff({
          url,
          attempt,
          status: undefined,
          retryAfter: undefined,
          signal,
          retry,
          logger,
        });
        continue;
      }

      const resolved = await this.resolveResponse(url, response, known);

      if (resolved !== undefined) {
        return resolved;
      }

      const retryAfter = await retryDelay(response, isLast, retry);

      // The body is going nowhere, and an undrained one holds its connection.
      // Not awaited: an intercepted response may never settle the cancellation,
      // and nothing here depends on it having finished.
      response.body?.cancel().catch(() => {});
      await backoff({ url, attempt, status: response.status, retryAfter, signal, retry, logger });
    }
  }

  /**
   * The resource a response carries, or nothing when it carries none and another
   * attempt is the question.
   */
  private async resolveResponse(
    url: string,
    response: Response,
    known: EtagEntry | undefined,
  ): Promise<FetchedResource | undefined> {
    // Checked before `ok`, which a 304 is not: nothing changed, so the body
    // that was sent with the validator is still the answer.
    if (response.status === 304) {
      if (known === undefined) {
        // Nothing here asked for it, so nothing here can satisfy it — an
        // intermediary added a validator of its own. Reported on its own terms
        // rather than left to fall through as an unexplained failed status.
        throw await toPokenodeError(
          response,
          `Request to ${response.url} was answered 304, but this client holds no response to reuse`,
        );
      }

      await this.state.cache?.set(url, known.value);

      return { data: known.value, status: response.status, revalidated: true };
    }

    if (!response.ok) {
      return undefined;
    }

    const data: unknown = await response.json();
    const etag = response.headers.get("ETag");

    if (etag !== null) {
      this.state.etags?.set(url, { etag, value: data });
    }

    await this.state.cache?.set(url, data);

    return { data, status: response.status };
  }

  private logResponse(
    url: string,
    status: number,
    source: LogResponsePayload["source"],
    startedAt: number,
  ): void {
    this.config.logger?.debug({
      event: "response",
      ...logMessage("pokeapi response"),
      url,
      status,
      source,
      durationMs: performance.now() - startedAt,
    });
  }
}
