import { Endpoints } from "../constants/endpoints";
import {
  Item,
  ItemAttribute,
  ItemCategory,
  ItemFlingEffect,
  ItemPocket,
  NamedAPIResourceList,
} from "../models";
import { BaseClient } from "../structures/base";
import { getListURL } from "../utils/request-params";
import { AxiosError, AxiosResponse } from "axios";

/**
 * ### Item Client
 *
 * Client used to access the Item Endpoints:
 *  - [Item](https://pokeapi.co/docs/v2#item)
 *  - [Item Attributes](https://pokeapi.co/docs/v2#item-attributes)
 *  - [Item Categories](https://pokeapi.co/docs/v2#item-categories)
 *  - [Item Filing Effects](https://pokeapi.co/docs/v2#item-fling-effects)
 *  - [Item Pockets](https://pokeapi.co/docs/v2#item-pockets)
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#items-section)
 */
export class ItemClient extends BaseClient {
  /**
   * Get an Item by it's name
   * @param name The item name
   * @returns An Item
   */
  public async getItemByName(name: string): Promise<Item> {
    return new Promise<Item>((resolve, reject) => {
      this.api
        .get<Item>(`${Endpoints.ITEM}/${name}`)
        .then((response: AxiosResponse<Item>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get an Item by it's ID
   * @param id The item ID
   * @returns An Item
   */
  public async getItemById(id: number): Promise<Item> {
    return new Promise<Item>((resolve, reject) => {
      this.api
        .get<Item>(`${Endpoints.ITEM}/${id}`)
        .then((response: AxiosResponse<Item>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get an Item Attribute by it's name
   * @param name The item attribute name
   * @returns An Item Attribute
   */
  public async getItemAttributeByName(name: string): Promise<ItemAttribute> {
    return new Promise<ItemAttribute>((resolve, reject) => {
      this.api
        .get<ItemAttribute>(`${Endpoints.ITEM_ATTRIBUTE}/${name}`)
        .then((response: AxiosResponse<ItemAttribute>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get an Item Attribute by it's ID
   * @param id The item attribute ID
   * @returns An Item Attribute
   */
  public async getItemAttributeById(id: number): Promise<ItemAttribute> {
    return new Promise<ItemAttribute>((resolve, reject) => {
      this.api
        .get<ItemAttribute>(`${Endpoints.ITEM_ATTRIBUTE}/${id}`)
        .then((response: AxiosResponse<ItemAttribute>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get an Item Category by it's name
   * @param name The item category name
   * @returns An Item Category
   */
  public async getItemCategoryByName(name: string): Promise<ItemCategory> {
    return new Promise<ItemCategory>((resolve, reject) => {
      this.api
        .get<ItemCategory>(`${Endpoints.ITEM_CATEGORY}/${name}`)
        .then((response: AxiosResponse<ItemCategory>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get an Item Category by it's ID
   * @param id The item category ID
   * @returns An Item Category
   */
  public async getItemCategoryById(id: number): Promise<ItemCategory> {
    return new Promise<ItemCategory>((resolve, reject) => {
      this.api
        .get<ItemCategory>(`${Endpoints.ITEM_CATEGORY}/${id}`)
        .then((response: AxiosResponse<ItemCategory>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get an Item Filing Effect by it's name
   * @param name The item filing effect name
   * @returns An Item Filing Effect
   */
  public async getItemFlingEffectByName(name: string): Promise<ItemFlingEffect> {
    return new Promise<ItemFlingEffect>((resolve, reject) => {
      this.api
        .get<ItemFlingEffect>(`${Endpoints.ITEM_FLING_EFFECT}/${name}`)
        .then((response: AxiosResponse<ItemFlingEffect>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get an Item Filing Effect by it's ID
   * @param id The item filing effect ID
   * @returns An Item Filing Effect
   */
  public async getItemFlingEffectById(id: number): Promise<ItemFlingEffect> {
    return new Promise<ItemFlingEffect>((resolve, reject) => {
      this.api
        .get<ItemFlingEffect>(`${Endpoints.ITEM_FLING_EFFECT}/${id}`)
        .then((response: AxiosResponse<ItemFlingEffect>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get an Item Pocket by it's name
   * @param name The item pocket name
   * @returns An Item Pocket
   */
  public async getItemPocketByName(name: string): Promise<ItemPocket> {
    return new Promise<ItemPocket>((resolve, reject) => {
      this.api
        .get<ItemPocket>(`${Endpoints.ITEM_POCKET}/${name}`)
        .then((response: AxiosResponse<ItemPocket>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get an Item Pocket by it's ID
   * @param id The item pocket ID
   * @returns An Item Pocket
   */
  public async getItemPocketById(id: number): Promise<ItemPocket> {
    return new Promise<ItemPocket>((resolve, reject) => {
      this.api
        .get<ItemPocket>(`${Endpoints.ITEM_POCKET}/${id}`)
        .then((response: AxiosResponse<ItemPocket>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Items
   * @param offset The first item that you will get
   * @param limit How many Items per page
   * @returns A list of Items
   */
  public async listItems(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = getListURL(Endpoints.ITEM, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Item Attributes
   * @param offset The first item that you will get
   * @param limit How many Item Attributes per page
   * @returns A list of Item Attributes
   */
  public async listItemAttributes(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = getListURL(Endpoints.ITEM_ATTRIBUTE, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Item Categories
   * @param offset The first item that you will get
   * @param limit How many Item Categories per page
   * @returns A list of Item Categories
   */
  public async listItemCategories(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = getListURL(Endpoints.ITEM_CATEGORY, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Item Filing Effects
   * @param offset The first item that you will get
   * @param limit How many Item Filing Effects per page
   * @returns A list of Item Filing Effects
   */
  public async listItemFilingEffects(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = getListURL(Endpoints.ITEM_FLING_EFFECT, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Item Pockets
   * @param offset The first item that you will get
   * @param limit How many Item Pockets per page
   * @returns A list of Item Pockets
   */
  public async listItemPockets(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = getListURL(Endpoints.ITEM_POCKET, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }
}
