import {
  BerryClient,
  ContestClient,
  CurrencyClient,
  EncounterClient,
  EvolutionClient,
  GameClient,
  ItemClient,
  LocationClient,
  MoveClient,
  PokemonClient,
  UtilityClient,
} from "@clients";
import {
  BERRIES,
  BERRY_FIRMNESSES,
  BERRY_FLAVORS,
  CONTEST_TYPES,
  CURRENCIES,
  EGG_GROUPS,
  ENCOUNTER_CONDITION_VALUES,
  ENCOUNTER_CONDITIONS,
  ENCOUNTER_METHODS,
  ENDPOINTS,
  EVOLUTION_TRIGGERS,
  GENDERS,
  GENERATIONS,
  GROWTH_RATES,
  ITEM_ATTRIBUTES,
  ITEM_CATEGORIES,
  ITEM_FLING_EFFECTS,
  ITEM_POCKETS,
  LANGUAGES,
  MOVE_AILMENTS,
  MOVE_BATTLE_STYLES,
  MOVE_CATEGORIES,
  MOVE_DAMAGE_CLASSES,
  MOVE_LEARN_METHODS,
  MOVE_TARGETS,
  NATURES,
  PAL_PARK_AREAS,
  POKEATHLON_STATS,
  POKEDEXES,
  POKEMON_COLORS,
  POKEMON_HABITATS,
  POKEMON_SHAPES,
  REGIONS,
  STATS,
  TYPES,
  type TypeName,
  VERSION_GROUPS,
  VERSIONS,
} from "@constants";
import type { NamedAPIResource } from "@models";
import { resourceId } from "@utils";
import { sortKeys } from "../helpers/model-keys";

/**
 * Tier 3, alongside `drift.live.spec.ts`: everything `src/constants` claims
 * about the PokéAPI, checked against the PokéAPI.
 *
 * `drift.live.spec.ts` watches response *shapes*; nothing watched the ids. They
 * are the one place a silent wrong answer is possible — an id that has moved or
 * never existed is a 404 at runtime, and `LANGUAGES` sat one language behind the
 * API long enough for the docs to describe a constant the code did not have.
 * `TYPES` then shipped without `stellar` for three generations of games, because
 * this file checked three maps and stopped.
 *
 * So every map is here. The ids come off the links a list page already carries —
 * `resourceId(link)` — rather than by resolving each resource for its `id`,
 * which is the difference between one request per section and one per resource.
 * Thirty-six sections cost fewer requests this way than three did before.
 */

/** What a listed link has to carry for its id to be read. */
type Links = () => AsyncIterable<NamedAPIResource<unknown>>;

/**
 * A constant's keys as the API writes its names: `TOWER_OF_WATERS` →
 * `tower-of-waters`, with the deprecated misspellings dropped.
 *
 * An alias is a second key for an id the map already has — `MONTAIN` beside
 * `MOUNTAIN` — kept for callers until 3.0 and never a name the API publishes. An
 * id identifies one resource, so a repeat is always an alias and never two names
 * upstream really has; that is what makes dropping the later key safe, and what
 * saves this file a list to maintain alongside the deprecations themselves.
 */
const asNames = (constant: Readonly<Record<string, number>>): Record<string, number> => {
  const names: Record<string, number> = {};
  const claimed = new Set<number>();

  for (const [key, id] of Object.entries(constant)) {
    if (claimed.has(id)) {
      continue;
    }

    claimed.add(id);
    names[key.toLowerCase().replace(/_/g, "-")] = id;
  }

  return names;
};

// One page per section rather than the default twenty entries: no section below
// has more than a hundred members, so this is a single request each.
const PAGE = { pageSize: 100 };

const berry = new BerryClient();
const contest = new ContestClient();
const currency = new CurrencyClient();
const encounter = new EncounterClient();
const evolution = new EvolutionClient();
const game = new GameClient();
const item = new ItemClient();
const location = new LocationClient();
const move = new MoveClient();
const pokemon = new PokemonClient();
const utility = new UtilityClient();

const cases: [name: string, declared: Record<string, number>, links: Links][] = [
  ["BERRIES", asNames(BERRIES), () => berry.paginate("listBerries", PAGE)],
  [
    "BERRY_FIRMNESSES",
    asNames(BERRY_FIRMNESSES),
    () => berry.paginate("listBerryFirmnesses", PAGE),
  ],
  ["BERRY_FLAVORS", asNames(BERRY_FLAVORS), () => berry.paginate("listBerryFlavors", PAGE)],
  ["CONTEST_TYPES", asNames(CONTEST_TYPES), () => contest.paginate("listContestTypes", PAGE)],
  ["CURRENCIES", asNames(CURRENCIES), () => currency.paginate("listCurrencies", PAGE)],
  [
    "ENCOUNTER_METHODS",
    asNames(ENCOUNTER_METHODS),
    () => encounter.paginate("listEncounterMethods", PAGE),
  ],
  [
    "ENCOUNTER_CONDITIONS",
    asNames(ENCOUNTER_CONDITIONS),
    () => encounter.paginate("listEncounterConditions", PAGE),
  ],
  [
    "ENCOUNTER_CONDITION_VALUES",
    asNames(ENCOUNTER_CONDITION_VALUES),
    () => encounter.paginate("listEncounterConditionValues", PAGE),
  ],
  [
    "EVOLUTION_TRIGGERS",
    asNames(EVOLUTION_TRIGGERS),
    () => evolution.paginate("listEvolutionTriggers", PAGE),
  ],
  ["GENERATIONS", asNames(GENERATIONS), () => game.paginate("listGenerations", PAGE)],
  ["POKEDEXES", asNames(POKEDEXES), () => game.paginate("listPokedexes", PAGE)],
  ["VERSIONS", asNames(VERSIONS), () => game.paginate("listVersions", PAGE)],
  ["VERSION_GROUPS", asNames(VERSION_GROUPS), () => game.paginate("listVersionGroups", PAGE)],
  ["ITEM_ATTRIBUTES", asNames(ITEM_ATTRIBUTES), () => item.paginate("listItemAttributes", PAGE)],
  ["ITEM_CATEGORIES", asNames(ITEM_CATEGORIES), () => item.paginate("listItemCategories", PAGE)],
  [
    "ITEM_FLING_EFFECTS",
    asNames(ITEM_FLING_EFFECTS),
    () => item.paginate("listItemFlingEffects", PAGE),
  ],
  ["ITEM_POCKETS", asNames(ITEM_POCKETS), () => item.paginate("listItemPockets", PAGE)],
  ["REGIONS", asNames(REGIONS), () => location.paginate("listRegions", PAGE)],
  ["PAL_PARK_AREAS", asNames(PAL_PARK_AREAS), () => location.paginate("listPalParkAreas", PAGE)],
  ["MOVE_AILMENTS", asNames(MOVE_AILMENTS), () => move.paginate("listMoveAilments", PAGE)],
  [
    "MOVE_BATTLE_STYLES",
    asNames(MOVE_BATTLE_STYLES),
    () => move.paginate("listMoveBattleStyles", PAGE),
  ],
  ["MOVE_CATEGORIES", asNames(MOVE_CATEGORIES), () => move.paginate("listMoveCategories", PAGE)],
  [
    "MOVE_DAMAGE_CLASSES",
    asNames(MOVE_DAMAGE_CLASSES),
    () => move.paginate("listMoveDamageClasses", PAGE),
  ],
  [
    "MOVE_LEARN_METHODS",
    asNames(MOVE_LEARN_METHODS),
    () => move.paginate("listMoveLearnMethods", PAGE),
  ],
  ["MOVE_TARGETS", asNames(MOVE_TARGETS), () => move.paginate("listMoveTargets", PAGE)],
  ["EGG_GROUPS", asNames(EGG_GROUPS), () => pokemon.paginate("listEggGroups", PAGE)],
  ["GENDERS", asNames(GENDERS), () => pokemon.paginate("listGenders", PAGE)],
  ["GROWTH_RATES", asNames(GROWTH_RATES), () => pokemon.paginate("listGrowthRates", PAGE)],
  ["NATURES", asNames(NATURES), () => pokemon.paginate("listNatures", PAGE)],
  [
    "POKEATHLON_STATS",
    asNames(POKEATHLON_STATS),
    () => pokemon.paginate("listPokeathlonStats", PAGE),
  ],
  ["POKEMON_COLORS", asNames(POKEMON_COLORS), () => pokemon.paginate("listPokemonColors", PAGE)],
  [
    "POKEMON_HABITATS",
    asNames(POKEMON_HABITATS),
    () => pokemon.paginate("listPokemonHabitats", PAGE),
  ],
  ["POKEMON_SHAPES", asNames(POKEMON_SHAPES), () => pokemon.paginate("listPokemonShapes", PAGE)],
  ["STATS", asNames(STATS), () => pokemon.paginate("listStats", PAGE)],
  ["TYPES", asNames(TYPES), () => pokemon.paginate("listTypes", PAGE)],
  ["LANGUAGES", asNames(LANGUAGES), () => utility.paginate("listLanguages", PAGE)],
];

describe.each(cases)("%s", (_name, declared, links) => {
  it("should match the ids the API publishes", async () => {
    const listed = new Map<string, number>();

    for await (const link of links()) {
      listed.set(link.name, resourceId(link));
    }

    // Keyed by name rather than by constant: a name the API has and this map
    // does not is the drift that actually happened, and comparing whole maps is
    // what catches it.
    expect(declared).toEqual(Object.fromEntries(listed));
  });
});

/**
 * {@link TypeName} at runtime. A `Record` of the union rather than a list: a
 * member missing here, or one here that the union does not have, is a compile
 * error, so `pnpm typecheck` proves the two are the same set before the request
 * below asks whether upstream agrees.
 */
const TYPE_NAMES: Record<TypeName, true> = {
  normal: true,
  fighting: true,
  flying: true,
  poison: true,
  ground: true,
  rock: true,
  bug: true,
  ghost: true,
  steel: true,
  fire: true,
  water: true,
  grass: true,
  electric: true,
  psychic: true,
  ice: true,
  dragon: true,
  dark: true,
  fairy: true,
  stellar: true,
};

describe("TypeName", () => {
  it("should be the types the API lists below 10000", async () => {
    const listed: string[] = [];

    for await (const link of pokemon.paginate("listTypes", PAGE)) {
      // The ids above 10000 are `unknown` and `shadow`, which the union leaves
      // out on purpose — the same line `src/utils/type-chart.ts` filters on.
      if (resourceId(link) < 10_000) {
        listed.push(link.name);
      }
    }

    expect(sortKeys(listed)).toEqual(sortKeys(Object.keys(TYPE_NAMES)));
  });
});

/**
 * Endpoints the client deliberately does not model.
 *
 * `/meta` reports the deploy the API is running — commit hash, deploy date, tag
 * — rather than any Pokémon data, so there is nothing for `src/models` to say
 * about it.
 */
const UNMODELLED = new Set(["/meta"]);

/** The index the API serves at its root, listing every endpoint it offers. */
const INDEX_URL = "https://pokeapi.co/api/v2/";

describe("ENDPOINTS", () => {
  // Lived in `drift.live.spec.ts` until it was noticed that what it checks is a
  // constant, not a model.
  it("should name every endpoint the API advertises", async () => {
    const index = await utility.getResourceByUrl<Record<string, string>>(INDEX_URL);
    const advertised = Object.keys(index)
      .map((name) => `/${name}`)
      .filter((path) => !UNMODELLED.has(path));

    expect(sortKeys(advertised)).toEqual(sortKeys([...Object.values(ENDPOINTS)]));
  });
});
