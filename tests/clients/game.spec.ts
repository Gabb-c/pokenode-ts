import { GameClient } from "@clients";
import { GENERATIONS, POKEDEXES, VERSION_GROUPS, VERSIONS } from "@constants";

import { type EndpointCase, expectEndpoint } from "../helpers/stub-fetch";

describe("GameClient", () => {
  it.each([
    [
      "getGenerationByName",
      "/generation/generation-i",
      (c) => c.getGenerationByName("generation-i"),
    ],
    ["getGenerationById", "/generation/1", (c) => c.getGenerationById(GENERATIONS.GENERATION_I)],
    ["getPokedexByName", "/pokedex/national", (c) => c.getPokedexByName("national")],
    ["getPokedexById", "/pokedex/1", (c) => c.getPokedexById(POKEDEXES.NATIONAL)],
    ["getVersionByName", "/version/red", (c) => c.getVersionByName("red")],
    ["getVersionById", "/version/1", (c) => c.getVersionById(VERSIONS.RED)],
    [
      "getVersionGroupByName",
      "/version-group/red-blue",
      (c) => c.getVersionGroupByName("red-blue"),
    ],
    [
      "getVersionGroupById",
      "/version-group/1",
      (c) => c.getVersionGroupById(VERSION_GROUPS.RED_BLUE),
    ],
    ["listGenerations", "/generation?offset=20&limit=50", (c) => c.listGenerations(20, 50)],
    ["listPokedexes", "/pokedex?offset=0&limit=20", (c) => c.listPokedexes()],
    ["listVersions", "/version?offset=0&limit=20", (c) => c.listVersions()],
    ["listVersionGroups", "/version-group?offset=0&limit=20", (c) => c.listVersionGroups()],
  ] satisfies EndpointCase<GameClient>[])("%s should request %s", async (_method, path, call) => {
    await expectEndpoint(GameClient, path, call);
  });
});
