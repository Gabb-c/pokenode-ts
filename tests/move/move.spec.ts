import { beforeAll, describe, expect, it } from "vitest";

import { MoveClient } from "../../src/clients";
import {
  MOVE_AILMENTS,
  MOVE_BATTLE_STYLES,
  MOVE_CATEGORIES,
  MOVE_DAMAGE_CLASSES,
  MOVE_LEARN_METHODS,
  MOVE_TARGETS,
} from "../../src/constants";

describe("Move Client", () => {
  let client: MoveClient;

  beforeAll(() => {
    client = new MoveClient();
  });

  // Client
  it("(client) should be instantiated correctly", () => expect(client).toBeDefined());

  // Move
  it("check if it returns a move passing an ID", async () => {
    const data = await client.getMoveById(1);

    expect(data.name).toBe("pound");
  });

  it("check if it returns a move passing a name", async () => {
    const data = await client.getMoveByName("pound");

    expect(data.name).toBe("pound");
  });

  it("check if it returns a list of moves", async () => {
    const data = await client.listMoves();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Move Ailment
  it("check if it returns a move ailment passing an ID", async () => {
    const data = await client.getMoveAilmentById(MOVE_AILMENTS.CONFUSION);

    expect(data.id).toBe(6);
  });

  it("check if it returns a move ailment passing a name", async () => {
    const data = await client.getMoveAilmentByName("confusion");

    expect(data.id).toBe(MOVE_AILMENTS.CONFUSION);
  });

  it("check if it returns a list of move ailments", async () => {
    const data = await client.listMoveAilments();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Move Battle Style
  it("check if it returns a move battle style passing an ID", async () => {
    const data = await client.getMoveBattleStyleById(MOVE_BATTLE_STYLES.ATTACK);

    expect(data.id).toBe(1);
  });

  it("check if it returns a move battle style ailment passing a name", async () => {
    const data = await client.getMoveBattleStyleByName("attack");

    expect(data.id).toBe(MOVE_BATTLE_STYLES.ATTACK);
  });

  it("check if it returns a list of move battle styles", async () => {
    const data = await client.listMoveBattleStyles();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Move Category
  it("check if it returns a move category passing an ID", async () => {
    const data = await client.getMoveCategoryById(MOVE_CATEGORIES.DAMAGE);

    expect(data.name).toBe("damage");
  });

  it("check if it returns a move category passing a name", async () => {
    const data = await client.getMoveCategoryByName("damage+heal");

    expect(data.id).toBe(MOVE_CATEGORIES.DAMAGE_HEAL);
  });

  it("check if it returns a list of move categories", async () => {
    const data = await client.listMoveCategories();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Move Damage Class
  it("check if it returns a move damage class passing an ID", async () => {
    const data = await client.getMoveDamageClassById(MOVE_DAMAGE_CLASSES.PHYSICAL);

    expect(data.name).toBe("physical");
  });

  it("check if it returns a move damage class passing a name", async () => {
    const data = await client.getMoveDamageClassByName("special");

    expect(data.id).toBe(MOVE_DAMAGE_CLASSES.SPECIAL);
  });

  it("check if it returns a list of move damage classes", async () => {
    const data = await client.listMoveCategories();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Move Learn Method
  it("check if it returns a move learn method passing an ID", async () => {
    const data = await client.getMoveLearnMethodById(MOVE_LEARN_METHODS.MACHINE);

    expect(data.name).toBe("machine");
  });

  it("check if it returns a move learn method passing a name", async () => {
    const data = await client.getMoveLearnMethodByName("machine");

    expect(data.id).toBe(MOVE_LEARN_METHODS.MACHINE);
  });

  it("check if it returns a list of move learn methods", async () => {
    const data = await client.listMoveLearnMethods();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Move Target
  it("check if it returns a move target passing an ID", async () => {
    const data = await client.getMoveTargetById(MOVE_TARGETS.ALLY);

    expect(data.name).toBe("ally");
  });

  it("check if it returns a move target passing a name", async () => {
    const data = await client.getMoveTargetByName("ally");

    expect(data.id).toBe(MOVE_TARGETS.ALLY);
  });

  it("check if it returns a list of move targets", async () => {
    const data = await client.listMoveTargets();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  it("check if it returns a list of move targets", async () => {
    const data = await client.listMoveDamageClasses();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });
});
