import { expect, describe, it, beforeAll, expectTypeOf } from 'vitest';
import { EvolutionChain, EvolutionTrigger, NamedAPIResourceList } from '../models';
import { EvolutionTriggers } from '../constants';
import { EvolutionClient } from '../clients';

describe('Evolution Client', () => {
  let client: EvolutionClient;
  beforeAll(() => {
    client = new EvolutionClient();
  });

  // Evolution Client
  it('check if the evolution client was instantiated correctly', () => {
    expectTypeOf(client).toEqualTypeOf<EvolutionClient>();
  });

  // Evolution Trigger
  it('check if it returns an evolution trigger passig an ID', async () => {
    const data = await client.getEvolutionTriggerById(EvolutionTriggers.LEVEL_UP);

    expectTypeOf(data).toEqualTypeOf<EvolutionTrigger>();
    expect(data.name).toBe('level-up');
  });

  it('check if it returns an evolution trigger passing a name', async () => {
    const data = await client.getEvolutionTriggerByName('level-up');

    expectTypeOf(data).toEqualTypeOf<EvolutionTrigger>();
    expect(data.id).toBe(EvolutionTriggers.LEVEL_UP);
  });

  it('check if it returns a list of evolution triggers', async () => {
    const data = await client.listEvolutionTriggers();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });

  // Evolution Chain
  it('check if it returns an evolution chain passig an ID', async () => {
    const data = await client.getEvolutionChainById(1);

    expectTypeOf(data).toEqualTypeOf<EvolutionChain>();
    expect(data.id).toBe(1);
  });

  it('check if it returns a list of evolution chains', async () => {
    const data = await client.listEvolutionChains();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });
});
