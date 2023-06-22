import { GameClient } from "../clients";
import { GENERATIONS, POKEDEXES, VERSIONS, VERSION_GROUPS } from "../constants";
import { Generation, NamedAPIResourceList, Pokedex, Version, VersionGroup } from "../models";
import { beforeAll, describe, expect, expectTypeOf, it } from "vitest";

describe("Game Client", () => {
  let client: GameClient;
  beforeAll(() => {
    client = new GameClient();
  });

  // Game Client
  it("check if the game client was instantiated correctly", () => {
    expectTypeOf(client).toEqualTypeOf<GameClient>();
  });

  // Generation
  it("check if it returns a generation passig a name", async () => {
    const data = await client.getGenerationByName("generation-i");

    expectTypeOf(data).toEqualTypeOf<Generation>();
    expect(data.id).toBe(GENERATIONS.GENERATION_I);
  });

  it("check if it returns a generation passing an ID", async () => {
    const data = await client.getGenerationById(GENERATIONS.GENERATION_I);

    expectTypeOf(data).toEqualTypeOf<Generation>();
    expect(data.name).toBe("generation-i");
  });

  it("check if it returns a list of generations", async () => {
    const data = await client.listGenerations();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Pokedex
  it("check if it returns a pokedex passig a name", async () => {
    const data = await client.getPokedexByName("national");

    expectTypeOf(data).toEqualTypeOf<Pokedex>();
    expect(data.id).toBe(POKEDEXES.NATIONAL);
  });

  it("check if it returns a pokedex passing an ID", async () => {
    const data = await client.getPokedexById(POKEDEXES.NATIONAL);

    expectTypeOf(data).toEqualTypeOf<Pokedex>();
    expect(data.name).toBe("national");
  });

  it("check if it returns a list of pokedexes", async () => {
    const data = await client.listPokedexes();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Version
  it("check if it returns a version passig a name", async () => {
    const data = await client.getVersionByName("red");

    expectTypeOf(data).toEqualTypeOf<Version>();
    expect(data.id).toBe(VERSIONS.RED);
  });

  it("check if it returns a version passing an ID", async () => {
    const data = await client.getVersionById(VERSIONS.RED);

    expectTypeOf(data).toEqualTypeOf<Version>();
    expect(data.name).toBe("red");
  });

  it("check if it returns a list of versions", async () => {
    const data = await client.listVersions();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Version Groups
  it("check if it returns a version group passig a name", async () => {
    const data = await client.getVersionGroupByName("red-blue");

    expectTypeOf(data).toEqualTypeOf<VersionGroup>();
    expect(data.id).toBe(VERSION_GROUPS.RED_BLUE);
  });

  it("check if it returns a version group passing an ID", async () => {
    const data = await client.getVersionGroupById(VERSION_GROUPS.RED_BLUE);

    expectTypeOf(data).toEqualTypeOf<VersionGroup>();
    expect(data.name).toBe("red-blue");
  });

  it("check if it returns a list of version groups", async () => {
    const data = await client.listVersionGroups();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });
});
