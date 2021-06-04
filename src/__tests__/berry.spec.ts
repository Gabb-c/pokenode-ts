import { Berry, BerryFirmness, BerryFlavor, NamedAPIResourceList } from '../models';
import { Berries, BerryFirmnesses, BerryFlavors } from '../constants';
import { BerryClient } from '../clients';

describe('test Berry Client', () => {
  let client: BerryClient;
  beforeAll(() => {
    client = new BerryClient();
  });

  // Berry
  it('check if it returns a berry passig a name', async () => {
    const data = await client.getBerryByName('cheri').then((response: Berry) => response);

    expect(data.id).toBe(Berries.CHERI);
  });
  it('check if it returns a berry passing an ID', async () => {
    const data = await client.getBerryById(Berries.CHERI).then((response: Berry) => response);

    expect(data.name).toBe('cheri');
  });
  it('check if it returns a list of berries', async () => {
    const data = await client.listBerries().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Berry Firmness
  it('check if it returns a berry firmness passig a name', async () => {
    const data = await client
      .getBerryFirmnessByName('very-soft')
      .then((response: BerryFirmness) => response);

    expect(data.name).toBe('very-soft');
  });
  it('check if it returns a berry firmness passing an ID', async () => {
    const data = await client
      .getBerryFirmnessById(BerryFirmnesses.VERY_SOFT)
      .then((response: BerryFirmness) => response);

    expect(data.name).toBe('very-soft');
  });
  it('check if it returns a list of berry firmnesses', async () => {
    const data = await client
      .listBerryFirmnesses()
      .then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Berry Flavor
  it('check if it returns a berry flavor passig a name', async () => {
    const data = await client
      .getBerryFlavorByName('spicy')
      .then((response: BerryFlavor) => response);

    expect(data.id).toBe(BerryFlavors.SPICY);
  });
  it('check if it returns a berry flavor passing an ID', async () => {
    const data = await client
      .getBerryFlavorById(BerryFlavors.SPICY)
      .then((response: BerryFlavor) => response);

    expect(data.name).toBe('spicy');
  });
  it('check if it returns a list of berry flavors', async () => {
    const data = await client.listBerryFlavors().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
});
