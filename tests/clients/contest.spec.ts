import { ContestClient } from "@clients";
import { CONTEST_TYPES } from "@constants";

import { type EndpointCase, testEndpoints } from "../utils/stub-fetch";

describe("ContestClient", () => {
  testEndpoints(ContestClient, [
    ["getContestTypeByName", (c) => c.getContestTypeByName("cool"), "/contest-type/cool"],
    ["getContestTypeById", (c) => c.getContestTypeById(CONTEST_TYPES.COOL), "/contest-type/1"],
    ["getContestEffectById", (c) => c.getContestEffectById(1), "/contest-effect/1"],
    ["getSuperContestEffectById", (c) => c.getSuperContestEffectById(1), "/super-contest-effect/1"],
    ["listContestTypes", (c) => c.listContestTypes(20, 50), "/contest-type?offset=20&limit=50"],
    ["listContestEffects", (c) => c.listContestEffects(), "/contest-effect?offset=0&limit=20"],
    [
      "listSuperContestEffects",
      (c) => c.listSuperContestEffects(),
      "/super-contest-effect?offset=0&limit=20",
    ],
  ] satisfies EndpointCase<ContestClient>[]);
});
