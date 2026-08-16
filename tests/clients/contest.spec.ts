import { ContestClient } from "@clients";
import { CONTEST_TYPES } from "@constants";

import { type EndpointCase, expectEndpoint } from "../helpers/stub-fetch";

describe("ContestClient", () => {
  it.each([
    ["getContestTypeByName", "/contest-type/cool", (c) => c.getContestTypeByName("cool")],
    ["getContestTypeById", "/contest-type/1", (c) => c.getContestTypeById(CONTEST_TYPES.COOL)],
    ["getContestEffectById", "/contest-effect/1", (c) => c.getContestEffectById(1)],
    ["getSuperContestEffectById", "/super-contest-effect/1", (c) => c.getSuperContestEffectById(1)],
    ["listContestTypes", "/contest-type?offset=20&limit=50", (c) => c.listContestTypes(20, 50)],
    ["listContestEffects", "/contest-effect?offset=0&limit=20", (c) => c.listContestEffects()],
    [
      "listSuperContestEffects",
      "/super-contest-effect?offset=0&limit=20",
      (c) => c.listSuperContestEffects(),
    ],
  ] satisfies EndpointCase<ContestClient>[])(
    "%s should request %s",
    async (_method, path, call) => {
      await expectEndpoint(ContestClient, path, call);
    },
  );
});
