import { BASE_URL } from "@constants";

/**
 * ## Sprite Variant
 * The sprite sets the PokéAPI publishes for a Pokémon.
 */
export type SpriteVariant = "default" | "official-artwork" | "home" | "dream-world" | "showdown";

/**
 * ## Pokemon Sprite Options
 * Which sprite to build a URL for.
 *
 * The sets do not carry the same images, so the options are constrained per
 * variant: only `default` and `showdown` have back-facing sprites, and only
 * `official-artwork` has no gendered ones.
 */
export type PokemonSpriteOptions =
  | { variant?: "default"; shiny?: boolean; back?: boolean; female?: boolean }
  | { variant: "showdown"; shiny?: boolean; back?: boolean; female?: boolean }
  | { variant: "home"; shiny?: boolean; female?: boolean; back?: never }
  | { variant: "official-artwork"; shiny?: boolean; back?: never; female?: never }
  | { variant: "dream-world"; female?: boolean; shiny?: never; back?: never };

interface VariantSpec {
  /** Path under `sprites/pokemon`. Empty for the default set, which sits at the root. */
  directory: string;
  extension: string;
}

const VARIANTS: Record<SpriteVariant, VariantSpec> = {
  default: { directory: "", extension: "png" },
  "official-artwork": { directory: "other/official-artwork", extension: "png" },
  home: { directory: "other/home", extension: "png" },
  "dream-world": { directory: "other/dream-world", extension: "svg" },
  showdown: { directory: "other/showdown", extension: "gif" },
};

/**
 * Builds the URL of a Pokémon sprite, without a request.
 *
 * ```ts
 * getPokemonSpriteUrl(25); // front, default set
 * getPokemonSpriteUrl(25, { variant: "official-artwork" });
 * getPokemonSpriteUrl(25, { variant: "showdown", back: true, shiny: true });
 * ```
 *
 * The sprite repository does not hold every combination for every Pokémon — a
 * back-facing sprite of a recent generation, or a gendered form of a species with
 * one appearance, simply does not exist. This builds a well-formed URL; it does
 * not promise the file is there.
 *
 * @param id The Pokémon ID. Names are not addressable — the sprites are keyed by ID.
 * @param options Which sprite set and which facing to build for.
 * @returns The URL of the sprite.
 */
export const getPokemonSpriteUrl = (id: number, options: PokemonSpriteOptions = {}): string => {
  const { variant = "default", shiny = false, back = false, female = false } = options;
  const { directory, extension } = VARIANTS[variant];

  // The repository nests the modifiers in this order, so `back/shiny/female` is
  // the only path that resolves.
  const segments = [directory, back && "back", shiny && "shiny", female && "female"];

  return [BASE_URL.SPRITES, "pokemon", ...segments.filter(Boolean), `${id}.${extension}`].join("/");
};
