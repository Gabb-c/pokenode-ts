import { EvolutionChain, EvolutionTrigger, NamedAPIResourceList } from '../models';
import { EvolutionTriggers } from '../constants';
import { EvolutionClient } from '../clients';

describe('test Evolution Client', () => {
  let client: EvolutionClient;
  beforeAll(() => {
    client = new EvolutionClient();
  });

  // Evolution Trigger
  it('check if it returns an evolution trigger passig an ID', async () => {
    const data = await client
      .getEvolutionTriggerById(EvolutionTriggers.LEVEL_UP)
      .then((response: EvolutionTrigger) => response);

    expect(data.name).toBe('level-up');
  });
  it('check if it returns an evolution trigger passing a name', async () => {
    const data = await client
      .getEvolutionTriggerByName('level-up')
      .then((response: EvolutionTrigger) => response);

    expect(data.id).toBe(EvolutionTriggers.LEVEL_UP);
  });
  it('check if it returns a list of evolution triggers', async () => {
    const data = await client
      .listEvolutionTriggers()
      .then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Evolution Chain
  it('check if it returns an evolution chain passig an ID', async () => {
    const data = await client.getEvolutionChainById(1).then((response: EvolutionChain) => response);

    expect(data.id).toBe(1);
  });
  it('check if it returns a list of evolution chains', async () => {
    const data = await client
      .listEvolutionChains()
      .then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
});
