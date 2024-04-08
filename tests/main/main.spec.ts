import { beforeAll, describe, expect, it } from "vitest";

import { MainClient } from "../../src/clients";
import {
  BERRIES,
  CONTEST_TYPES,
  ENCOUNTER_METHODS,
  EVOLUTION_TRIGGERS,
  GENERATIONS,
} from "../../src/constants";

describe("MainClient Client", () => {
  let client: MainClient;

  beforeAll(() => {
    client = new MainClient();
  });

  // Main Client
  it("(clients) should be instantiated correctly", () => {
    expect(client).toBeDefined();
    expect(client.berry).toBeDefined;
    expect(client.contest).toBeDefined();
    expect(client.encounter).toBeDefined();
    expect(client.evolution).toBeDefined();
    expect(client.game).toBeDefined();
    expect(client.item).toBeDefined();
    expect(client.location).toBeDefined();
    expect(client.machine).toBeDefined();
    expect(client.move).toBeDefined();
    expect(client.pokemon).toBeDefined();
  });

  // Berry Client
  it("check if it returns a berry passig a name", async () => {
    const data = await client.berry.getBerryByName("cheri");

    expect(data.id).toBe(BERRIES.CHERI);
  });

  // Contest Client
  it("check if it returns a contest type passig a name", async () => {
    const data = await client.contest.getContestTypeByName("cool");

    expect(data.id).toBe(CONTEST_TYPES.COOL);
  });

  // Encounter Client
  it("check if it returns an encounter method passig a name", async () => {
    const data = await client.encounter.getEncounterMethodByName("surf");

    expect(data.id).toBe(ENCOUNTER_METHODS.SURF);
  });

  // Evolution Client
  it("check if it returns an evolution trigger method passig a name", async () => {
    const data = await client.evolution.getEvolutionTriggerByName("shed");

    expect(data.id).toBe(EVOLUTION_TRIGGERS.SHED);
  });

  // Game Client
  it("check if it returns a generation method passig a name", async () => {
    const data = await client.game.getGenerationByName("generation-i");

    expect(data.id).toBe(GENERATIONS.GENERATION_I);
  });

  // Item Client
  it("check if it returns an item passig a name", async () => {
    const data = await client.item.getItemByName("master-ball");

    expect(data.id).toBe(1);
  });

  // Location Client
  it("check if it returns a location passig a name", async () => {
    const data = await client.location.getLocationByName("canalave-city");

    expect(data.id).toBe(1);
  });

  // Machine Client
  it("check if it returns a machine passig an ID", async () => {
    const data = await client.machine.getMachineById(1);

    expect(data.id).toBe(1);
  });

  // Move Client
  it("check if it returns a move passig a name", async () => {
    const data = await client.move.getMoveById(1);

    expect(data.id).toBe(1);
  });

  // Pokemon Client
  it("check if it returns a pokemon passig a name", async () => {
    const data = await client.pokemon.getPokemonByName("luxray");

    expect(data.id).toBe(405);
  });
});
