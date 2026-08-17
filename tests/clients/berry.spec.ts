import { BerryClient } from "@clients";
import { BERRIES, BERRY_FIRMNESSES, BERRY_FLAVORS } from "@constants";

import { type EndpointCase, expectEndpoint } from "../helpers/stub-fetch";

describe("BerryClient", () => {
  it.each([
    ["getBerryByName", "/berry/cheri", (c) => c.getBerryByName("cheri")],
    ["getBerryById", "/berry/1", (c) => c.getBerryById(BERRIES.CHERI)],
    [
      "getBerryFirmnessByName",
      "/berry-firmness/very-soft",
      (c) => c.getBerryFirmnessByName("very-soft"),
    ],
    [
      "getBerryFirmnessById",
      "/berry-firmness/1",
      (c) => c.getBerryFirmnessById(BERRY_FIRMNESSES.VERY_SOFT),
    ],
    ["getBerryFlavorByName", "/berry-flavor/spicy", (c) => c.getBerryFlavorByName("spicy")],
    ["getBerryFlavorById", "/berry-flavor/1", (c) => c.getBerryFlavorById(BERRY_FLAVORS.SPICY)],
    ["listBerries", "/berry?offset=20&limit=50", (c) => c.listBerries(20, 50)],
    ["listBerryFirmnesses", "/berry-firmness?offset=0&limit=20", (c) => c.listBerryFirmnesses()],
    ["listBerryFlavors", "/berry-flavor?offset=0&limit=20", (c) => c.listBerryFlavors()],
  ] satisfies EndpointCase<BerryClient>[])("%s should request %s", async (_method, path, call) => {
    await expectEndpoint(BerryClient, path, call);
  });
});
