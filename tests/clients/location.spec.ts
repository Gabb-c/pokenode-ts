import { LocationClient } from "@clients";
import { PAL_PARK_AREAS, REGIONS } from "@constants";

import { type EndpointCase, testEndpoints } from "../utils/stub-fetch";

describe("LocationClient", () => {
  testEndpoints(LocationClient, [
    ["getLocationByName", (c) => c.getLocationByName("canalave-city"), "/location/canalave-city"],
    ["getLocationById", (c) => c.getLocationById(1), "/location/1"],
    [
      "getLocationAreaByName",
      (c) => c.getLocationAreaByName("canalave-city-area"),
      "/location-area/canalave-city-area",
    ],
    ["getLocationAreaById", (c) => c.getLocationAreaById(1), "/location-area/1"],
    ["getPalParkAreaByName", (c) => c.getPalParkAreaByName("forest"), "/pal-park-area/forest"],
    ["getPalParkAreaById", (c) => c.getPalParkAreaById(PAL_PARK_AREAS.FOREST), "/pal-park-area/1"],
    ["getRegionByName", (c) => c.getRegionByName("kanto"), "/region/kanto"],
    ["getRegionById", (c) => c.getRegionById(REGIONS.KANTO), "/region/1"],
    ["listLocations", (c) => c.listLocations(20, 50), "/location?offset=20&limit=50"],
    ["listLocationAreas", (c) => c.listLocationAreas(), "/location-area?offset=0&limit=20"],
    ["listPalParkAreas", (c) => c.listPalParkAreas(), "/pal-park-area?offset=0&limit=20"],
    ["listRegions", (c) => c.listRegions(), "/region?offset=0&limit=20"],
  ] satisfies EndpointCase<LocationClient>[]);
});
