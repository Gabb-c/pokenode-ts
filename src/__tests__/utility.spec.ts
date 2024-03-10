import { beforeAll, describe, expect, expectTypeOf, it } from "vitest";
import { UtilityClient } from "../clients";
import { LANGUAGES } from "../constants";
import type { Language, NamedAPIResourceList, Pokemon } from "../models";

describe("Utility Client", () => {
  let client: UtilityClient;
  beforeAll(() => {
    client = new UtilityClient();
  });

  // Utility Client
  it("check if the pokemon client was instantiated correctly", () => {
    expectTypeOf(client).toEqualTypeOf<UtilityClient>();
  });

  // Language
  it("check if it returns a language passig a name", async () => {
    const data = await client.getLanguageByName("roomaji");

    expectTypeOf(data).toEqualTypeOf<Language>();
    expect(data.id).toBe(LANGUAGES.ROOMAJI);
  });
  it("check if it returns a language passing an ID", async () => {
    const data = await client.getLanguageById(LANGUAGES.FR);

    expectTypeOf(data).toEqualTypeOf<Language>();
    expect(data.name).toBe("fr");
  });
  it("check if it returns a list of berries", async () => {
    const data = await client.listLanguages();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Resource (pokemon)
  it("check if it returns a resource (pokemon) passig an url", async () => {
    const data = await client.getResourceByUrl<Pokemon>("https://pokeapi.co/api/v2/pokemon/luxray");

    expectTypeOf(data).toEqualTypeOf<Pokemon>();
    expect(data.id).toBe(405);
  });
});
