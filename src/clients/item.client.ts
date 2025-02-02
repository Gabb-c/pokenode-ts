import { ENDPOINTS } from "../constants";
import type {
  Item,
  ItemAttribute,
  ItemCategory,
  ItemFlingEffect,
  ItemPocket,
  NamedAPIResourceList,
} from "../models";
import { BaseClient } from "./base";

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
    return this.getResource<Item>(ENDPOINTS.ITEM, name);
  }

  /**
   * Get an Item by it's ID
   * @param id The item ID
   * @returns An Item
   */
  public async getItemById(id: number): Promise<Item> {
    return this.getResource<Item>(ENDPOINTS.ITEM, id);
  }

  /**
   * Get an Item Attribute by it's name
   * @param name The item attribute name
   * @returns An Item Attribute
   */
  public async getItemAttributeByName(name: string): Promise<ItemAttribute> {
    return this.getResource<ItemAttribute>(ENDPOINTS.ITEM_ATTRIBUTE, name);
  }

  /**
   * Get an Item Attribute by it's ID
   * @param id The item attribute ID
   * @returns An Item Attribute
   */
  public async getItemAttributeById(id: number): Promise<ItemAttribute> {
    return this.getResource<ItemAttribute>(ENDPOINTS.ITEM_ATTRIBUTE, id);
  }

  /**
   * Get an Item Category by it's name
   * @param name The item category name
   * @returns An Item Category
   */
  public async getItemCategoryByName(name: string): Promise<ItemCategory> {
    return this.getResource<ItemCategory>(ENDPOINTS.ITEM_CATEGORY, name);
  }

  /**
   * Get an Item Category by it's ID
   * @param id The item category ID
   * @returns An Item Category
   */
  public async getItemCategoryById(id: number): Promise<ItemCategory> {
    return this.getResource<ItemCategory>(ENDPOINTS.ITEM_CATEGORY, id);
  }

  /**
   * Get an Item Filing Effect by it's name
   * @param name The item filing effect name
   * @returns An Item Filing Effect
   */
  public async getItemFlingEffectByName(name: string): Promise<ItemFlingEffect> {
    return this.getResource<ItemFlingEffect>(ENDPOINTS.ITEM_FLING_EFFECT, name);
  }

  /**
   * Get an Item Filing Effect by it's ID
   * @param id The item filing effect ID
   * @returns An Item Filing Effect
   */
  public async getItemFlingEffectById(id: number): Promise<ItemFlingEffect> {
    return this.getResource<ItemFlingEffect>(ENDPOINTS.ITEM_FLING_EFFECT, id);
  }

  /**
   * Get an Item Pocket by it's name
   * @param name The item pocket name
   * @returns An Item Pocket
   */
  public async getItemPocketByName(name: string): Promise<ItemPocket> {
    return this.getResource<ItemPocket>(ENDPOINTS.ITEM_POCKET, name);
  }

  /**
   * Get an Item Pocket by it's ID
   * @param id The item pocket ID
   * @returns An Item Pocket
   */
  public async getItemPocketById(id: number): Promise<ItemPocket> {
    return this.getResource<ItemPocket>(ENDPOINTS.ITEM_POCKET, id);
  }

  /**
   * List Items
   * @param offset The first item that you will get
   * @param limit How many Items per page
   * @returns A list of Items
   */
  public async listItems(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.ITEM, offset, limit);
  }

  /**
   * List Item Attributes
   * @param offset The first item that you will get
   * @param limit How many Item Attributes per page
   * @returns A list of Item Attributes
   */
  public async listItemAttributes(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.ITEM_ATTRIBUTE, offset, limit);
  }

  /**
   * List Item Categories
   * @param offset The first item that you will get
   * @param limit How many Item Categories per page
   * @returns A list of Item Categories
   */
  public async listItemCategories(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.ITEM_CATEGORY, offset, limit);
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
    return this.getListResource(ENDPOINTS.ITEM_FLING_EFFECT, offset, limit);
  }

  /**
   * List Item Pockets
   * @param offset The first item that you will get
   * @param limit How many Item Pockets per page
   * @returns A list of Item Pockets
   */
  public async listItemPockets(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.ITEM_POCKET, offset, limit);
  }
}
