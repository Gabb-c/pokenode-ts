import { ItemClient } from "@clients";
import { ITEM_ATTRIBUTES, ITEM_CATEGORIES, ITEM_FLING_EFFECTS, ITEM_POCKETS } from "@constants";

import { type EndpointCase, expectEndpoint } from "../helpers/stub-fetch";

describe("ItemClient", () => {
  it.each([
    ["getItemByName", "/item/master-ball", (c) => c.getItemByName("master-ball")],
    ["getItemById", "/item/1", (c) => c.getItemById(1)],
    [
      "getItemAttributeByName",
      "/item-attribute/countable",
      (c) => c.getItemAttributeByName("countable"),
    ],
    [
      "getItemAttributeById",
      "/item-attribute/1",
      (c) => c.getItemAttributeById(ITEM_ATTRIBUTES.COUNTABLE),
    ],
    [
      "getItemCategoryByName",
      "/item-category/stat-boosts",
      (c) => c.getItemCategoryByName("stat-boosts"),
    ],
    [
      "getItemCategoryById",
      "/item-category/1",
      (c) => c.getItemCategoryById(ITEM_CATEGORIES.STAT_BOOSTS),
    ],
    [
      "getItemFlingEffectByName",
      "/item-fling-effect/badly-poison",
      (c) => c.getItemFlingEffectByName("badly-poison"),
    ],
    [
      "getItemFlingEffectById",
      "/item-fling-effect/1",
      (c) => c.getItemFlingEffectById(ITEM_FLING_EFFECTS.BADLY_POISON),
    ],
    ["getItemPocketByName", "/item-pocket/misc", (c) => c.getItemPocketByName("misc")],
    ["getItemPocketById", "/item-pocket/1", (c) => c.getItemPocketById(ITEM_POCKETS.MISC)],
    ["listItems", "/item?offset=20&limit=50", (c) => c.listItems(20, 50)],
    ["listItemAttributes", "/item-attribute?offset=0&limit=20", (c) => c.listItemAttributes()],
    ["listItemCategories", "/item-category?offset=0&limit=20", (c) => c.listItemCategories()],
    [
      "listItemFlingEffects",
      "/item-fling-effect?offset=0&limit=20",
      (c) => c.listItemFlingEffects(),
    ],
    ["listItemPockets", "/item-pocket?offset=0&limit=20", (c) => c.listItemPockets()],
  ] satisfies EndpointCase<ItemClient>[])("%s should request %s", async (_method, path, call) => {
    await expectEndpoint(ItemClient, path, call);
  });
});
