import { beforeAll, describe, expect, expectTypeOf, it } from "vitest";
import { MoveClient } from "../clients";
import {
  MOVE_AILMENTS,
  MOVE_BATTLE_STYLES,
  MOVE_CATEGORIES,
  MOVE_DAMAGE_CLASSES,
  MOVE_LEARN_METHODS,
  MOVE_TARGETS,
} from "../constants";
import type {
  Move,
  MoveAilment,
  MoveBattleStyle,
  MoveCategory,
  MoveDamageClass,
  MoveLearnMethod,
  MoveTarget,
  NamedAPIResourceList,
} from "../models";

describe("Move Client", () => {
  let client: MoveClient;
  beforeAll(() => {
    client = new MoveClient();
  });

  // Move Client
  it("check if the move client was instantiated correctly", () => {
    expectTypeOf(client).toEqualTypeOf<MoveClient>();
  });

  // Move
  it("check if it returns a move passing an ID", async () => {
    const data = await client.getMoveById(1);

    expectTypeOf(data).toEqualTypeOf<Move>();
    expect(data.name).toBe("pound");
  });

  it("check if it returns a move passing a name", async () => {
    const data = await client.getMoveByName("pound");

    expectTypeOf(data).toEqualTypeOf<Move>();
    expect(data.name).toBe("pound");
  });

  it("check if it returns a list of moves", async () => {
    const data = await client.listMoves();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Move Ailment
  it("check if it returns a move ailment passing an ID", async () => {
    const data = await client.getMoveAilmentById(MOVE_AILMENTS.CONFUSION);

    expectTypeOf(data).toEqualTypeOf<MoveAilment>();
    expect(data.id).toBe(6);
  });

  it("check if it returns a move ailment passing a name", async () => {
    const data = await client.getMoveAilmentByName("confusion");

    expectTypeOf(data).toEqualTypeOf<MoveAilment>();
    expect(data.id).toBe(MOVE_AILMENTS.CONFUSION);
  });

  it("check if it returns a list of move ailments", async () => {
    const data = await client.listMoveAilments();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Move Battle Style
  it("check if it returns a move battle style passing an ID", async () => {
    const data = await client.getMoveBattleStyleById(MOVE_BATTLE_STYLES.ATTACK);

    expectTypeOf(data).toEqualTypeOf<MoveBattleStyle>();
    expect(data.id).toBe(1);
  });

  it("check if it returns a move battle style ailment passing a name", async () => {
    const data = await client.getMoveBattleStyleByName("attack");

    expectTypeOf(data).toEqualTypeOf<MoveBattleStyle>();
    expect(data.id).toBe(MOVE_BATTLE_STYLES.ATTACK);
  });

  it("check if it returns a list of move battle styles", async () => {
    const data = await client.listMoveBattleStyles();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Move Category
  it("check if it returns a move category passing an ID", async () => {
    const data = await client.getMoveCategoryById(MOVE_CATEGORIES.DAMAGE);

    expectTypeOf(data).toEqualTypeOf<MoveCategory>();
    expect(data.name).toBe("damage");
  });

  it("check if it returns a move category passing a name", async () => {
    const data = await client.getMoveCategoryByName("damage+heal");

    expectTypeOf(data).toEqualTypeOf<MoveCategory>();
    expect(data.id).toBe(MOVE_CATEGORIES.DAMAGE_HEAL);
  });

  it("check if it returns a list of move categories", async () => {
    const data = await client.listMoveCategories();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Move Damage Class
  it("check if it returns a move damage class passing an ID", async () => {
    const data = await client.getMoveDamageClassById(MOVE_DAMAGE_CLASSES.PHYSICAL);

    expectTypeOf(data).toEqualTypeOf<MoveDamageClass>();
    expect(data.name).toBe("physical");
  });

  it("check if it returns a move damage class passing a name", async () => {
    const data = await client.getMoveDamageClassByName("special");

    expectTypeOf(data).toEqualTypeOf<MoveDamageClass>();
    expect(data.id).toBe(MOVE_DAMAGE_CLASSES.SPECIAL);
  });

  it("check if it returns a list of move damage classes", async () => {
    const data = await client.listMoveCategories();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Move Learn Method
  it("check if it returns a move learn method passing an ID", async () => {
    const data = await client.getMoveLearnMethodById(MOVE_LEARN_METHODS.MACHINE);

    expectTypeOf(data).toEqualTypeOf<MoveLearnMethod>();
    expect(data.name).toBe("machine");
  });

  it("check if it returns a move learn method passing a name", async () => {
    const data = await client.getMoveLearnMethodByName("machine");

    expectTypeOf(data).toEqualTypeOf<MoveLearnMethod>();
    expect(data.id).toBe(MOVE_LEARN_METHODS.MACHINE);
  });

  it("check if it returns a list of move learn methods", async () => {
    const data = await client.listMoveLearnMethods();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Move Target
  it("check if it returns a move target passing an ID", async () => {
    const data = await client.getMoveTargetById(MOVE_TARGETS.ALLY);

    expectTypeOf(data).toEqualTypeOf<MoveTarget>();
    expect(data.name).toBe("ally");
  });

  it("check if it returns a move target passing a name", async () => {
    const data = await client.getMoveTargetByName("ally");

    expectTypeOf(data).toEqualTypeOf<MoveTarget>();
    expect(data.id).toBe(MOVE_TARGETS.ALLY);
  });

  it("check if it returns a list of move targets", async () => {
    const data = await client.listMoveTargets();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  it("check if it returns a list of move targets", async () => {
    const data = await client.listMoveDamageClasses();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });
});
