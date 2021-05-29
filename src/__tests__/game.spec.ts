import { Generation, NamedAPIResourceList, Pokedex, Version, VersionGroup } from '../models';
import { Generations, Pokedexes, Versions, VersionGroups } from '../constants';
import { GameClient } from '../clients';

describe('test Game Client', () => {
  let client: GameClient;
  beforeAll(() => {
    client = new GameClient();
  });

  // Generation
  it('check if it returns a generation passig a name', async () => {
    const data = await client
      .getGenerationByName('generation-i')
      .then((response: Generation) => response);

    expect(data.id).toBe(Generations.GENERATION_I);
  });
  it('check if it returns a generation passing an ID', async () => {
    const data = await client
      .getGenerationById(Generations.GENERATION_I)
      .then((response: Generation) => response);

    expect(data.name).toBe('generation-i');
  });
  it('check if it returns a list of generations', async () => {
    const data = await client.listGenerations().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Pokedex
  it('check if it returns a pokedex passig a name', async () => {
    const data = await client.getPokedexByName('national').then((response: Pokedex) => response);

    expect(data.id).toBe(Pokedexes.NATIONAL);
  });
  it('check if it returns a pokedex passing an ID', async () => {
    const data = await client
      .getPokedexById(Pokedexes.NATIONAL)
      .then((response: Pokedex) => response);

    expect(data.name).toBe('national');
  });
  it('check if it returns a list of pokedexes', async () => {
    const data = await client.listPokedexes().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Version
  it('check if it returns a version passig a name', async () => {
    const data = await client.getVersionByName('red').then((response: Version) => response);

    expect(data.id).toBe(Versions.RED);
  });
  it('check if it returns a version passing an ID', async () => {
    const data = await client.getVersionById(Versions.RED).then((response: Version) => response);

    expect(data.name).toBe('red');
  });
  it('check if it returns a list of versions', async () => {
    const data = await client.listVersions().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Version Groups
  it('check if it returns a version group passig a name', async () => {
    const data = await client
      .getVersionGroupByName('red-blue')
      .then((response: VersionGroup) => response);

    expect(data.id).toBe(VersionGroups.RED_BLUE);
  });
  it('check if it returns a version group passing an ID', async () => {
    const data = await client
      .getVersionGroupById(VersionGroups.RED_BLUE)
      .then((response: VersionGroup) => response);

    expect(data.name).toBe('red-blue');
  });
  it('check if it returns a list of version groups', async () => {
    const data = await client
      .listVersionGroups()
      .then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
});
