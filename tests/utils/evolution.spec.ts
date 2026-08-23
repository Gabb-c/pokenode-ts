import type { ChainLink, EvolutionChain, EvolutionDetail, NamedAPIResource } from "@models";
import {
  type EvolutionRequirement,
  flattenChain,
  formatRequirements,
  pathTo,
  REQUIREMENT_PHRASES,
  requirementsOf,
} from "@utils";

const link = <T>(name: string): NamedAPIResource<T> => ({
  name,
  url: `https://pokeapi.co/api/v2/${name}`,
});

/** An `EvolutionDetail` with everything unset, so a case states only what it needs. */
const detail = (partial: Partial<EvolutionDetail> = {}): EvolutionDetail => ({
  item: null,
  trigger: link("level-up"),
  gender: null,
  held_item: null,
  known_move: null,
  known_move_type: null,
  location: null,
  min_level: null,
  min_happiness: null,
  min_beauty: null,
  min_affection: null,
  needs_overworld_rain: false,
  party_species: null,
  party_type: null,
  relative_physical_stats: null,
  time_of_day: "",
  trade_species: null,
  turn_upside_down: false,
  version_group: link("red-blue"),
  is_default: true,
  near_special_rock: false,
  needs_multiplayer: false,
  region: null,
  base_form: null,
  evolved_form: null,
  used_move: null,
  min_move_count: null,
  min_steps: null,
  min_damage_taken: null,
  ...partial,
});

const node = (
  species: string,
  details: EvolutionDetail[] = [],
  evolvesTo: ChainLink[] = [],
): ChainLink => ({
  is_baby: false,
  species: link(species),
  evolution_details: details,
  evolves_to: evolvesTo,
});

const chainOf = (root: ChainLink): EvolutionChain => ({
  id: 0,
  baby_trigger_item: null,
  chain: root,
});

const stone = (item: string, versionGroup: string): EvolutionDetail =>
  detail({ trigger: link("use-item"), item: link(item), version_group: link(versionGroup) });

const mossyRock = (location: string, versionGroup: string): EvolutionDetail =>
  detail({ location: link(location), version_group: link(versionGroup) });

// Eevee is the branching case, and Leafeon is the one that carries six
// alternatives — five mossy-rock locations, and a Leaf Stone. Copied from the
// live chain so the counts asserted below are the API's, not an invention.
const EEVEE = chainOf(
  node(
    "eevee",
    [],
    [
      node("vaporeon", [stone("water-stone", "red-blue")]),
      node("jolteon", [stone("thunder-stone", "red-blue")]),
      node("flareon", [stone("fire-stone", "red-blue")]),
      node("espeon", [
        detail({ min_happiness: 160, time_of_day: "day", version_group: link("gold-silver") }),
      ]),
      node("umbreon", [
        detail({ min_happiness: 160, time_of_day: "night", version_group: link("gold-silver") }),
      ]),
      node("leafeon", [
        mossyRock("eterna-forest", "diamond-pearl"),
        mossyRock("pinwheel-forest", "black-white"),
        mossyRock("petalburg-woods", "omega-ruby-alpha-sapphire"),
        mossyRock("kalos-route-20", "x-y"),
        mossyRock("lush-jungle", "sun-moon"),
        stone("leaf-stone", "sword-shield"),
      ]),
      node("glaceon", [
        mossyRock("eterna-forest", "diamond-pearl"),
        stone("ice-stone", "sword-shield"),
      ]),
      node("sylveon", [
        detail({
          min_happiness: 160,
          known_move_type: link("fairy"),
          version_group: link("sword-shield"),
        }),
        detail({ min_affection: 2, known_move_type: link("fairy"), version_group: link("x-y") }),
      ]),
    ],
  ),
);

const wurmpleBranch = (cocoon: string, moth: string): ChainLink =>
  node(
    cocoon,
    [detail({ min_level: 7, version_group: link("ruby-sapphire") })],
    [node(moth, [detail({ min_level: 10, version_group: link("ruby-sapphire") })])],
  );

const WURMPLE = chainOf(
  node("wurmple", [], [wurmpleBranch("silcoon", "beautifly"), wurmpleBranch("cascoon", "dustox")]),
);

describe("flattenChain", () => {
  it("should emit one step per evolution and none for the root", () => {
    const steps = flattenChain(EEVEE);

    expect(steps).toHaveLength(8);
    expect(steps.every((step) => step.from.name === "eevee")).toBe(true);
    expect(steps.every((step) => step.depth === 1)).toBe(true);
    expect(steps.map((step) => step.to.name)).toContain("sylveon");
  });

  it("should keep every alternative a step has", () => {
    const leafeon = flattenChain(EEVEE).find((step) => step.to.name === "leafeon");

    expect(leafeon?.details).toHaveLength(6);
  });

  it("should walk deeper chains depth-first", () => {
    const steps = flattenChain(WURMPLE);

    expect(steps.map((step) => `${step.from.name}→${step.to.name}`)).toEqual([
      "wurmple→silcoon",
      "silcoon→beautifly",
      "wurmple→cascoon",
      "cascoon→dustox",
    ]);
    expect(steps.map((step) => step.depth)).toEqual([1, 2, 1, 2]);
  });

  describe("with a version group", () => {
    it("should keep only the details that version group tags", () => {
      const steps = flattenChain(EEVEE, { versionGroup: "sword-shield" });
      const leafeon = steps.find((step) => step.to.name === "leafeon");

      expect(leafeon?.details).toHaveLength(1);
      expect(leafeon?.details[0]?.item?.name).toBe("leaf-stone");
    });

    it("should drop the steps that version group tags no detail of", () => {
      const steps = flattenChain(EEVEE, { versionGroup: "sword-shield" });

      expect(steps.map((step) => step.to.name)).toEqual(["leafeon", "glaceon", "sylveon"]);
    });

    it("should return nothing for a version group the chain has no detail for", () => {
      expect(flattenChain(EEVEE, { versionGroup: "gold" })).toEqual([]);
    });

    // Every edge is filtered on its own terms: a first evolution missing from a
    // game must not hide the one below it.
    it("should still walk below a step it dropped", () => {
      const steps = flattenChain(WURMPLE, { versionGroup: "ruby-sapphire" });
      const partial = flattenChain(
        chainOf(
          node(
            "wurmple",
            [],
            [
              node(
                "silcoon",
                [detail({ min_level: 7, version_group: link("gold-silver") })],
                [
                  node("beautifly", [
                    detail({ min_level: 10, version_group: link("ruby-sapphire") }),
                  ]),
                ],
              ),
            ],
          ),
        ),
        { versionGroup: "ruby-sapphire" },
      );

      expect(steps).toHaveLength(4);
      expect(partial.map((step) => step.to.name)).toEqual(["beautifly"]);
    });
  });
});

describe("pathTo", () => {
  it("should return the steps from the root down to the species", () => {
    expect(pathTo(WURMPLE, "dustox")?.map((step) => step.to.name)).toEqual(["cascoon", "dustox"]);
  });

  it("should accept a link as readily as a name", () => {
    expect(pathTo(WURMPLE, link("beautifly"))?.map((step) => step.to.name)).toEqual([
      "silcoon",
      "beautifly",
    ]);
  });

  it("should return no steps for the species the chain starts from", () => {
    expect(pathTo(WURMPLE, "wurmple")).toEqual([]);
  });

  it("should return nothing for a species the chain does not contain", () => {
    expect(pathTo(WURMPLE, "pikachu")).toBeUndefined();
  });
});

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

describe("formatRequirements", () => {
  it("should render the trigger and its conditions", () => {
    const rendered = formatRequirements(
      requirementsOf(
        detail({ min_happiness: 160, known_move_type: link("fairy"), time_of_day: "night" }),
      ),
    );

    expect(rendered).toBe(
      "level up, with at least 160 happiness, knowing a fairy-type move, during the night",
    );
  });

  it("should say an item is used once, not twice", () => {
    expect(formatRequirements(requirementsOf(stone("water-stone", "red-blue")))).toBe(
      "use water stone",
    );
  });

  it("should render a trigger that has no conditions", () => {
    expect(formatRequirements(requirementsOf(detail({ trigger: link("trade") })))).toBe("trade");
  });

  it("should fall back to the name of a trigger it does not know", () => {
    expect(formatRequirements(requirementsOf(detail({ trigger: link("some-new-trigger") })))).toBe(
      "some new trigger",
    );
  });

  it("should render the comparison a relative physical stats requirement means", () => {
    expect(formatRequirements(requirementsOf(detail({ relative_physical_stats: 0 })))).toBe(
      "level up, with Attack = Defense",
    );
  });

  it("should take the wording of one kind from the caller and leave the rest", () => {
    const rendered = formatRequirements(
      requirementsOf(detail({ min_happiness: 160, time_of_day: "night" })),
      { phrases: { "min-happiness": ({ happiness }) => `at ${happiness} friendship` } },
    );

    expect(rendered).toBe("level up, at 160 friendship, during the night");
  });

  // The de-duplication drops the trigger before anything is rendered, so an
  // override of the item is still the phrase that says the item is used.
  it("should say an item is used once under an override too", () => {
    expect(
      formatRequirements(requirementsOf(stone("water-stone", "red-blue")), {
        phrases: { item: ({ item }) => `usar ${item.name}` },
      }),
    ).toBe("usar water-stone");
  });

  it("should render the table it was given as a whole", () => {
    const requirements = requirementsOf(detail({ trigger: link("trade"), min_level: 30 }));

    expect(
      formatRequirements(requirements, {
        phrases: {
          ...REQUIREMENT_PHRASES,
          trigger: () => "troca",
          "min-level": ({ level }) => `no nível ${level}`,
        },
      }),
    ).toBe("troca, no nível 30");
  });
});

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
    "base-form",
    { base_form: link("darumaka-galar") },
    { kind: "base-form", form: link("darumaka-galar") },
    "in its darumaka galar form",
  ],
  [
    "evolved-form",
    { evolved_form: link("darmanitan-galar-zen") },
    { kind: "evolved-form", form: link("darmanitan-galar-zen") },
    "into its darmanitan galar zen form",
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

// Exhaustive over the union by construction: the table below is what the phrase
// table in `formatRequirements` is checked against.
const triggers: [name: string, phrase: string][] = [
  ["level-up", "level up"],
  ["trade", "trade"],
  ["use-item", "use an item"],
  ["shed", "shed"],
  ["spin", "spin"],
  ["tower-of-darkness", "train in the Tower of Darkness"],
  ["tower-of-waters", "train in the Tower of Waters"],
  ["three-critical-hits", "land three critical hits in one battle"],
  ["take-damage", "take damage"],
  ["other", "an in-game event"],
  ["agile-style-move", "use agile style moves"],
  ["strong-style-move", "use strong style moves"],
  ["recoil-damage", "take recoil damage"],
  ["use-move", "use a move"],
  ["three-defeated-bisharp", "defeat three pack-leading Bisharp"],
  ["gimmighoul-coins", "collect Gimmighoul Coins"],
];

describe("every trigger", () => {
  it.each(triggers)("should render %s", (name, rendered) => {
    expect(formatRequirements(requirementsOf(detail({ trigger: link(name) })))).toBe(rendered);
  });
});
