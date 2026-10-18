import type { EvolutionConditionExpression } from "@models";
import {
  formatRequirements,
  REQUIREMENT_PHRASES,
  requirementPhrases,
  requirementsOf,
} from "@utils";

import { detail, link, stone } from "../helpers/evolution-fixtures";

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

  // Milcery's spin: the expression reads the player's input, so there are no odds to state.
  it("should leave out a condition that has no chance", () => {
    const spin: EvolutionConditionExpression = {
      expression: "SPIN_DIR 0 == SPIN_SEC 5 < &&",
      percentage_chance: null,
      variables: [link("spin-direction"), link("spin-duration")],
    };
    const requirements = requirementsOf(
      detail({ trigger: link("spin"), time_of_day: "day", condition_expression: spin }),
    );

    expect(requirements).toContainEqual({ kind: "condition", condition: spin });
    expect(formatRequirements(requirements)).toBe("spin, during the day");
  });

  it("should leave out a kind an override renders as nothing", () => {
    expect(
      formatRequirements(requirementsOf(detail({ min_level: 30 })), {
        phrases: { trigger: () => "" },
      }),
    ).toBe("at level 30");
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
  ["in-battle-level-up", "level up during a battle"],
  ["agile-style-move", "use agile style moves"],
  ["strong-style-move", "use strong style moves"],
  ["recoil-damage", "take recoil damage"],
  ["use-move", "use a move"],
  ["three-defeated-bisharp", "defeat three pack-leading Bisharp"],
  ["gimmighoul-coins", "collect Gimmighoul Coins"],
  ["meltan-candies", "feed Meltan Candies in Pokémon GO"],
  ["unclassified", "an unclassified method"],
];

describe("every trigger", () => {
  it.each(triggers)("should render %s", (name, rendered) => {
    expect(formatRequirements(requirementsOf(detail({ trigger: link(name) })))).toBe(rendered);
  });
});

describe("formatRequirements naming", () => {
  const display = new Map([
    ["water-stone", "Pedra da Água"],
    ["mt-coronet", "Monte Coroa"],
  ]);
  const named = (resource: { name: string }) => display.get(resource.name) ?? resource.name;

  it("should name resources the way it was told to", () => {
    expect(
      formatRequirements(requirementsOf(stone("water-stone", "red-blue")), { name: named }),
    ).toBe("use Pedra da Água");
  });

  it("should apply the namer to every kind that names a resource", () => {
    const rendered = formatRequirements(
      requirementsOf(detail({ location: link("mt-coronet"), held_item: link("water-stone") })),
      { name: named },
    );

    expect(rendered).toBe("level up, holding Pedra da Água, at Monte Coroa");
  });

  // The two halves of a translation, and neither needs the other.
  it("should combine with a phrase override", () => {
    const rendered = formatRequirements(
      requirementsOf(detail({ trigger: link("use-item"), item: link("water-stone") })),
      { name: named, phrases: { item: ({ item }) => `usar ${named(item)}` } },
    );

    expect(rendered).toBe("usar Pedra da Água");
  });

  it("should leave the API's own names alone by default", () => {
    expect(formatRequirements(requirementsOf(detail({ location: link("mt-coronet") })))).toBe(
      "level up, at mt coronet",
    );
  });

  it("should build a table a caller can hold on to", () => {
    const phrases = requirementPhrases(named);

    expect(phrases.item({ kind: "item", item: link("water-stone") })).toBe("use Pedra da Água");
    expect(phrases["min-level"]({ kind: "min-level", level: 16 })).toBe("at level 16");
  });
});
