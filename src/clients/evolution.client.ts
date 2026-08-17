import { ENDPOINTS } from "@constants";
import type {
  APIResourceList,
  EvolutionChain,
  EvolutionTrigger,
  NamedAPIResourceList,
} from "@models";
import { BaseClient } from "./base";

/**
 * ### Evolution Client
 *
 * Client used to access the Evolution Endpoints:
 *  - [Evolution Chains](https://pokeapi.co/docs/v2#evolution-chains)
 *  - [Evolution Triggers](https://pokeapi.co/docs/v2#evolution-triggers)
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#evolution-section)
 */
export class EvolutionClient extends BaseClient {
  /**
   * Get an Evolution Chain by its ID.
   * @param id The Evolution Chain ID.
   * @returns The matching Evolution Chain.
   */
  public async getEvolutionChainById(id: number): Promise<EvolutionChain> {
    return this.getResource(ENDPOINTS.EVOLUTION_CHAIN, id);
  }

  /**
   * Get an Evolution Trigger by its ID.
   * @param id The Evolution Trigger ID.
   * @returns The matching Evolution Trigger.
   */
  public async getEvolutionTriggerById(id: number): Promise<EvolutionTrigger> {
    return this.getResource(ENDPOINTS.EVOLUTION_TRIGGER, id);
  }

  /**
   * Get an Evolution Trigger by its name.
   * @param name The Evolution Trigger name.
   * @returns The matching Evolution Trigger.
   */
  public async getEvolutionTriggerByName(name: string): Promise<EvolutionTrigger> {
    return this.getResource(ENDPOINTS.EVOLUTION_TRIGGER, name);
  }

  /**
   * List Evolution Chains.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Evolution Chains.
   */
  public async listEvolutionChains(
    offset?: number,
    limit?: number,
  ): Promise<APIResourceList<EvolutionChain>> {
    return this.getUnnamedListResource<EvolutionChain>(ENDPOINTS.EVOLUTION_CHAIN, offset, limit);
  }

  /**
   * List Evolution Triggers.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Evolution Triggers.
   */
  public async listEvolutionTriggers(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<EvolutionTrigger>> {
    return this.getListResource<EvolutionTrigger>(ENDPOINTS.EVOLUTION_TRIGGER, offset, limit);
  }
}
