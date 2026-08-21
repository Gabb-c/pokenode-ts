import type { Version } from "../game/version";
import type { Language } from "./language";
import type { NamedAPIResource } from "./resource";

/**
 * The localized flavor text for an API resource in a specific language.
 */
export interface FlavorText {
  /** The localized flavor text for an API resource in a specific language. */
  flavor_text: string;
  /** The language this name is in. */
  language: NamedAPIResource<Language>;
  /** The game version this flavor text appears in. */
  version: NamedAPIResource<Version>;
}
