import { BerryClient, PokemonClient } from "@clients";
import { BASE_URL } from "@constants";
import type { Type, TypeRelations } from "@models";
import { getPokemonSpriteUrl, type PokemonSpriteOptions } from "@utils";

/**
 * Tier 3: the behaviour the client assumes of the services it talks to, as
 * opposed to the data they serve.
 *
 * `drift.live.spec.ts` and `constants.live.spec.ts` ask whether what `src/`
 * *declares* is still true. This asks whether what `src/` *relies on* is still
 * true — conditional requests, the shape of a page, and a sprite repository on
 * another host entirely. Each has a hermetic suite proving the client does its
 * half; only a real request proves the other side still does its own.
 *
 * A failure here is not a model that needs updating. It is a feature that has
 * quietly stopped working: revalidation downloading every time, a paginated walk
 * that never terminates, sprite URLs answering 404 in someone's application.
 */

/**
 * Conditional requests, by hand rather than through the client: what is being
 * checked is that the API answers 304, not that the client asks well.
 *
 * One resource per endpoint shape: a single resource, a paginated list, and one
 * of the sections whose entries have no name.
 */
const CONDITIONAL: [name: string, path: string][] = [
  ["a single resource", "/berry/1"],
  ["a paginated list", "/berry?offset=0&limit=20"],
  ["an unnamed resource", "/machine/1"],
];

describe("conditional requests", () => {
  it.each(CONDITIONAL)("should answer 304 for %s", async (_name, path) => {
    const url = `${BASE_URL.REST}${path}`;
    const first = await fetch(url, { headers: { Accept: "application/json" } });
    const etag = first.headers.get("ETag");

    expect(etag, `${url} sent no ETag`).not.toBeNull();

    const second = await fetch(url, {
      headers: { Accept: "application/json", "If-None-Match": etag as string },
    });

    expect(second.status, url).toBe(304);
  });
});

describe("pagination", () => {
  // `walk` reads `next` to decide there is another page, and the offset it
  // carries to know where it is. A list that stopped advertising either would
  // strand the walk on page one, or never end it.
  it("should page a list the way the client expects", async () => {
    const list = await new BerryClient().listBerries(0, 5);

    expect(list.results).toHaveLength(5);
    expect(list.next).toContain("offset=5");
  });
});

/**
 * The URLs {@link getPokemonSpriteUrl} builds are a contract with a repository
 * nobody here controls, and it is not even the API — a reorganisation there is
 * invisible to every other case in this tier.
 *
 * One request per variant, on Pokémon the sets are known to cover: Pikachu for
 * everything, and Unfezant (593) for the gendered sprites, which most species
 * do not have.
 */
const SPRITES: [name: string, id: number, options: PokemonSpriteOptions][] = [
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
  it.each(SPRITES)("should resolve the %s sprite", async (_name, id, options) => {
    const url = getPokemonSpriteUrl(id, options);
    const response = await fetch(url, { method: "HEAD" });

    expect(response.status, url).toBe(200);
  });
});

/**
 * The type chart says the same thing from both sides: `X.double_damage_to`
 * holds exactly the types whose `double_damage_from` holds `X`.
 *
 * `defensiveProfileFrom` is the cheap path only because of this — it reads the
 * defending types' own arrays, one or two resources, and claims the answer
 * `defensiveProfile` gets from all of them. That claim is about upstream, so it
 * decays; a failure here means the two helpers have silently stopped agreeing
 * and the cheaper one is wrong.
 */
const SIDES = [
  ["no_damage_to", "no_damage_from"],
  ["half_damage_to", "half_damage_from"],
  ["double_damage_to", "double_damage_from"],
] as const satisfies readonly (readonly [keyof TypeRelations, keyof TypeRelations])[];

let fetched: Promise<Type[]> | undefined;

/** The types a matchup can involve. `unknown` and `shadow` hold no relations. */
const types = async (): Promise<Type[]> => {
  fetched ??= (async () => {
    const listed: Type[] = [];

    for await (const type of new PokemonClient().paginate("listTypes", { resolve: true })) {
      if (type.id < 10_000) {
        listed.push(type);
      }
    }

    return listed;
  })();

  return fetched;
};

/** Every `attacker → defender` edge one side of the chart claims. */
const edges = (
  listed: readonly Type[],
  offensive: keyof TypeRelations,
  defensive: keyof TypeRelations,
): { attacking: Set<string>; defending: Set<string> } => ({
  attacking: new Set(
    listed.flatMap((type) =>
      type.damage_relations[offensive].map((target) => `${type.name} → ${target.name}`),
    ),
  ),
  defending: new Set(
    listed.flatMap((type) =>
      type.damage_relations[defensive].map((source) => `${source.name} → ${type.name}`),
    ),
  ),
});

describe.each(SIDES)("%s", (offensive, defensive) => {
  it("should hold the same edges as its mirror", async () => {
    const { attacking, defending } = edges(await types(), offensive, defensive);

    expect(
      [...attacking].sort(),
      `\`${offensive}\` and \`${defensive}\` disagree. The type chart is not symmetric, ` +
        "so `defensiveProfileFrom` is no longer the same answer as `defensiveProfile`.",
    ).toEqual([...defending].sort());
  });
});
