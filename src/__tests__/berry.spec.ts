import { BerryClient } from "../clients";
import { Berries, BerryFirmnesses, BerryFlavors } from "../constants";
import { Berry, BerryFirmness, BerryFlavor, NamedAPIResourceList } from "../models";
import { assertType, beforeAll, describe, expect, expectTypeOf, it } from "vitest";

describe("Berry Client", () => {
  let client: BerryClient;
  beforeAll(() => {
    client = new BerryClient();
  });

  // Berry Client
  it("check if berry client way instantiated correctly", () => {
    expect(client).toBeDefined();
    assertType<BerryClient>(client);
  });

  // Berry
  it("check if it returns a berry passig a name", async () => {
    const data = await client.getBerryByName("cheri");

    expectTypeOf(data).toEqualTypeOf<Berry>();
    expect(data.id).toBe(Berries.CHERI);
  });

  it("check if it returns a berry passing an ID", async () => {
    const data = await client.getBerryById(Berries.CHERI);

    expectTypeOf(data).toEqualTypeOf<Berry>();
    expect(data.name).toBe("cheri");
  });

  it("check if it returns a list of berries", async () => {
    const data = await client.listBerries().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });

  // Berry Firmness
  it("check if it returns a berry firmness passig a name", async () => {
    const data = await client.getBerryFirmnessByName("very-soft");

    expectTypeOf(data).toEqualTypeOf<BerryFirmness>();
    expect(data.name).toBe("very-soft");
  });

  it("check if it returns a berry firmness passing an ID", async () => {
    const data = await client.getBerryFirmnessById(BerryFirmnesses.VERY_SOFT);

    expectTypeOf(data).toEqualTypeOf<BerryFirmness>();
    expect(data.name).toBe("very-soft");
  });

  it("check if it returns a list of berry firmnesses", async () => {
    const data = await client.listBerryFirmnesses();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });

  // Berry Flavor
  it("check if it returns a berry flavor passig a name", async () => {
    const data = await client.getBerryFlavorByName("spicy");

    expectTypeOf(data).toEqualTypeOf<BerryFlavor>();
    expect(data.id).toBe(BerryFlavors.SPICY);
  });

  it("check if it returns a berry flavor passing an ID", async () => {
    const data = await client.getBerryFlavorById(BerryFlavors.SPICY);

    expectTypeOf(data).toEqualTypeOf<BerryFlavor>();
    expect(data.name).toBe("spicy");
  });

  it("check if it returns a list of berry flavors", async () => {
    const data = await client.listBerryFlavors();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });
});
