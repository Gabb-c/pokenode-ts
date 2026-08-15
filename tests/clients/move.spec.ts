import { MoveClient } from "@clients";
import {
  MOVE_AILMENTS,
  MOVE_BATTLE_STYLES,
  MOVE_CATEGORIES,
  MOVE_DAMAGE_CLASSES,
  MOVE_LEARN_METHODS,
  MOVE_TARGETS,
} from "@constants";

import { type EndpointCase, testEndpoints } from "../utils/stub-fetch";

describe("MoveClient", () => {
  testEndpoints(MoveClient, [
    ["getMoveByName", (c) => c.getMoveByName("pound"), "/move/pound"],
    ["getMoveById", (c) => c.getMoveById(1), "/move/1"],
    ["getMoveAilmentByName", (c) => c.getMoveAilmentByName("paralysis"), "/move-ailment/paralysis"],
    ["getMoveAilmentById", (c) => c.getMoveAilmentById(MOVE_AILMENTS.PARALYSIS), "/move-ailment/1"],
    [
      "getMoveBattleStyleByName",
      (c) => c.getMoveBattleStyleByName("attack"),
      "/move-battle-style/attack",
    ],
    [
      "getMoveBattleStyleById",
      (c) => c.getMoveBattleStyleById(MOVE_BATTLE_STYLES.ATTACK),
      "/move-battle-style/1",
    ],
    ["getMoveCategoryByName", (c) => c.getMoveCategoryByName("damage"), "/move-category/damage"],
    // The damage category is id 0 — a falsy identifier that must still be sent.
    [
      "getMoveCategoryById",
      (c) => c.getMoveCategoryById(MOVE_CATEGORIES.DAMAGE),
      "/move-category/0",
    ],
    [
      "getMoveDamageClassByName",
      (c) => c.getMoveDamageClassByName("status"),
      "/move-damage-class/status",
    ],
    [
      "getMoveDamageClassById",
      (c) => c.getMoveDamageClassById(MOVE_DAMAGE_CLASSES.STATUS),
      "/move-damage-class/1",
    ],
    [
      "getMoveLearnMethodByName",
      (c) => c.getMoveLearnMethodByName("level-up"),
      "/move-learn-method/level-up",
    ],
    [
      "getMoveLearnMethodById",
      (c) => c.getMoveLearnMethodById(MOVE_LEARN_METHODS.LEVEL_UP),
      "/move-learn-method/1",
    ],
    [
      "getMoveTargetByName",
      (c) => c.getMoveTargetByName("specific-move"),
      "/move-target/specific-move",
    ],
    ["getMoveTargetById", (c) => c.getMoveTargetById(MOVE_TARGETS.SPECIFIC_MOVE), "/move-target/1"],
    ["listMoves", (c) => c.listMoves(20, 50), "/move?offset=20&limit=50"],
    ["listMoveAilments", (c) => c.listMoveAilments(), "/move-ailment?offset=0&limit=20"],
    [
      "listMoveBattleStyles",
      (c) => c.listMoveBattleStyles(),
      "/move-battle-style?offset=0&limit=20",
    ],
    ["listMoveCategories", (c) => c.listMoveCategories(), "/move-category?offset=0&limit=20"],
    [
      "listMoveDamageClasses",
      (c) => c.listMoveDamageClasses(),
      "/move-damage-class?offset=0&limit=20",
    ],
    [
      "listMoveLearnMethods",
      (c) => c.listMoveLearnMethods(),
      "/move-learn-method?offset=0&limit=20",
    ],
    ["listMoveTargets", (c) => c.listMoveTargets(), "/move-target?offset=0&limit=20"],
  ] satisfies EndpointCase<MoveClient>[]);
});
