import { beforeAll, describe, expect, expectTypeOf, it } from "vitest";
import { ContestClient } from "../clients";
import { CONTEST_TYPES } from "../constants";
import type {
  ContestEffect,
  ContestType,
  NamedAPIResourceList,
  SuperContestEffect,
} from "../models";

describe("Contest Client", () => {
  let client: ContestClient;
  beforeAll(() => {
    client = new ContestClient();
  });

  // Contest Client
  it("check if the contest client was instantiated correctly", () => {
    expectTypeOf(client).toEqualTypeOf<ContestClient>();
  });

  // Contest Type
  it("check if it returns a contest type passig a name", async () => {
    const data = await client.getContestTypeByName("cool");

    expectTypeOf(data).toEqualTypeOf<ContestType>();
    expect(data.id).toBe(CONTEST_TYPES.COOL);
  });

  it("check if it returns a contest type passing an ID", async () => {
    const data = await client.getContestTypeById(CONTEST_TYPES.COOL);

    expectTypeOf(data).toEqualTypeOf<ContestType>();
    expect(data.name).toBe("cool");
  });

  it("check if it returns a list of contest types", async () => {
    const data = await client.listContestTypes();

    expectTypeOf(data).toMatchTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Contest Effect
  it("check if it returns a contest effect passing an ID", async () => {
    const data = await client.getContestEffectById(1);

    expectTypeOf(data).toEqualTypeOf<ContestEffect>();
    expect(data.effect_entries.length).toBeGreaterThan(0);
  });

  it("check if it returns a list of contest effects", async () => {
    const data = await client.listContestEffects();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Super Contest Effect
  it("check if it returns a super contest effect passing an ID", async () => {
    const data = await client.getSuperContestEffectById(1);

    expectTypeOf(data).toEqualTypeOf<SuperContestEffect>();
    expect(data.flavor_text_entries.length).toBeGreaterThan(0);
  });

  it("check if it returns a list of super contest effects", async () => {
    const data = await client.listSuperContestEffects();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });
});
