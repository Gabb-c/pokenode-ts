import type { EvolutionConditionExpression, EvolutionDetail } from "@models";
import { type EvolutionRequirement, formatRequirements, requirementsOf } from "@utils";

import { detail, link } from "../helpers/evolution-fixtures";

describe("requirementsOf", () => {
  it("should lead with the trigger and drop everything unset", () => {
    expect(requirementsOf(detail({ min_level: 16 }))).toEqual([
      { kind: "trigger", trigger: link("level-up") },
      { kind: "min-level", level: 16 },
    ]);
  });

  it("should read a detail with several conditions", () => {
    const sylveon = requirementsOf(
      detail({ min_happiness: 160, known_move_type: link("fairy"), time_of_day: "night" }),
    );

    expect(sylveon.map((requirement) => requirement.kind)).toEqual([
      "trigger",
      "min-happiness",
      "known-move-type",
      "time-of-day",
    ]);
  });

  // `0` means Attack must equal Defense, so testing for truthiness would drop it.
  it("should keep a relative physical stats requirement of zero", () => {
    expect(requirementsOf(detail({ relative_physical_stats: 0 }))).toContainEqual({
      kind: "relative-physical-stats",
      comparison: 0,
    });
  });

  it("should keep the flags that are set and drop the ones that are not", () => {
    const requirements = requirementsOf(detail({ needs_overworld_rain: true }));

    expect(requirements).toContainEqual({ kind: "needs-overworld-rain" });
    expect(requirements).not.toContainEqual({ kind: "turn-upside-down" });
  });

  it("should carry the trigger alone when nothing else is set", () => {
    expect(requirementsOf(detail({ trigger: link("shed") }))).toEqual([
      { kind: "trigger", trigger: link("shed") },
    ]);
  });
});

const condition: EvolutionConditionExpression = {
  expression: "EC 100 % 0 !=",
  percentage_chance: 99,
  variables: [link("encryption-constant")],
};

/**
 * Every kind, with the field that produces it and the phrase it renders as. The
 * mapping is mechanical, which is exactly why a transposed field or property
 * name would otherwise go unseen.
 */
const kinds: [
  label: string,
  patch: Partial<EvolutionDetail>,
  requirement: EvolutionRequirement,
  phrase: string,
][] = [
  [
    "item",
    { item: link("water-stone") },
    { kind: "item", item: link("water-stone") },
    "use water stone",
  ],
  [
    "held-item",
    { held_item: link("razor-claw") },
    { kind: "held-item", item: link("razor-claw") },
    "holding razor claw",
  ],
  ["min-level", { min_level: 16 }, { kind: "min-level", level: 16 }, "at level 16"],
  [
    "min-happiness",
    { min_happiness: 160 },
    { kind: "min-happiness", happiness: 160 },
    "with at least 160 happiness",
  ],
  [
    "min-beauty",
    { min_beauty: 170 },
    { kind: "min-beauty", beauty: 170 },
    "with at least 170 beauty",
  ],
  [
    "min-affection",
    { min_affection: 2 },
    { kind: "min-affection", affection: 2 },
    "with at least 2 affection",
  ],
  [
    "known-move",
    { known_move: link("ancient-power") },
    { kind: "known-move", move: link("ancient-power") },
    "knowing ancient power",
  ],
  [
    "known-move-type",
    { known_move_type: link("fairy") },
    { kind: "known-move-type", type: link("fairy") },
    "knowing a fairy-type move",
  ],
  [
    "used-move",
    { used_move: link("psyshield-bash") },
    { kind: "used-move", move: link("psyshield-bash") },
    "after using psyshield bash",
  ],
  ["min-move-count", { min_move_count: 20 }, { kind: "min-move-count", count: 20 }, "20 times"],
  ["min-steps", { min_steps: 1000 }, { kind: "min-steps", steps: 1000 }, "after 1000 steps"],
  [
    "min-damage-taken",
    { min_damage_taken: 49 },
    { kind: "min-damage-taken", damage: 49 },
    "after taking 49 damage",
  ],
  [
    "location",
    { location: link("eterna-forest") },
    { kind: "location", location: link("eterna-forest") },
    "at eterna forest",
  ],
  ["region", { region: link("alola") }, { kind: "region", region: link("alola") }, "in alola"],
  ["time-of-day", { time_of_day: "day" }, { kind: "time-of-day", time: "day" }, "during the day"],
  // Lycanroc and Ursaluna: the two the API has beyond the day/night pair its
  // own documentation describes, and the two that do not take "during the …".
  ["time-of-day (dusk)", { time_of_day: "dusk" }, { kind: "time-of-day", time: "dusk" }, "at dusk"],
  [
    "time-of-day (full moon)",
    { time_of_day: "full-moon" },
    { kind: "time-of-day", time: "full-moon" },
    "under a full moon",
  ],
  ["gender (female)", { gender: 1 }, { kind: "gender", gender: 1 }, "as a female"],
  ["gender (male)", { gender: 2 }, { kind: "gender", gender: 2 }, "as a male"],
  ["gender (unknown)", { gender: 9 }, { kind: "gender", gender: 9 }, "as a gender 9"],
  [
    "relative-physical-stats (attack higher)",
    { relative_physical_stats: 1 },
    { kind: "relative-physical-stats", comparison: 1 },
    "with Attack > Defense",
  ],
  [
    "relative-physical-stats (attack lower)",
    { relative_physical_stats: -1 },
    { kind: "relative-physical-stats", comparison: -1 },
    "with Attack < Defense",
  ],
  [
    "party-species",
    { party_species: link("remoraid") },
    { kind: "party-species", species: link("remoraid") },
    "with remoraid in the party",
  ],
  [
    "party-type",
    { party_type: link("dark") },
    { kind: "party-type", type: link("dark") },
    "with a dark-type in the party",
  ],
  [
    "trade-species",
    { trade_species: link("karrablast") },
    { kind: "trade-species", species: link("karrablast") },
    "traded for karrablast",
  ],
  [
    "required-form",
    { required_pokemon_form: link("darumaka-galar") },
    { kind: "required-form", form: link("darumaka-galar") },
    "in its darumaka galar form",
  ],
  [
    "evolved-form",
    { evolved_pokemon_form: link("darmanitan-galar-zen") },
    { kind: "evolved-form", form: link("darmanitan-galar-zen") },
    "into its darmanitan galar zen form",
  ],
  [
    "allowed-natures",
    { allowed_natures: [link("hardy"), link("jolly")] },
    { kind: "allowed-natures", natures: [link("hardy"), link("jolly")] },
    "with a hardy or jolly nature",
  ],
  [
    "condition",
    { condition_expression: condition },
    { kind: "condition", condition },
    "with a 99% chance",
  ],
  [
    "needs-overworld-rain",
    { needs_overworld_rain: true },
    { kind: "needs-overworld-rain" },
    "while it is raining",
  ],
  [
    "turn-upside-down",
    { turn_upside_down: true },
    { kind: "turn-upside-down" },
    "with the console upside down",
  ],
  [
    "near-special-rock",
    { near_special_rock: true },
    { kind: "near-special-rock" },
    "near a special rock",
  ],
  [
    "needs-multiplayer",
    { needs_multiplayer: true },
    { kind: "needs-multiplayer" },
    "in multiplayer",
  ],
];

describe("every requirement kind", () => {
  it.each(kinds)("should read %s off the detail", (_label, patch, requirement) => {
    expect(requirementsOf(detail(patch))).toContainEqual(requirement);
  });

  it.each(kinds)("should render %s", (_label, _patch, requirement, rendered) => {
    expect(formatRequirements([requirement])).toBe(rendered);
  });
});
