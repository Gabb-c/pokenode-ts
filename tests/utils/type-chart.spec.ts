import { type GenerationName, TYPES, type TypeName } from "@constants";
import type {
  NamedAPIResource,
  Type,
  TypeRelations,
  TypeRelationsPast,
  TypeSprites,
} from "@models";
import { defensiveProfile, defensiveProfileFrom, effectiveness, relationsFor } from "@utils";

const link = (name: string): NamedAPIResource<Type> => ({
  name,
  url: `https://pokeapi.co/api/v2/type/${name}`,
});

const links = (...names: string[]): NamedAPIResource<Type>[] => names.map(link);

const relations = (partial: Partial<TypeRelations>): TypeRelations => ({
  no_damage_to: [],
  half_damage_to: [],
  double_damage_to: [],
  no_damage_from: [],
  half_damage_from: [],
  double_damage_from: [],
  ...partial,
});

const past = (generation: GenerationName, damage: Partial<TypeRelations>): TypeRelationsPast => ({
  generation: { name: generation, url: `https://pokeapi.co/api/v2/generation/${generation}` },
  damage_relations: relations(damage),
});

const type = (options: {
  name: string;
  generation: GenerationName;
  damage_relations: TypeRelations;
  past_damage_relations?: TypeRelationsPast[];
}): Type => ({
  id: 0,
  name: options.name,
  damage_relations: options.damage_relations,
  past_damage_relations: options.past_damage_relations ?? [],
  generation: {
    name: options.generation,
    url: `https://pokeapi.co/api/v2/generation/${options.generation}`,
  },
  game_indices: [],
  move_damage_class: { name: "special", url: "https://pokeapi.co/api/v2/move-damage-class/3" },
  names: [],
  pokemon: [],
  moves: [],
  // Nothing here reads the icons, and writing them out is seven generations of
  // game keys for a field no assertion touches.
  sprites: {} as TypeSprites,
});

// Ghost is the type whose chart moved twice, and the values below are the ones
// the API publishes: the `generation-i` entry is Ghost as it was in generation I
// alone, and the `generation-v` entry is Ghost from II through V.
const GHOST = type({
  name: "ghost",
  generation: "generation-i",
  damage_relations: relations({
    no_damage_to: links("normal"),
    half_damage_to: links("dark"),
    double_damage_to: links("ghost", "psychic"),
  }),
  past_damage_relations: [
    past("generation-i", {
      no_damage_to: links("normal", "psychic"),
      double_damage_to: links("ghost"),
    }),
    past("generation-v", {
      no_damage_to: links("normal"),
      half_damage_to: links("dark", "steel"),
      double_damage_to: links("ghost", "psychic"),
    }),
  ],
});

const FIRE = type({
  name: "fire",
  generation: "generation-i",
  damage_relations: relations({
    half_damage_to: links("fire", "water", "rock", "dragon"),
    double_damage_to: links("grass", "ice", "bug", "steel"),
  }),
});

const ELECTRIC = type({
  name: "electric",
  generation: "generation-i",
  damage_relations: relations({
    no_damage_to: links("ground"),
    half_damage_to: links("electric", "grass", "dragon"),
    double_damage_to: links("water", "flying"),
  }),
});

const STEEL = type({
  name: "steel",
  generation: "generation-ii",
  damage_relations: relations({
    half_damage_to: links("steel", "fire", "water", "electric"),
    double_damage_to: links("rock", "ice", "fairy"),
  }),
  past_damage_relations: [
    past("generation-v", {
      half_damage_to: links("steel", "fire", "water", "electric"),
      double_damage_to: links("rock", "ice"),
    }),
  ],
});

const FAIRY = type({
  name: "fairy",
  generation: "generation-vi",
  damage_relations: relations({
    half_damage_to: links("fire", "poison", "steel"),
    double_damage_to: links("fighting", "dragon", "dark"),
  }),
});

describe("relationsFor", () => {
  it("should return the current relations when no generation is named", () => {
    expect(relationsFor(GHOST)).toBe(GHOST.damage_relations);
  });

  // Each past entry records the last generation it applied to, so generations II
  // through V all resolve through the single `generation-v` entry.
  it.each<[GenerationName, string[]]>([
    ["generation-i", []],
    ["generation-ii", ["dark", "steel"]],
    ["generation-iii", ["dark", "steel"]],
    ["generation-v", ["dark", "steel"]],
    ["generation-vi", ["dark"]],
    ["generation-ix", ["dark"]],
  ])("should resolve ghost's chart in %s", (generation, halfDamageTo) => {
    const resolved = relationsFor(GHOST, generation);

    expect(resolved?.half_damage_to.map((entry) => entry.name)).toEqual(halfDamageTo);
  });

  it("should not depend on the order the past entries arrive in", () => {
    const shuffled = {
      ...GHOST,
      past_damage_relations: [...GHOST.past_damage_relations].reverse(),
    };

    expect(relationsFor(shuffled, "generation-i")).toEqual(relationsFor(GHOST, "generation-i"));
    expect(relationsFor(shuffled, "generation-iii")).toEqual(relationsFor(GHOST, "generation-iii"));
  });

  // The trap the guard exists for: Steel's only past entry is `generation-v`, so
  // without it generation I would answer with the generation II–V chart.
  it("should return nothing for a generation the type predates", () => {
    expect(relationsFor(STEEL, "generation-i")).toBeUndefined();
    expect(relationsFor(FAIRY, "generation-iii")).toBeUndefined();
  });

  // A generation the constant does not know yet — the API adding one before this
  // library does. Degrading to the current chart beats refusing to answer.
  it("should fall back to the current chart for an unknown generation", () => {
    const future = { ...FIRE, generation: { name: "generation-x", url: "" } };

    expect(relationsFor(future, "generation-ix")).toBe(FIRE.damage_relations);
  });

  // The mirror of the case above, and the one that matters when the API adds a
  // generation before this library does: -1 would sort before every type's debut
  // and report that nothing existed yet.
  it("should fall back to the current chart for a generation it does not know", () => {
    expect(relationsFor(FIRE, "generation-x" as GenerationName)).toBe(FIRE.damage_relations);
    expect(relationsFor(FAIRY, "generation-x" as GenerationName)).toBe(FAIRY.damage_relations);
  });

  it("should return relations for the generation the type was introduced in", () => {
    expect(relationsFor(STEEL, "generation-ii")).toBeDefined();
    expect(relationsFor(FAIRY, "generation-vi")).toBe(FAIRY.damage_relations);
  });
});

describe("effectiveness", () => {
  it("should multiply across a dual-typed defender", () => {
    expect(effectiveness(FIRE, links("grass", "steel"))).toBe(4);
  });

  it("should return zero when any defending type is immune", () => {
    expect(effectiveness(ELECTRIC, links("ground", "flying"))).toBe(0);
  });

  it("should be neutral against a type the attacker does not list", () => {
    expect(effectiveness(FIRE, links("normal"))).toBe(1);
    expect(effectiveness(FIRE, [])).toBe(1);
  });

  // The historical case: Ghost moves did nothing to Psychic in generation I.
  it("should read the chart of the generation it was given", () => {
    expect(effectiveness(GHOST, links("psychic"))).toBe(2);
    expect(effectiveness(GHOST, links("psychic"), { generation: "generation-i" })).toBe(0);
    expect(effectiveness(GHOST, links("steel"), { generation: "generation-iii" })).toBe(0.5);
    expect(effectiveness(GHOST, links("steel"))).toBe(1);
  });

  it("should return nothing when the attacking type predates the generation", () => {
    expect(effectiveness(STEEL, links("rock"), { generation: "generation-i" })).toBeUndefined();
  });
});

describe("defensiveProfile", () => {
  it("should key every attacking type's multiplier by name", () => {
    expect(defensiveProfile([FIRE, ELECTRIC], links("grass", "steel"))).toEqual({
      fire: 4,
      electric: 0.5,
    });
  });

  it("should leave out types that did not exist in the generation", () => {
    const profile = defensiveProfile([FIRE, STEEL, FAIRY], links("rock"), {
      generation: "generation-i",
    });

    expect(profile).toEqual({ fire: 0.5 });
  });

  // `unknown` and `shadow` are types the API lists and a matchup never involves:
  // they hold no damage relations, so an entry for them is neutral by default and
  // means nothing.
  it("should leave out a type that is not a type name", () => {
    const shadow = type({
      name: "shadow",
      generation: "generation-iii",
      damage_relations: relations({}),
    });

    expect(defensiveProfile([FIRE, shadow], links("grass"))).toEqual({ fire: 2 });
  });

  it("should key the table by type name", () => {
    const profile = defensiveProfile([FIRE], links("grass"));

    expectTypeOf(profile).toEqualTypeOf<Partial<Record<TypeName, number>>>();
    expectTypeOf(profile.fire).toEqualTypeOf<number | undefined>();
    // @ts-expect-error a name that is not a type is a mistake, not a miss.
    profile.psychick;
  });
});

/**
 * Defenders, with the arrays the defender-side reading uses. Real values: Gengar
 * is the immunity case and Ferrothorn the ×4 one, and both are what
 * `defensiveProfile` produces from the other side of the same chart.
 */
const GHOST_DEFENDING = type({
  name: "ghost",
  generation: "generation-i",
  damage_relations: relations({
    no_damage_from: links("normal", "fighting"),
    half_damage_from: links("poison", "bug"),
    double_damage_from: links("ghost", "dark"),
  }),
});

const POISON_DEFENDING = type({
  name: "poison",
  generation: "generation-i",
  damage_relations: relations({
    half_damage_from: links("fighting", "poison", "bug", "grass", "fairy"),
    double_damage_from: links("ground", "psychic"),
  }),
});

const GRASS_DEFENDING = type({
  name: "grass",
  generation: "generation-i",
  damage_relations: relations({
    half_damage_from: links("water", "electric", "grass", "ground"),
    double_damage_from: links("fire", "ice", "poison", "flying", "bug"),
  }),
});

const STEEL_DEFENDING = type({
  name: "steel",
  generation: "generation-ii",
  damage_relations: relations({
    no_damage_from: links("poison"),
    half_damage_from: links(
      "normal",
      "grass",
      "ice",
      "flying",
      "psychic",
      "bug",
      "rock",
      "dragon",
      "steel",
      "fairy",
    ),
    double_damage_from: links("fire", "fighting", "ground"),
  }),
});

describe("defensiveProfileFrom", () => {
  it("should multiply the two types' own arrays", () => {
    const profile = defensiveProfileFrom([GRASS_DEFENDING, STEEL_DEFENDING]);

    expect(profile.fire).toBe(4);
    expect(profile.fighting).toBe(2);
    expect(profile.poison).toBe(0);
  });

  it("should report an immunity from either type", () => {
    const profile = defensiveProfileFrom([GHOST_DEFENDING, POISON_DEFENDING]);

    expect(profile.normal).toBe(0);
    expect(profile.fighting).toBe(0);
    expect(profile.psychic).toBe(2);
  });

  it("should be neutral for a type neither defender lists", () => {
    expect(defensiveProfileFrom([GHOST_DEFENDING]).steel).toBe(1);
  });

  // Total where `defensiveProfile` is partial: nothing here can be missing, so
  // every name is present rather than absent-meaning-neutral.
  it("should key every type name", () => {
    const profile = defensiveProfileFrom([GHOST_DEFENDING]);

    expect(Object.keys(profile).sort()).toEqual(
      Object.keys(TYPES)
        .filter((key) => TYPES[key as keyof typeof TYPES] < 10_000)
        .map((key) => key.toLowerCase())
        .sort(),
    );
  });

  // Total, not `Partial`: the loop assigns every name, so a caller handling
  // `undefined` would be handling something that cannot happen.
  it("should type every entry as present", () => {
    const profile = defensiveProfileFrom([GHOST_DEFENDING]);

    expectTypeOf(profile).toEqualTypeOf<Record<TypeName, number>>();
    expectTypeOf(profile.fire).toEqualTypeOf<number>();
  });

  it("should return neutral everywhere for no defending types", () => {
    expect(new Set(Object.values(defensiveProfileFrom([])))).toEqual(new Set([1]));
  });

  // The equivalence the cheaper path rests on, on the fixtures above: the
  // attacker-side reading of the same chart has to agree.
  it("should agree with the attacker-side reading", () => {
    const attackers = [FIRE, ELECTRIC];
    const defending = links("grass", "steel");

    const fromDefenders = defensiveProfileFrom([GRASS_DEFENDING, STEEL_DEFENDING]);
    const fromAttackers = defensiveProfile(attackers, defending);

    for (const [name, multiplier] of Object.entries(fromAttackers)) {
      expect(fromDefenders[name as keyof typeof fromDefenders], name).toBe(multiplier);
    }
  });
});
