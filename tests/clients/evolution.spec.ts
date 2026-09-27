import { EvolutionClient } from "@clients";
import { EVOLUTION_TRIGGERS, EVOLUTION_VARIABLES } from "@constants";

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
    [
      "getEvolutionVariableById",
      "/evolution-variable/1",
      (c) => c.getEvolutionVariableById(EVOLUTION_VARIABLES.ENCRYPTION_CONSTANT),
    ],
    [
      "getEvolutionVariableByName",
      "/evolution-variable/personality-value",
      (c) => c.getEvolutionVariableByName("personality-value"),
    ],
    [
      "listEvolutionVariables",
      "/evolution-variable?offset=0&limit=20",
      (c) => c.listEvolutionVariables(),
    ],
  ] satisfies EndpointCase<EvolutionClient>[])(
    "%s should request %s",
    async (_method, path, call) => {
      await expectEndpoint(EvolutionClient, path, call);
    },
  );
});
