import { ENDPOINTS } from "@constants";
import type { Machine, NamedAPIResourceList } from "@models";
import { BaseClient } from "./base";

/**
 * ### Machine Client
 *
 * Client used to access the Machine Endpoints:
 *  - [Machines](https://pokeapi.co/docs/v2#machines)
 *
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#machines-section)
 */
export class MachineClient extends BaseClient {
  /**
   * Get a Machine by it's ID
   * @param id The Machine ID
   * @returns A Machine
   */
  public async getMachineById(id: number): Promise<Machine> {
    return this.getResource(ENDPOINTS.MACHINE, id);
  }

  /**
   * List Machines
   * @param offset The first item that you will get
   * @param limit How many Machines per page
   * @returns A list of Machines
   */
  public async listMachines(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.MACHINE, offset, limit);
  }
}
