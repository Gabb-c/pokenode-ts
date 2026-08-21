import type { Name } from "@models";
import { localize } from "@utils";

const named = (language: string, name: string): Name => ({
  name,
  language: { name: language, url: `https://pokeapi.co/api/v2/language/${language}` },
});

// Language names as the PokéAPI writes them: lower case throughout.
const NAMES: Name[] = [named("ja-hrkt", "イーブイ"), named("en", "Eevee"), named("de", "Evoli")];

describe("localize", () => {
  it("should default to English", () => {
    expect(localize(NAMES)?.name).toBe("Eevee");
  });

  it("should pick the language it was asked for", () => {
    expect(localize(NAMES, "de")?.name).toBe("Evoli");
    expect(localize(NAMES, "ja-hrkt")?.name).toBe("イーブイ");
  });

  // BCP 47 capitalizes the script subtag and the PokéAPI does not, so the tag
  // someone reaches for by habit has to keep working.
  it("should ignore the case of the tag it was given", () => {
    expect(localize(NAMES, "ja-Hrkt")?.name).toBe("イーブイ");
    expect(localize(NAMES, "EN")?.name).toBe("Eevee");
  });

  it("should return nothing for a language that is absent", () => {
    expect(localize(NAMES, "ko")).toBeUndefined();
  });

  it("should return nothing for an empty list", () => {
    expect(localize([], "en")).toBeUndefined();
  });

  it("should return the first entry a language has", () => {
    const entries = [named("en", "first"), named("en", "second")];

    expect(localize(entries)?.name).toBe("first");
  });
});
