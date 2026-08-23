import { GENERATIONS, type GenerationName, TYPES, type TypeName } from "@constants";
import type { NamedAPIResource, Type, TypeRelations } from "@models";

/**
 * The names {@link TypeName} declares, at runtime. Read off {@link TYPES} by id
 * rather than written out a second time: `unknown` and `shadow` are the ids above
 * 10000, the way every other section marks what is not part of the main games.
 *
 * `constants.live.spec.ts` is what holds the two to the same set — the ids are
 * upstream's, and a type arriving above 10000 that does belong in a matchup would
 * pass here unnoticed.
 */
const TYPE_NAMES: ReadonlySet<string> = new Set(
  Object.entries(TYPES)
    .filter(([, id]) => id < 10_000)
    .map(([key]) => key.toLowerCase()),
);

const isTypeName = (name: string): name is TypeName => TYPE_NAMES.has(name);

/**
 * The id {@link GENERATIONS} gives a generation, or `-1` for a name that is not
 * one. Generations are compared by this rather than by name, which does not sort.
 */
const rank = (name: string): number => {
  const key = name.toUpperCase().replace(/-/g, "_") as keyof typeof GENERATIONS;

  return GENERATIONS[key] ?? -1;
};

/** The offensive arrays of a {@link TypeRelations}, and what each one means. */
const MULTIPLIERS: readonly (readonly [keyof TypeRelations, number])[] = [
  ["no_damage_to", 0],
  ["half_damage_to", 0.5],
  ["double_damage_to", 2],
];

/** The defensive arrays, which say the same thing from the other side. */
const INCOMING: readonly (readonly [keyof TypeRelations, number])[] = [
  ["no_damage_from", 0],
  ["half_damage_from", 0.5],
  ["double_damage_from", 2],
];

/** Looks one type up in a set of arrays. Unlisted is neutral. */
const lookup = (
  relations: TypeRelations,
  arrays: readonly (readonly [keyof TypeRelations, number])[],
  name: string,
): number => {
  for (const [key, multiplier] of arrays) {
    if (relations[key].some((type) => type.name === name)) {
      return multiplier;
    }
  }

  return 1;
};

/** What one attacking type does to one defending type. */
const against = (relations: TypeRelations, defending: string): number =>
  lookup(relations, MULTIPLIERS, defending);

/** The multiplier a set of relations produces against every defending type. */
const multiply = (relations: TypeRelations, defending: readonly NamedAPIResource<Type>[]): number =>
  defending.reduce((total, type) => total * against(relations, type.name), 1);

/**
 * ## Generation Scope
 * Which generation's type chart to read. Leave it out for the current one.
 */
export interface GenerationScope {
  generation?: GenerationName;
}

/**
 * The damage relations `type` had in `generation`, or the current ones when no
 * generation is named.
 *
 * ```ts
 * const ghost = await api.pokemon.getTypeByName('ghost');
 *
 * relationsFor(ghost).half_damage_to; // [dark]
 * relationsFor(ghost, 'generation-iii')?.half_damage_to; // [dark, steel]
 * ```
 *
 * Each entry in `past_damage_relations` records the *last* generation it applied
 * to, so the chart in force is the first entry still at or after the generation
 * asked for — Ghost's `generation-v` entry is what Ghost looked like from II
 * through V, and the current relations take over at VI.
 *
 * @returns The relations, or `undefined` when `type` did not exist yet in
 *   `generation`. Nothing is guessed: Steel in generation I has no chart, and a
 *   neutral one would be a confidently wrong answer rather than a missing one.
 */
export const relationsFor = (
  type: Type,
  generation?: GenerationName,
): TypeRelations | undefined => {
  if (generation === undefined) {
    return type.damage_relations;
  }

  const wanted = rank(generation);

  // Checked before the entries are: Steel's only past entry is `generation-v`,
  // which would otherwise answer for generation I, where Steel did not exist.
  if (wanted < rank(type.generation.name)) {
    return undefined;
  }

  // Sorted rather than trusted: the rule below is "the first entry still at or
  // after", and first means nothing in an order upstream never promised.
  const past = [...type.past_damage_relations]
    .sort((left, right) => rank(left.generation.name) - rank(right.generation.name))
    .find((entry) => rank(entry.generation.name) >= wanted);

  return past?.damage_relations ?? type.damage_relations;
};

/**
 * The damage multiplier `attacking` deals to a defender that has `defending`
 * types — `0`, `0.25`, `0.5`, `1`, `2` or `4`.
 *
 * ```ts
 * const fire = await api.pokemon.getTypeByName('fire');
 * const ferrothorn = await api.pokemon.getPokemonByName('ferrothorn');
 *
 * effectiveness(fire, ferrothorn.types.map((slot) => slot.type)); // 4
 * ```
 *
 * Read from the attacking type's own offensive relations, so this needs the one
 * type fetched rather than one per defending type.
 *
 * With a `generation`, the chart of that generation is used and the result is
 * `undefined` when `attacking` postdates it. Only the attacker is checked that
 * way: the defenders arrive as links, which carry no generation to check
 * against. `Pokemon.past_types` is where a historically correct defender comes
 * from.
 */
export function effectiveness(
  attacking: Type,
  defending: readonly NamedAPIResource<Type>[],
): number;
export function effectiveness(
  attacking: Type,
  defending: readonly NamedAPIResource<Type>[],
  options: { generation: GenerationName },
): number | undefined;
export function effectiveness(
  attacking: Type,
  defending: readonly NamedAPIResource<Type>[],
  options?: GenerationScope,
): number | undefined {
  const relations = relationsFor(attacking, options?.generation);

  return relations === undefined ? undefined : multiply(relations, defending);
}

/**
 * What every one of `types` does to a defender that has `defending` types, keyed
 * by attacking type name — the "what is this Pokémon weak to" table.
 *
 * ```ts
 * const types: Type[] = [];
 * for await (const type of api.pokemon.paginate('listTypes', { resolve: true })) {
 *   types.push(type);
 * }
 *
 * const profile = defensiveProfile(types, gengar.types.map((slot) => slot.type));
 * profile.psychic; // 2
 * profile.normal; // 0
 * ```
 *
 * The whole `type` section is one cached walk, and every lookup after that is
 * local. A type that did not exist in the generation asked for is left out of the
 * table rather than reported as neutral.
 *
 * `Partial` because of that, and because `types` is whatever the caller resolved:
 * an entry is there when the attacking type is, so every lookup is `number |
 * undefined`. `unknown` and `shadow` are not {@link TypeName}s and are skipped —
 * they hold no damage relations, so they have no place in a matchup table.
 *
 * Reach for {@link defensiveProfileFrom} unless you are asking about a past
 * generation: it answers the same question from the defender's own types, which
 * is one or two resources rather than the whole section. This is the form that
 * takes a `generation`, because only the attacking type carries the history.
 */
export const defensiveProfile = (
  types: readonly Type[],
  defending: readonly NamedAPIResource<Type>[],
  options?: GenerationScope,
): Partial<Record<TypeName, number>> => {
  const profile: Partial<Record<TypeName, number>> = {};

  for (const attacking of types) {
    if (!isTypeName(attacking.name)) {
      continue;
    }

    const relations = relationsFor(attacking, options?.generation);

    if (relations !== undefined) {
      profile[attacking.name] = multiply(relations, defending);
    }
  }

  return profile;
};

/**
 * The same table, read off the defending types themselves — what every type does
 * to a Pokémon that has `defending` types.
 *
 * ```ts
 * const gengar = await api.pokemon.getPokemonByName('gengar');
 * const types = await api.resolveAll(gengar.types.map((slot) => slot.type));
 *
 * const profile = defensiveProfileFrom(types);
 * profile.psychic; // 2
 * profile.normal; // 0
 * ```
 *
 * Two requests for a dual-typed Pokémon, against the whole `type` section that
 * {@link defensiveProfile} needs — the answer is the same because the chart is
 * symmetric, which `tests/live/relations.live.spec.ts` is what keeps honest.
 *
 * Every {@link TypeName} is present: the defending types name every attacker
 * they interact with, and the rest are neutral rather than unknown. There is no
 * `generation` option for exactly the reason the entries are total — a defending
 * type's arrays are the current chart, and they have no way to say that an
 * attacking type did not exist yet. That question needs {@link defensiveProfile}.
 */
export const defensiveProfileFrom = (
  defending: readonly Type[],
): Partial<Record<TypeName, number>> => {
  const profile: Partial<Record<TypeName, number>> = {};

  for (const name of TYPE_NAMES) {
    profile[name as TypeName] = defending.reduce(
      (total, type) => total * lookup(type.damage_relations, INCOMING, name),
      1,
    );
  }

  return profile;
};
