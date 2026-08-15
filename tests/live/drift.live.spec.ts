import { MainClient } from "@clients";

/**
 * Tier 3: the only suite that talks to the real PokéAPI.
 *
 * It exists to answer one question the hermetic suites structurally cannot —
 * *has the upstream response shape changed?* — so it asserts the top-level key
 * set of one stable resource per section rather than any particular value. A
 * failure here is upstream drift, and means `src/models` is out of date; it is
 * not a regression in the client.
 *
 * Runs on a schedule, never on a pull request. See `.github/workflows/live.yml`.
 */

const client = new MainClient();

type Section = [name: string, fetchResource: () => Promise<object>, keys: string[]];

const SECTIONS: Section[] = [
  [
    "berry",
    () => client.berry.getBerryByName("cheri"),
    [
      "firmness",
      "flavors",
      "growth_time",
      "id",
      "item",
      "max_harvest",
      "name",
      "natural_gift_power",
      "natural_gift_type",
      "size",
      "smoothness",
      "soil_dryness",
    ],
  ],
  [
    "contest",
    () => client.contest.getContestTypeByName("cool"),
    ["berry_flavor", "id", "name", "names"],
  ],
  [
    "encounter",
    () => client.encounter.getEncounterMethodByName("walk"),
    ["id", "name", "names", "order"],
  ],
  [
    "evolution",
    () => client.evolution.getEvolutionTriggerByName("level-up"),
    ["id", "name", "names", "pokemon_species"],
  ],
  ["game", () => client.game.getVersionByName("red"), ["id", "name", "names", "version_group"]],
  ["item", () => client.item.getItemPocketByName("misc"), ["categories", "id", "name", "names"]],
  [
    "location",
    () => client.location.getPalParkAreaByName("forest"),
    ["id", "name", "names", "pokemon_encounters"],
  ],
  ["machine", () => client.machine.getMachineById(1), ["id", "item", "move", "version_group"]],
  [
    "move",
    () => client.move.getMoveDamageClassByName("status"),
    ["descriptions", "id", "moves", "name", "names"],
  ],
  [
    "pokemon",
    () => client.pokemon.getGrowthRateByName("slow"),
    ["descriptions", "formula", "id", "levels", "name", "pokemon_species"],
  ],
  [
    "utility",
    () => client.utility.getLanguageByName("ja-Hrkt"),
    ["id", "iso3166", "iso639", "name", "names", "official"],
  ],
];

describe("PokéAPI contract", () => {
  it.each(SECTIONS)("%s should keep the fields the models declare", async (_name, get, keys) => {
    const resource = await get();

    expect(Object.keys(resource).sort()).toEqual(keys);
  });

  it("should paginate a list the way the client expects", async () => {
    const list = await client.berry.listBerries(0, 5);

    expect(Object.keys(list).sort()).toEqual(["count", "next", "previous", "results"]);
    expect(list.results).toHaveLength(5);
  });
});
