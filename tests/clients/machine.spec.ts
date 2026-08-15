import { MachineClient } from "@clients";

import { type EndpointCase, testEndpoints } from "../utils/stub-fetch";

describe("MachineClient", () => {
  testEndpoints(MachineClient, [
    ["getMachineById", (c) => c.getMachineById(1), "/machine/1"],
    ["listMachines", (c) => c.listMachines(20, 50), "/machine?offset=20&limit=50"],
  ] satisfies EndpointCase<MachineClient>[]);
});
