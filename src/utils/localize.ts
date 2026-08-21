import type { Language, NamedAPIResource } from "@models";

/**
 * ## Localized
 * An entry the PokéAPI publishes once per language — a `Name`, `FlavorText`,
 * `Description`, `Effect`, `VerboseEffect`, and everything shaped like them.
 */
export interface Localized {
  language: NamedAPIResource<Language>;
}

/**
 * Picks the entry written in `language`, by the name the PokéAPI gives that
 * language: `en`, `ja`, `ja-hrkt`, `zh-hans`, `es-419`, and so on.
 *
 * ```ts
 * const species = await api.pokemon.getPokemonSpeciesByName('eevee');
 *
 * localize(species.names)?.name; // 'Eevee'
 * localize(species.names, 'ja')?.name; // 'イーブイ'
 * ```
 *
 * Matched without regard to case: the PokéAPI writes these tags in lower case,
 * while BCP 47 capitalizes the script subtag — `ja-Hrkt` is the form anyone used
 * to language tags will reach for, and it should not silently match nothing.
 *
 * A section may list several entries for one language — flavor text, one per
 * version — and the first is the one returned. Filter first when you want a
 * particular version.
 *
 * @returns The entry, or `undefined` when that language is absent. Which
 *   language to try instead is the caller's decision, so nothing is guessed here.
 */
export const localize = <T extends Localized>(
  entries: readonly T[],
  language = "en",
): T | undefined => {
  const wanted = language.toLowerCase();

  return entries.find((entry) => entry.language.name.toLowerCase() === wanted);
};
