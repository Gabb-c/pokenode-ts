import { expect, describe, it, beforeAll, expectTypeOf } from 'vitest';
import {
  EncounterCondition,
  EncounterConditionValue,
  EncounterMethod,
  NamedAPIResourceList,
} from '../models';
import { EncounterClient } from '../clients';
import { EncounterMethods, EncounterConditions, EncounterConditionValues } from '../constants';

describe('Encounter Client', () => {
  let client: EncounterClient;
  beforeAll(() => {
    client = new EncounterClient();
  });

  // Encouter Client
  it('check if the encouter client was instantiated correctly', () => {
    expectTypeOf(client).toEqualTypeOf<EncounterClient>();
  });

  // Encounter Method
  it('check if it returns an encounter method passig a name', async () => {
    const data = await client.getEncounterMethodByName('walk');

    expectTypeOf(data).toEqualTypeOf<EncounterMethod>();
    expect(data.id).toBe(EncounterMethods.WALK);
  });

  it('check if it returns an encounter method passig an id', async () => {
    const data = await client.getEncounterMethodById(EncounterMethods.WALK);

    expectTypeOf(data).toEqualTypeOf<EncounterMethod>();
    expect(data.name).toBe('walk');
  });

  it('check if it returns a list of encounter methods', async () => {
    const data = await client.listEncounterMethods();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });

  // Encounter Condition
  it('check if it returns an encounter condition passig a name', async () => {
    const data = await client.getEncounterConditionByName('swarm');

    expectTypeOf(data).toEqualTypeOf<EncounterCondition>();
    expect(data.id).toBe(EncounterConditions.SWARM);
  });

  it('check if it returns an encounter condition passig an id', async () => {
    const data = await client.getEncounterConditionById(EncounterConditions.SWARM);

    expectTypeOf(data).toEqualTypeOf<EncounterCondition>();
    expect(data.name).toBe('swarm');
  });

  it('check if it returns a list of encounter conditions', async () => {
    const data = await client.listEncounterConditions();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });

  // Encounter Condition Values
  it('check if it returns an encounter condition values passig a name', async () => {
    const data = await client.getEncounterConditionValueByName('swarm-yes');

    expectTypeOf(data).toEqualTypeOf<EncounterConditionValue>();
    expect(data.id).toBe(EncounterConditionValues.SWARM_YES);
  });

  it('check if it returns an encounter condition values passig an id', async () => {
    const data = await client.getEncounterConditionValueById(EncounterConditionValues.SWARM_YES);

    expectTypeOf(data).toEqualTypeOf<EncounterConditionValue>();
    expect(data.name).toBe('swarm-yes');
  });

  it('check if it returns a list of encounter condition values', async () => {
    const data = await client.listEncounterConditionValues();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });
});
