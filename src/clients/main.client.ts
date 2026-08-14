import { type CacheStore, MemoryCache } from "../config/cache";
// Imported file by file rather than through the `@clients` barrel, which
// re-exports this module: the barrel would close an import cycle.
import type { ClientOptions } from "./base";
import { BerryClient } from "./berry.client";
import { ContestClient } from "./contest.client";
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
 * ### Main Client
 *
 * The main client used to access all the PokéAPI Endpoints:
 *  - [Berries](https://pokeapi.co/docs/v2#berries-section)
 *  - [Contests](https://pokeapi.co/docs/v2#contests-section)
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
  /** The store every client below shares, or `undefined` when caching is disabled. */
  public readonly cache: CacheStore | undefined;

  public readonly berry: BerryClient;
  public readonly contest: ContestClient;
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
    // Every client below builds its own store when handed none, so the store is
    // resolved once here instead. `false` survives the `??` and stays disabled.
    const cache = clientOptions?.cache ?? new MemoryCache();
    const sharedOptions: ClientOptions = { ...clientOptions, cache };

    this.cache = cache === false ? undefined : cache;

    this.berry = new BerryClient(sharedOptions);
    this.contest = new ContestClient(sharedOptions);
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

  /** Drops every cached response, for all the clients at once. */
  public async clearCache(): Promise<void> {
    await this.cache?.clear?.();
  }
}
