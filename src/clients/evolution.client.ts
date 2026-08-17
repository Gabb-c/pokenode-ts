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
  /** Get an Evolution Chain by its ID. */
  public async getEvolutionChainById(id: number): Promise<EvolutionChain> {
    return this.getResource(ENDPOINTS.EVOLUTION_CHAIN, id);
  }

  /** Get an Evolution Trigger by its ID. */
  public async getEvolutionTriggerById(id: number): Promise<EvolutionTrigger> {
    return this.getResource(ENDPOINTS.EVOLUTION_TRIGGER, id);
  }

  /** Get an Evolution Trigger by its name. */
  public async getEvolutionTriggerByName(name: string): Promise<EvolutionTrigger> {
    return this.getResource(ENDPOINTS.EVOLUTION_TRIGGER, name);
  }

  /** List Evolution Chains. Page defaults to 20 entries from offset 0. */
  public async listEvolutionChains(
    offset?: number,
    limit?: number,
  ): Promise<APIResourceList<EvolutionChain>> {
    return this.getUnnamedListResource<EvolutionChain>(ENDPOINTS.EVOLUTION_CHAIN, offset, limit);
  }

  /** List Evolution Triggers. Page defaults to 20 entries from offset 0. */
  public async listEvolutionTriggers(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<EvolutionTrigger>> {
    return this.getListResource<EvolutionTrigger>(ENDPOINTS.EVOLUTION_TRIGGER, offset, limit);
  }
}
