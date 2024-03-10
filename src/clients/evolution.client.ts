import { ENDPOINTS } from "@constants";
import type { EvolutionChain, EvolutionTrigger, NamedAPIResourceList } from "@models";
import { BaseClient } from "./base";

/**
 * ### Evolution Client
 *
 * Client used to access the Berry Endpoints:
 *  - [Evolution Chains](https://pokeapi.co/docs/v2#evolution-chains)
 *  - [Evolution Triggers](https://pokeapi.co/docs/v2#evolution-triggers)
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#evolution-section)
 */
export class EvolutionClient extends BaseClient {
  /**
   * Get an Evolution Chain by it's ID
   * @param id The Evolution Chain ID
   * @returns An Evolution Chain
   */
  public async getEvolutionChainById(id: number): Promise<EvolutionChain> {
    return this.getResource(ENDPOINTS.EVOLUTION_CHAIN, id);
  }

  /**
   * Get an Evolution Trigger by it's ID
   * @param id The Evolution Trigger ID
   * @returns An Evolution Trigger
   */
  public async getEvolutionTriggerById(id: number): Promise<EvolutionTrigger> {
    return this.getResource(ENDPOINTS.EVOLUTION_TRIGGER, id);
  }

  /**
   * Get an Evolution Trigger by it's name
   * @param name The Evolution Trigger name
   * @returns An Evolution Trigger
   */
  public async getEvolutionTriggerByName(name: string): Promise<EvolutionTrigger> {
    return this.getResource(ENDPOINTS.EVOLUTION_TRIGGER, name);
  }

  /**
   * List Evolution Chains
   * @param offset The first item that you will get
   * @param limit How many Evolution Chains per page
   * @returns A list of Evolution Chains
   */
  public async listEvolutionChains(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.EVOLUTION_CHAIN, offset, limit);
  }

  /**
   * List Evolution Triggers
   * @param offset The first item that you will get
   * @param limit How many Evolution Triggers per page
   * @returns A list of Evolution Triggers
   */
  public async listEvolutionTriggers(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.EVOLUTION_TRIGGER, offset, limit);
  }
}
