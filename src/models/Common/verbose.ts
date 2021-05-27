import { NamedAPIResource } from './resource';

/**
 * The localized effect for an API resource
 */
export interface VerboseEffect {
  /** The localized effect text for an API resource in a specific language */
  effect: string;
  /** The localized effect text in brief */
  short_effect: string;
  /** The language this effect is in */
  language: NamedAPIResource;
}
