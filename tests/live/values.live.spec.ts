import { BerryClient, ContestClient, EvolutionClient, MoveClient, PokemonClient } from "@clients";
import { type Field, fieldOf } from "../helpers/model-keys";

/**
 * Tier 3, alongside `drift.live.spec.ts` and `constants.live.spec.ts`: the
 * fields `src/models` narrows to a union of literals, checked against the values
 * upstream actually holds.
 *
 * `drift.live.spec.ts` already rejects a value outside a declared union, but it
 * sees one resource per model, so a union whose members are spread across a
 * section is never exercised. `time_of_day` shipped as `"Day" | "Night"` for a
 * release behind exactly that gap: the one chain that suite fetches has
 * `time_of_day: ""`, which the wrong union still permitted.
 *
 * So this checks both directions, and the second is the one that matters:
 *
 * - a **value upstream holds that the union omits** is drift, the same as a new
 *   key, and means the type is out of date;
 * - a **member the union declares that never appears upstream** is a value that
 *   was invented rather than observed — the failure that let `"Day"` through.
 *
 * The second is only sound because every source below is exhaustive. A sampled
 * one would report a merely rare value as invented: sampling every twelfth
 * evolution chain finds `day` and `night` and misses `dusk` and `full-moon`,
 * which belong to one species each.
 */

/** Every value upstream holds for one field. */
type Observed = Set<string | number | null>;

const literalsOf = (field: Field): Observed =>
  new Set(field.literals === null ? [] : [...field.literals]);

/**
 * A name field whose union is the whole of a listable endpoint: the names the
 * endpoint lists are the values, so one page settles it.
 */
const namesOf = (list: () => AsyncIterable<{ name: string }>) => async (): Promise<Observed> => {
  const seen: Observed = new Set();

  for await (const resource of list()) {
    seen.add(resource.name);
  }

  return seen;
};

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

const cases: [label: string, field: Field, observe: () => Promise<Observed>][] = [
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

// `Move.priority` is deliberately absent. It is declared as the full -8..8 range
// the games allow, and no shipped move uses every step of it, so the unobserved
// half is correct rather than invented.

describe.each(cases)("%s", (label, field, observe) => {
  it("should declare exactly the values upstream holds", async () => {
    const declared = literalsOf(field);
    const seen = await observe();

    // `null` is `| null` on the annotation rather than a member of the union, so
    // a nullable field reports it as observed and would otherwise look undeclared.
    const observed = new Set([...seen].filter((value) => !(value === null && field.nullable)));

    const undeclared = [...observed].filter((value) => !declared.has(value));
    const unobserved = [...declared].filter((value) => !observed.has(value));

    expect(
      { undeclared, unobserved },
      `${label} is declared \`${field.annotation}\`. ` +
        "Values upstream holds but the type omits are drift; " +
        "values the type declares but upstream never holds were never observed.",
    ).toEqual({ undeclared: [], unobserved: [] });
  });
});
