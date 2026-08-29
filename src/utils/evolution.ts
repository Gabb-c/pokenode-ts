import type {
  ChainLink,
  EvolutionChain,
  EvolutionDetail,
  EvolutionTimeOfDay,
  EvolutionTrigger,
  EvolutionTriggerName,
  Item,
  Location,
  Move,
  NamedAPIResource,
  PokemonForm,
  PokemonSpecies,
  Region,
  Type,
} from "@models";

/**
 * ## Evolution Step
 * One edge of an evolution chain: a species, what it evolves into, and every way
 * that happens.
 */
export interface EvolutionStep {
  /** The species that evolves. */
  from: NamedAPIResource<PokemonSpecies>;
  /** What it evolves into. */
  to: NamedAPIResource<PokemonSpecies>;
  /**
   * The ways this step happens, which are alternatives rather than a sequence —
   * the API publishes one per version group, so Leafeon carries five mossy-rock
   * locations and a Leaf Stone. Never empty.
   */
  details: EvolutionDetail[];
  /** How deep in the chain this step sits: `1` for a first evolution. */
  depth: number;
  /** Whether {@link EvolutionStep.to} is a baby Pokémon. */
  isBaby: boolean;
}

/**
 * ## Flatten Options
 * How {@link flattenChain} narrows the chain it walks.
 */
export interface FlattenOptions {
  /**
   * Keep only the details tagged with this version group, by the name the API
   * gives it — `sword-shield`, not `Sword/Shield` — and drop the steps left with
   * none. The tag is the game that introduced the method, not every game it
   * applies in — see {@link flattenChain}.
   */
  versionGroup?: string;
}

/** The details of a link, narrowed to one version group when asked for. */
const detailsFor = (link: ChainLink, versionGroup: string | undefined): EvolutionDetail[] =>
  versionGroup === undefined
    ? link.evolution_details
    : link.evolution_details.filter((detail) => detail.version_group.name === versionGroup);

/**
 * Flattens an evolution chain into one step per evolution, depth-first in the
 * order the API lists them.
 *
 * ```ts
 * const species = await api.pokemon.getPokemonSpeciesByName('eevee');
 * const chain = await api.resolve(species.evolution_chain);
 *
 * for (const step of flattenChain(chain)) {
 *   console.log(`${step.from.name} → ${step.to.name}`);
 * }
 * ```
 *
 * The root is not a step: it is what the chain starts from, and the API gives it
 * no `evolution_details` to describe.
 *
 * `versionGroup` keeps only the details tagged with that version group, which is
 * what picks the Leaf Stone out of Leafeon's six alternatives:
 *
 * ```ts
 * flattenChain(chain, { versionGroup: 'sword-shield' });
 * ```
 *
 * That tag is the game which *introduced* the method, not every game it applies
 * in: Eevee's Water Stone is tagged `red-blue` alone, so filtering to
 * `sword-shield` drops Vaporeon even though Sword/Shield evolves it the same way
 * it always did. The question this answers is what a game changed.
 *
 * A step with nothing left after that is dropped, but the chain below it is
 * still walked — every edge is filtered on its own terms, and `depth` stays the
 * position in the chain rather than in the result.
 */
export const flattenChain = (chain: EvolutionChain, options?: FlattenOptions): EvolutionStep[] => {
  const collect = (link: ChainLink, depth: number): EvolutionStep[] =>
    link.evolves_to.flatMap((next) => {
      const details = detailsFor(next, options?.versionGroup);
      const below = collect(next, depth + 1);

      if (details.length === 0) {
        return below;
      }

      return [
        { from: link.species, to: next.species, details, depth, isBaby: next.is_baby },
        ...below,
      ];
    });

  return collect(chain.chain, 1);
};

/**
 * The steps leading from the root of a chain to `species`.
 *
 * ```ts
 * pathTo(chain, 'dustox')?.map((step) => step.to.name); // ['cascoon', 'dustox']
 * ```
 *
 * Matched against the name the API gives a species, which is not the name a game
 * displays: `localize(species.names)` is `Papilord` in French and finds nothing
 * here. Pass the link itself when you have one.
 *
 * @returns The steps, `[]` when `species` is the root the chain starts from, and
 *   `undefined` when the chain does not contain it. The two empty answers are
 *   different questions, so they are different values.
 */
export const pathTo = (
  chain: EvolutionChain,
  species: string | NamedAPIResource<PokemonSpecies>,
): EvolutionStep[] | undefined => {
  const wanted = typeof species === "string" ? species : species.name;

  const search = (link: ChainLink, trail: EvolutionStep[]): EvolutionStep[] | undefined => {
    if (link.species.name === wanted) {
      return trail;
    }

    for (const next of link.evolves_to) {
      const step: EvolutionStep = {
        from: link.species,
        to: next.species,
        details: next.evolution_details,
        depth: trail.length + 1,
        isBaby: next.is_baby,
      };
      const found = search(next, [...trail, step]);

      if (found !== undefined) {
        return found;
      }
    }

    return undefined;
  };

  return search(chain.chain, []);
};

/**
 * ## Evolution Requirement
 * One condition an evolution is subject to, as a discriminated union — what an
 * {@link EvolutionDetail}'s thirty-odd nullable fields say, without the nulls.
 *
 * `is_default` and `version_group` are not here: they describe the record, not
 * what the Pokémon has to do.
 */
export type EvolutionRequirement =
  | { kind: "trigger"; trigger: NamedAPIResource<EvolutionTrigger> }
  | { kind: "item"; item: NamedAPIResource<Item> }
  | { kind: "held-item"; item: NamedAPIResource<Item> }
  | { kind: "min-level"; level: number }
  | { kind: "min-happiness"; happiness: number }
  | { kind: "min-beauty"; beauty: number }
  | { kind: "min-affection"; affection: number }
  | { kind: "known-move"; move: NamedAPIResource<Move> }
  | { kind: "known-move-type"; type: NamedAPIResource<Type> }
  | { kind: "used-move"; move: NamedAPIResource<Move> }
  | { kind: "min-move-count"; count: number }
  | { kind: "min-steps"; steps: number }
  | { kind: "min-damage-taken"; damage: number }
  | { kind: "location"; location: NamedAPIResource<Location> }
  | { kind: "region"; region: NamedAPIResource<Region> }
  | { kind: "time-of-day"; time: EvolutionTimeOfDay }
  | { kind: "gender"; gender: number }
  | { kind: "relative-physical-stats"; comparison: 1 | 0 | -1 }
  | { kind: "party-species"; species: NamedAPIResource<PokemonSpecies> }
  | { kind: "party-type"; type: NamedAPIResource<Type> }
  | { kind: "trade-species"; species: NamedAPIResource<PokemonSpecies> }
  | { kind: "base-form"; form: NamedAPIResource<PokemonForm> }
  | { kind: "evolved-form"; form: NamedAPIResource<PokemonForm> }
  | { kind: "needs-overworld-rain" }
  | { kind: "turn-upside-down" }
  | { kind: "near-special-rock" }
  | { kind: "needs-multiplayer" };

/**
 * One reader per field an {@link EvolutionDetail} can set, in the order the
 * requirements come out, each `null` when its field is unset.
 */
const READERS: ((detail: EvolutionDetail) => EvolutionRequirement | null)[] = [
  ({ item }) => (item === null ? null : { kind: "item", item }),
  ({ held_item: item }) => (item === null ? null : { kind: "held-item", item }),
  ({ min_level: level }) => (level === null ? null : { kind: "min-level", level }),
  ({ min_happiness: happiness }) =>
    happiness === null ? null : { kind: "min-happiness", happiness },
  ({ min_beauty: beauty }) => (beauty === null ? null : { kind: "min-beauty", beauty }),
  ({ min_affection: affection }) =>
    affection === null ? null : { kind: "min-affection", affection },
  ({ known_move: move }) => (move === null ? null : { kind: "known-move", move }),
  ({ known_move_type: type }) => (type === null ? null : { kind: "known-move-type", type }),
  ({ used_move: move }) => (move === null ? null : { kind: "used-move", move }),
  ({ min_move_count: count }) => (count === null ? null : { kind: "min-move-count", count }),
  ({ min_steps: steps }) => (steps === null ? null : { kind: "min-steps", steps }),
  ({ min_damage_taken: damage }) => (damage === null ? null : { kind: "min-damage-taken", damage }),
  ({ location }) => (location === null ? null : { kind: "location", location }),
  ({ region }) => (region === null ? null : { kind: "region", region }),
  ({ time_of_day: time }) => (time === "" ? null : { kind: "time-of-day", time }),
  ({ gender }) => (gender === null ? null : { kind: "gender", gender }),
  ({ relative_physical_stats: comparison }) =>
    comparison === null ? null : { kind: "relative-physical-stats", comparison },
  ({ party_species: species }) => (species === null ? null : { kind: "party-species", species }),
  ({ party_type: type }) => (type === null ? null : { kind: "party-type", type }),
  ({ trade_species: species }) => (species === null ? null : { kind: "trade-species", species }),
  ({ base_form: form }) => (form === null ? null : { kind: "base-form", form }),
  ({ evolved_form: form }) => (form === null ? null : { kind: "evolved-form", form }),
  ({ needs_overworld_rain: rain }) => (rain ? { kind: "needs-overworld-rain" } : null),
  ({ turn_upside_down: upsideDown }) => (upsideDown ? { kind: "turn-upside-down" } : null),
  ({ near_special_rock: rock }) => (rock ? { kind: "near-special-rock" } : null),
  ({ needs_multiplayer: multiplayer }) => (multiplayer ? { kind: "needs-multiplayer" } : null),
];

/**
 * The conditions one {@link EvolutionDetail} sets out, with everything it left
 * unset dropped.
 *
 * ```ts
 * requirementsOf(step.details[0]); // eevee → umbreon
 * // [
 * //   { kind: 'trigger', trigger: { name: 'level-up', … } },
 * //   { kind: 'min-happiness', happiness: 160 },
 * //   { kind: 'time-of-day', time: 'night' },
 * //   { kind: 'base-form', form: { name: 'eevee', … } },
 * // ]
 * ```
 *
 * The trigger leads, so rendering the result is a walk over one array.
 *
 * Every field is tested against the value the API uses for "unset" rather than
 * for truthiness: `relative_physical_stats` is `0` when Attack has to equal
 * Defense, and `time_of_day` is `''`.
 */
export const requirementsOf = (detail: EvolutionDetail): EvolutionRequirement[] => [
  { kind: "trigger", trigger: detail.trigger },
  ...READERS.flatMap((read) => read(detail) ?? []),
];

/**
 * Every trigger as a verb phrase. Exhaustive over {@link EvolutionTriggerName},
 * so a trigger added to that union has to be given words here too.
 */
const TRIGGERS: Record<EvolutionTriggerName, string> = {
  "level-up": "level up",
  trade: "trade",
  "use-item": "use an item",
  shed: "shed",
  spin: "spin",
  "tower-of-darkness": "train in the Tower of Darkness",
  "tower-of-waters": "train in the Tower of Waters",
  "three-critical-hits": "land three critical hits in one battle",
  "take-damage": "take damage",
  other: "an in-game event",
  "agile-style-move": "use agile style moves",
  "strong-style-move": "use strong style moves",
  "recoil-damage": "take recoil damage",
  "use-move": "use a move",
  "three-defeated-bisharp": "defeat three pack-leading Bisharp",
  "gimmighoul-coins": "collect Gimmighoul Coins",
};

/** A resource name as prose: the API writes them kebab-cased and lower case. */
const spaced = (resource: NamedAPIResource<unknown>): string => resource.name.replace(/-/g, " ");

/**
 * Every time of day as a phrase. Exhaustive over {@link EvolutionTimeOfDay}, so
 * a value added to that union has to be given words here too — `dusk` and
 * `full-moon` do not fit the "during the …" the other two take.
 */
const TIMES: Record<EvolutionTimeOfDay, string> = {
  day: "during the day",
  night: "during the night",
  dusk: "at dusk",
  "full-moon": "under a full moon",
};

const GENDERS: Record<number, string> = { 1: "female", 2: "male", 3: "genderless" };

/** Unknown ids name themselves, so a gender added upstream still renders. */
const genderName = (gender: number): string => GENDERS[gender] ?? `gender ${gender}`;

const COMPARISONS: Record<string, string> = { "1": ">", "0": "=", "-1": "<" };

/**
 * ## Requirement Phrases
 * One renderer per {@link EvolutionRequirement} kind. Exhaustive, so a kind added
 * to that union has to be given words here too.
 */
export type RequirementPhrases = {
  [K in EvolutionRequirement["kind"]]: (
    requirement: Extract<EvolutionRequirement, { kind: K }>,
  ) => string;
};

/**
 * ## Resource Namer
 * How a resource a requirement names is written out.
 *
 * @param resource The item, move, species, location, region, form or type the
 *   requirement carries.
 * @returns What to print for it.
 */
export type ResourceNamer = (resource: NamedAPIResource<unknown>) => string;

/**
 * Builds the English table around a way of naming resources.
 *
 * Everything except the name is fixed; `namer` is the one thing a caller who
 * keeps the English sentence still has to replace, because `spaced` prints what
 * the API calls a resource and no localized name is derivable from it.
 *
 * ```ts
 * const names = new Map([['water-stone', 'Pedra da Água']]);
 *
 * requirementPhrases((resource) => names.get(resource.name) ?? resource.name);
 * ```
 *
 * @param namer How to write a resource out. Defaults to the API's own name, with
 *   the hyphens turned to spaces.
 */
export const requirementPhrases = (namer: ResourceNamer = spaced): RequirementPhrases => ({
  trigger: ({ trigger }) => TRIGGERS[trigger.name as EvolutionTriggerName] ?? namer(trigger),
  item: ({ item }) => `use ${namer(item)}`,
  "held-item": ({ item }) => `holding ${namer(item)}`,
  "min-level": ({ level }) => `at level ${level}`,
  "min-happiness": ({ happiness }) => `with at least ${happiness} happiness`,
  "min-beauty": ({ beauty }) => `with at least ${beauty} beauty`,
  "min-affection": ({ affection }) => `with at least ${affection} affection`,
  "known-move": ({ move }) => `knowing ${namer(move)}`,
  "known-move-type": ({ type }) => `knowing a ${namer(type)}-type move`,
  "used-move": ({ move }) => `after using ${namer(move)}`,
  "min-move-count": ({ count }) => `${count} times`,
  "min-steps": ({ steps }) => `after ${steps} steps`,
  "min-damage-taken": ({ damage }) => `after taking ${damage} damage`,
  location: ({ location }) => `at ${namer(location)}`,
  region: ({ region }) => `in ${namer(region)}`,
  "time-of-day": ({ time }) => TIMES[time],
  gender: ({ gender }) => `as a ${genderName(gender)}`,
  "relative-physical-stats": ({ comparison }) =>
    `with Attack ${COMPARISONS[String(comparison)]} Defense`,
  "party-species": ({ species }) => `with ${namer(species)} in the party`,
  "party-type": ({ type }) => `with a ${namer(type)}-type in the party`,
  "trade-species": ({ species }) => `traded for ${namer(species)}`,
  "base-form": ({ form }) => `in its ${namer(form)} form`,
  "evolved-form": ({ form }) => `into its ${namer(form)} form`,
  "needs-overworld-rain": () => "while it is raining",
  "turn-upside-down": () => "with the console upside down",
  "near-special-rock": () => "near a special rock",
  "needs-multiplayer": () => "in multiplayer",
});

/**
 * ## Requirement Phrases
 * The English {@link formatRequirements} renders with, naming resources the way
 * the API does. Exported so a caller can replace the wording of one kind — or
 * all of them, in another language — without rebuilding the rest of the renderer
 * around it, and so an override can fall back to the default for what it does
 * not handle.
 *
 * ```ts
 * formatRequirements(requirements, {
 *   phrases: { 'min-happiness': ({ happiness }) => `com ${happiness} de felicidade` },
 * });
 *
 * formatRequirements(requirements, {
 *   phrases: {
 *     trigger: (requirement) => MINE[requirement.trigger.name] ?? REQUIREMENT_PHRASES.trigger(requirement),
 *   },
 * });
 * ```
 */
export const REQUIREMENT_PHRASES: RequirementPhrases = requirementPhrases();

/**
 * The table built for a namer, kept so that rendering a list does not rebuild
 * twenty-seven closures per row. Weak, so a namer closed over a component's
 * props is not held alive by having been used once.
 */
const tables = new WeakMap<ResourceNamer, RequirementPhrases>();

const tableFor = (namer: ResourceNamer | undefined): RequirementPhrases => {
  if (namer === undefined) {
    return REQUIREMENT_PHRASES;
  }

  const built = tables.get(namer) ?? requirementPhrases(namer);
  tables.set(namer, built);

  return built;
};

/**
 * The table is keyed by `kind` and the union is discriminated by it, so the two
 * are known to line up — but only one entry at a time, which is not something an
 * index of the whole table can be written to say.
 */
const phrase = (requirement: EvolutionRequirement, phrases: RequirementPhrases): string =>
  (phrases[requirement.kind] as (value: EvolutionRequirement) => string)(requirement);

/**
 * ## Format Options
 * How {@link formatRequirements} words what it renders.
 */
export interface FormatOptions {
  /**
   * How to write out the resources the requirements name. Defaults to the API's
   * own name with the hyphens turned to spaces — `water stone`.
   *
   * This is the half of a translation that `phrases` cannot do: a display name
   * is `localize(item.names)`, which is a request, so it has to come from the
   * caller. Applied to the default table, and to nothing a `phrases` entry
   * overrides — that entry is handed the resource and names it however it likes.
   *
   * Hold the function rather than writing it inline: the table built around a
   * namer is kept and reused, and a new closure per call is a new table per call.
   */
  name?: ResourceNamer;
  /**
   * Wording for the kinds named, {@link REQUIREMENT_PHRASES} for the rest —
   * everything around it, including the `use-item` de-duplication, stays.
   */
  phrases?: Partial<RequirementPhrases>;
}

/**
 * Renders requirements as an English phrase.
 *
 * ```ts
 * formatRequirements(requirementsOf(detail)); // eevee → umbreon
 * // 'level up, with at least 160 happiness, during the night, in its eevee form'
 * ```
 *
 * The only English in the library, and a separate export for that reason: an
 * application rendering its own copy — in its own language, or as anything other
 * than a sentence — drops this and the phrase table with it. Use
 * {@link requirementsOf} for that, or `phrases` to keep the sentence and change
 * the words:
 *
 * ```ts
 * formatRequirements(requirements, { phrases: { trade: () => 'by trade' } });
 * ```
 *
 * Resources are named the way the API names them, not the way a game displays
 * them. `localize(item.names)` is the display name, it costs a request, and
 * `name` is where it goes:
 *
 * ```ts
 * const items = await api.resolveAll(links);
 * const display = new Map(items.map((item) => [item.name, localize(item.names)?.name]));
 *
 * formatRequirements(requirements, { name: (resource) => display.get(resource.name) ?? resource.name });
 * // 'use Water Stone'
 * ```
 *
 * The two options are the two halves of a translation and are independent:
 * `phrases` is the words the library supplies, `name` the words the API does.
 *
 * A `use-item` trigger and the item it uses are one phrase, since "use an item,
 * use water stone" says it twice. That holds under `phrases` too: the trigger is
 * dropped before anything is rendered, so an overridden `item` is still what says
 * the item is used.
 */
export const formatRequirements = (
  requirements: readonly EvolutionRequirement[],
  options?: FormatOptions,
): string => {
  const phrases = { ...tableFor(options?.name), ...options?.phrases };

  const usesItem =
    requirements.some((requirement) => requirement.kind === "item") &&
    requirements.some(
      (requirement) => requirement.kind === "trigger" && requirement.trigger.name === "use-item",
    );

  return requirements
    .filter((requirement) => !(usesItem && requirement.kind === "trigger"))
    .map((requirement) => phrase(requirement, phrases))
    .join(", ");
};
