import { Berry, NamedAPIResourceList } from '../models';
import { BerryClient } from '../clients/berry.client';

describe('Test Berry Client', () => {
  it('Check if it returns a berry passig a name', async () => {
    const client = new BerryClient();

    const data = await client.getBerryByName('cheri').then((response: Berry) => response);

    expect(data.name).toBe('cheri');
  });
  it('Check if it returns a berry passing an ID', async () => {
    const client = new BerryClient();

    const data = await client.getBerryById(1).then((response: Berry) => response);

    expect(data.name).toBe('cheri');
  });
  it('Check if it returns a list of berries', async () => {
    const client = new BerryClient();

    const data = await client.listBerries().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
});
