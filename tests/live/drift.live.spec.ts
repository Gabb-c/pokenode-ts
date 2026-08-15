import { MainClient } from "@clients";
import type {
  Berry,
  ContestType,
  EncounterMethod,
  EvolutionDetail,
  EvolutionTrigger,
  GrowthRate,
  Item,
  ItemPocket,
  ItemPrice,
  Language,
  Machine,
  Move,
  MoveDamageClass,
  PalParkArea,
  Pokemon,
  PokemonForm,
  PokemonFormCondition,
  PokemonMoveVersion,
  Version,
} from "@models";
import { modelKeys } from "../utils/model-keys";

/**
 * Tier 3: the only suite that talks to the real PokéAPI.
 *
 * It exists to answer one question the hermetic suites structurally cannot —
 * *has the upstream response shape changed?* — so it asserts the key set of one
 * stable resource per model rather than any particular value. A failure here is
 * upstream drift, and means `src/models` is out of date; it is not a regression
 * in the client.
 *
 * Every expected key list goes through {@link modelKeys}, which makes the
 * compiler prove the list is exactly `keyof` the model it names. A list can
 * therefore never quietly disagree with the type it stands for.
 *
 * Runs on a schedule, never on a pull request. See `.github/workflows/live.yml`.
 */

const client = new MainClient();

type Case = [name: string, fetchResource: () => Promise<object>, keys: string[]];

const RESOURCES: Case[] = [
  [
    "berry",
    () => client.berry.getBerryByName("cheri"),
    modelKeys<Berry>()([
      "id",
      "name",
      "growth_time",
      "max_harvest",
      "natural_gift_power",
      "size",
      "smoothness",
      "soil_dryness",
      "firmness",
      "flavors",
      "item",
      "natural_gift_type",
    ]),
  ],
  [
    "contest type",
    () => client.contest.getContestTypeByName("cool"),
    modelKeys<ContestType>()(["id", "name", "berry_flavor", "names"]),
  ],
  [
    "encounter method",
    () => client.encounter.getEncounterMethodByName("walk"),
    modelKeys<EncounterMethod>()(["id", "name", "order", "names"]),
  ],
  [
    "evolution trigger",
    () => client.evolution.getEvolutionTriggerByName("level-up"),
    modelKeys<EvolutionTrigger>()(["id", "name", "names", "pokemon_species"]),
  ],
  [
    "version",
    () => client.game.getVersionByName("red"),
    modelKeys<Version>()(["id", "name", "names", "version_group"]),
  ],
  [
    "item pocket",
    () => client.item.getItemPocketByName("misc"),
    modelKeys<ItemPocket>()(["id", "name", "categories", "names"]),
  ],
  [
    "item",
    () => client.item.getItemByName("master-ball"),
    modelKeys<Item>()([
      "id",
      "name",
      "prices",
      "fling_power",
      "fling_effect",
      "attributes",
      "category",
      "effect_entries",
      "flavor_text_entries",
      "game_indices",
      "names",
      "sprites",
      "held_by_pokemon",
      "baby_trigger_for",
      "machines",
    ]),
  ],
  [
    "pal park area",
    () => client.location.getPalParkAreaByName("forest"),
    modelKeys<PalParkArea>()(["id", "name", "names", "pokemon_encounters"]),
  ],
  [
    "machine",
    () => client.machine.getMachineById(1),
    modelKeys<Machine>()(["id", "item", "move", "version_group"]),
  ],
  [
    "move damage class",
    () => client.move.getMoveDamageClassByName("status"),
    modelKeys<MoveDamageClass>()(["id", "name", "descriptions", "moves", "names"]),
  ],
  [
    "move",
    () => client.move.getMoveByName("pound"),
    modelKeys<Move>()([
      "id",
      "name",
      "accuracy",
      "effect_chance",
      "pp",
      "priority",
      "power",
      "contest_combos",
      "contest_type",
      "contest_effect",
      "damage_class",
      "effect_entries",
      "effect_changes",
      "learned_by_pokemon",
      "flavor_text_entries",
      "generation",
      "machines",
      "meta",
      "names",
      "past_values",
      "stat_changes",
      "super_contest_effect",
      "target",
      "type",
    ]),
  ],
  [
    "growth rate",
    () => client.pokemon.getGrowthRateByName("slow"),
    modelKeys<GrowthRate>()(["id", "name", "formula", "descriptions", "levels", "pokemon_species"]),
  ],
  [
    "pokemon",
    () => client.pokemon.getPokemonByName("bulbasaur"),
    modelKeys<Pokemon>()([
      "id",
      "name",
      "base_experience",
      "height",
      "is_default",
      "order",
      "weight",
      "abilities",
      "forms",
      "game_indices",
      "held_items",
      "location_area_encounters",
      "moves",
      "sprites",
      "cries",
      "species",
      "stats",
      "types",
      "past_types",
      "past_abilities",
      "past_stats",
    ]),
  ],
  [
    "pokemon form",
    () => client.pokemon.getPokemonFormByName("bulbasaur"),
    modelKeys<PokemonForm>()([
      "id",
      "name",
      "order",
      "form_order",
      "is_default",
      "is_battle_only",
      "is_mega",
      "form_name",
      "pokemon",
      "sprites",
      "version_group",
      "names",
      "form_names",
      "types",
      "trigger_conditions",
    ]),
  ],
  [
    "language",
    () => client.utility.getLanguageByName("ja-Hrkt"),
    modelKeys<Language>()(["id", "name", "official", "iso639", "iso3166", "names"]),
  ],
];

/**
 * Picks the sample a nested case asserts against. An empty list is drift in its
 * own right — it would leave the case asserting nothing — so it fails here
 * rather than passing silently.
 */
const sample = <T>(items: readonly T[], what: string): T => {
  const [item] = items;

  if (item === undefined) {
    throw new Error(`The PokéAPI returned no ${what} to check`);
  }

  return item;
};

/**
 * Shapes that only ever appear nested inside another resource, so a top-level
 * key set never reaches them. Each case digs out one sample from a resource
 * known to populate it.
 */
const NESTED: Case[] = [
  [
    "item price",
    async () => sample((await client.item.getItemByName("master-ball")).prices, "item price"),
    modelKeys<ItemPrice>()(["currency", "purchase_price", "sell_price", "version_group"]),
  ],
  [
    "pokemon move version",
    async () =>
      sample(
        sample((await client.pokemon.getPokemonByName("bulbasaur")).moves, "pokemon move")
          .version_group_details,
        "move version group detail",
      ),
    modelKeys<PokemonMoveVersion>()([
      "move_learn_method",
      "version_group",
      "level_learned_at",
      "order",
    ]),
  ],
  [
    // Darmanitan's zen mode is the case that carries `base_form`; a form
    // triggered by a held item, such as a Mega Stone, omits it.
    "pokemon form condition",
    async () =>
      sample(
        (await client.pokemon.getPokemonFormByName("darmanitan-zen")).trigger_conditions,
        "form trigger condition",
      ),
    modelKeys<PokemonFormCondition>()(["name", "url", "trigger", "base_form"]),
  ],
  [
    "evolution detail",
    async () =>
      sample(
        sample((await client.evolution.getEvolutionChainById(2)).chain.evolves_to, "evolution")
          .evolution_details,
        "evolution detail",
      ),
    modelKeys<EvolutionDetail>()([
      "item",
      "trigger",
      "gender",
      "held_item",
      "known_move",
      "known_move_type",
      "location",
      "min_level",
      "min_happiness",
      "min_beauty",
      "min_affection",
      "needs_overworld_rain",
      "party_species",
      "party_type",
      "relative_physical_stats",
      "time_of_day",
      "trade_species",
      "turn_upside_down",
      "version_group",
      "is_default",
      "near_special_rock",
      "needs_multiplayer",
      "region",
      "base_form",
      "evolved_form",
      "used_move",
      "min_move_count",
      "min_steps",
      "min_damage_taken",
    ]),
  ],
];

describe("PokéAPI contract", () => {
  it.each(RESOURCES)("%s should keep the fields the model declares", async (_name, get, keys) => {
    const resource = await get();

    expect(Object.keys(resource).sort()).toEqual(keys);
  });

  it.each(NESTED)("nested %s should keep the fields the model declares", async (_n, get, keys) => {
    const resource = await get();

    expect(Object.keys(resource).sort()).toEqual(keys);
  });

  it("should paginate a list the way the client expects", async () => {
    const list = await client.berry.listBerries(0, 5);

    expect(Object.keys(list).sort()).toEqual(["count", "next", "previous", "results"]);
    expect(list.results).toHaveLength(5);
  });
});
