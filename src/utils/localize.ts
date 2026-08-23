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
 * ## Localize Options
 * Which language to pick, and which to settle for.
 */
export interface LocalizeOptions {
  /** The language wanted, by the name the PokéAPI gives it. Defaults to `en`. */
  language?: string;
  /**
   * The language to try when the first one is absent. Left out, nothing is tried
   * and the answer is `undefined` — a fallback is a decision about the product,
   * not a default.
   */
  fallback?: string;
}

const optionsOf = (
  language: string | LocalizeOptions | undefined,
): LocalizeOptions & { language: string } => {
  const options = typeof language === "string" ? { language } : (language ?? {});

  return { ...options, language: options.language ?? "en" };
};

/** Every entry written in one language, matched without regard to case. */
const inLanguage = <T extends Localized>(entries: readonly T[], language: string): T[] => {
  const wanted = language.toLowerCase();

  return entries.filter((entry) => entry.language.name.toLowerCase() === wanted);
};

/**
 * Picks the entry written in `language`, by the name the PokéAPI gives that
 * language: `en`, `ja`, `ja-hrkt`, `zh-hans`, `es-419`, and so on.
 *
 * ```ts
 * const species = await api.pokemon.getPokemonSpeciesByName('eevee');
 *
 * localize(species.names)?.name; // 'Eevee'
 * localize(species.names, 'ja')?.name; // 'イーブイ'
 * localize(species.names, { language: 'gd', fallback: 'en' })?.name; // 'Eevee'
 * ```
 *
 * Matched without regard to case: the PokéAPI writes these tags in lower case,
 * while BCP 47 capitalizes the script subtag — `ja-Hrkt` is the form anyone used
 * to language tags will reach for, and it should not silently match nothing.
 *
 * A section may list several entries for one language — flavor text, one per
 * version — and the first is the one returned. {@link localizeAll} is the way to
 * see the rest and pick by version.
 *
 * @returns The entry, the one in `fallback` when that language is absent, or
 *   `undefined` when neither is there.
 */
export const localize = <T extends Localized>(
  entries: readonly T[],
  language?: string | LocalizeOptions,
): T | undefined => localizeAll(entries, language)[0];

/**
 * Every entry written in `language`, in the order the API lists them.
 *
 * ```ts
 * const species = await api.pokemon.getPokemonSpeciesByName('eevee');
 *
 * const entries = localizeAll(species.flavor_text_entries, 'en');
 * entries.find((entry) => entry.version.name === 'sword')?.flavor_text;
 * ```
 *
 * Which is what a section publishing one entry per version needs: `localize`
 * answers with the first, and the first is an arbitrary game's Pokédex entry
 * rather than the one asked for. The version is on the entry — `version` on
 * flavor text, `version_group` on the sections that change per group — so the
 * filter belongs to the caller, who knows which of the two is there.
 *
 * @returns The entries, those in `fallback` when the language is absent, or `[]`
 *   when neither is there.
 */
export const localizeAll = <T extends Localized>(
  entries: readonly T[],
  language?: string | LocalizeOptions,
): T[] => {
  const options = optionsOf(language);
  const matched = inLanguage(entries, options.language);

  if (matched.length > 0 || options.fallback === undefined) {
    return matched;
  }

  return inLanguage(entries, options.fallback);
};
