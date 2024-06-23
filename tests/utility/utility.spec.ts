import { UtilityClient } from "@clients";
import { LANGUAGES } from "@constants";
import type { Pokemon } from "@models";

describe("Utility Client", () => {
  let client: UtilityClient;

  beforeAll(() => {
    client = new UtilityClient();
  });

  // Client
  it("(client) should be instantiated correctly", () => expect(client).toBeDefined());

  // Language
  it("check if it returns a language passig a name", async () => {
    const data = await client.getLanguageByName("roomaji");

    expect(data.id).toBe(LANGUAGES.ROOMAJI);
  });
  it("check if it returns a language passing an ID", async () => {
    const data = await client.getLanguageById(LANGUAGES.FR);

    expect(data.name).toBe("fr");
  });
  it("check if it returns a list of berries", async () => {
    const data = await client.listLanguages();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Resource (pokemon)
  it("check if it returns a resource (pokemon) passig an url", async () => {
    const data = await client.getResourceByUrl<Pokemon>("https://pokeapi.co/api/v2/pokemon/luxray");

    expect(data.id).toBe(405);
  });
});
