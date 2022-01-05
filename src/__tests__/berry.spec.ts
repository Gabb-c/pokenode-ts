import { Berry, BerryFirmness, BerryFlavor, NamedAPIResourceList } from '../models';
import { Berries, BerryFirmnesses, BerryFlavors } from '../constants';
import { BerryClient } from '../clients';
import { AxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';

const aHugeNumber = 62_436_346;

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

  it('check if getBerryByName returns NOT FOUND', async () => {
    const data = await client
      .getBerryByName('it will not pass')
      .catch((error: AxiosError<string>) => error.response?.status);

    expect(data).toBe(StatusCodes.NOT_FOUND);
  });

  it('check if getBerryById returns NOT FOUND', async () => {
    const data = await client
      .getBerryById(aHugeNumber)
      .catch((error: AxiosError<string>) => error.response?.status);

    expect(data).toBe(StatusCodes.NOT_FOUND);
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

  it('check if getBerryFirmnessByName returns NOT FOUND', async () => {
    const data = await client
      .getBerryFirmnessByName('it will not pass')
      .catch((error: AxiosError<string>) => error.response?.status);

    expect(data).toBe(StatusCodes.NOT_FOUND);
  });

  it('check if getBerryFirmnessById returns NOT FOUND', async () => {
    const data = await client
      .getBerryFirmnessById(aHugeNumber)
      .catch((error: AxiosError<string>) => error.response?.status);

    expect(data).toBe(StatusCodes.NOT_FOUND);
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

  it('check if getBerryFlavorByName returns NOT FOUND', async () => {
    const data = await client
      .getBerryFlavorByName('it will not pass')
      .catch((error: AxiosError<string>) => error.response?.status);

    expect(data).toBe(StatusCodes.NOT_FOUND);
  });

  it('check if getBerryFlavorById returns NOT FOUND', async () => {
    const data = await client
      .getBerryFlavorById(aHugeNumber)
      .catch((error: AxiosError<string>) => error.response?.status);

    expect(data).toBe(404);
  });

  it('check if it returns a list of berry flavors', async () => {
    const data = await client.listBerryFlavors().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
});
