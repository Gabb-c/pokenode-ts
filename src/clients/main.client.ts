import { type CacheStore, MemoryCache } from "../config/cache";
import type { ClientOptions } from "./base";
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
    const sharedOptions: ClientOptions = { ...clientOptions, cache };

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

  /** Drops every cached response, for all the clients at once. */
  public async clearCache(): Promise<void> {
    await this.cache?.clear?.();
  }
}
