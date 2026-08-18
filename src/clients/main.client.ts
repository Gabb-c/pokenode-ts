import { type CacheStore, EtagStore, MemoryCache } from "../config/cache";
import { DEFAULT_CONCURRENCY, mapWithConcurrency } from "../internal/pool";
import type { APIResource, NamedAPIResource } from "../models/common/resource";
import type { ClientOptions, RequestScope } from "./base";
import { BerryClient } from "./berry.client";
import { ContestClient } from "./contest.client";
import { CurrencyClient } from "./currency.client";
import { EncounterClient } from "./encounter.client";
import { EvolutionClient } from "./evolution.client";
import { GameClient } from "./game.client";
import { ItemClient } from "./item.client";
import { LocationClient } from "./location.client";
import { MachineClient } from "./machine.client";
import { MoveClient } from "./move.client";
import { PokemonClient } from "./pokemon.client";
import { UtilityClient } from "./utility.client";

/**
 * ## Resolve Options
 * How {@link MainClient.resolveAll} fetches the links it was given.
 */
export interface ResolveOptions {
  /** Links fetched at a time. Defaults to 4. */
  concurrency?: number;
}

/**
 * ### Main Client
 *
 * The main client used to access all the PokéAPI Endpoints:
 *  - [Berries](https://pokeapi.co/docs/v2#berries-section)
 *  - [Contests](https://pokeapi.co/docs/v2#contests-section)
 *  - [Currencies](https://pokeapi.co/docs/v2#currencies-section)
 *  - [Encounters](https://pokeapi.co/docs/v2#encounters-section)
 *  - [Evolution](https://pokeapi.co/docs/v2#evolution-section)
 *  - [Games](https://pokeapi.co/docs/v2#games-section)
 *  - [Items](https://pokeapi.co/docs/v2#items-section)
 *  - [Locations](https://pokeapi.co/docs/v2#locations-section)
 *  - [Machines](https://pokeapi.co/docs/v2#machines-section)
 *  - [Moves](https://pokeapi.co/docs/v2#moves-section)
 *  - [Pokémon](https://pokeapi.co/docs/v2#pokemon-section)
 *  - [Utility](https://pokeapi.co/docs/v2#utility-section)
 * ---
 * All the clients below share a single cache, so a resource fetched through one
 * of them is served from memory by the rest.
 *
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2)
 */
export class MainClient {
  public readonly cache: CacheStore | undefined;

  public readonly berry: BerryClient;
  public readonly contest: ContestClient;
  public readonly currency: CurrencyClient;
  public readonly encounter: EncounterClient;
  public readonly evolution: EvolutionClient;
  public readonly game: GameClient;
  public readonly item: ItemClient;
  public readonly location: LocationClient;
  public readonly machine: MachineClient;
  public readonly move: MoveClient;
  public readonly pokemon: PokemonClient;
  public readonly utility: UtilityClient;

  constructor(clientOptions?: ClientOptions) {
    const cache = clientOptions?.cache ?? new MemoryCache();
    // Built here rather than twelve times over, for the same reason as the cache:
    // an ETag learned through one section is worth having in all of them.
    const revalidate =
      clientOptions?.revalidate === true ? new EtagStore() : clientOptions?.revalidate;
    const sharedOptions: ClientOptions = {
      ...clientOptions,
      cache,
      ...(revalidate === undefined ? {} : { revalidate }),
    };

    this.cache = cache === false ? undefined : cache;

    this.berry = new BerryClient(sharedOptions);
    this.contest = new ContestClient(sharedOptions);
    this.currency = new CurrencyClient(sharedOptions);
    this.encounter = new EncounterClient(sharedOptions);
    this.evolution = new EvolutionClient(sharedOptions);
    this.game = new GameClient(sharedOptions);
    this.item = new ItemClient(sharedOptions);
    this.location = new LocationClient(sharedOptions);
    this.machine = new MachineClient(sharedOptions);
    this.move = new MoveClient(sharedOptions);
    this.pokemon = new PokemonClient(sharedOptions);
    this.utility = new UtilityClient(sharedOptions);
  }

  /**
   * Fetches what a link points at, through the cache every client here shares.
   *
   * A link carries what it points at, so the result is typed without saying so:
   *
   * ```ts
   * const pokemon = await api.pokemon.getPokemonByName('luxray');
   * const species = await api.resolve(pokemon.species);
   * //    ^? PokemonSpecies
   * ```
   *
   * @throws {TypeError} If the URL is not valid, or names no PokéAPI endpoint.
   */
  public async resolve<T>(resource: string | NamedAPIResource<T> | APIResource<T>): Promise<T> {
    return this.utility.getResourceByUrl(resource);
  }

  /**
   * Fetches what several links point at, in the order they were given.
   *
   * At most `concurrency` requests run at a time — four by default, because the
   * PokéAPI's fair-use policy asks clients not to flood it. The first failure
   * rejects, and no further link is fetched.
   *
   * ```ts
   * const pokemon = await api.pokemon.getPokemonByName('luxray');
   * const types = await api.resolveAll(pokemon.types.map((slot) => slot.type));
   * //    ^? Type[]
   * ```
   */
  public async resolveAll<T>(
    resources: readonly (string | NamedAPIResource<T> | APIResource<T>)[],
    options?: ResolveOptions,
  ): Promise<T[]> {
    return mapWithConcurrency(resources, options?.concurrency ?? DEFAULT_CONCURRENCY, (resource) =>
      this.utility.getResourceByUrl(resource),
    );
  }

  /**
   * Derives a client whose requests carry a signal, a timeout, or both, across
   * every section at once. The derived client shares this one's cache and its
   * in-flight requests.
   *
   * ```ts
   * const scoped = api.with({ signal: request.signal, timeout: 2_000 });
   *
   * await scoped.pokemon.getPokemonByName('luxray');
   * ```
   */
  public with(scope: RequestScope): MainClient {
    const clone = Object.create(Object.getPrototypeOf(this) as object) as MainClient;

    return Object.assign(clone, this, {
      berry: this.berry.with(scope),
      contest: this.contest.with(scope),
      currency: this.currency.with(scope),
      encounter: this.encounter.with(scope),
      evolution: this.evolution.with(scope),
      game: this.game.with(scope),
      item: this.item.with(scope),
      location: this.location.with(scope),
      machine: this.machine.with(scope),
      move: this.move.with(scope),
      pokemon: this.pokemon.with(scope),
      utility: this.utility.with(scope),
    });
  }

  /** Drops every cached response, for all the clients at once. */
  public async clearCache(): Promise<void> {
    await this.cache?.clear?.();
  }
}
