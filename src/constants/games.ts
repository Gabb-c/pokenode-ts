export const GENERATIONS = {
  GENERATION_I: 1,
  GENERATION_II: 2,
  GENERATION_III: 3,
  GENERATION_IV: 4,
  GENERATION_V: 5,
  GENERATION_VI: 6,
  GENERATION_VII: 7,
  GENERATION_VIII: 8,
  GENERATION_IX: 9,
} as const;

/**
 * ## Generation Name
 * A generation as the PokéAPI names it, which is what a
 * `NamedAPIResource<Generation>` carries and what the helpers that resolve a
 * resource's past state are given.
 *
 * Written out rather than derived from {@link GENERATIONS}: turning
 * `GENERATION_VIII` into `generation-viii` in the type system takes a recursive
 * template literal, and the set is closed and nine long.
 */
export type GenerationName =
  | "generation-i"
  | "generation-ii"
  | "generation-iii"
  | "generation-iv"
  | "generation-v"
  | "generation-vi"
  | "generation-vii"
  | "generation-viii"
  | "generation-ix";

export const POKEDEXES = {
  NATIONAL: 1,
  KANTO: 2,
  ORIGINAL_JOHTO: 3,
  HOENN: 4,
  ORIGINAL_SINNOH: 5,
  EXTENDED_SINNOH: 6,
  UPDATED_JOHTO: 7,
  ORIGINAL_UNOVA: 8,
  UPDATED_UNOVA: 9,
  CONQUEST_GALLERY: 11,
  KALOS_CENTRAL: 12,
  KALOS_COASTAL: 13,
  KALOS_MOUNTAIN: 14,
  UPDATED_HOENN: 15,
  ORIGINAL_ALOLA: 16,
  ORIGINAL_MELEMELE: 17,
  ORIGINAL_AKALA: 18,
  ORIGINAL_ULAULA: 19,
  ORIGINAL_PONI: 20,
  UPDATED_ALOLA: 21,
  UPDATED_MELEMELE: 22,
  UPDATED_AKALA: 23,
  UPDATED_ULAULA: 24,
  UPDATED_PONI: 25,
  LETSGO_KANTO: 26,
  GALAR: 27,
  ISLE_OF_ARMOR: 28,
  CROWN_TUNDRA: 29,
  HISUI: 30,
  PALDEA: 31,
  KITAKAMI: 32,
  BLUEBERRY: 33,
  LUMIOSE_CITY: 34,
  HYPERSPACE: 35,
  CHAMPIONS: 36,
  /**
   * @deprecated Misspelled: the endpoint names this `kalos-mountain`.
   *   Use {@link POKEDEXES.KALOS_MOUNTAIN}. Removed in 3.0.
   */
  KALOS_MONTAIN: 14,
  /**
   * @deprecated The endpoint names this `letsgo-kanto` now.
   *   Use {@link POKEDEXES.LETSGO_KANTO}. Removed in 3.0.
   */
  UPDATED_KANTO: 26,
} as const;

export const VERSIONS = {
  RED: 1,
  BLUE: 2,
  YELLOW: 3,
  GOLD: 4,
  SILVER: 5,
  CRYSTAL: 6,
  RUBY: 7,
  SAPPHIRE: 8,
  EMERALD: 9,
  FIRERED: 10,
  LEAFGREEN: 11,
  DIAMOND: 12,
  PEARL: 13,
  PLATINUM: 14,
  HEARTGOLD: 15,
  SOULSILVER: 16,
  BLACK: 17,
  WHITE: 18,
  COLOSSEUM: 19,
  XD: 20,
  BLACK_2: 21,
  WHITE_2: 22,
  X: 23,
  Y: 24,
  OMEGA_RUBY: 25,
  ALPHA_SAPPHIRE: 26,
  SUN: 27,
  MOON: 28,
  ULTRA_SUN: 29,
  ULTRA_MOON: 30,
  LETS_GO_PIKACHU: 31,
  LETS_GO_EEVEE: 32,
  SWORD: 33,
  SHIELD: 34,
  THE_ISLE_OF_ARMOR_SWORD: 35,
  THE_CROWN_TUNDRA_SWORD: 36,
  BRILLIANT_DIAMOND: 37,
  SHINING_PEARL: 38,
  LEGENDS_ARCEUS: 39,
  SCARLET: 40,
  VIOLET: 41,
  THE_TEAL_MASK_SCARLET: 42,
  THE_INDIGO_DISK_SCARLET: 43,
  RED_JAPAN: 44,
  GREEN_JAPAN: 45,
  BLUE_JAPAN: 46,
  LEGENDS_ZA: 47,
  MEGA_DIMENSION: 48,
  CHAMPIONS: 49,
  THE_ISLE_OF_ARMOR_SHIELD: 50,
  THE_CROWN_TUNDRA_SHIELD: 51,
  THE_TEAL_MASK_VIOLET: 52,
  THE_INDIGO_DISK_VIOLET: 53,
  /**
   * @deprecated The endpoint names this `the-crown-tundra-sword` now.
   *   Use {@link VERSIONS.THE_CROWN_TUNDRA_SWORD}. Removed in 3.0.
   */
  THE_CROWN_TUNDRA: 36,
  /**
   * @deprecated The endpoint names this `the-isle-of-armor-sword` now.
   *   Use {@link VERSIONS.THE_ISLE_OF_ARMOR_SWORD}. Removed in 3.0.
   */
  THE_ISLE_OF_ARMOR: 35,
} as const;

export const VERSION_GROUPS = {
  RED_BLUE: 1,
  YELLOW: 2,
  GOLD_SILVER: 3,
  CRYSTAL: 4,
  RUBY_SAPPHIRE: 5,
  EMERALD: 6,
  FIRERED_LEAFGREEN: 7,
  DIAMOND_PEARL: 8,
  PLATINUM: 9,
  HEARTGOLD_SOULSILVER: 10,
  BLACK_WHITE: 11,
  COLOSSEUM: 12,
  XD: 13,
  BLACK_2_WHITE_2: 14,
  X_Y: 15,
  OMEGA_RUBY_ALPHA_SAPPHIRE: 16,
  SUN_MOON: 17,
  ULTRA_SUN_ULTRA_MOON: 18,
  LETS_GO_PIKACHU_LETS_GO_EEVEE: 19,
  SWORD_SHIELD: 20,
  THE_ISLE_OF_ARMOR: 21,
  THE_CROWN_TUNDRA: 22,
  BRILLIANT_DIAMOND_SHINING_PEARL: 23,
  LEGENDS_ARCEUS: 24,
  SCARLET_VIOLET: 25,
  THE_TEAL_MASK: 26,
  THE_INDIGO_DISK: 27,
  RED_GREEN_JAPAN: 28,
  BLUE_JAPAN: 29,
  LEGENDS_ZA: 30,
  MEGA_DIMENSION: 31,
  CHAMPIONS: 32,
  /**
   * @deprecated The endpoint names this `brilliant-diamond-shining-pearl` now.
   *   Use {@link VERSION_GROUPS.BRILLIANT_DIAMOND_SHINING_PEARL}. Removed in 3.0.
   */
  BRILLIANT_DIAMOND_AND_SHINING_PEARL: 23,
  /**
   * @deprecated The endpoint names this `lets-go-pikachu-lets-go-eevee` now.
   *   Use {@link VERSION_GROUPS.LETS_GO_PIKACHU_LETS_GO_EEVEE}. Removed in 3.0.
   */
  LETS_GO: 19,
} as const;
