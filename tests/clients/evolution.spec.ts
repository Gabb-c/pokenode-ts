import { EvolutionClient } from "@clients";
import { EVOLUTION_TRIGGERS } from "@constants";

import { type EndpointCase, testEndpoints } from "../utils/stub-fetch";

describe("EvolutionClient", () => {
  testEndpoints(EvolutionClient, [
    ["getEvolutionChainById", (c) => c.getEvolutionChainById(1), "/evolution-chain/1"],
    [
      "getEvolutionTriggerByName",
      (c) => c.getEvolutionTriggerByName("level-up"),
      "/evolution-trigger/level-up",
    ],
    [
      "getEvolutionTriggerById",
      (c) => c.getEvolutionTriggerById(EVOLUTION_TRIGGERS.LEVEL_UP),
      "/evolution-trigger/1",
    ],
    [
      "listEvolutionChains",
      (c) => c.listEvolutionChains(20, 50),
      "/evolution-chain?offset=20&limit=50",
    ],
    [
      "listEvolutionTriggers",
      (c) => c.listEvolutionTriggers(),
      "/evolution-trigger?offset=0&limit=20",
    ],
  ] satisfies EndpointCase<EvolutionClient>[]);
});
