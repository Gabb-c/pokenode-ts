import { GameClient } from "@clients";
import { GENERATIONS, POKEDEXES, VERSION_GROUPS, VERSIONS } from "@constants";

import { type EndpointCase, testEndpoints } from "../utils/stub-fetch";

describe("GameClient", () => {
  testEndpoints(GameClient, [
    [
      "getGenerationByName",
      (c) => c.getGenerationByName("generation-i"),
      "/generation/generation-i",
    ],
    ["getGenerationById", (c) => c.getGenerationById(GENERATIONS.GENERATION_I), "/generation/1"],
    ["getPokedexByName", (c) => c.getPokedexByName("national"), "/pokedex/national"],
    ["getPokedexById", (c) => c.getPokedexById(POKEDEXES.NATIONAL), "/pokedex/1"],
    ["getVersionByName", (c) => c.getVersionByName("red"), "/version/red"],
    ["getVersionById", (c) => c.getVersionById(VERSIONS.RED), "/version/1"],
    [
      "getVersionGroupByName",
      (c) => c.getVersionGroupByName("red-blue"),
      "/version-group/red-blue",
    ],
    [
      "getVersionGroupById",
      (c) => c.getVersionGroupById(VERSION_GROUPS.RED_BLUE),
      "/version-group/1",
    ],
    ["listGenerations", (c) => c.listGenerations(20, 50), "/generation?offset=20&limit=50"],
    ["listPokedexes", (c) => c.listPokedexes(), "/pokedex?offset=0&limit=20"],
    ["listVersions", (c) => c.listVersions(), "/version?offset=0&limit=20"],
    ["listVersionGroups", (c) => c.listVersionGroups(), "/version-group?offset=0&limit=20"],
  ] satisfies EndpointCase<GameClient>[]);
});
