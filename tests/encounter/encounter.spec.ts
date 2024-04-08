import { beforeAll, describe, expect, it } from "vitest";

import { EncounterClient } from "../../src/clients";
import {
  ENCOUNTER_CONDITIONS,
  ENCOUNTER_CONDITION_VALUES,
  ENCOUNTER_METHODS,
} from "../../src/constants";

describe("Encounter Client", () => {
  let client: EncounterClient;

  beforeAll(() => {
    client = new EncounterClient();
  });

  // Client
  it("(client) should be instantiated correctly", () => expect(client).toBeDefined());

  // Encounter Method
  it("check if it returns an encounter method passig a name", async () => {
    const data = await client.getEncounterMethodByName("walk");

    expect(data.id).toBe(ENCOUNTER_METHODS.WALK);
  });

  it("check if it returns an encounter method passig an id", async () => {
    const data = await client.getEncounterMethodById(ENCOUNTER_METHODS.WALK);

    expect(data.name).toBe("walk");
  });

  it("check if it returns a list of encounter methods", async () => {
    const data = await client.listEncounterMethods();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Encounter Condition
  it("check if it returns an encounter condition passig a name", async () => {
    const data = await client.getEncounterConditionByName("swarm");

    expect(data.id).toBe(ENCOUNTER_CONDITIONS.SWARM);
  });

  it("check if it returns an encounter condition passig an id", async () => {
    const data = await client.getEncounterConditionById(ENCOUNTER_CONDITIONS.SWARM);

    expect(data.name).toBe("swarm");
  });

  it("check if it returns a list of encounter conditions", async () => {
    const data = await client.listEncounterConditions();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Encounter Condition Values
  it("check if it returns an encounter condition values passig a name", async () => {
    const data = await client.getEncounterConditionValueByName("swarm-yes");

    expect(data.id).toBe(ENCOUNTER_CONDITION_VALUES.SWARM_YES);
  });

  it("check if it returns an encounter condition values passig an id", async () => {
    const data = await client.getEncounterConditionValueById(ENCOUNTER_CONDITION_VALUES.SWARM_YES);

    expect(data.name).toBe("swarm-yes");
  });

  it("check if it returns a list of encounter condition values", async () => {
    const data = await client.listEncounterConditionValues();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });
});
