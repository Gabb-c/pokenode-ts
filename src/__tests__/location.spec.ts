import { beforeAll, describe, expect, expectTypeOf, it } from "vitest";
import { LocationClient } from "../clients";
import { PAL_PARK_AREAS, REGIONS } from "../constants";
import type { Location, LocationArea, NamedAPIResourceList, PalParkArea, Region } from "../models";

describe("Location Client", () => {
  let client: LocationClient;
  beforeAll(() => {
    client = new LocationClient();
  });

  // Location Client
  it("check if the location client was instantiated correctly", () => {
    expectTypeOf(client).toEqualTypeOf<LocationClient>();
  });

  // Location
  it("check if it returns a location passig a name", async () => {
    const data = await client.getLocationByName("canalave-city");

    expectTypeOf(data).toEqualTypeOf<Location>();
    expect(data.id).toBe(1);
  });

  it("check if it returns a location passing an ID", async () => {
    const data = await client.getLocationById(1);

    expectTypeOf(data).toEqualTypeOf<Location>();
    expect(data.name).toBe("canalave-city");
  });

  it("check if it returns a list of locations", async () => {
    const data = await client.listLocations();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Location Area
  it("check if it returns a location area passig a name", async () => {
    const data = await client.getLocationAreaByName("canalave-city-area");

    expectTypeOf(data).toEqualTypeOf<LocationArea>();
    expect(data.id).toBe(1);
  });

  it("check if it returns a location area passing an ID", async () => {
    const data = await client.getLocationAreaById(1);

    expectTypeOf(data).toEqualTypeOf<LocationArea>();
    expect(data.name).toBe("canalave-city-area");
  });

  it("check if it returns a list of location areas", async () => {
    const data = await client.listLocationAreas();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Pal Park Area
  it("check if it returns a pal park area passig a name", async () => {
    const data = await client.getPalParkAreaByName("forest");

    expectTypeOf(data).toEqualTypeOf<PalParkArea>();
    expect(data.id).toBe(PAL_PARK_AREAS.FOREST);
  });

  it("check if it returns a pal park area passing an ID", async () => {
    const data = await client.getPalParkAreaById(PAL_PARK_AREAS.FOREST);

    expectTypeOf(data).toEqualTypeOf<PalParkArea>();
    expect(data.name).toBe("forest");
  });

  it("check if it returns a list of pal park areas", async () => {
    const data = await client.listPalParkAreas();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Regions
  it("check if it returns a region passig a name", async () => {
    const data = await client.getRegionByName("kanto");

    expectTypeOf(data).toEqualTypeOf<Region>();
    expect(data.id).toBe(REGIONS.KANTO);
  });

  it("check if it returns a region passing an ID", async () => {
    const data = await client.getRegionById(REGIONS.KANTO);

    expectTypeOf(data).toEqualTypeOf<Region>();
    expect(data.name).toBe("kanto");
  });

  it("check if it returns a list of regions", async () => {
    const data = await client.listRegions();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });
});
