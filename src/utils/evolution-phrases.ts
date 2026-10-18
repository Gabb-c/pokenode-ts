import type { EvolutionTimeOfDay, EvolutionTriggerName, NamedAPIResource } from "@models";
import type { EvolutionRequirement } from "./evolution-requirements";

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
  "in-battle-level-up": "level up during a battle",
  "agile-style-move": "use agile style moves",
  "strong-style-move": "use strong style moves",
  "recoil-damage": "take recoil damage",
  "use-move": "use a move",
  "three-defeated-bisharp": "defeat three pack-leading Bisharp",
  "gimmighoul-coins": "collect Gimmighoul Coins",
  "meltan-candies": "feed Meltan Candies in Pokémon GO",
  unclassified: "an unclassified method",
};

/** A resource name as prose: the API writes them kebab-cased and lower case. */
const spaced = (resource: NamedAPIResource<unknown>): string => resource.name.replaceAll("-", " ");

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
 * @param resource The item, move, species, location, region, form, nature or type the
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
  "required-form": ({ form }) => `in its ${namer(form)} form`,
  "evolved-form": ({ form }) => `into its ${namer(form)} form`,
  "allowed-natures": ({ natures }) =>
    `with a ${natures.map((nature) => namer(nature)).join(" or ")} nature`,
  condition: ({ condition }) =>
    condition.percentage_chance === null ? "" : `with a ${condition.percentage_chance}% chance`,
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
 * twenty-nine closures per row. Weak, so a namer closed over a component's
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
 *
 * A phrase that renders as `""` is left out of the sentence. The default table
 * does this for a `condition` with no `percentage_chance` — Milcery's spin, which
 * the trigger already names — and an override can do it to hide any kind.
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
    .filter((text) => text !== "")
    .join(", ");
};
