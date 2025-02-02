import {
  BerryClient,
  ContestClient,
  EncounterClient,
  EvolutionClient,
  GameClient,
  ItemClient,
  LocationClient,
  MachineClient,
  MoveClient,
  PokemonClient,
  UtilityClient,
} from "../clients";
import { BaseClient, type ClientArgs } from "./base";

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
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2)
 */
export class MainClient extends BaseClient {
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
  public utility: UtilityClient;

  constructor(clientOptions?: ClientArgs) {
    super(clientOptions);

    this.berry = new BerryClient(clientOptions);
    this.contest = new ContestClient(clientOptions);
    this.encounter = new EncounterClient(clientOptions);
    this.evolution = new EvolutionClient(clientOptions);
    this.game = new GameClient(clientOptions);
    this.item = new ItemClient(clientOptions);
    this.location = new LocationClient(clientOptions);
    this.machine = new MachineClient(clientOptions);
    this.move = new MoveClient(clientOptions);
    this.pokemon = new PokemonClient(clientOptions);
    this.utility = new UtilityClient(clientOptions);
  }
}
