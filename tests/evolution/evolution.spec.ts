import { beforeAll, describe, expect, it } from "vitest";

import { EvolutionClient } from "../../src/clients";
import { EVOLUTION_TRIGGERS } from "../../src/constants";

describe("Evolution Client", () => {
  let client: EvolutionClient;

  beforeAll(() => {
    client = new EvolutionClient();
  });

  // Client
  it("(client) should be instantiated correctly", () => expect(client).toBeDefined());

  // Evolution Trigger
  it("check if it returns an evolution trigger passig an ID", async () => {
    const data = await client.getEvolutionTriggerById(EVOLUTION_TRIGGERS.LEVEL_UP);

    expect(data.name).toBe("level-up");
  });

  it("check if it returns an evolution trigger passing a name", async () => {
    const data = await client.getEvolutionTriggerByName("level-up");

    expect(data.id).toBe(EVOLUTION_TRIGGERS.LEVEL_UP);
  });

  it("check if it returns a list of evolution triggers", async () => {
    const data = await client.listEvolutionTriggers();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Evolution Chain
  it("check if it returns an evolution chain passig an ID", async () => {
    const data = await client.getEvolutionChainById(1);

    expect(data.id).toBe(1);
  });

  it("check if it returns a list of evolution chains", async () => {
    const data = await client.listEvolutionChains();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });
});
