import { MachineClient } from "@clients";

import { type EndpointCase, expectEndpoint } from "../helpers/stub-fetch";

describe("MachineClient", () => {
  it.each([
    ["getMachineById", "/machine/1", (c) => c.getMachineById(1)],
    ["listMachines", "/machine?offset=20&limit=50", (c) => c.listMachines(20, 50)],
  ] satisfies EndpointCase<MachineClient>[])(
    "%s should request %s",
    async (_method, path, call) => {
      await expectEndpoint(MachineClient, path, call);
    },
  );
});
