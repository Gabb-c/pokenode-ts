import * as Clients from "../clients";
import {
  BERRIES,
  CONTEST_TYPES,
  ENCOUNTER_METHODS,
  EVOLUTION_TRIGGERS,
  GENERATIONS,
} from "../constants";
import {
  Berry,
  ContestType,
  EncounterMethod,
  EvolutionTrigger,
  Generation,
  Item,
  Location,
  Machine,
  Move,
  Pokemon,
} from "../models";
import { beforeAll, describe, expect, expectTypeOf, it } from "vitest";

describe("MainClient Client", () => {
  let client: Clients.MainClient;
  beforeAll(() => {
    client = new Clients.MainClient();
  });

  // Main Client
  it("check if the main client was instantiated correctly", () => {
    expectTypeOf(client).toMatchTypeOf<Clients.MainClient>();
    expectTypeOf(client.berry).toMatchTypeOf<Clients.BerryClient>();
    expectTypeOf(client.contest).toMatchTypeOf<Clients.ContestClient>();
    expectTypeOf(client.encounter).toMatchTypeOf<Clients.EncounterClient>();
    expectTypeOf(client.evolution).toMatchTypeOf<Clients.EvolutionClient>();
    expectTypeOf(client.game).toMatchTypeOf<Clients.GameClient>();
    expectTypeOf(client.item).toMatchTypeOf<Clients.ItemClient>();
    expectTypeOf(client.location).toMatchTypeOf<Clients.LocationClient>();
    expectTypeOf(client.machine).toMatchTypeOf<Clients.MachineClient>();
    expectTypeOf(client.move).toMatchTypeOf<Clients.MoveClient>();
    expectTypeOf(client.pokemon).toMatchTypeOf<Clients.PokemonClient>();
  });

  // Berry Client
  it("check if it returns a berry passig a name", async () => {
    const data = await client.berry.getBerryByName("cheri");

    expectTypeOf(data).toMatchTypeOf<Berry>();
    expect(data.id).toBe(BERRIES.CHERI);
  });

  // Contest Client
  it("check if it returns a contest type passig a name", async () => {
    const data = await client.contest.getContestTypeByName("cool");

    expectTypeOf(data).toMatchTypeOf<ContestType>();
    expect(data.id).toBe(CONTEST_TYPES.COOL);
  });

  // Encounter Client
  it("check if it returns an encounter method passig a name", async () => {
    const data = await client.encounter.getEncounterMethodByName("surf");

    expectTypeOf(data).toMatchTypeOf<EncounterMethod>();
    expect(data.id).toBe(ENCOUNTER_METHODS.SURF);
  });

  // Evolution Client
  it("check if it returns an evolution trigger method passig a name", async () => {
    const data = await client.evolution.getEvolutionTriggerByName("shed");

    expectTypeOf(data).toMatchTypeOf<EvolutionTrigger>();
    expect(data.id).toBe(EVOLUTION_TRIGGERS.SHED);
  });

  // Game Client
  it("check if it returns a generation method passig a name", async () => {
    const data = await client.game.getGenerationByName("generation-i");

    expectTypeOf(data).toMatchTypeOf<Generation>();
    expect(data.id).toBe(GENERATIONS.GENERATION_I);
  });

  // Item Client
  it("check if it returns an item passig a name", async () => {
    const data = await client.item.getItemByName("master-ball");

    expectTypeOf(data).toMatchTypeOf<Item>();
    expect(data.id).toBe(1);
  });

  // Location Client
  it("check if it returns a location passig a name", async () => {
    const data = await client.location.getLocationByName("canalave-city");

    expectTypeOf(data).toMatchTypeOf<Location>();
    expect(data.id).toBe(1);
  });

  // Machine Client
  it("check if it returns a machine passig an ID", async () => {
    const data = await client.machine.getMachineById(1);

    expectTypeOf(data).toMatchTypeOf<Machine>();
    expect(data.id).toBe(1);
  });

  // Move Client
  it("check if it returns a move passig a name", async () => {
    const data = await client.move.getMoveById(1);

    expectTypeOf(data).toMatchTypeOf<Move>();
    expect(data.id).toBe(1);
  });

  // Pokemon Client
  it("check if it returns a pokemon passig a name", async () => {
    const data = await client.pokemon.getPokemonByName("luxray");

    expectTypeOf(data).toMatchTypeOf<Pokemon>();
    expect(data.id).toBe(405);
  });
});
