import { ItemClient } from "@clients";
import { ITEM_ATTRIBUTES, ITEM_CATEGORIES, ITEM_FLING_EFFECTS, ITEM_POCKETS } from "@constants";

import { type EndpointCase, testEndpoints } from "../utils/stub-fetch";

describe("ItemClient", () => {
  testEndpoints(ItemClient, [
    ["getItemByName", (c) => c.getItemByName("master-ball"), "/item/master-ball"],
    ["getItemById", (c) => c.getItemById(1), "/item/1"],
    [
      "getItemAttributeByName",
      (c) => c.getItemAttributeByName("countable"),
      "/item-attribute/countable",
    ],
    [
      "getItemAttributeById",
      (c) => c.getItemAttributeById(ITEM_ATTRIBUTES.COUNTABLE),
      "/item-attribute/1",
    ],
    [
      "getItemCategoryByName",
      (c) => c.getItemCategoryByName("stat-boosts"),
      "/item-category/stat-boosts",
    ],
    [
      "getItemCategoryById",
      (c) => c.getItemCategoryById(ITEM_CATEGORIES.STAT_BOOSTS),
      "/item-category/1",
    ],
    [
      "getItemFlingEffectByName",
      (c) => c.getItemFlingEffectByName("badly-poison"),
      "/item-fling-effect/badly-poison",
    ],
    [
      "getItemFlingEffectById",
      (c) => c.getItemFlingEffectById(ITEM_FLING_EFFECTS.BADLY_POISON),
      "/item-fling-effect/1",
    ],
    ["getItemPocketByName", (c) => c.getItemPocketByName("misc"), "/item-pocket/misc"],
    ["getItemPocketById", (c) => c.getItemPocketById(ITEM_POCKETS.MISC), "/item-pocket/1"],
    ["listItems", (c) => c.listItems(20, 50), "/item?offset=20&limit=50"],
    ["listItemAttributes", (c) => c.listItemAttributes(), "/item-attribute?offset=0&limit=20"],
    ["listItemCategories", (c) => c.listItemCategories(), "/item-category?offset=0&limit=20"],
    [
      "listItemFlingEffects",
      (c) => c.listItemFlingEffects(),
      "/item-fling-effect?offset=0&limit=20",
    ],
    ["listItemPockets", (c) => c.listItemPockets(), "/item-pocket?offset=0&limit=20"],
  ] satisfies EndpointCase<ItemClient>[]);
});
