import { BASE_URL } from "@constants";
import { getPokemonSpriteUrl, type PokemonSpriteOptions } from "@utils";

const root = `${BASE_URL.SPRITES}/pokemon`;

const cases: [name: string, options: PokemonSpriteOptions, path: string][] = [
  ["default front", {}, "/25.png"],
  ["default back", { back: true }, "/back/25.png"],
  ["default shiny", { shiny: true }, "/shiny/25.png"],
  ["default female", { female: true }, "/female/25.png"],
  [
    "default back shiny female",
    { back: true, shiny: true, female: true },
    "/back/shiny/female/25.png",
  ],
  ["official artwork", { variant: "official-artwork" }, "/other/official-artwork/25.png"],
  [
    "official artwork shiny",
    { variant: "official-artwork", shiny: true },
    "/other/official-artwork/shiny/25.png",
  ],
  ["home", { variant: "home" }, "/other/home/25.png"],
  [
    "home shiny female",
    { variant: "home", shiny: true, female: true },
    "/other/home/shiny/female/25.png",
  ],
  ["dream world", { variant: "dream-world" }, "/other/dream-world/25.svg"],
  [
    "dream world female",
    { variant: "dream-world", female: true },
    "/other/dream-world/female/25.svg",
  ],
  ["showdown", { variant: "showdown" }, "/other/showdown/25.gif"],
  [
    "showdown back shiny",
    { variant: "showdown", back: true, shiny: true },
    "/other/showdown/back/shiny/25.gif",
  ],
];

describe("getPokemonSpriteUrl", () => {
  it.each(cases)("should build the %s url", (_name, options, path) => {
    expect(getPokemonSpriteUrl(25, options)).toBe(`${root}${path}`);
  });

  it("should default to the front-facing sprite of the default set", () => {
    expect(getPokemonSpriteUrl(25)).toBe(`${root}/25.png`);
  });

  it("should reject a facing the variant does not publish", () => {
    // @ts-expect-error — there are no back-facing official artworks.
    getPokemonSpriteUrl(25, { variant: "official-artwork", back: true });
    // @ts-expect-error — the dream world set has no shiny sprites.
    getPokemonSpriteUrl(25, { variant: "dream-world", shiny: true });
  });
});
