import type {
  APIResource,
  Description,
  FlavorText,
  Language,
  Name,
  NamedAPIResource,
} from "../common";
import type { EvolutionChain } from "../evolution/evolution";
import type { Generation } from "../game/generation";
import type { Pokedex } from "../game/pokedex";
import type { PalParkArea } from "../location/palpark";
import type { EggGroup } from "./egg-group";
import type { GrowthRate } from "./growth-rate";
import type { Pokemon } from "./pokemon";
import type { PokemonColor } from "./pokemon-color";
import type { PokemonHabitat } from "./pokemon-habitat";
import type { PokemonShape } from "./pokemon-shape";

/**
 * ## Pokémon Species
 * A Pokémon Species forms the basis for at least one Pokémon.
 * Attributes of a Pokémon species are shared across all varieties of Pokémon within the species.
 * A good example is Wormadam; Wormadam is the species which can be found in three different varieties,
 * Wormadam-Trash, Wormadam-Sandy and Wormadam-Plant */
export interface PokemonSpecies {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: string;
  /** The order in which species should be sorted. Based on National Dex order, except families are grouped together and sorted by stage. */
  order: number;
  /** The chance of this Pokémon being female, in eighths; or -1 for genderless. */
  gender_rate: number;
  /** The base capture rate; up to 255. The higher the number, the easier the catch. */
  capture_rate: number;
  /** The happiness when caught by a normal Pokéball; up to 255. The higher the number, the happier the Pokémon. */
  base_happiness: number;
  /** Whether or not this is a baby Pokémon. */
  is_baby: boolean;
  /** Whether or not this is a legendary Pokémon. */
  is_legendary: boolean;
  /** Whether or not this is a mythical Pokémon. */
  is_mythical: boolean;
  /** Initial hatch counter: one must walk 255 × (hatch_counter + 1) steps before this Pokémon's egg hatches, unless utilizing bonuses like Flame Body's. */
  hatch_counter: number;
  /** Whether or not this Pokémon has visual gender differences. */
  has_gender_differences: boolean;
  /** Whether or not this Pokémon has multiple forms and can switch between them. */
  forms_switchable: boolean;
  /** The rate at which this Pokémon species gains levels. */
  growth_rate: NamedAPIResource<GrowthRate>;
  /** A list of Pokédexes and the indexes reserved within them for this Pokémon species. */
  pokedex_numbers: PokemonSpeciesDexEntry[];
  /** A list of egg groups this Pokémon species is a member of. */
  egg_groups: NamedAPIResource<EggGroup>[];
  /** The color of this Pokémon for Pokédex search. */
  color: NamedAPIResource<PokemonColor>;
  /** The shape of this Pokémon for Pokédex search. */
  shape: NamedAPIResource<PokemonShape>;
  /** The Pokémon species that evolves into this Pokémon species, if any. */
  evolves_from_species: NamedAPIResource<PokemonSpecies> | null;
  /** The evolution chain this Pokémon species is a member of. */
  evolution_chain: APIResource<EvolutionChain>;
  /** The habitat this Pokémon species can be encountered in. */
  habitat: NamedAPIResource<PokemonHabitat>;
  /** The generation this Pokémon species was introduced in. */
  generation: NamedAPIResource<Generation>;
  /** The name of this resource listed in different languages. */
  names: Name[];
  /** A list of encounters that can be had with this Pokémon species in pal park. */
  pal_park_encounters: PalParkEncounterArea[];
  /** A list of flavor text entries for this Pokémon species. */
  flavor_text_entries: FlavorText[];
  /** Descriptions of different forms Pokémon take on within the Pokémon species. */
  form_descriptions: Description[];
  /** The genus of this Pokémon species listed in multiple languages. */
  genera: Genus[];
  /** A list of the Pokémon that exist within this Pokémon species. */
  varieties: PokemonSpeciesVariety[];
}

/**
 * The genus of the given Pokémon species listed in multiple languages.
 */
export interface Genus {
  /** The localized genus for the referenced Pokémon species. */
  genus: string;
  /** The language this genus is in. */
  language: NamedAPIResource<Language>;
}

/** Pokédexes and the indexes reserved within them for the given Pokémon species. */
export interface PokemonSpeciesDexEntry {
  /** The index number within the Pokédex. */
  entry_number: number;
  /** The Pokédex the referenced Pokémon species can be found in. */
  pokedex: NamedAPIResource<Pokedex>;
}

/**
 * Encounter that can be had with the given Pokémon species in pal park.
 */
export interface PalParkEncounterArea {
  /** The base score given to the player when the referenced Pokémon is caught during a pal park run. */
  base_score: number;
  /** The base rate for encountering the referenced Pokémon in this pal park area. */
  rate: number;
  /** The pal park area where this encounter happens. */
  area: NamedAPIResource<PalParkArea>;
}

/**
 * Pokémon that exist within this Pokémon species.
 */
export interface PokemonSpeciesVariety {
  /** Whether this variety is the default variety. */
  is_default: boolean;
  /** The Pokémon variety. */
  pokemon: NamedAPIResource<Pokemon>;
}
