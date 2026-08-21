import type { CacheStore, EtagStore } from "../config/cache";
import type { Logger } from "../config/logger";
import type { Endpoint } from "../constants";
import { Transport } from "../internal/transport";
import type {
  APIResource,
  APIResourceList,
  NamedAPIResource,
  NamedAPIResourceList,
} from "../models/common/resource";

/**
 * ## Fetch Like
 * A `fetch` implementation taking a string URL, as every client call does.
 */
export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

/**
 * ## Retry Options
 * When a failed request is worth attempting again.
 *
 * Retrying is off unless this is given — a client that quietly triples its own
 * traffic is not something to opt out of after the fact.
 */
export interface RetryOptions {
  /** Attempts in total, the first one included. Defaults to 3. */
  attempts?: number;
  /** Statuses worth another attempt. Defaults to 429, 500, 502, 503 and 504. */
  statuses?: number[];
  /** The first wait, in milliseconds, doubling from there. Defaults to 300. */
  initialDelay?: number;
  /** The longest this client will ever wait between attempts. Defaults to 5000. */
  maxDelay?: number;
}

/**
 * ## Request Scope
 * Cancellation applied to every request a client makes.
 *
 * Passed to {@link ClientFacade.with}, not to the constructor: a signal belongs
 * to one unit of work, while a client outlives many, and a client holding a
 * signal for its whole life is dead the first time that signal aborts.
 */
export interface RequestScope {
  /** Aborts the requests made through this scope. */
  signal?: AbortSignal;
  /** How long a request may take, in milliseconds, before it is aborted. */
  timeout?: number;
}

/**
 * ## Client Options
 * Optional configuration accepted by every client.
 */
export interface ClientOptions {
  /**
   * Where the request lifecycle is reported. Leave empty to log nothing, or pass
   * {@link consoleLogger} to write it to the console.
   */
  logger?: Logger;
  /**
   * Response cache. Leave empty for an in-memory {@link MemoryCache}, pass `false`
   * to disable caching, or supply your own {@link CacheStore}.
   */
  cache?: CacheStore | false;
  /** Location of the PokéAPI. Leave empty to use the official PokéAPI instance. */
  baseURL?: string;
  /**
   * Custom `fetch` implementation, for proxies, retries, cancellation or
   * instrumentation. Defaults to the global `fetch`.
   *
   * Requests carry no timeout of their own: derive a scoped client with
   * {@link ClientFacade.with} if you want one.
   */
  fetch?: FetchLike;
  /**
   * When to attempt a failed request again. Leave empty to attempt each request
   * exactly once.
   */
  retry?: RetryOptions;
  /**
   * Ask the PokéAPI whether a response has changed, rather than downloading it
   * again, once the {@link CacheStore} entry for it has expired.
   *
   * Pass `true` for a default {@link EtagStore}, or one of your own to size it.
   * Leave empty and every expired entry is refetched in full.
   */
  revalidate?: boolean | EtagStore;
}

/**
 * ## List Page
 * The part of a resource list a walk needs: how much there is, and this page of
 * it. Both {@link NamedAPIResourceList} and {@link APIResourceList} qualify.
 */
export interface ListPage<L> {
  count: number;
  results: L[];
}

/**
 * ## List Fn
 * A list method, called with the offset and the limit of the page to fetch.
 */
export type ListFn<L> = (offset: number, limit: number) => Promise<ListPage<L>>;

/**
 * ## List Method
 * The shape every `list*` method on a section client has.
 */
export type ListMethod = (
  offset?: number,
  limit?: number,
) => Promise<ListPage<APIResource<unknown>>>;

/**
 * ## List Method Name
 * The names of `C`'s own list methods, and nothing else — so naming one to
 * {@link BaseClient.paginate} is checked and completed by the compiler.
 */
export type ListMethodName<C> = {
  [K in keyof C]: C[K] extends ListMethod ? K : never;
}[keyof C];

/** What a list method's page is made of. */
export type Listed<F> = F extends (offset?: number, limit?: number) => Promise<ListPage<infer L>>
  ? L
  : never;

/** What a listed link resolves to. */
export type Resolves<L> = L extends APIResource<infer T> ? T : never;

/**
 * ## Paginate Options
 * How {@link BaseClient.paginate} walks a list endpoint.
 */
export interface PaginateOptions {
  /** Entries fetched per request. Defaults to 20. */
  pageSize?: number;
  /** Fetch each link and yield the resource instead. Defaults to `false`. */
  resolve?: boolean;
  /** Links resolved at a time, when `resolve` is set. Defaults to 4. */
  concurrency?: number;
}

/**
 * ## Resolve Options
 * How {@link ClientFacade.resolveAll} fetches the links it was given.
 */
export interface ResolveOptions {
  /** Links fetched at a time. Defaults to 4. */
  concurrency?: number;
}

/**
 * ## Client Facade
 * What every client is, underneath: something that owns a transport and talks
 * to it. Holds the members {@link BaseClient} and {@link MainClient} would
 * otherwise each declare — the cache, the scope, and following a link.
 *
 * The transport is a `#private` field rather than a `protected` one so that
 * nothing about it reaches the published types: a `protected` member keeps its
 * type in the emitted `.d.ts`, which would put the whole internal transport
 * surface in front of consumers who cannot name it.
 */
export abstract class ClientFacade {
  readonly #transport: Transport;

  constructor(options?: ClientOptions);
  /** @internal Shares the transport a client already holds. */
  constructor(source?: ClientOptions | Transport);
  constructor(source?: ClientOptions | Transport) {
    this.#transport = source instanceof Transport ? source : Transport.create(source);
  }

  /** The store backing this client, or `undefined` when caching is disabled. */
  public get cache(): CacheStore | undefined {
    return this.#transport.cache;
  }

  /**
   * Derives a client whose requests carry a signal, a timeout, or both.
   *
   * The clone shares this client's transport — its cache, its validators and the
   * requests already on the wire — so a scoped call still joins an identical
   * unscoped one instead of repeating it. Cloning is cheap, but not free: derive
   * one per unit of work — a request handler, a job — rather than one per call.
   *
   * ```ts
   * const scoped = api.with({ signal: request.signal, timeout: 2_000 });
   * ```
   */
  public with(scope: RequestScope): this {
    // Rebuilt through the constructor rather than copied, so that whatever a
    // subclass sets up is initialised instead of skipped — the twelve sections
    // `MainClient` builds, for one. Every constructor down here takes the same
    // `ClientOptions | Transport`, which is what makes the cast hold.
    const Client = this.constructor as new (transport: Transport) => this;

    return new Client(this.#transport.with(scope));
  }

  /**
   * Drops every cached response. A {@link CacheStore} that does not implement
   * `clear` is left alone.
   *
   * The store is the transport's, so a client sharing one with others clears
   * theirs too.
   */
  public async clearCache(): Promise<void> {
    await this.#transport.clear();
  }

  /**
   * Fetches what a link points at, through this client's cache and scope.
   *
   * A link carries what it points at, so the result is typed without saying so:
   *
   * ```ts
   * const pokemon = await api.getPokemonByName('luxray');
   * const species = await api.resolve(pokemon.species);
   * //    ^? PokemonSpecies
   * ```
   *
   * A link names a resource, not a section, so any client resolves any link.
   *
   * @throws {TypeError} If the URL is not valid, or names no PokéAPI endpoint.
   */
  public async resolve<T>(resource: string | NamedAPIResource<T> | APIResource<T>): Promise<T> {
    return this.#transport.byURL<T>(resource);
  }

  /**
   * Fetches what several links point at, in the order they were given.
   *
   * At most `concurrency` requests run at a time — four by default, because the
   * PokéAPI's fair-use policy asks clients not to flood it. The first failure
   * rejects, and no further link is fetched.
   *
   * ```ts
   * const types = await api.resolveAll(pokemon.types.map((slot) => slot.type));
   * //    ^? Type[]
   * ```
   */
  public async resolveAll<T>(
    resources: readonly (string | NamedAPIResource<T> | APIResource<T>)[],
    options?: ResolveOptions,
  ): Promise<T[]> {
    return this.#transport.resolveAll<T>(resources, options?.concurrency);
  }

  /**
   * Retrieves a single resource from the PokéAPI by its endpoint and identifier.
   *
   * @param segments - The identifier of the resource, followed by any path below
   *   it. Each is percent-encoded, so pass `id, 'encounters'` rather than
   *   `` `${id}/encounters` ``. Omit them to address the endpoint itself.
   */
  protected async getResource<T>(endpoint: Endpoint, ...segments: (string | number)[]): Promise<T> {
    return this.#transport.resource<T>(endpoint, ...segments);
  }

  /**
   * Retrieves a resource by its URL, or by a link taken from another response.
   *
   * A link knows what it points at, so passing one infers `T`; a bare string
   * does not, and needs `T` named.
   *
   * @throws {TypeError} If the URL is not valid, or names no endpoint under `baseURL`.
   */
  protected async getResourceByURL<T>(
    resource: string | NamedAPIResource<T> | APIResource<T>,
    baseURL?: string,
  ): Promise<T> {
    return this.#transport.byURL<T>(resource, baseURL);
  }

  /**
   * Retrieves a list of resources from the PokéAPI with pagination support.
   *
   * @template T - What the listed links resolve to.
   */
  protected async getListResource<T = unknown>(
    endpoint: Endpoint,
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<T>> {
    return this.#transport.list<NamedAPIResourceList<T>>(endpoint, offset, limit);
  }

  /**
   * Retrieves a list of resources that have no name to list, with pagination support.
   *
   * @template T - What the listed links resolve to.
   */
  protected async getUnnamedListResource<T = unknown>(
    endpoint: Endpoint,
    offset?: number,
    limit?: number,
  ): Promise<APIResourceList<T>> {
    return this.#transport.list<APIResourceList<T>>(endpoint, offset, limit);
  }

  /**
   * Walks every page of a list, yielding one entry at a time. The bridge
   * {@link BaseClient.paginate} reaches the transport through, so that no
   * signature here has to name one.
   */
  protected walk<T>(
    list: ListFn<APIResource<T>>,
    options?: PaginateOptions,
  ): AsyncGenerator<APIResource<T> | T> {
    return this.#transport.walk(list, options);
  }
}

/**
 * ## Base Client
 * Base class for every section client. Names endpoints; the transport behind
 * {@link ClientFacade} does everything else — requests, caching, coalescing,
 * retries and logs.
 *
 * A {@link MainClient} builds one transport and hands it to all twelve of its
 * section clients, which is what makes them share a cache and a round trip.
 */
export class BaseClient extends ClientFacade {
  /**
   * Walks every page of a list endpoint, yielding one entry at a time.
   *
   * Name the list method to walk; the offset and the limit are this method's to
   * manage.
   *
   * ```ts
   * for await (const berry of api.berry.paginate('listBerries')) {
   *   console.log(berry.name);
   * }
   * ```
   *
   * With `resolve`, each link is fetched and the resource is yielded instead of
   * the link. Requests are capped at `concurrency` at a time — the default is
   * deliberately low, because walking a section is exactly the traffic the
   * PokéAPI's fair-use policy asks clients to keep gentle.
   *
   * ```ts
   * for await (const berry of api.berry.paginate('listBerries', { resolve: true })) {
   *   console.log(berry.growth_time);
   * }
   * ```
   *
   * A function is accepted too, for a list this client does not carry — a page
   * of a foreign endpoint, or one narrowed before the walk sees it.
   *
   * ```ts
   * api.berry.paginate((offset, limit) => api.berry.listBerries(offset, limit));
   * ```
   */
  public paginate<K extends ListMethodName<this>>(
    list: K,
    options?: PaginateOptions & { resolve?: false },
  ): AsyncGenerator<Listed<this[K]>>;
  public paginate<K extends ListMethodName<this>>(
    list: K,
    options: PaginateOptions & { resolve: true },
  ): AsyncGenerator<Resolves<Listed<this[K]>>>;
  public paginate<L extends APIResource<unknown>>(
    list: ListFn<L>,
    options?: PaginateOptions & { resolve?: false },
  ): AsyncGenerator<L>;
  public paginate<T>(
    list: ListFn<APIResource<T>>,
    options: PaginateOptions & { resolve: true },
  ): AsyncGenerator<T>;
  public paginate<T>(
    list: ListFn<APIResource<T>> | ListMethodName<this>,
    options?: PaginateOptions,
  ): AsyncGenerator<APIResource<T> | T> {
    // A named method is bound here rather than by the caller: reaching it
    // through `this` is the whole point of naming it, and `this` is what
    // carries the scope a derived client was given.
    const listPage =
      typeof list === "function"
        ? list
        : (offset: number, limit: number) => (this[list] as ListFn<APIResource<T>>)(offset, limit);

    return this.walk(listPage, options);
  }
}
