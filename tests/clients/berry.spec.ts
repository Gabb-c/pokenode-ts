import { BerryClient } from "@clients";
import { BERRIES, BERRY_FIRMNESSES, BERRY_FLAVORS } from "@constants";

import { type EndpointCase, testEndpoints } from "../utils/stub-fetch";

describe("BerryClient", () => {
  testEndpoints(BerryClient, [
    ["getBerryByName", (c) => c.getBerryByName("cheri"), "/berry/cheri"],
    ["getBerryById", (c) => c.getBerryById(BERRIES.CHERI), "/berry/1"],
    [
      "getBerryFirmnessByName",
      (c) => c.getBerryFirmnessByName("very-soft"),
      "/berry-firmness/very-soft",
    ],
    [
      "getBerryFirmnessById",
      (c) => c.getBerryFirmnessById(BERRY_FIRMNESSES.VERY_SOFT),
      "/berry-firmness/1",
    ],
    ["getBerryFlavorByName", (c) => c.getBerryFlavorByName("spicy"), "/berry-flavor/spicy"],
    ["getBerryFlavorById", (c) => c.getBerryFlavorById(BERRY_FLAVORS.SPICY), "/berry-flavor/1"],
    ["listBerries", (c) => c.listBerries(20, 50), "/berry?offset=20&limit=50"],
    ["listBerryFirmnesses", (c) => c.listBerryFirmnesses(), "/berry-firmness?offset=0&limit=20"],
    ["listBerryFlavors", (c) => c.listBerryFlavors(), "/berry-flavor?offset=0&limit=20"],
  ] satisfies EndpointCase<BerryClient>[]);
});
