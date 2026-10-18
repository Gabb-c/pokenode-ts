import { EncounterClient } from "@clients";
import { ENCOUNTER_CONDITIONS, ENCOUNTER_METHODS } from "@constants";

import { type EndpointCase, expectEndpoint, expectEveryMethodCovered } from "../helpers/stub-fetch";

const CASES = [
  ["getEncounterMethodByName", "/encounter-method/walk", (c) => c.getEncounterMethodByName("walk")],
  [
    "getEncounterMethodById",
    "/encounter-method/1",
    (c) => c.getEncounterMethodById(ENCOUNTER_METHODS.WALK),
  ],
  [
    "getEncounterConditionByName",
    "/encounter-condition/swarm",
    (c) => c.getEncounterConditionByName("swarm"),
  ],
  [
    "getEncounterConditionById",
    "/encounter-condition/1",
    (c) => c.getEncounterConditionById(ENCOUNTER_CONDITIONS.SWARM),
  ],
  [
    "getEncounterConditionValueByName",
    "/encounter-condition-value/swarm-yes",
    (c) => c.getEncounterConditionValueByName("swarm-yes"),
  ],
  [
    "getEncounterConditionValueById",
    "/encounter-condition-value/1",
    (c) => c.getEncounterConditionValueById(1),
  ],
  [
    "listEncounterMethods",
    "/encounter-method?offset=20&limit=50",
    (c) => c.listEncounterMethods(20, 50),
  ],
  [
    "listEncounterConditions",
    "/encounter-condition?offset=0&limit=20",
    (c) => c.listEncounterConditions(),
  ],
  [
    "listEncounterConditionValues",
    "/encounter-condition-value?offset=0&limit=20",
    (c) => c.listEncounterConditionValues(),
  ],
] satisfies EndpointCase<EncounterClient>[];

describe("EncounterClient", () => {
  it.each(CASES)("%s should request %s", async (_method, path, call) => {
    await expectEndpoint(EncounterClient, path, call);
  });

  it("should cover every endpoint method", () => {
    expectEveryMethodCovered(EncounterClient, CASES);
  });
});
