import { EncounterClient } from "@clients";
import { ENCOUNTER_CONDITIONS, ENCOUNTER_METHODS } from "@constants";

import { type EndpointCase, testEndpoints } from "../utils/stub-fetch";

describe("EncounterClient", () => {
  testEndpoints(EncounterClient, [
    [
      "getEncounterMethodByName",
      (c) => c.getEncounterMethodByName("walk"),
      "/encounter-method/walk",
    ],
    [
      "getEncounterMethodById",
      (c) => c.getEncounterMethodById(ENCOUNTER_METHODS.WALK),
      "/encounter-method/1",
    ],
    [
      "getEncounterConditionByName",
      (c) => c.getEncounterConditionByName("swarm"),
      "/encounter-condition/swarm",
    ],
    [
      "getEncounterConditionById",
      (c) => c.getEncounterConditionById(ENCOUNTER_CONDITIONS.SWARM),
      "/encounter-condition/1",
    ],
    [
      "getEncounterConditionValueByName",
      (c) => c.getEncounterConditionValueByName("swarm-yes"),
      "/encounter-condition-value/swarm-yes",
    ],
    [
      "getEncounterConditionValueById",
      (c) => c.getEncounterConditionValueById(1),
      "/encounter-condition-value/1",
    ],
    [
      "listEncounterMethods",
      (c) => c.listEncounterMethods(20, 50),
      "/encounter-method?offset=20&limit=50",
    ],
    [
      "listEncounterConditions",
      (c) => c.listEncounterConditions(),
      "/encounter-condition?offset=0&limit=20",
    ],
    [
      "listEncounterConditionValues",
      (c) => c.listEncounterConditionValues(),
      "/encounter-condition-value?offset=0&limit=20",
    ],
  ] satisfies EndpointCase<EncounterClient>[]);
});
