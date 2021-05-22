/* eslint-disable import/prefer-default-export */

import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { EvolutionChain, EvolutionTrigger, NamedAPIResourceList } from '../models';
import client from '../config/axios';
import { Endpoints } from '../constants/endpoints';

export class EvolutionClient {
  private api: AxiosInstance = client;

  /**
   * Get an Evolution Chain by it's ID
   * @param id The Evolution Chain ID
   * @returns An Evolution Chain
   */
  public getEvolutionChainById(id: number): Promise<EvolutionChain> {
    return new Promise<EvolutionChain>((resolve, reject) => {
      this.api
        .get(`${Endpoints.EvolutionChain}/${id}`)
        .then((response: AxiosResponse<EvolutionChain>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get an Evolution Trigger by it's ID
   * @param id The Evolution Trigger ID
   * @returns An Evolution Trigger
   */
  public getEvolutionTriggerById(id: number): Promise<EvolutionTrigger> {
    return new Promise<EvolutionTrigger>((resolve, reject) => {
      this.api
        .get(`${Endpoints.EvolutionTrigger}/${id}`)
        .then((response: AxiosResponse<EvolutionTrigger>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get an Evolution Trigger by it's name
   * @param name The Evolution Trigger name
   * @returns An Evolution Trigger
   */
  public getEvolutionTriggerByName(name: string): Promise<EvolutionTrigger> {
    return new Promise<EvolutionTrigger>((resolve, reject) => {
      this.api
        .get(`${Endpoints.EvolutionTrigger}/${name}`)
        .then((response: AxiosResponse<EvolutionTrigger>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Evolution Chains
   * @param offset The first item that you will get
   * @param limit How many Evolution Chains per page
   * @returns A list of Evolution Chains
   */
  public listEvolutionChains(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.EvolutionChain}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Evolution Triggers
   * @param offset The first item that you will get
   * @param limit How many Evolution Triggers per page
   * @returns A list of Evolution Triggers
   */
  public listEvolutionTriggers(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.EvolutionTrigger}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }
}
