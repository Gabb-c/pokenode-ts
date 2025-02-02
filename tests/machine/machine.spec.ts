import { MachineClient } from "@clients";

describe("Machine Client", () => {
  let client: MachineClient;

  beforeAll(() => {
    client = new MachineClient();
  });

  // Client
  it("(client) should be instantiated correctly", () => expect(client).toBeDefined());

  // Machine
  it("check if it returns a machine passing an ID", async () => {
    const data = await client.getMachineById(1);

    expect(data.id).toBe(1);
  });

  it("check if it returns a list of machines", async () => {
    const data = await client.listMachines();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });
});
