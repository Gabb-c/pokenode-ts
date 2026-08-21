import { ENDPOINTS } from "@constants";
import type { APIResourceList, Machine } from "@models";
import { BaseClient } from "./base";

/**
 * ### Machine Client
 *
 * Client used to access the Machine Endpoints:
 *
 * - [Machines](https://pokeapi.co/docs/v2#machines)
 *
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#machines-section)
 */
export class MachineClient extends BaseClient {
  /** Get a Machine by its ID. */
  public async getMachineById(id: number): Promise<Machine> {
    return this.getResource(ENDPOINTS.MACHINE, id);
  }

  /** List Machines. Page defaults to 20 entries from offset 0. */
  public async listMachines(offset?: number, limit?: number): Promise<APIResourceList<Machine>> {
    return this.getUnnamedListResource<Machine>(ENDPOINTS.MACHINE, offset, limit);
  }
}
