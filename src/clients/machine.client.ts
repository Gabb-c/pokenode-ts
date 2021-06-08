import { AxiosError, AxiosResponse } from 'axios';
import { Machine, NamedAPIResourceList } from '../models';
import { Endpoints } from '../constants';
import { BaseClient, ClientArgs } from '../structures/base';

/**
 * ### Machine Client
 *
 * Client used to access the Machine Endpoints:
 *  - Machines
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#machines-section)
 */
export class MachineClient extends BaseClient {
  /**
   * @argument clientOptions Options for the client.
   */
  constructor(clientOptions?: ClientArgs) {
    super(clientOptions);
  }

  /**
   * Get a Machine by it's ID
   * @param id The Machine ID
   * @returns A Machine
   */
  public async getMachineById(id: number): Promise<Machine> {
    return new Promise<Machine>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Machine}/${id}`)
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
        .get(`${Endpoints.Machine}?offset=${offset || 0}&limit=${limit || 20}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }
}
