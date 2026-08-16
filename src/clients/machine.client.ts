import { ENDPOINTS } from "@constants";
import type { Machine, NamedAPIResourceList } from "@models";
import { BaseClient } from "./base";

/**
 * ### Machine Client
 *
 * Client used to access the Machine Endpoints:
 *  - [Machines](https://pokeapi.co/docs/v2#machines)
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#machines-section)
 */
export class MachineClient extends BaseClient {
  /**
   * Get a Machine by its ID.
   * @param id The Machine ID.
   * @returns The matching Machine.
   */
  public async getMachineById(id: number): Promise<Machine> {
    return this.getResource(ENDPOINTS.MACHINE, id);
  }

  /**
   * List Machines.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Machines.
   */
  public async listMachines(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<Machine>> {
    return this.getListResource<Machine>(ENDPOINTS.MACHINE, offset, limit);
  }
}
