import { beforeAll, describe, expect, expectTypeOf, it } from "vitest";
import { EncounterClient } from "../clients";
import { ENCOUNTER_CONDITIONS, ENCOUNTER_CONDITION_VALUES, ENCOUNTER_METHODS } from "../constants";
import type {
  EncounterCondition,
  EncounterConditionValue,
  EncounterMethod,
  NamedAPIResourceList,
} from "../models";

describe("Encounter Client", () => {
  let client: EncounterClient;
  beforeAll(() => {
    client = new EncounterClient();
  });

  // Encouter Client
  it("check if the encouter client was instantiated correctly", () => {
    expectTypeOf(client).toEqualTypeOf<EncounterClient>();
  });

  // Encounter Method
  it("check if it returns an encounter method passig a name", async () => {
    const data = await client.getEncounterMethodByName("walk");

    expectTypeOf(data).toEqualTypeOf<EncounterMethod>();
    expect(data.id).toBe(ENCOUNTER_METHODS.WALK);
  });

  it("check if it returns an encounter method passig an id", async () => {
    const data = await client.getEncounterMethodById(ENCOUNTER_METHODS.WALK);

    expectTypeOf(data).toEqualTypeOf<EncounterMethod>();
    expect(data.name).toBe("walk");
  });

  it("check if it returns a list of encounter methods", async () => {
    const data = await client.listEncounterMethods();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Encounter Condition
  it("check if it returns an encounter condition passig a name", async () => {
    const data = await client.getEncounterConditionByName("swarm");

    expectTypeOf(data).toEqualTypeOf<EncounterCondition>();
    expect(data.id).toBe(ENCOUNTER_CONDITIONS.SWARM);
  });

  it("check if it returns an encounter condition passig an id", async () => {
    const data = await client.getEncounterConditionById(ENCOUNTER_CONDITIONS.SWARM);

    expectTypeOf(data).toEqualTypeOf<EncounterCondition>();
    expect(data.name).toBe("swarm");
  });

  it("check if it returns a list of encounter conditions", async () => {
    const data = await client.listEncounterConditions();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Encounter Condition Values
  it("check if it returns an encounter condition values passig a name", async () => {
    const data = await client.getEncounterConditionValueByName("swarm-yes");

    expectTypeOf(data).toEqualTypeOf<EncounterConditionValue>();
    expect(data.id).toBe(ENCOUNTER_CONDITION_VALUES.SWARM_YES);
  });

  it("check if it returns an encounter condition values passig an id", async () => {
    const data = await client.getEncounterConditionValueById(ENCOUNTER_CONDITION_VALUES.SWARM_YES);

    expectTypeOf(data).toEqualTypeOf<EncounterConditionValue>();
    expect(data.name).toBe("swarm-yes");
  });

  it("check if it returns a list of encounter condition values", async () => {
    const data = await client.listEncounterConditionValues();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });
});
