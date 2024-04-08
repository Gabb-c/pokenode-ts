import { beforeAll, describe, expect, it } from "vitest";
import { ContestClient } from "../../src/clients";
import { CONTEST_TYPES } from "../../src/constants";

describe("Contest Client", () => {
  let client: ContestClient;

  beforeAll(() => {
    client = new ContestClient();
  });

  // Client
  it("(client) should be instantiated correctly", () => expect(client).toBeDefined());

  // Contest Type
  it("check if it returns a contest type passig a name", async () => {
    const data = await client.getContestTypeByName("cool");
    expect(data.id).toBe(CONTEST_TYPES.COOL);
  });

  it("check if it returns a contest type passing an ID", async () => {
    const data = await client.getContestTypeById(CONTEST_TYPES.COOL);
    expect(data.name).toBe("cool");
  });

  it("check if it returns a list of contest types", async () => {
    const data = await client.listContestTypes();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Contest Effect
  it("check if it returns a contest effect passing an ID", async () => {
    const data = await client.getContestEffectById(1);
    expect(data.effect_entries.length).toBeGreaterThan(0);
  });

  it("check if it returns a list of contest effects", async () => {
    const data = await client.listContestEffects();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Super Contest Effect
  it("check if it returns a super contest effect passing an ID", async () => {
    const data = await client.getSuperContestEffectById(1);
    expect(data.flavor_text_entries.length).toBeGreaterThan(0);
  });

  it("check if it returns a list of super contest effects", async () => {
    const data = await client.listSuperContestEffects();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });
});
