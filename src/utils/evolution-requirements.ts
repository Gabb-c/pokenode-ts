import type {
  EvolutionConditionExpression,
  EvolutionDetail,
  EvolutionTimeOfDay,
  EvolutionTrigger,
  Item,
  Location,
  Move,
  NamedAPIResource,
  Nature,
  PokemonForm,
  PokemonSpecies,
  Region,
  Type,
} from "@models";

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
  | { kind: "required-form"; form: NamedAPIResource<PokemonForm> }
  | { kind: "evolved-form"; form: NamedAPIResource<PokemonForm> }
  | { kind: "allowed-natures"; natures: NamedAPIResource<Nature>[] }
  | { kind: "condition"; condition: EvolutionConditionExpression }
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
  ({ required_pokemon_form: form }) => (form === null ? null : { kind: "required-form", form }),
  ({ evolved_pokemon_form: form }) => (form === null ? null : { kind: "evolved-form", form }),
  ({ allowed_natures: natures }) =>
    natures === null ? null : { kind: "allowed-natures", natures },
  ({ condition_expression: condition }) =>
    condition === null ? null : { kind: "condition", condition },
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
 * //   { kind: 'required-form', form: { name: 'eevee', … } },
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
