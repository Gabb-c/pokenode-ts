import { getPokemonSpriteUrl, type PokemonSpriteOptions } from "@utils";

/**
 * Tier 3, alongside `drift.live.spec.ts`: the URLs {@link getPokemonSpriteUrl}
 * builds are a contract with a repository nobody here controls.
 *
 * The unit suite proves the builder produces the paths it was told to. Only a
 * real request proves those paths still resolve, so a reorganisation upstream
 * surfaces as drift rather than as 404s in someone's application.
 *
 * One request per variant, on Pokémon the sets are known to cover: Pikachu for
 * everything, and Unfezant (593) for the gendered sprites, which most species
 * do not have.
 */

const cases: [name: string, id: number, options: PokemonSpriteOptions][] = [
  ["default front", 25, {}],
  ["default back shiny", 25, { back: true, shiny: true }],
  ["default female", 593, { female: true }],
  ["official artwork", 25, { variant: "official-artwork" }],
  ["official artwork shiny", 25, { variant: "official-artwork", shiny: true }],
  ["home", 25, { variant: "home" }],
  ["home shiny female", 593, { variant: "home", shiny: true, female: true }],
  ["dream world", 25, { variant: "dream-world" }],
  ["dream world female", 593, { variant: "dream-world", female: true }],
  ["showdown", 25, { variant: "showdown" }],
  ["showdown back shiny", 25, { variant: "showdown", back: true, shiny: true }],
];

describe("sprite urls", () => {
  it.each(cases)("should resolve the %s sprite", async (_name, id, options) => {
    const url = getPokemonSpriteUrl(id, options);
    const response = await fetch(url, { method: "HEAD" });

    expect(response.status, url).toBe(200);
  });
});
