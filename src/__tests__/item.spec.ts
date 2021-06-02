import { Item, ItemAttribute, NamedAPIResourceList } from '../models';
import { ItemClient } from '../clients';

describe('test Item Client', () => {
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
});
