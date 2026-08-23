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
   * Keep only the details tagged with this version group, by name, and drop the
   * steps left with none. The tag is the game that introduced the method, not
   * every game it applies in — see {@link flattenChain}.
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
export const requirementsOf = (detail: EvolutionDetail): EvolutionRequirement[] => {
  const requirements: EvolutionRequirement[] = [{ kind: "trigger", trigger: detail.trigger }];

  if (detail.item !== null) {
    requirements.push({ kind: "item", item: detail.item });
  }
  if (detail.held_item !== null) {
    requirements.push({ kind: "held-item", item: detail.held_item });
  }
  if (detail.min_level !== null) {
    requirements.push({ kind: "min-level", level: detail.min_level });
  }
  if (detail.min_happiness !== null) {
    requirements.push({ kind: "min-happiness", happiness: detail.min_happiness });
  }
  if (detail.min_beauty !== null) {
    requirements.push({ kind: "min-beauty", beauty: detail.min_beauty });
  }
  if (detail.min_affection !== null) {
    requirements.push({ kind: "min-affection", affection: detail.min_affection });
  }
  if (detail.known_move !== null) {
    requirements.push({ kind: "known-move", move: detail.known_move });
  }
  if (detail.known_move_type !== null) {
    requirements.push({ kind: "known-move-type", type: detail.known_move_type });
  }
  if (detail.used_move !== null) {
    requirements.push({ kind: "used-move", move: detail.used_move });
  }
  if (detail.min_move_count !== null) {
    requirements.push({ kind: "min-move-count", count: detail.min_move_count });
  }
  if (detail.min_steps !== null) {
    requirements.push({ kind: "min-steps", steps: detail.min_steps });
  }
  if (detail.min_damage_taken !== null) {
    requirements.push({ kind: "min-damage-taken", damage: detail.min_damage_taken });
  }
  if (detail.location !== null) {
    requirements.push({ kind: "location", location: detail.location });
  }
  if (detail.region !== null) {
    requirements.push({ kind: "region", region: detail.region });
  }
  if (detail.time_of_day !== "") {
    requirements.push({ kind: "time-of-day", time: detail.time_of_day });
  }
  if (detail.gender !== null) {
    requirements.push({ kind: "gender", gender: detail.gender });
  }
  if (detail.relative_physical_stats !== null) {
    requirements.push({
      kind: "relative-physical-stats",
      comparison: detail.relative_physical_stats,
    });
  }
  if (detail.party_species !== null) {
    requirements.push({ kind: "party-species", species: detail.party_species });
  }
  if (detail.party_type !== null) {
    requirements.push({ kind: "party-type", type: detail.party_type });
  }
  if (detail.trade_species !== null) {
    requirements.push({ kind: "trade-species", species: detail.trade_species });
  }
  if (detail.base_form !== null) {
    requirements.push({ kind: "base-form", form: detail.base_form });
  }
  if (detail.evolved_form !== null) {
    requirements.push({ kind: "evolved-form", form: detail.evolved_form });
  }
  if (detail.needs_overworld_rain) {
    requirements.push({ kind: "needs-overworld-rain" });
  }
  if (detail.turn_upside_down) {
    requirements.push({ kind: "turn-upside-down" });
  }
  if (detail.near_special_rock) {
    requirements.push({ kind: "near-special-rock" });
  }
  if (detail.needs_multiplayer) {
    requirements.push({ kind: "needs-multiplayer" });
  }

  return requirements;
};

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
 * ## Requirement Phrases
 * The English {@link formatRequirements} renders with. Exported so a caller can
 * replace the wording of one kind — or all of them, in another language — without
 * rebuilding the rest of the renderer around it.
 *
 * ```ts
 * formatRequirements(requirements, {
 *   phrases: { 'min-happiness': ({ happiness }) => `com ${happiness} de felicidade` },
 * });
 * ```
 */
export const REQUIREMENT_PHRASES: RequirementPhrases = {
  trigger: ({ trigger }) => TRIGGERS[trigger.name as EvolutionTriggerName] ?? spaced(trigger),
  item: ({ item }) => `use ${spaced(item)}`,
  "held-item": ({ item }) => `holding ${spaced(item)}`,
  "min-level": ({ level }) => `at level ${level}`,
  "min-happiness": ({ happiness }) => `with at least ${happiness} happiness`,
  "min-beauty": ({ beauty }) => `with at least ${beauty} beauty`,
  "min-affection": ({ affection }) => `with at least ${affection} affection`,
  "known-move": ({ move }) => `knowing ${spaced(move)}`,
  "known-move-type": ({ type }) => `knowing a ${type.name}-type move`,
  "used-move": ({ move }) => `after using ${spaced(move)}`,
  "min-move-count": ({ count }) => `${count} times`,
  "min-steps": ({ steps }) => `after ${steps} steps`,
  "min-damage-taken": ({ damage }) => `after taking ${damage} damage`,
  location: ({ location }) => `at ${spaced(location)}`,
  region: ({ region }) => `in ${spaced(region)}`,
  "time-of-day": ({ time }) => TIMES[time],
  gender: ({ gender }) => `as a ${GENDERS[gender] ?? `gender ${gender}`}`,
  "relative-physical-stats": ({ comparison }) =>
    `with Attack ${COMPARISONS[String(comparison)]} Defense`,
  "party-species": ({ species }) => `with ${spaced(species)} in the party`,
  "party-type": ({ type }) => `with a ${type.name}-type in the party`,
  "trade-species": ({ species }) => `traded for ${spaced(species)}`,
  "base-form": ({ form }) => `in its ${spaced(form)} form`,
  "evolved-form": ({ form }) => `into its ${spaced(form)} form`,
  "needs-overworld-rain": () => "while it is raining",
  "turn-upside-down": () => "with the console upside down",
  "near-special-rock": () => "near a special rock",
  "needs-multiplayer": () => "in multiplayer",
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
 * them. `localize(item.names)` is the display name, and it costs a request.
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
  const phrases = { ...REQUIREMENT_PHRASES, ...options?.phrases };

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
