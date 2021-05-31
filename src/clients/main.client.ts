import { DestinationObjectOptions, LoggerOptions } from 'pino';
import { IAxiosCacheAdapterOptions } from 'axios-cache-adapter';
import { BaseClient } from '../structures/base';
import { BerryClient } from './berry.client';
import { ContestClient } from './contest.client';
import { EncounterClient } from './encounter.client';
import { EvolutionClient } from './evolution.client';
import { GameClient } from './game.client';
import { ItemClient } from './item.client';
import { LocationClient } from './location.client';
import { MachineClient } from './machine.client';
import { MoveClient } from './move.client';
import { PokemonClient } from './pokemon.client';

/**
 * ### Pokenode Client
 *
 * The main client used to access all the PokéAPI Endpoints:
 *  - Berries
 *  - Contests
 *  - Encounters
 *  - Evolution
 *  - Games
 *  - Items
 *  - Locations
 *  - Machines
 *  - Moves
 *  - Pokémon
 *  - Utility
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2)
 */
export class Pokenode extends BaseClient {
  public berry: BerryClient;

  public contest: ContestClient;

  public encounter: EncounterClient;

  public evolution: EvolutionClient;

  public game: GameClient;

  public item: ItemClient;

  public location: LocationClient;

  public machine: MachineClient;

  public move: MoveClient;

  public pokemon: PokemonClient;

  constructor(
    logOptions?: LoggerOptions,
    logDestination?: DestinationObjectOptions,
    cacheOptions?: IAxiosCacheAdapterOptions
  ) {
    super(logOptions, logDestination, cacheOptions);

    this.berry = new BerryClient(logOptions, logDestination, cacheOptions);
    this.contest = new ContestClient(logOptions, logDestination, cacheOptions);
    this.encounter = new EncounterClient(logOptions, logDestination, cacheOptions);
    this.evolution = new EvolutionClient(logOptions, logDestination, cacheOptions);
    this.game = new GameClient(logOptions, logDestination, cacheOptions);
    this.item = new ItemClient(logOptions, logDestination, cacheOptions);
    this.location = new LocationClient(logOptions, logDestination, cacheOptions);
    this.machine = new MachineClient(logOptions, logDestination, cacheOptions);
    this.move = new MoveClient(logOptions, logDestination, cacheOptions);
    this.pokemon = new PokemonClient(logOptions, logDestination, cacheOptions);
  }
}
