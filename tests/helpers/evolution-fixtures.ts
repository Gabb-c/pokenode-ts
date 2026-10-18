import type { EvolutionDetail, NamedAPIResource } from "@models";

export const link = <T>(name: string): NamedAPIResource<T> => ({
  name,
  url: `https://pokeapi.co/api/v2/${name}`,
});

/** An `EvolutionDetail` with everything unset, so a case states only what it needs. */
export const detail = (partial: Partial<EvolutionDetail> = {}): EvolutionDetail => ({
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
  required_pokemon_form: null,
  evolved_pokemon_form: null,
  used_move: null,
  min_move_count: null,
  min_steps: null,
  min_damage_taken: null,
  allowed_natures: null,
  condition_expression: null,
  ...partial,
});

export const stone = (item: string, versionGroup: string): EvolutionDetail =>
  detail({ trigger: link("use-item"), item: link(item), version_group: link(versionGroup) });
