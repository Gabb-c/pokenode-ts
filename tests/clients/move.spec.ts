import { MoveClient } from "@clients";
import {
  MOVE_AILMENTS,
  MOVE_BATTLE_STYLES,
  MOVE_CATEGORIES,
  MOVE_DAMAGE_CLASSES,
  MOVE_LEARN_METHODS,
  MOVE_TARGETS,
} from "@constants";

import { type EndpointCase, expectEndpoint } from "../helpers/stub-fetch";

describe("MoveClient", () => {
  it.each([
    ["getMoveByName", "/move/pound", (c) => c.getMoveByName("pound")],
    ["getMoveById", "/move/1", (c) => c.getMoveById(1)],
    ["getMoveAilmentByName", "/move-ailment/paralysis", (c) => c.getMoveAilmentByName("paralysis")],
    ["getMoveAilmentById", "/move-ailment/1", (c) => c.getMoveAilmentById(MOVE_AILMENTS.PARALYSIS)],
    [
      "getMoveBattleStyleByName",
      "/move-battle-style/attack",
      (c) => c.getMoveBattleStyleByName("attack"),
    ],
    [
      "getMoveBattleStyleById",
      "/move-battle-style/1",
      (c) => c.getMoveBattleStyleById(MOVE_BATTLE_STYLES.ATTACK),
    ],
    ["getMoveCategoryByName", "/move-category/damage", (c) => c.getMoveCategoryByName("damage")],
    // The damage category is id 0 — a falsy identifier that must still be sent.
    [
      "getMoveCategoryById",
      "/move-category/0",
      (c) => c.getMoveCategoryById(MOVE_CATEGORIES.DAMAGE),
    ],
    [
      "getMoveDamageClassByName",
      "/move-damage-class/status",
      (c) => c.getMoveDamageClassByName("status"),
    ],
    [
      "getMoveDamageClassById",
      "/move-damage-class/1",
      (c) => c.getMoveDamageClassById(MOVE_DAMAGE_CLASSES.STATUS),
    ],
    [
      "getMoveLearnMethodByName",
      "/move-learn-method/level-up",
      (c) => c.getMoveLearnMethodByName("level-up"),
    ],
    [
      "getMoveLearnMethodById",
      "/move-learn-method/1",
      (c) => c.getMoveLearnMethodById(MOVE_LEARN_METHODS.LEVEL_UP),
    ],
    [
      "getMoveTargetByName",
      "/move-target/specific-move",
      (c) => c.getMoveTargetByName("specific-move"),
    ],
    ["getMoveTargetById", "/move-target/1", (c) => c.getMoveTargetById(MOVE_TARGETS.SPECIFIC_MOVE)],
    ["listMoves", "/move?offset=20&limit=50", (c) => c.listMoves(20, 50)],
    ["listMoveAilments", "/move-ailment?offset=0&limit=20", (c) => c.listMoveAilments()],
    [
      "listMoveBattleStyles",
      "/move-battle-style?offset=0&limit=20",
      (c) => c.listMoveBattleStyles(),
    ],
    ["listMoveCategories", "/move-category?offset=0&limit=20", (c) => c.listMoveCategories()],
    [
      "listMoveDamageClasses",
      "/move-damage-class?offset=0&limit=20",
      (c) => c.listMoveDamageClasses(),
    ],
    [
      "listMoveLearnMethods",
      "/move-learn-method?offset=0&limit=20",
      (c) => c.listMoveLearnMethods(),
    ],
    ["listMoveTargets", "/move-target?offset=0&limit=20", (c) => c.listMoveTargets()],
  ] satisfies EndpointCase<MoveClient>[])("%s should request %s", async (_method, path, call) => {
    await expectEndpoint(MoveClient, path, call);
  });
});
