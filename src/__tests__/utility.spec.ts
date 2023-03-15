import { expect, it, beforeAll, describe, expectTypeOf } from 'vitest';
import { Language, NamedAPIResourceList, Pokemon } from '../models';
import { Languages } from '../constants';
import { UtilityClient } from '../clients';

describe('Utility Client', () => {
  let client: UtilityClient;
  beforeAll(() => {
    client = new UtilityClient();
  });

  // Utility Client
  it('check if the pokemon client was instantiated correctly', () => {
    expectTypeOf(client).toEqualTypeOf<UtilityClient>();
  });

  // Language
  it('check if it returns a language passig a name', async () => {
    const data = await client.getLanguageByName('roomaji');

    expectTypeOf(data).toEqualTypeOf<Language>();
    expect(data.id).toBe(Languages.ROOMAJI);
  });
  it('check if it returns a language passing an ID', async () => {
    const data = await client.getLanguageById(Languages.FR);

    expectTypeOf(data).toEqualTypeOf<Language>();
    expect(data.name).toBe('fr');
  });
  it('check if it returns a list of berries', async () => {
    const data = await client.listLanguages();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });

  // Resource (pokemon)
  it('check if it returns a resource (pokemon) passig an url', async () => {
    const data = await client.getResourceByUrl<Pokemon>('https://pokeapi.co/api/v2/pokemon/luxray');

    expectTypeOf(data).toEqualTypeOf<Pokemon>();
    expect(data.id).toBe(405);
  });
});
