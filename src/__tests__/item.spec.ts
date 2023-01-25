import { expect, describe, it, beforeAll } from 'vitest';
import {
  Item,
  ItemAttribute,
  ItemCategory,
  ItemFlingEffect,
  ItemPocket,
  NamedAPIResourceList,
} from '../models';
import { ItemClient } from '../clients';
import { ItemCategories, ItemFlingEffects, ItemPockets } from '../constants';

describe('Item Client', () => {
  let client: ItemClient;
  beforeAll(() => {
    client = new ItemClient();
  });

  // Item
  it('check if it returns an item passig a name', async () => {
    const data = await client.getItemByName('master-ball').then((response: Item) => response);

    expect(data.name).toBe('master-ball');
  });
  it('check if it returns an item passing an ID', async () => {
    const data = await client.getItemById(1).then((response: Item) => response);

    expect(data.name).toBe('master-ball');
  });
  it('check if it returns a list of Items', async () => {
    const data = await client.listItems().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });

  // Item Attribute
  it('check if it returns an item attribute passig a name', async () => {
    const data = await client
      .getItemAttributeByName('countable')
      .then((response: ItemAttribute) => response);

    expect(data.name).toBe('countable');
  });
  it('check if it returns an item attribute passing an ID', async () => {
    const data = await client.getItemAttributeById(1).then((response: ItemAttribute) => response);

    expect(data.name).toBe('countable');
  });
  it('check if it returns a list of item attributes', async () => {
    const data = await client
      .listItemAttributes()
      .then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });

  // Item Category
  it('check if it returns an item category passig a name', async () => {
    const data = await client
      .getItemCategoryByName('choice')
      .then((response: ItemCategory) => response);

    expect(data.id).toBe(13);
  });
  it('check if it returns an item category passing an ID', async () => {
    const data = await client
      .getItemCategoryById(ItemCategories.CHOICE)
      .then((response: ItemCategory) => response);

    expect(data.name).toBe('choice');
  });
  it('check if it returns a list of item categories', async () => {
    const data = await client
      .listItemCategories()
      .then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });

  // Item Fling Effects
  it('check if it returns an item fling effect passig a name', async () => {
    const data = await client
      .getItemFlingEffectByName('flinch')
      .then((response: ItemFlingEffect) => response);

    expect(data.id).toBe(ItemFlingEffects.FLINCH);
  });
  it('check if it returns an item fling effect passing an ID', async () => {
    const data = await client
      .getItemFlingEffectById(ItemFlingEffects.FLINCH)
      .then((response: ItemFlingEffect) => response);

    expect(data.name).toBe('flinch');
  });
  it('check if it returns a list of item fling effects', async () => {
    const data = await client
      .listItemFilingEffects()
      .then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });

  // Item Pocket
  it('check if it returns an item pocket passig a name', async () => {
    const data = await client
      .getItemPocketByName('battle')
      .then((response: ItemPocket) => response);

    expect(data.id).toBe(ItemPockets.BATTLE);
  });
  it('check if it returns an item pocket passing an ID', async () => {
    const data = await client
      .getItemPocketById(ItemPockets.BATTLE)
      .then((response: ItemPocket) => response);

    expect(data.name).toBe('battle');
  });
  it('check if it returns a list of item pockets', async () => {
    const data = await client.listItemPockets().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
});
