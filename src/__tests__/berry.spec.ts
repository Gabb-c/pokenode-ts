import { expect, describe, it, beforeAll, expectTypeOf } from 'vitest';
import { Berry, BerryFirmness, BerryFlavor, NamedAPIResourceList } from '../models';
import { Berries, BerryFirmnesses, BerryFlavors } from '../constants';
import { BerryClient } from '../clients';
import { AxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';

const aHugeNumber = 62_436_346;

describe('Berry Client', () => {
  let client: BerryClient;
  beforeAll(() => {
    client = new BerryClient();
  });

  // Berry Client
  it('check if berry client way instantiated correctly', () => {
    expectTypeOf(client).toEqualTypeOf<BerryClient>();
  });

  // Berry
  it('check if it returns a berry passig a name', async () => {
    const data = await client.getBerryByName('cheri');

    expectTypeOf(data).toEqualTypeOf<Berry>();
    expect(data.id).toBe(Berries.CHERI);
  });

  it('check if it returns a berry passing an ID', async () => {
    const data = await client.getBerryById(Berries.CHERI);

    expectTypeOf(data).toEqualTypeOf<Berry>();
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
    const data = await client.getBerryFirmnessByName('very-soft');

    expectTypeOf(data).toEqualTypeOf<BerryFirmness>();
    expect(data.name).toBe('very-soft');
  });

  it('check if it returns a berry firmness passing an ID', async () => {
    const data = await client.getBerryFirmnessById(BerryFirmnesses.VERY_SOFT);

    expectTypeOf(data).toEqualTypeOf<BerryFirmness>();
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
    const data = await client.listBerryFirmnesses();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });

  // Berry Flavor
  it('check if it returns a berry flavor passig a name', async () => {
    const data = await client.getBerryFlavorByName('spicy');

    expectTypeOf(data).toEqualTypeOf<BerryFlavor>();
    expect(data.id).toBe(BerryFlavors.SPICY);
  });

  it('check if it returns a berry flavor passing an ID', async () => {
    const data = await client.getBerryFlavorById(BerryFlavors.SPICY);

    expectTypeOf(data).toEqualTypeOf<BerryFlavor>();
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

    expect(data).toBe(StatusCodes.NOT_FOUND);
  });

  it('check if it returns a list of berry flavors', async () => {
    const data = await client.listBerryFlavors();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });
});
