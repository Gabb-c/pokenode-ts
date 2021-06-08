import { Machine, NamedAPIResourceList } from '../models';
import { MachineClient } from '../clients';

describe('test Machine Client', () => {
  let client: MachineClient;
  beforeAll(() => {
    client = new MachineClient();
  });

  // Machine
  it('check if it returns a machine passing an ID', async () => {
    const data = await client.getMachineById(1).then((response: Machine) => response);

    expect(data.id).toBe(1);
  });
  it('check if it returns a list of machines', async () => {
    const data = await client.listMachines().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
});
