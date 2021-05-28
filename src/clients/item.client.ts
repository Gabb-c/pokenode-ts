/* eslint-disable import/prefer-default-export */

import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { DestinationObjectOptions, Logger, LoggerOptions } from 'pino';
import { IAxiosCacheAdapterOptions, setup } from 'axios-cache-adapter';
import {
  Item,
  ItemAttribute,
  ItemCategory,
  ItemFlingEffect,
  ItemPocket,
  NamedAPIResourceList,
} from '../models';
import { Endpoints } from '../constants/endpoints';
import { BaseURL } from '../constants';
import {
  createLogger,
  handleRequest,
  handleRequestError,
  handleResponse,
  handleResponseError,
} from '../config/logger';

/**
 * ### Item Client
 *
 * Client used to access the Item Endpoints:
 *  - Item
 *  - Item Attributes
 *  - Item Categories
 *  - Item Filing Effects
 *  - Item Pockets
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#items-section)
 */
export class ItemClient {
  private api: AxiosInstance;

  private logger: Logger;

  /**
   * @param logOptions Options for the logger.
   * @param logDestination Options for the logs destination.
   * @param cacheOptions Options for the axios-cache.
   */
  constructor(
    logOptions?: LoggerOptions,
    logDestination?: DestinationObjectOptions,
    cacheOptions?: IAxiosCacheAdapterOptions
  ) {
    this.api = setup({
      baseURL: BaseURL.REST,
      headers: {
        'Content-Type': 'application/json',
      },
      cache: cacheOptions,
    });

    this.logger = createLogger(
      {
        enabled: !(logOptions?.enabled === undefined || logOptions.enabled === false),
        ...logOptions,
      },
      logDestination
    );

    this.api.interceptors.request.use(
      (config: AxiosRequestConfig) => handleRequest(config, this.logger),
      (error: AxiosError<string>) => handleRequestError(error, this.logger)
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => handleResponse(response, this.logger),
      (error: AxiosError<string>) => handleResponseError(error, this.logger)
    );
  }

  /**
   * Get an Item by it's name
   * @param name The item name
   * @returns An Item
   */
  public getItemByName(name: string): Promise<Item> {
    return new Promise<Item>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Item}/${name}`)
        .then((response: AxiosResponse<Item>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get an Item by it's ID
   * @param id The item ID
   * @returns An Item
   */
  public getItemById(id: number): Promise<Item> {
    return new Promise<Item>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Item}/${id}`)
        .then((response: AxiosResponse<Item>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get an Item Attribute by it's name
   * @param name The item attribute name
   * @returns An Item Attribute
   */
  public getItemAttributeByName(name: string): Promise<ItemAttribute> {
    return new Promise<ItemAttribute>((resolve, reject) => {
      this.api
        .get(`${Endpoints.ItemAttribute}/${name}`)
        .then((response: AxiosResponse<ItemAttribute>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get an Item Attribute by it's ID
   * @param id The item attribute ID
   * @returns An Item Attribute
   */
  public getItemAttributeById(id: number): Promise<ItemAttribute> {
    return new Promise<ItemAttribute>((resolve, reject) => {
      this.api
        .get(`${Endpoints.ItemAttribute}/${id}`)
        .then((response: AxiosResponse<ItemAttribute>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get an Item Category by it's name
   * @param name The item category name
   * @returns An Item Category
   */
  public getItemCategoryByName(name: string): Promise<ItemCategory> {
    return new Promise<ItemCategory>((resolve, reject) => {
      this.api
        .get(`${Endpoints.ItemCategory}/${name}`)
        .then((response: AxiosResponse<ItemCategory>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get an Item Category by it's ID
   * @param id The item category ID
   * @returns An Item Category
   */
  public getItemCategoryById(id: number): Promise<ItemCategory> {
    return new Promise<ItemCategory>((resolve, reject) => {
      this.api
        .get(`${Endpoints.ItemCategory}/${id}`)
        .then((response: AxiosResponse<ItemCategory>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get an Item Filing Effect by it's name
   * @param name The item filing effect name
   * @returns An Item Filing Effect
   */
  public getItemFilingEffectByName(name: string): Promise<ItemFlingEffect> {
    return new Promise<ItemFlingEffect>((resolve, reject) => {
      this.api
        .get(`${Endpoints.ItemFlingEffect}/${name}`)
        .then((response: AxiosResponse<ItemFlingEffect>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get an Item Filing Effect by it's ID
   * @param id The item filing effect ID
   * @returns An Item Filing Effect
   */
  public getItemFilingEffectById(id: number): Promise<ItemFlingEffect> {
    return new Promise<ItemFlingEffect>((resolve, reject) => {
      this.api
        .get(`${Endpoints.ItemFlingEffect}/${id}`)
        .then((response: AxiosResponse<ItemFlingEffect>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get an Item Pocket by it's name
   * @param name The item pocket name
   * @returns An Item Pocket
   */
  public getItemPocketByName(name: string): Promise<ItemPocket> {
    return new Promise<ItemPocket>((resolve, reject) => {
      this.api
        .get(`${Endpoints.ItemPocket}/${name}`)
        .then((response: AxiosResponse<ItemPocket>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get an Item Pocket by it's ID
   * @param id The item pocket ID
   * @returns An Item Pocket
   */
  public getItemPocketById(id: number): Promise<ItemPocket> {
    return new Promise<ItemPocket>((resolve, reject) => {
      this.api
        .get(`${Endpoints.ItemPocket}/${id}`)
        .then((response: AxiosResponse<ItemPocket>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Items
   * @param offset The first item that you will get
   * @param limit How many Items per page
   * @returns A list of Items
   */
  public listItems(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Item}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Item Attributes
   * @param offset The first item that you will get
   * @param limit How many Item Attributes per page
   * @returns A list of Item Attributes
   */
  public listItemAttributes(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.ItemAttribute}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Item Categories
   * @param offset The first item that you will get
   * @param limit How many Item Categories per page
   * @returns A list of Item Categories
   */
  public listItemCategories(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.ItemCategory}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Item Filing Effects
   * @param offset The first item that you will get
   * @param limit How many Item Filing Effects per page
   * @returns A list of Item Filing Effects
   */
  public listItemFilingEffects(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.ItemFlingEffect}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }
}
