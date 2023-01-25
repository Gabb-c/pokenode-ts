import { expect, test, it, beforeAll } from 'vitest';
import { Language, NamedAPIResourceList, Pokemon } from '../models';
import { Languages } from '../constants';
import { UtilityClient } from '../clients';

test('Utility Client', () => {
  let client: UtilityClient;
  beforeAll(() => {
    client = new UtilityClient();
  });

  // Language
  it('check if it returns a language passig a name', async () => {
    const data = await client.getLanguageByName('roomaji').then((response: Language) => response);

    expect(data.id).toBe(Languages.ROOMAJI);
  });
  it('check if it returns a language passing an ID', async () => {
    const data = await client.getLanguageById(Languages.FR).then((response: Language) => response);

    expect(data.name).toBe('fr');
  });
  it('check if it returns a list of berries', async () => {
    const data = await client.listLanguages().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });

  // Resource (pokemon)
  it('check if it returns a resource (pokemon) passig an url', async () => {
    const data = await client
      .getResourceByUrl('https://pokeapi.co/api/v2/pokemon/luxray')
      .then((response: Pokemon) => response);

    expect(data.id).toBe(405);
  });
});
