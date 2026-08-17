import { EvolutionClient } from "@clients";
import { EVOLUTION_TRIGGERS } from "@constants";

import { type EndpointCase, expectEndpoint } from "../helpers/stub-fetch";

describe("EvolutionClient", () => {
  it.each([
    ["getEvolutionChainById", "/evolution-chain/1", (c) => c.getEvolutionChainById(1)],
    [
      "getEvolutionTriggerByName",
      "/evolution-trigger/level-up",
      (c) => c.getEvolutionTriggerByName("level-up"),
    ],
    [
      "getEvolutionTriggerById",
      "/evolution-trigger/1",
      (c) => c.getEvolutionTriggerById(EVOLUTION_TRIGGERS.LEVEL_UP),
    ],
    [
      "listEvolutionChains",
      "/evolution-chain?offset=20&limit=50",
      (c) => c.listEvolutionChains(20, 50),
    ],
    [
      "listEvolutionTriggers",
      "/evolution-trigger?offset=0&limit=20",
      (c) => c.listEvolutionTriggers(),
    ],
  ] satisfies EndpointCase<EvolutionClient>[])(
    "%s should request %s",
    async (_method, path, call) => {
      await expectEndpoint(EvolutionClient, path, call);
    },
  );
});
