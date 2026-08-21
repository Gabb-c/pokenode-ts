import { Transport } from "../internal/transport";
import { ClientFacade, type ClientOptions } from "./base";
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
 * All the clients below share a single transport, so a resource fetched through
 * one of them is served from cache by the rest — and two of them asking for the
 * same URL at once make one round trip, not two.
 *
 * Composes its sections rather than inheriting from them: it extends
 * {@link ClientFacade}, not {@link BaseClient}, so it carries no endpoint of its
 * own.
 *
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2)
 */
export class MainClient extends ClientFacade {
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

  constructor(options?: ClientOptions);
  /** @internal Shares the transport a client already holds. */
  constructor(source?: ClientOptions | Transport);
  constructor(source?: ClientOptions | Transport) {
    // Built here rather than read back off the facade, which keeps it private:
    // one transport handed to all twelve, so a cached response, a learned ETag
    // and a request already on the wire are each worth having in every section
    // rather than only in the one that paid for it.
    const transport = source instanceof Transport ? source : Transport.create(source);

    super(transport);

    this.berry = new BerryClient(transport);
    this.contest = new ContestClient(transport);
    this.currency = new CurrencyClient(transport);
    this.encounter = new EncounterClient(transport);
    this.evolution = new EvolutionClient(transport);
    this.game = new GameClient(transport);
    this.item = new ItemClient(transport);
    this.location = new LocationClient(transport);
    this.machine = new MachineClient(transport);
    this.move = new MoveClient(transport);
    this.pokemon = new PokemonClient(transport);
    this.utility = new UtilityClient(transport);
  }
}
