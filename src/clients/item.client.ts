import { ENDPOINTS } from "@constants";
import type {
  Item,
  ItemAttribute,
  ItemCategory,
  ItemFlingEffect,
  ItemPocket,
  NamedAPIResourceList,
} from "@models";
import { BaseClient } from "./base";

/**
 * ### Item Client
 *
 * Client used to access the Item Endpoints:
 *
 * - [Items](https://pokeapi.co/docs/v2#item)
 * - [Item Attributes](https://pokeapi.co/docs/v2#item-attributes)
 * - [Item Categories](https://pokeapi.co/docs/v2#item-categories)
 * - [Item Fling Effects](https://pokeapi.co/docs/v2#item-fling-effects)
 * - [Item Pockets](https://pokeapi.co/docs/v2#item-pockets)
 *
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#items-section)
 */
export class ItemClient extends BaseClient {
  /** Get an Item by its name. */
  public async getItemByName(name: string): Promise<Item> {
    return this.getResource(ENDPOINTS.ITEM, name);
  }

  /** Get an Item by its ID. */
  public async getItemById(id: number): Promise<Item> {
    return this.getResource(ENDPOINTS.ITEM, id);
  }

  /** Get an Item Attribute by its name. */
  public async getItemAttributeByName(name: string): Promise<ItemAttribute> {
    return this.getResource(ENDPOINTS.ITEM_ATTRIBUTE, name);
  }

  /** Get an Item Attribute by its ID. */
  public async getItemAttributeById(id: number): Promise<ItemAttribute> {
    return this.getResource(ENDPOINTS.ITEM_ATTRIBUTE, id);
  }

  /** Get an Item Category by its name. */
  public async getItemCategoryByName(name: string): Promise<ItemCategory> {
    return this.getResource(ENDPOINTS.ITEM_CATEGORY, name);
  }

  /** Get an Item Category by its ID. */
  public async getItemCategoryById(id: number): Promise<ItemCategory> {
    return this.getResource(ENDPOINTS.ITEM_CATEGORY, id);
  }

  /** Get an Item Fling Effect by its name. */
  public async getItemFlingEffectByName(name: string): Promise<ItemFlingEffect> {
    return this.getResource(ENDPOINTS.ITEM_FLING_EFFECT, name);
  }

  /** Get an Item Fling Effect by its ID. */
  public async getItemFlingEffectById(id: number): Promise<ItemFlingEffect> {
    return this.getResource(ENDPOINTS.ITEM_FLING_EFFECT, id);
  }

  /** Get an Item Pocket by its name. */
  public async getItemPocketByName(name: string): Promise<ItemPocket> {
    return this.getResource(ENDPOINTS.ITEM_POCKET, name);
  }

  /** Get an Item Pocket by its ID. */
  public async getItemPocketById(id: number): Promise<ItemPocket> {
    return this.getResource(ENDPOINTS.ITEM_POCKET, id);
  }

  /** List Items. Page defaults to 20 entries from offset 0. */
  public async listItems(offset?: number, limit?: number): Promise<NamedAPIResourceList<Item>> {
    return this.getListResource<Item>(ENDPOINTS.ITEM, offset, limit);
  }

  /** List Item Attributes. Page defaults to 20 entries from offset 0. */
  public async listItemAttributes(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<ItemAttribute>> {
    return this.getListResource<ItemAttribute>(ENDPOINTS.ITEM_ATTRIBUTE, offset, limit);
  }

  /** List Item Categories. Page defaults to 20 entries from offset 0. */
  public async listItemCategories(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<ItemCategory>> {
    return this.getListResource<ItemCategory>(ENDPOINTS.ITEM_CATEGORY, offset, limit);
  }

  /** List Item Fling Effects. Page defaults to 20 entries from offset 0. */
  public async listItemFlingEffects(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<ItemFlingEffect>> {
    return this.getListResource<ItemFlingEffect>(ENDPOINTS.ITEM_FLING_EFFECT, offset, limit);
  }

  /** List Item Pockets. Page defaults to 20 entries from offset 0. */
  public async listItemPockets(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<ItemPocket>> {
    return this.getListResource<ItemPocket>(ENDPOINTS.ITEM_POCKET, offset, limit);
  }
}
