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
 *  - [Items](https://pokeapi.co/docs/v2#item)
 *  - [Item Attributes](https://pokeapi.co/docs/v2#item-attributes)
 *  - [Item Categories](https://pokeapi.co/docs/v2#item-categories)
 *  - [Item Fling Effects](https://pokeapi.co/docs/v2#item-fling-effects)
 *  - [Item Pockets](https://pokeapi.co/docs/v2#item-pockets)
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#items-section)
 */
export class ItemClient extends BaseClient {
  /**
   * Get an Item by its name.
   * @param name The Item name.
   * @returns The matching Item.
   */
  public async getItemByName(name: string): Promise<Item> {
    return this.getResource(ENDPOINTS.ITEM, name);
  }

  /**
   * Get an Item by its ID.
   * @param id The Item ID.
   * @returns The matching Item.
   */
  public async getItemById(id: number): Promise<Item> {
    return this.getResource(ENDPOINTS.ITEM, id);
  }

  /**
   * Get an Item Attribute by its name.
   * @param name The Item Attribute name.
   * @returns The matching Item Attribute.
   */
  public async getItemAttributeByName(name: string): Promise<ItemAttribute> {
    return this.getResource(ENDPOINTS.ITEM_ATTRIBUTE, name);
  }

  /**
   * Get an Item Attribute by its ID.
   * @param id The Item Attribute ID.
   * @returns The matching Item Attribute.
   */
  public async getItemAttributeById(id: number): Promise<ItemAttribute> {
    return this.getResource(ENDPOINTS.ITEM_ATTRIBUTE, id);
  }

  /**
   * Get an Item Category by its name.
   * @param name The Item Category name.
   * @returns The matching Item Category.
   */
  public async getItemCategoryByName(name: string): Promise<ItemCategory> {
    return this.getResource(ENDPOINTS.ITEM_CATEGORY, name);
  }

  /**
   * Get an Item Category by its ID.
   * @param id The Item Category ID.
   * @returns The matching Item Category.
   */
  public async getItemCategoryById(id: number): Promise<ItemCategory> {
    return this.getResource(ENDPOINTS.ITEM_CATEGORY, id);
  }

  /**
   * Get an Item Fling Effect by its name.
   * @param name The Item Fling Effect name.
   * @returns The matching Item Fling Effect.
   */
  public async getItemFlingEffectByName(name: string): Promise<ItemFlingEffect> {
    return this.getResource(ENDPOINTS.ITEM_FLING_EFFECT, name);
  }

  /**
   * Get an Item Fling Effect by its ID.
   * @param id The Item Fling Effect ID.
   * @returns The matching Item Fling Effect.
   */
  public async getItemFlingEffectById(id: number): Promise<ItemFlingEffect> {
    return this.getResource(ENDPOINTS.ITEM_FLING_EFFECT, id);
  }

  /**
   * Get an Item Pocket by its name.
   * @param name The Item Pocket name.
   * @returns The matching Item Pocket.
   */
  public async getItemPocketByName(name: string): Promise<ItemPocket> {
    return this.getResource(ENDPOINTS.ITEM_POCKET, name);
  }

  /**
   * Get an Item Pocket by its ID.
   * @param id The Item Pocket ID.
   * @returns The matching Item Pocket.
   */
  public async getItemPocketById(id: number): Promise<ItemPocket> {
    return this.getResource(ENDPOINTS.ITEM_POCKET, id);
  }

  /**
   * List Items.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Items.
   */
  public async listItems(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.ITEM, offset, limit);
  }

  /**
   * List Item Attributes.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Item Attributes.
   */
  public async listItemAttributes(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.ITEM_ATTRIBUTE, offset, limit);
  }

  /**
   * List Item Categories.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Item Categories.
   */
  public async listItemCategories(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.ITEM_CATEGORY, offset, limit);
  }

  /**
   * List Item Fling Effects.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Item Fling Effects.
   */
  public async listItemFlingEffects(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.ITEM_FLING_EFFECT, offset, limit);
  }

  /**
   * List Item Pockets.
   * @param offset Index of the first resource returned. Defaults to 0.
   * @param limit How many resources per page. Defaults to 20.
   * @returns A paginated list of Item Pockets.
   */
  public async listItemPockets(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return this.getListResource(ENDPOINTS.ITEM_POCKET, offset, limit);
  }
}
