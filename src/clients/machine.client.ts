import { Endpoints } from "../constants";
import { Machine, NamedAPIResourceList } from "../models";
import { BaseClient } from "../structures/base";
import { AxiosError, AxiosResponse } from "axios";

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
    return new Promise<Machine>((resolve, reject) => {
      this.api
        .get<Machine>(`${Endpoints.Machine}/${id}`)
        .then((response: AxiosResponse<Machine>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Machines
   * @param offset The first item that you will get
   * @param limit How many Machines per page
   * @returns A list of Machines
   */
  public async listMachines(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get<NamedAPIResourceList>(
          `${Endpoints.Machine}?offset=${offset ?? 0}&limit=${limit ?? 20}`,
        )
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }
}
