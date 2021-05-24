import { Generation, NamedAPIResourceList, Pokedex, Version, VersionGroup } from '../models';
import { GameClient } from '../clients';

describe('Test Game Client', () => {
  let client: GameClient;
  beforeAll(() => {
    client = new GameClient();
  });

  // Generation
  it('Check if it returns a generation passig a name', async () => {
    const data = await client
      .getGenerationByName('generation-i')
      .then((response: Generation) => response);

    expect(data.name).toBe('generation-i');
  });
  it('Check if it returns a generation passing an ID', async () => {
    const data = await client.getGenerationById(1).then((response: Generation) => response);

    expect(data.name).toBe('generation-i');
  });
  it('Check if it returns a list of berries', async () => {
    const data = await client.listGenerations().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Pokedex
  it('Check if it returns a pokedex passig a name', async () => {
    const data = await client.getPokedexByName('national').then((response: Pokedex) => response);

    expect(data.name).toBe('national');
  });
  it('Check if it returns a pokedex passing an ID', async () => {
    const data = await client.getPokedexById(1).then((response: Pokedex) => response);

    expect(data.name).toBe('national');
  });
  it('Check if it returns a list of pokedexes', async () => {
    const data = await client.listPokedexes().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Version
  it('Check if it returns a version passig a name', async () => {
    const data = await client.getVersionByName('red').then((response: Version) => response);

    expect(data.name).toBe('red');
  });
  it('Check if it returns a version passing an ID', async () => {
    const data = await client.getVersionById(1).then((response: Version) => response);

    expect(data.name).toBe('red');
  });
  it('Check if it returns a list of versions', async () => {
    const data = await client.listVersions().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Version Groups
  it('Check if it returns a version group passig a name', async () => {
    const data = await client
      .getVersionGroupByName('red-blue')
      .then((response: VersionGroup) => response);

    expect(data.name).toBe('red-blue');
  });
  it('Check if it returns a version group passing an ID', async () => {
    const data = await client.getVersionGroupById(1).then((response: VersionGroup) => response);

    expect(data.name).toBe('red-blue');
  });
  it('Check if it returns a list of version groups', async () => {
    const data = await client
      .listVersionGroups()
      .then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
});
