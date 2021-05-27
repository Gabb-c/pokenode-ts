/* eslint-disable import/prefer-default-export */

import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { Machine, NamedAPIResourceList } from '../models';
import client from '../config/axios';
import { Endpoints } from '../constants';

export class MachineClient {
  private api: AxiosInstance = client;

  /**
   * Get a Machine by it's ID
   * @param id The Machine ID
   * @returns A Machine
   */
  public getMachineById(id: number): Promise<Machine> {
    return new Promise<Machine>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Machine}/${id}`)
        .then((response: AxiosResponse<Machine>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Machines
   * @param offset The first item that you will get
   * @param limit How many Machines per page
   * @returns A list of Machines
   */
  public listMachines(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Machine}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }
}
