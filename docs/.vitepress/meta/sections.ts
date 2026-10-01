import { ENDPOINTS } from "../../../src/constants/endpoints";

interface Section {
  name: string;
  /** Anchor on https://pokeapi.co/docs/v2 */
  anchor: string;
  endpoints: readonly (keyof typeof ENDPOINTS)[];
}

/** The PokéAPI section each client page covers, named by the page's `section` frontmatter. */
export const SECTIONS = {
  berries: {
    name: "Berries",
    anchor: "berries-section",
    endpoints: ["BERRY", "BERRY_FIRMNESS", "BERRY_FLAVOR"],
  },
  contests: {
    name: "Contests",
    anchor: "contests-section",
    endpoints: ["CONTEST_TYPE", "CONTEST_EFFECT", "SUPER_CONTEST_EFFECT"],
  },
  currencies: {
    name: "Currencies",
    anchor: "currencies-section",
    endpoints: ["CURRENCY"],
  },
  encounters: {
    name: "Encounters",
    anchor: "encounters-section",
    endpoints: ["ENCOUNTER_METHOD", "ENCOUNTER_CONDITION", "ENCOUNTER_CONDITION_VALUE"],
  },
  evolution: {
    name: "Evolution",
    anchor: "evolution-section",
    endpoints: ["EVOLUTION_CHAIN", "EVOLUTION_TRIGGER", "EVOLUTION_VARIABLE"],
  },
  games: {
    name: "Games",
    anchor: "games-section",
    endpoints: ["GENERATION", "POKEDEX", "VERSION", "VERSION_GROUP"],
  },
  items: {
    name: "Items",
    anchor: "items-section",
    endpoints: ["ITEM", "ITEM_ATTRIBUTE", "ITEM_CATEGORY", "ITEM_FLING_EFFECT", "ITEM_POCKET"],
  },
  locations: {
    name: "Locations",
    anchor: "locations-section",
    endpoints: ["LOCATION", "LOCATION_AREA", "PALPARK_AREA", "REGION"],
  },
  machines: {
    name: "Machines",
    anchor: "machines-section",
    endpoints: ["MACHINE"],
  },
  moves: {
    name: "Moves",
    anchor: "moves-section",
    endpoints: [
      "MOVE",
      "MOVE_AILMENT",
      "MOVE_BATTLE_STYLE",
      "MOVE_CATEGORY",
      "MOVE_DAMAGE_CLASS",
      "MOVE_LEARN_METHOD",
      "MOVE_TARGET",
    ],
  },
  pokemon: {
    name: "Pokémon",
    anchor: "pokemon-section",
    endpoints: [
      "ABILITY",
      "CHARACTERISTIC",
      "EGG_GROUP",
      "GENDER",
      "GROWTH_RATE",
      "NATURE",
      "POKEATHLON_STAT",
      "POKEMON",
      "POKEMON_COLOR",
      "POKEMON_FORM",
      "POKEMON_HABITAT",
      "POKEMON_SHAPE",
      "POKEMON_SPECIES",
      "STAT",
      "TYPE",
    ],
  },
  utility: {
    name: "Utility",
    anchor: "utility-section",
    endpoints: ["LANGUAGE"],
  },
} as const satisfies Record<string, Section>;

export type SectionKey = keyof typeof SECTIONS;

export const isSectionKey = (value: unknown): value is SectionKey =>
  typeof value === "string" && Object.hasOwn(SECTIONS, value);

export const sectionPaths = (key: SectionKey): string[] =>
  SECTIONS[key].endpoints.map((endpoint) => ENDPOINTS[endpoint]);

export const sectionDocsUrl = (key: SectionKey): string =>
  `https://pokeapi.co/docs/v2#${SECTIONS[key].anchor}`;
