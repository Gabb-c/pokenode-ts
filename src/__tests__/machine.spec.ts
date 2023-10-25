import { beforeAll, describe, expect, expectTypeOf, it } from "vitest";
import { MachineClient } from "../clients";
import { Machine, NamedAPIResourceList } from "../models";

describe("Machine Client", () => {
  let client: MachineClient;
  beforeAll(() => {
    client = new MachineClient();
  });

  // Machine Client
  it("check if the machine client was instantiated correctly", () => {
    expectTypeOf(client).toEqualTypeOf<MachineClient>();
  });

  // Machine
  it("check if it returns a machine passing an ID", async () => {
    const data = await client.getMachineById(1);

    expectTypeOf(data).toEqualTypeOf<Machine>();
    expect(data.id).toBe(1);
  });

  it("check if it returns a list of machines", async () => {
    const data = await client.listMachines();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });
});
