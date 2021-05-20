import { ContestEffect, ContestType, NamedAPIResourceList, SuperContestEffect } from '../models';
import { ContestClient } from '../clients';

describe('Test Contest Client', () => {
  // Contest Type
  it('Check if it returns a contest type passig a name', async () => {
    const client = new ContestClient();
    const data = await client
      .getContestTypeByName('cool')
      .then((response: ContestType) => response);

    expect(data.name).toBe('cool');
  });
  it('Check if it returns a contest type passing an ID', async () => {
    const client = new ContestClient();
    const data = await client.getContestTypeById(1).then((response: ContestType) => response);

    expect(data.name).toBe('cool');
  });
  it('Check if it returns a list of contest types', async () => {
    const client = new ContestClient();
    const data = await client.listContestTypes().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Contest Effect
  it('Check if it returns a contest effect passing an ID', async () => {
    const client = new ContestClient();
    const data = await client.getContestEffectById(1).then((response: ContestEffect) => response);

    expect(data.effect_entries.length).toBeGreaterThan(0);
  });
  it('Check if it returns a list of contest effects', async () => {
    const client = new ContestClient();
    const data = await client
      .listContestEffects()
      .then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Berry Flavor
  it('Check if it returns a super contest effect passing an ID', async () => {
    const client = new ContestClient();
    const data = await client
      .getSuperContestEffectById(1)
      .then((response: SuperContestEffect) => response);

    expect(data.flavor_text_entries.length).toBeGreaterThan(0);
  });
  it('Check if it returns a list of super contest effects', async () => {
    const client = new ContestClient();
    const data = await client
      .listSuperContestEffects()
      .then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
});
