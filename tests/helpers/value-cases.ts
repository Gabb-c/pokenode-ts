import { BerryClient, ContestClient, EvolutionClient, MoveClient, PokemonClient } from "@clients";
import { type Field, fieldOf } from "./model-keys";

/**
 * The rows `values.live.spec.ts` runs, kept apart from it so the unit tier can
 * prove every literal union has one without touching the network.
 *
 * Every source below has to be exhaustive. A sampled one would report a merely
 * rare value as invented: sampling every twelfth evolution chain finds `day` and
 * `night` and misses `dusk` and `full-moon`, which belong to one species each.
 */

/** Every value upstream holds for one field. */
export type Observed = Set<string | number | null>;

/** One row: what it checks, the declared field, and how to observe it. */
export type ValueCase = [label: string, field: Field, observe: () => Promise<Observed>];

/** One field read off every resource of a listable endpoint. */
const valuesOf =
  <T>(list: () => AsyncIterable<T>, read: (resource: T) => readonly (string | number | null)[]) =>
  async (): Promise<Observed> => {
    const seen: Observed = new Set();

    for await (const resource of list()) {
      for (const value of read(resource)) {
        seen.add(value);
      }
    }

    return seen;
  };

/**
 * A name field whose union is the whole of a listable endpoint: the names the
 * endpoint lists are the values, so one page settles it.
 */
const namesOf = (list: () => AsyncIterable<{ name: string }>) =>
  valuesOf(list, (resource) => [resource.name]);

/**
 * The seed table behind the evolution endpoints.
 *
 * Read from the PokeAPI repo rather than swept off the API: the values below
 * live inside `evolution_details`, which no endpoint lists, so covering them
 * exhaustively over the wire costs a request per evolution chain — 500-odd, for
 * two assertions, against an API whose fair-use policy asks the opposite. The
 * same table is one request, and it is what the endpoints are built from.
 *
 * It is upstream *earlier* than the deployed API, so a value appearing here
 * first is advance notice that the type will need widening, not a false alarm.
 */
const SEED_URL =
  "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_evolution.csv";

let seeded: Promise<Record<string, string>[]> | undefined;

/** No field in this table is quoted or holds a comma, so a split is enough. */
const seed = async (): Promise<Record<string, string>[]> => {
  seeded ??= (async () => {
    const response = await fetch(SEED_URL);

    if (!response.ok) {
      throw new Error(`${SEED_URL} answered ${response.status}`);
    }

    const [header, ...rows] = (await response.text()).trim().split("\n");
    const columns = (header ?? "").split(",");

    return rows.map((row) =>
      Object.fromEntries(row.split(",").map((cell, index) => [columns[index] as string, cell])),
    );
  })();

  return seeded;
};

/**
 * One column of the seed table. `parse` maps a cell to the value the API emits
 * for it — an empty cell is `""` on a string column and `null` on a nullable
 * numeric one, which is the difference between the two rows below.
 */
const seedColumn =
  (column: string, parse: (cell: string) => string | number | null) =>
  async (): Promise<Observed> =>
    new Set((await seed()).map((row) => parse(row[column] ?? "")));

export const VALUES: ValueCase[] = [
  // Closed sets: the union is the endpoint's own list of names.
  [
    "Gender.name",
    fieldOf("Gender", "name"),
    namesOf(() => new PokemonClient().paginate("listGenders", { resolve: true })),
  ],
  [
    "GrowthRate.name",
    fieldOf("GrowthRate", "name"),
    namesOf(() => new PokemonClient().paginate("listGrowthRates", { resolve: true })),
  ],
  [
    "PokeathlonStat.name",
    fieldOf("PokeathlonStat", "name"),
    namesOf(() => new PokemonClient().paginate("listPokeathlonStats", { resolve: true })),
  ],
  [
    "EggGroup.name",
    fieldOf("EggGroup", "name"),
    namesOf(() => new PokemonClient().paginate("listEggGroups", { resolve: true })),
  ],
  [
    "PokemonColor.name",
    fieldOf("PokemonColor", "name"),
    namesOf(() => new PokemonClient().paginate("listPokemonColors", { resolve: true })),
  ],
  [
    "PokemonHabitat.name",
    fieldOf("PokemonHabitat", "name"),
    namesOf(() => new PokemonClient().paginate("listPokemonHabitats", { resolve: true })),
  ],
  [
    "Stat.name",
    fieldOf("Stat", "name"),
    namesOf(() => new PokemonClient().paginate("listStats", { resolve: true })),
  ],
  [
    "ContestType.name",
    fieldOf("ContestType", "name"),
    namesOf(() => new ContestClient().paginate("listContestTypes", { resolve: true })),
  ],
  [
    "BerryFlavor.name",
    fieldOf("BerryFlavor", "name"),
    namesOf(() => new BerryClient().paginate("listBerryFlavors", { resolve: true })),
  ],
  [
    "BerryFirmness.name",
    fieldOf("BerryFirmness", "name"),
    namesOf(() => new BerryClient().paginate("listBerryFirmnesses", { resolve: true })),
  ],
  [
    "MoveBattleStyle.name",
    fieldOf("MoveBattleStyle", "name"),
    namesOf(() => new MoveClient().paginate("listMoveBattleStyles", { resolve: true })),
  ],
  // `constants.live.spec.ts` checks the EVOLUTION_TRIGGERS map against the same
  // endpoint; this checks the type union, which can drift from the map on its own.
  [
    "EvolutionTrigger.name",
    fieldOf("EvolutionTrigger", "name"),
    namesOf(() => new EvolutionClient().paginate("listEvolutionTriggers", { resolve: true })),
  ],
  [
    "EvolutionVariable.name",
    fieldOf("EvolutionVariable", "name"),
    namesOf(() => new EvolutionClient().paginate("listEvolutionVariables", { resolve: true })),
  ],
  [
    "EvolutionVariable.source",
    fieldOf("EvolutionVariable", "source"),
    valuesOf(
      () => new EvolutionClient().paginate("listEvolutionVariables", { resolve: true }),
      (variable) => [variable.source],
    ),
  ],

  // Stat changes, read off every resource of the small sections that list them.
  [
    "MoveStatAffect.change",
    fieldOf("MoveStatAffect", "change"),
    valuesOf(
      () => new PokemonClient().paginate("listStats", { resolve: true }),
      ({ affecting_moves }) =>
        [...affecting_moves.increase, ...affecting_moves.decrease].map(({ change }) => change),
    ),
  ],
  [
    "NatureStatChange.max_change",
    fieldOf("NatureStatChange", "max_change"),
    valuesOf(
      () => new PokemonClient().paginate("listNatures", { resolve: true }),
      (nature) => nature.pokeathlon_stat_changes.map(({ max_change }) => max_change),
    ),
  ],
  [
    "NaturePokeathlonStatAffect.max_change",
    fieldOf("NaturePokeathlonStatAffect", "max_change"),
    valuesOf(
      () => new PokemonClient().paginate("listPokeathlonStats", { resolve: true }),
      ({ affecting_natures }) =>
        [...affecting_natures.increase, ...affecting_natures.decrease].map(
          ({ max_change }) => max_change,
        ),
    ),
  ],

  // Values buried in `evolution_details`, which is where the one-resource check
  // is blind and no endpoint offers a listing.
  [
    "EvolutionDetail.time_of_day",
    fieldOf("EvolutionDetail", "time_of_day"),
    seedColumn("time_of_day", (cell) => cell),
  ],
  [
    "EvolutionDetail.relative_physical_stats",
    fieldOf("EvolutionDetail", "relative_physical_stats"),
    seedColumn("relative_physical_stats", (cell) => (cell === "" ? null : Number(cell))),
  ],
];

/** Literal unions deliberately left without a row, and why. */
export const UNSWEPT: ReadonlyMap<string, string> = new Map([
  [
    "Move.priority",
    "declared as the full -8..8 range the games allow; no shipped move uses every step of it, " +
      "so the unobserved half is correct rather than invented",
  ],
]);
