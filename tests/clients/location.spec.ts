import { LocationClient } from "@clients";
import { PAL_PARK_AREAS, REGIONS } from "@constants";

import { type EndpointCase, expectEndpoint } from "../helpers/stub-fetch";

describe("LocationClient", () => {
  it.each([
    ["getLocationByName", "/location/canalave-city", (c) => c.getLocationByName("canalave-city")],
    ["getLocationById", "/location/1", (c) => c.getLocationById(1)],
    [
      "getLocationAreaByName",
      "/location-area/canalave-city-area",
      (c) => c.getLocationAreaByName("canalave-city-area"),
    ],
    ["getLocationAreaById", "/location-area/1", (c) => c.getLocationAreaById(1)],
    ["getPalParkAreaByName", "/pal-park-area/forest", (c) => c.getPalParkAreaByName("forest")],
    ["getPalParkAreaById", "/pal-park-area/1", (c) => c.getPalParkAreaById(PAL_PARK_AREAS.FOREST)],
    ["getRegionByName", "/region/kanto", (c) => c.getRegionByName("kanto")],
    ["getRegionById", "/region/1", (c) => c.getRegionById(REGIONS.KANTO)],
    ["listLocations", "/location?offset=20&limit=50", (c) => c.listLocations(20, 50)],
    ["listLocationAreas", "/location-area?offset=0&limit=20", (c) => c.listLocationAreas()],
    ["listPalParkAreas", "/pal-park-area?offset=0&limit=20", (c) => c.listPalParkAreas()],
    ["listRegions", "/region?offset=0&limit=20", (c) => c.listRegions()],
  ] satisfies EndpointCase<LocationClient>[])(
    "%s should request %s",
    async (_method, path, call) => {
      await expectEndpoint(LocationClient, path, call);
    },
  );
});
