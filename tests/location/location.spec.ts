import { LocationClient } from "@clients";
import { PAL_PARK_AREAS, REGIONS } from "@constants";

describe("Location Client", () => {
  let client: LocationClient;

  beforeAll(() => {
    client = new LocationClient();
  });

  // Client
  it("(client) should be instantiated correctly", () => expect(client).toBeDefined());

  // Location
  it("check if it returns a location passig a name", async () => {
    const data = await client.getLocationByName("canalave-city");

    expect(data.id).toBe(1);
  });

  it("check if it returns a location passing an ID", async () => {
    const data = await client.getLocationById(1);

    expect(data.name).toBe("canalave-city");
  });

  it("check if it returns a list of locations", async () => {
    const data = await client.listLocations();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Location Area
  it("check if it returns a location area passig a name", async () => {
    const data = await client.getLocationAreaByName("canalave-city-area");

    expect(data.id).toBe(1);
  });

  it("check if it returns a location area passing an ID", async () => {
    const data = await client.getLocationAreaById(1);

    expect(data.name).toBe("canalave-city-area");
  });

  it("check if it returns a list of location areas", async () => {
    const data = await client.listLocationAreas();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Pal Park Area
  it("check if it returns a pal park area passig a name", async () => {
    const data = await client.getPalParkAreaByName("forest");

    expect(data.id).toBe(PAL_PARK_AREAS.FOREST);
  });

  it("check if it returns a pal park area passing an ID", async () => {
    const data = await client.getPalParkAreaById(PAL_PARK_AREAS.FOREST);

    expect(data.name).toBe("forest");
  });

  it("check if it returns a list of pal park areas", async () => {
    const data = await client.listPalParkAreas();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Regions
  it("check if it returns a region passig a name", async () => {
    const data = await client.getRegionByName("kanto");

    expect(data.id).toBe(REGIONS.KANTO);
  });

  it("check if it returns a region passing an ID", async () => {
    const data = await client.getRegionById(REGIONS.KANTO);

    expect(data.name).toBe("kanto");
  });

  it("check if it returns a list of regions", async () => {
    const data = await client.listRegions();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });
});
