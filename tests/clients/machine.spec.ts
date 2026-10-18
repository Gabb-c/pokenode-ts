import { MachineClient } from "@clients";

import { type EndpointCase, expectEndpoint, expectEveryMethodCovered } from "../helpers/stub-fetch";

const CASES = [
  ["getMachineById", "/machine/1", (c) => c.getMachineById(1)],
  ["listMachines", "/machine?offset=20&limit=50", (c) => c.listMachines(20, 50)],
] satisfies EndpointCase<MachineClient>[];

describe("MachineClient", () => {
  it.each(CASES)("%s should request %s", async (_method, path, call) => {
    await expectEndpoint(MachineClient, path, call);
  });

  it("should cover every endpoint method", () => {
    expectEveryMethodCovered(MachineClient, CASES);
  });
});
