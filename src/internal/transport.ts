import type {
  ClientOptions,
  ClientStats,
  FetchLike,
  ListFn,
  PaginateOptions,
  RequestScope,
  ResourceLink,
  RetryOptions,
} from "../clients/types";
import { type CacheStore, type EtagEntry, EtagStore, MemoryCache } from "../config/cache";
import { toPokenodeError } from "../config/errors";
import { type Logger, type LogResponsePayload, logMessage } from "../config/logger";
import { BASE_URL, type Endpoint } from "../constants";
import type { APIResource } from "../models/common/resource";
import { InFlight } from "./inflight";
import { DEFAULT_PAGE_SIZE, walk as walkPages } from "./paginate";
import { DEFAULT_CONCURRENCY, mapWithConcurrency } from "./pool";
import { attemptCount, backoff, isAbort, retryDelay } from "./retry";
import { listPath, normalizeURL, splitCredentials, toEndpointPath, trimTrailingSlash } from "./url";

interface FetchedResource {
  data: unknown;
  status: number;
  /** Served from the {@link EtagStore} after a 304. */
  revalidated?: boolean;
}

const responseSource = (
  joined: boolean,
  revalidated: boolean | undefined,
): LogResponsePayload["source"] => {
  if (joined) {
    return "in-flight";
  }

  return revalidated === true ? "revalidated" : "network";
};

const toEtagStore = (revalidate: boolean | EtagStore | undefined): EtagStore | undefined => {
  if (!revalidate) {
    return undefined;
  }

  return revalidate === true ? new EtagStore() : revalidate;
};

interface TransportConfig {
  baseURL: string;
  fetch: FetchLike;
  logger: Logger | undefined;
  retry: RetryOptions | undefined;
}

/** Passed by reference, so a derived transport joins the same cache, validators and requests. */
interface TransportState {
  cache: CacheStore | undefined;
  etags: EtagStore | undefined;
  inFlight: InFlight<FetchedResource>;
  /** Mutated in place, so every derived transport counts into the same object. */
  stats: ClientStats;
}

const SOURCE_STAT: Record<LogResponsePayload["source"], keyof ClientStats> = {
  network: "network",
  cache: "cache",
  "in-flight": "inFlight",
  revalidated: "revalidated",
};

/**
 * ## Transport
 * Requests, caching, coalescing, retries, revalidation and logging. One per
 * `MainClient`, shared by all twelve sections.
 */
export class Transport {
  constructor(
    private readonly config: TransportConfig,
    private readonly state: TransportState,
    private readonly scope: RequestScope = {},
  ) {}

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
        inFlight: new InFlight(),
        stats: { network: 0, cache: 0, inFlight: 0, revalidated: 0, roundTrips: 0 },
      },
    );
  }

  /** A snapshot; the counts behind it keep moving. */
  get stats(): ClientStats {
    return { ...this.state.stats };
  }

  get cache(): CacheStore | undefined {
    return this.state.cache;
  }

  with(scope: RequestScope): Transport {
    return new Transport(this.config, this.state, { ...this.scope, ...scope });
  }

  /** Validators go too, or the next 304 would answer with the body just dropped. */
  async clear(): Promise<void> {
    await this.state.cache?.clear?.();
    this.state.etags?.clear();
  }

  /** Each segment is percent-encoded: an unencoded `?`, `/` or `#` would escape the endpoint. */
  async resource<T>(endpoint: Endpoint, ...segments: (string | number)[]): Promise<T> {
    const path = segments.map((segment) => encodeURIComponent(segment)).join("/");

    return this.request<T>(path === "" ? endpoint : `${endpoint}/${path}`);
  }

  async byURL<T>(resource: ResourceLink<T>, baseURL = this.config.baseURL): Promise<T> {
    const url = typeof resource === "string" ? resource : resource.url;

    return this.request<T>(toEndpointPath(url, baseURL), baseURL);
  }

  async list<T>(endpoint: Endpoint, offset = 0, limit = DEFAULT_PAGE_SIZE): Promise<T> {
    return this.request<T>(listPath(endpoint, offset, limit));
  }

  async resolveAll<T>(
    resources: readonly ResourceLink<T>[],
    concurrency = DEFAULT_CONCURRENCY,
  ): Promise<T[]> {
    return mapWithConcurrency(resources, concurrency, (resource) => this.byURL<T>(resource));
  }

  walk<T>(
    list: ListFn<APIResource<T>>,
    options?: PaginateOptions,
  ): AsyncGenerator<APIResource<T> | T> {
    return walkPages(list, (link) => this.byURL(link), options);
  }

  /** Cache, then any identical request in flight, then the network. */
  private async request<T>(path: string, baseURL = this.config.baseURL): Promise<T> {
    const rooted = path.startsWith("/") ? path : `/${path}`;

    // concatenated: `new URL(path, base)` would drop the base's `/api/v2`.
    // credentials split first: fetch rejects them, and the cache key and logs derive from this url
    const { url, authorization } = splitCredentials(
      normalizeURL(`${trimTrailingSlash(baseURL)}${rooted}`),
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
      // before the cache: an aborted scope must fail whatever happens to be cached
      if (signal?.aborted) {
        throw signal.reason;
      }

      const cached = await this.state.cache?.get(url);

      if (cached !== undefined) {
        this.recordResponse(url, 200, "cache", startedAt);
        return cached as T;
      }

      const { value, joined } = await this.state.inFlight.share(url, signal, (requestSignal) =>
        this.fetchResource(url, authorization, requestSignal),
      );

      this.recordResponse(url, value.status, responseSource(joined, value.revalidated), startedAt);

      return value.data as T;
    } catch (error) {
      this.logFailure(error, signal, url, startedAt);
      throw error;
    }
  }

  /** A timeout is created per request, not per scope: a scope is reused. */
  private requestSignal(): AbortSignal | undefined {
    const { signal, timeout } = this.scope;

    if (timeout === undefined) {
      return signal;
    }

    const expiry = AbortSignal.timeout(timeout);

    return signal ? AbortSignal.any([signal, expiry]) : expiry;
  }

  private async fetchResource(
    url: string,
    authorization: string | undefined,
    signal: AbortSignal | undefined,
  ): Promise<FetchedResource> {
    // read once: an eviction mid-flight must not leave a 304 with no body
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
        // counted before the call: an attempt that throws still left the process
        this.state.stats.roundTrips += 1;
        response = await this.config.fetch(url, init);
      } catch (error) {
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

      // an undrained body holds its connection; not awaited, an intercepted one may never settle
      response.body?.cancel().catch(() => {});
      await backoff({ url, attempt, status: response.status, retryAfter, signal, retry, logger });
    }
  }

  /** The resource a response carries, or `undefined` when another attempt is the question. */
  private async resolveResponse(
    url: string,
    response: Response,
    known: EtagEntry | undefined,
  ): Promise<FetchedResource | undefined> {
    // before `ok`, which a 304 is not
    if (response.status === 304) {
      if (known === undefined) {
        // an intermediary added its own validator; nothing here can satisfy it
        throw await toPokenodeError(
          response,
          `Request to ${response.url} was answered 304, but this client holds no response to reuse`,
        );
      }

      // a 304 may rotate the validator (RFC 9110); keeping the old one wastes the next revalidation
      const refreshed = response.headers.get("ETag");
      await this.remember(url, known.value, refreshed === known.etag ? null : refreshed);

      return { data: known.value, status: response.status, revalidated: true };
    }

    if (!response.ok) {
      return undefined;
    }

    const data: unknown = await response.json();
    await this.remember(url, data, response.headers.get("ETag"));

    return { data, status: response.status };
  }

  /** Caches a body, and learns its validator when one is given. */
  private async remember(url: string, data: unknown, etag: string | null): Promise<void> {
    if (etag !== null) {
      this.state.etags?.set(url, { etag, value: data });
    }

    await this.state.cache?.set(url, data);
  }

  /** The one place a resolution is counted, so stats and logs agree. */
  private recordResponse(
    url: string,
    status: number,
    source: LogResponsePayload["source"],
    startedAt: number,
  ): void {
    this.state.stats[SOURCE_STAT[source]] += 1;

    this.config.logger?.debug({
      event: "response",
      ...logMessage("pokeapi response"),
      url,
      status,
      source,
      durationMs: performance.now() - startedAt,
    });
  }

  /** A cancellation is not a failure, so it goes to `debug`, not `error`. */
  private logFailure(
    error: unknown,
    signal: AbortSignal | undefined,
    url: string,
    startedAt: number,
  ): void {
    if (isAbort(error, signal)) {
      this.config.logger?.debug({
        event: "cancelled",
        ...logMessage("pokeapi request cancelled"),
        url,
        reason: error,
        durationMs: performance.now() - startedAt,
      });
      return;
    }

    this.config.logger?.error({
      event: "error",
      ...logMessage("pokeapi request failed"),
      url,
      err: error,
      error,
    });
  }
}
