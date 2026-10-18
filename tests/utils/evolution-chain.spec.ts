import type { ChainLink, EvolutionChain, EvolutionDetail } from "@models";
import { flattenChain, pathTo } from "@utils";

import { detail, link, stone } from "../helpers/evolution-fixtures";

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
