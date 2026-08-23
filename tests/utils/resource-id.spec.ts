import type { APIResource, NamedAPIResource, Pokemon } from "@models";
import { resourceId } from "@utils";

const link: NamedAPIResource<Pokemon> = {
  name: "pikachu",
  url: "https://pokeapi.co/api/v2/pokemon/25/",
};

const unnamed: APIResource<Pokemon> = { url: "https://pokeapi.co/api/v2/evolution-chain/67/" };

describe("resourceId", () => {
  it("should read the id off a named link", () => {
    expect(resourceId(link)).toBe(25);
  });

  it("should read the id off an unnamed link", () => {
    expect(resourceId(unnamed)).toBe(67);
  });

  it("should take a bare URL", () => {
    expect(resourceId("https://pokeapi.co/api/v2/pokemon/25/")).toBe(25);
  });

  // The API writes the trailing slash and a caller trimming it is not wrong.
  it("should read the id with or without the trailing slash", () => {
    expect(resourceId("https://pokeapi.co/api/v2/berry/1")).toBe(1);
    expect(resourceId("https://pokeapi.co/api/v2/berry/1/")).toBe(1);
  });

  // `move-ailment/-1` is the "unknown" ailment. The API lists it like any other.
  it("should read a negative id", () => {
    expect(resourceId("https://pokeapi.co/api/v2/move-ailment/-1/")).toBe(-1);
  });

  it("should read the id off a host of its own", () => {
    expect(resourceId("http://localhost:3000/api/v2/pokemon/10034/")).toBe(10_034);
  });

  it("should throw for a URL that names no resource", () => {
    expect(() => resourceId("https://pokeapi.co/api/v2/pokemon/")).toThrow(TypeError);
    expect(() => resourceId("https://pokeapi.co/api/v2/pokemon/ditto")).toThrow(
      "No resource id in URL",
    );
  });
});
