import { expect, describe, it, beforeAll } from 'vitest';
import { ContestEffect, ContestType, NamedAPIResourceList, SuperContestEffect } from '../models';
import { ContestClient } from '../clients';
import { ContestTypes } from '../constants';

describe('Contest Client', () => {
  let client: ContestClient;
  beforeAll(() => {
    client = new ContestClient();
  });

  // Contest Type
  it('check if it returns a contest type passig a name', async () => {
    const data = await client
      .getContestTypeByName('cool')
      .then((response: ContestType) => response);

    expect(data.id).toBe(ContestTypes.COOL);
  });
  it('check if it returns a contest type passing an ID', async () => {
    const data = await client
      .getContestTypeById(ContestTypes.COOL)
      .then((response: ContestType) => response);

    expect(data.name).toBe('cool');
  });
  it('check if it returns a list of contest types', async () => {
    const data = await client.listContestTypes().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Contest Effect
  it('check if it returns a contest effect passing an ID', async () => {
    const data = await client.getContestEffectById(1).then((response: ContestEffect) => response);

    expect(data.effect_entries.length).toBeGreaterThan(0);
  });
  it('check if it returns a list of contest effects', async () => {
    const data = await client
      .listContestEffects()
      .then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Super Contest Effect
  it('check if it returns a super contest effect passing an ID', async () => {
    const data = await client
      .getSuperContestEffectById(1)
      .then((response: SuperContestEffect) => response);

    expect(data.flavor_text_entries.length).toBeGreaterThan(0);
  });
  it('check if it returns a list of super contest effects', async () => {
    const data = await client
      .listSuperContestEffects()
      .then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
});
