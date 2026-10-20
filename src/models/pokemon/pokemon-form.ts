import type { FlavorText, Name, NamedAPIResource } from "../common";
import type { VersionGroup } from "../game/version";
import type { Pokemon, PokemonType } from "./pokemon";
import type { OtherPokemonSprites, VersionSprites } from "./pokemon-sprites";

/**
 * ## Pokémon Form
 * Some Pokémon may appear in one of multiple, visually different forms.
 * These differences are purely cosmetic. For variations within a Pokémon species,
 * which do differ in more than just visuals, the 'Pokémon' entity is used to represent such a variety.
 */
export interface PokemonForm {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: string;
  /** The order in which forms should be sorted within all forms.
   * Multiple forms may have equal order, in which case they should fall back on sorting by name.
   */
  order: number;
  /** The order in which forms should be sorted within a species' forms. */
  form_order: number;
  /** True for exactly one form used as the default for each Pokémon. */
  is_default: boolean;
  /** Whether or not this form can only happen during battle. */
  is_battle_only: boolean;
  /** Whether or not this form requires mega evolution. */
  is_mega: boolean;
  /** The name of this form. */
  form_name: string;
  /** The Pokémon that can take on this form. */
  pokemon: NamedAPIResource<Pokemon>;
  /** A set of sprites used to depict this Pokémon form in the game. */
  sprites: PokemonFormSprites;
  /** The version group this Pokémon form was introduced in. */
  version_group: NamedAPIResource<VersionGroup>;
  /** The form specific full name of this Pokémon form, or empty if the form does not have a specific name. */
  names: Name[];
  /** The form specific form name of this Pokémon form, or empty if the form does not have a specific name. */
  form_names: Name[];
  /** A list of details showing types this Pokémon has. */
  types: PokemonType[];
  /**
   * The conditions that trigger this (usually battle-only) form, such as holding a Mega Stone or
   * having a specific ability. Empty for forms that are not triggered.
   */
  trigger_conditions: PokemonFormCondition[];
  /** The flavor text of this Pokémon form, in every language it is published in. */
  flavor_text_entries: FlavorText[];
}

/** A condition that causes a Pokémon to take on a particular form. */
export interface PokemonFormCondition {
  /** The name of the resource that triggers the form. */
  name: string;
  /** The URL of the resource that triggers the form. */
  url: string;
  /** What kind of resource triggers the form, e.g. `held-item` or `ability`. */
  trigger: string;
  /** The form the Pokémon changes from, when the condition switches between two forms. */
  base_form?: NamedAPIResource<PokemonForm>;
}

/**
 * Sprites used to depict this Pokémon form in the game.
 */
export interface PokemonFormSprites {
  /** The default depiction of this Pokémon form from the front in battle. */
  front_default: string | null;
  /** The female depiction of this Pokémon form from the front in battle. */
  front_female: string | null;
  /** The shiny depiction of this Pokémon form from the front in battle. */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon form from the front in battle. */
  front_shiny_female: string | null;
  /** The default depiction of this Pokémon form from the back in battle. */
  back_default: string | null;
  /** The female depiction of this Pokémon form from the back in battle. */
  back_female: string | null;
  /** The shiny depiction of this Pokémon form from the back in battle. */
  back_shiny: string | null;
  /** The shiny female depiction of this Pokémon form from the back in battle. */
  back_shiny_female: string | null;
  /** Dream World, Official Artwork, Home and Showdown sprites of this Pokémon form. */
  other: OtherPokemonSprites;
  /** Version Sprites of this Pokémon form. */
  versions: VersionSprites;
}
