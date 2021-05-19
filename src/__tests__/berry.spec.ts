import { Berry, BerryFirmness, BerryFlavor, NamedAPIResourceList } from '../models';
import { BerryClient } from '../clients/berry.client';

describe('Test Berry Client', () => {
  // Berry
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
  // Berry Firmness
  it('Check if it returns a berry firmness passig a name', async () => {
    const client = new BerryClient();
    const data = await client
      .getBerryFirmnessByName('very-soft')
      .then((response: BerryFirmness) => response);

    expect(data.name).toBe('very-soft');
  });
  it('Check if it returns a berry firmness passing an ID', async () => {
    const client = new BerryClient();
    const data = await client.getBerryFirmnessById(1).then((response: BerryFirmness) => response);

    expect(data.name).toBe('very-soft');
  });
  it('Check if it returns a list of berry firmnesses', async () => {
    const client = new BerryClient();
    const data = await client
      .listBerryFirmness()
      .then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Berry Flavor
  it('Check if it returns a berry flavor passig a name', async () => {
    const client = new BerryClient();
    const data = await client
      .getBerryFlavorByName('spicy')
      .then((response: BerryFlavor) => response);

    expect(data.name).toBe('spicy');
  });
  it('Check if it returns a berry flavor passing an ID', async () => {
    const client = new BerryClient();
    const data = await client.getBerryFlavorById(1).then((response: BerryFlavor) => response);

    expect(data.name).toBe('spicy');
  });
  it('Check if it returns a list of berry flavors', async () => {
    const client = new BerryClient();
    const data = await client.listBerryFlavors().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
});
