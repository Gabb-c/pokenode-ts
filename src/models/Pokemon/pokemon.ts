import {
  APIResource,
  Description,
  FlavorText,
  Name,
  NamedAPIResource,
  VersionEncounterDetail,
  VersionGameIndex,
} from '../Common';

/**
 * ## Pokemon
 * Pokémon are the creatures that inhabit the world of the Pokémon games.
 * They can be caught using Pokéballs and trained by battling with other Pokémon.
 * Each Pokémon belongs to a specific species but may take on a variant
 * which makes it differ from other Pokémon of the same species, such as base stats, available abilities and typings.
 * - See [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_(species)) for greater detail.
 */
export interface Pokemon {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** The base experience gained for defeating this Pokémon */
  base_experience: number;
  /** The height of this Pokémon in decimetres */
  height: number;
  /** Set for exactly one Pokémon used as the default for each species */
  is_default: boolean;
  /** Order for sorting. Almost national order, except families are grouped together */
  order: number;
  /** The weight of this Pokémon in hectograms */
  weight: number;
  /** A list of abilities this Pokémon could potentially have */
  abilities: PokemonAbility[];
  /** A list of forms this Pokémon can take on */
  forms: NamedAPIResource[];
  /** A list of game indices relevent to Pokémon item by generation */
  game_indices: VersionGameIndex[];
  /** A list of items this Pokémon may be holding when encountered */
  held_items: PokemonHeldItem[];
  /** A link to a list of location areas, as well as encounter details pertaining to specific versions */
  location_area_encounters: string;
  /** A list of moves along with learn methods and level details pertaining to specific version groups */
  moves: PokemonMove[];
  /** A set of sprites used to depict this Pokémon in the game.
   * A visual representation of the various sprites can be found at [PokeAPI/sprites](https://github.com/PokeAPI/sprites#sprites)
   */
  sprites: PokemonSprites;
  /** The species this Pokémon belongs to */
  species: NamedAPIResource;
  /** A list of base stat values for this Pokémon */
  stats: PokemonStat[];
  /** A list of details showing types this Pokémon has */
  types: PokemonType[];
  /** Data describing a Pokemon's types in a previous generation. */
  past_types: PokemonPastType[];
}

/**
 * Abilities the given pokémon could potentially have
 */
export interface PokemonAbility {
  /** Whether or not this is a hidden ability */
  is_hidden: boolean;
  /** The slot this ability occupies in this Pokémon species */
  slot: number;
  /** The ability the Pokémon may have */
  ability: NamedAPIResource;
}

/**
 * Details showing types the given Pokémon has
 */
export interface PokemonType {
  /** The order the Pokémon's types are listed in */
  slot: number;
  /** The type the referenced Pokémon has */
  type: NamedAPIResource;
}

/**
 * Data describing a Pokemon's types in a previous generation.
 */
export interface PokemonPastType {
  /** The generation of this Pokémon Type. */
  generation: NamedAPIResource;
  /** Types this of this Pokémon in a previos generation. */
  types: PokemonType[];
}

/**
 * Items the given Pokémon may be holding when encountered
 */
export interface PokemonHeldItem {
  /** The item the referenced Pokémon holds */
  item: NamedAPIResource;
  /** The details of the different versions in which the item is held */
  version_details: PokemonHeldItemVersion[];
}

/**
 * The details of the different versions in which the item is held
 */
export interface PokemonHeldItemVersion {
  /** The version in which the item is held */
  version: NamedAPIResource;
  /** How often the item is held */
  rarity: number;
}

/**
 * A Move along with learn methods and level details pertaining to specific version groups
 */
export interface PokemonMove {
  /** The move the Pokémon can learn */
  move: NamedAPIResource;
  /** The details of the version in which the Pokémon can learn the move */
  version_group_details: PokemonMoveVersion[];
}

/**
 * The details of the version in which the Pokémon can learn the move
 */
export interface PokemonMoveVersion {
  /** The method by which the move is learned */
  move_learn_method: NamedAPIResource;
  /** The version group in which the move is learned */
  version_group: NamedAPIResource;
  /** The minimum level to learn the move */
  level_learned_at: number;
}

/**
 * Base stat values for the given Pokémon
 */
export interface PokemonStat {
  /** The stat the Pokémon has */
  stat: NamedAPIResource;
  /** The effort points (EV) the Pokémon has in the stat */
  effort: 0 | 1 | 2 | 3;
  /** The base value of the stat */
  base_stat: number;
}

/** Version Sprites */
export interface VersionSprites {
  /** Generation-I Sprites of this Pokémon */
  'generation-i': GenerationISprites;
  /** Generation-II Sprites of this Pokémon */
  'generation-ii': GenerationIISprites;
  /** Generation-III Sprites of this Pokémon */
  'generation-iii': GenerationIIISprites;
  /** Generation-IV Sprites of this Pokémon */
  'generation-iv': GenerationIVSprites;
  /** Generation-V Sprites of this Pokémon */
  'generation-v': GenerationVSprites;
  /** Generation-VI Sprites of this Pokémon */
  'generation-vi': GenerationVISprites;
  /** Generation-VII Sprites of this Pokémon */
  'generation-vii': GenerationVIISprites;
  /** Generation-VIII Sprites of this Pokémon */
  'generation-viii': GenerationVIIISprites;
}

/**
 * A set of sprites used to depict this Pokémon in the game.
 * A visual representation of the various sprites can be found at [PokeAPI/sprites](https://github.com/PokeAPI/sprites#sprites)
 */
export interface PokemonSprites {
  /** The default depiction of this Pokémon from the front in battle */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle */
  front_shiny: string | null;
  /** The female depiction of this Pokémon from the front in battle */
  front_female: string | null;
  /** The shiny female depiction of this Pokémon from the front in battle */
  front_shiny_female: string | null;
  /** The default depiction of this Pokémon from the back in battle */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle */
  back_shiny: string | null;
  /** The female depiction of this Pokémon from the back in battle */
  back_female: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle */
  back_shiny_female: string | null;
  /** Dream World, Official Artwork and Home sprites */
  other: OtherPokemonSprites;
  /** Version Sprites of this Pokémon */
  versions: VersionSprites;
}

/** Other Pokemon Sprites (Dream World and Official Artwork sprites) */
export interface OtherPokemonSprites {
  /** Dream World Sprites of this Pokémon */
  dream_world: DreamWorld;
  /** Official Artwork Sprites of this Pokémon */
  'official-artwork': OfficialArtwork;
  /** Home Artwork Sprites of this Pokémon */
  home: Home;
}

/** Dream World sprites */
export interface DreamWorld {
  /** The default depiction of this Pokémon from the front in battle */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle */
  front_female: string | null;
}

/** Official Artwork sprites */
interface OfficialArtwork {
  /** The default depiction of this Pokémon from the front in battle */
  front_default: string | null;
}

/** Home sprites */
export interface Home {
  /** The default depiction of this Pokémon from the front in battle */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle */
  front_female: string | null;
  /** The shiny depiction of this Pokémon from the front in battle */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle */
  front_shiny_female: string | null;
}

/** Generation-I Srites */
export interface GenerationISprites {
  /** Red-blue sprites of this Pokémon */
  'red-blue': RedBlue;
  /** Yellow sprites of this Pokémon  */
  yellow: Yellow;
}

/** Red/Blue Sprites */
export interface RedBlue {
  /** The default depiction of this Pokémon from the back in battle */
  back_default: string | null;
  /** The gray depiction of this Pokémon from the back in battle */
  back_gray: string | null;
  /** The transparent depiction of this Pokémon from the back in battle */
  back_transparent: string | null;
  /** The default depiction of this Pokémon from the front in battle */
  front_default: string | null;
  /** The gray depiction of this Pokémon from the front in battle */
  front_gray: string | null;
  /** The transparent depiction of this Pokémon from the front in battle */
  front_transparent: string | null;
}

/** Yellow sprites */
export interface Yellow {
  /** The default depiction of this Pokémon from the back in battle */
  back_default: string | null;
  /** The gray depiction of this Pokémon from the back in battle */
  back_gray: string | null;
  /** The transparent depiction of this Pokémon from the back in battle */
  back_transparent: string | null;
  /** The default depiction of this Pokémon from the front in battle */
  front_default: string | null;
  /** The gray depiction of this Pokémon from the front in battle */
  front_gray: string | null;
  /** The transparent depiction of this Pokémon from the front in battle */
  front_transparent: string | null;
}

/** Generation-II Sprites */
export interface GenerationIISprites {
  /** Crystal sprites of this Pokémon */
  crystal: Crystal;
  /** Gold sprites of this Pokémon */
  gold: Gold;
  /** Silver sprites of this Pokémon */
  silver: Silver;
}

/** Crystal sprites */
export interface Crystal {
  /** The default depiction of this Pokémon from the back in battle */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle */
  back_shiny: string | null;
  /** The back shiny transparent depiction of this Pokémon from the back in battle */
  back_shiny_transparent: string | null;
  /** The transparent depiction of this Pokémon from the back in battle */
  back_transparent: string | null;
  /** The default depiction of this Pokémon from the front in battle */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle */
  front_shiny: string | null;
  /** The front shiny transparent depiction of this Pokémon from the front in battle */
  front_shiny_transparent: string | null;
  /** The transparent depiction of this Pokémon from the front in battle */
  front_transparent: string | null;
}

export interface Gold {
  /** The default depiction of this Pokémon from the back in battle */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle */
  back_shiny: string | null;
  /** The default depiction of this Pokémon from the front in battle */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle */
  front_shiny: string | null;
  /** The transparent depiction of this Pokémon from the front in battle */
  front_transparent: string | null;
}

/** Silver sprites */
interface Silver {
  /** The default depiction of this Pokémon from the back in battle */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle */
  back_shiny: string | null;
  /** The default depiction of this Pokémon from the front in battle */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle */
  front_shiny: string | null;
  /** The transparent depiction of this Pokémon from the front in battle */
  front_transparent: string | null;
}

/** Generation-III Sprites */
export interface GenerationIIISprites {
  /** Emerald sprites of this Pokémon */
  emerald: Emerald;
  /** Firered-Leafgreen sprites of this Pokémon */
  'firered-leafgreen': FireredLeafgreen;
  /** Ruby-Sapphire sprites of this Pokémon */
  'ruby-sapphire': RubySapphire;
}

/** Emerald sprites */
export interface Emerald {
  /** The default depiction of this Pokémon from the front in battle */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle */
}

/** FireRead LeafGreen sprites  */
export interface FireredLeafgreen {
  /** The default depiction of this Pokémon from the back in battle */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle */
  back_shiny: string | null;
  /** The default depiction of this Pokémon from the front in battle */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle */
  front_shiny: string | null;
}

/** Ruby/Sapphire sprites */
export interface RubySapphire {
  /** The default depiction of this Pokémon from the back in battle */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle */
  back_shiny: string | null;
  /** The default depiction of this Pokémon from the front in battle */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle */
  front_shiny: string | null;
}

/** Generation-IV Sprites */
export interface GenerationIVSprites {
  /** Diamond-pearl Generation sprites of this Pokémon */
  'diamond-perl': DiamondPearl;
  /** Heartgold-Soulsilver sprites of this Pokémon */
  'heartgold-soulsilver': HeartgoldSoulsilver;
  /** Platinum sprites of this Pokémon */
  platinum: Platinum;
}

export interface DiamondPearl {
  /** The default depiction of this Pokémon from the back in battle */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle */
  back_shiny: string | null;
  /** The female depiction of this Pokémon from the back in battle */
  back_female: string | null;
  /** The default depiction of this Pokémon from the front in battle */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle */
  back_shiny_female: string | null;
  /** The female depiction of this Pokémon from the front in battle */
  front_female: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle */
  front_shiny_female: string | null;
}

export interface HeartgoldSoulsilver {
  /** The default depiction of this Pokémon from the back in battle */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle */
  back_shiny: string | null;
  /** The female depiction of this Pokémon from the back in battle */
  back_female: string | null;
  /** The default depiction of this Pokémon from the front in battle */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle */
  back_shiny_female: string | null;
  /** The female depiction of this Pokémon from the front in battle */
  front_female: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle */
  front_shiny_female: string | null;
}

export interface Platinum {
  /** The default depiction of this Pokémon from the back in battle */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle */
  back_shiny: string | null;
  /** The female depiction of this Pokémon from the back in battle */
  back_female: string | null;
  /** The default depiction of this Pokémon from the front in battle */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle */
  back_shiny_female: string | null;
  /** The female depiction of this Pokémon from the front in battle */
  front_female: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle */
  front_shiny_female: string | null;
}

/** Generation-V Sprites */
export interface GenerationVSprites {
  /** Black-white sprites of this Pokémon */
  'black-white': BlackWhite;
}

/** Black/White sprites */
export interface BlackWhite {
  /** The animated sprite of this pokémon */
  animated: Animated;
  /** The default depiction of this Pokémon from the back in battle */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle */
  back_shiny: string | null;
  /** The female depiction of this Pokémon from the back in battle */
  back_female: string | null;
  /** The default depiction of this Pokémon from the front in battle */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle */
  back_shiny_female: string | null;
  /** The female depiction of this Pokémon from the front in battle */
  front_female: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle */
  front_shiny_female: string | null;
}
export interface Animated {
  /** The default depiction of this Pokémon from the back in battle */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle */
  back_shiny: string | null;
  /** The female depiction of this Pokémon from the back in battle */
  back_female: string | null;
  /** The default depiction of this Pokémon from the front in battle */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle */
  back_shiny_female: string | null;
  /** The female depiction of this Pokémon from the front in battle */
  front_female: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle */
  front_shiny_female: string | null;
}

/** Generation-VI Sprites */
export interface GenerationVISprites {
  /** Omegaruby-Alphasapphire sprites of this Pokémon */
  'omegaruby-alphasapphire': OmegarubyAlphasapphire;
  /** X-Y sprites of this Pokémon */
  'x-y': XY;
}

/** Omega/Ruby Alpha/Sapphire sprites */
export interface OmegarubyAlphasapphire {
  /** The default depiction of this Pokémon from the front in battle */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle */
  front_female: string | null;
  /** The shiny depiction of this Pokémon from the front in battle */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle */
  front_shiny_female: string | null;
}

/** XY sprites */
export interface XY {
  /** The default depiction of this Pokémon from the front in battle */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle */
  front_female: string | null;
  /** The shiny depiction of this Pokémon from the front in battle */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle */
  front_shiny_female: string | null;
}

/** Generation-VII Sprites */
export interface GenerationVIISprites {
  /** Icon sprites of this Pokémon */
  icons: GenerationViiIcons;
  /** Ultra-sun-ultra-moon sprites of this Pokémon */
  'ultra-sun-ultra-moon': UltraSunUltraMoon;
}

/** Generation VII icons */
export interface GenerationViiIcons {
  /** The default depiction of this Pokémon from the front in battle */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle */
  front_female: string | null;
}

/** Ultra Sun Ultra Moon sprites */
export interface UltraSunUltraMoon {
  /** The default depiction of this Pokémon from the front in battle */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle */
  front_female: string | null;
  /** The shiny depiction of this Pokémon from the front in battle */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle */
  front_shiny_female: string | null;
}

/** Generation-VIII Sprites */
export interface GenerationVIIISprites {
  /** Icon sprites of this Pokémon */
  icons: GenerationViiiIcons;
}

/** Generation VIII icons */
export interface GenerationViiiIcons {
  /** The default depiction of this Pokémon from the front in battle */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle */
  front_female: string | null;
}

/**
 * ## Location Area Encounter
 * Pokémon location areas where Pokémon can be found
 */
export interface LocationAreaEncounter {
  /** The location area the referenced Pokémon can be encountered in */
  location_area: NamedAPIResource;
  /** A list of versions and encounters with the referenced Pokémon that might happen */
  version_details: VersionEncounterDetail[];
}

/**
 * ## Pokemon Colors
 * Colors used for sorting Pokémon in a Pokédex.
 * The color listed in the Pokédex is usually the color most apparent or covering each Pokémon's body.
 * No orange category exists; Pokémon that are primarily orange are listed as red or brown.
 */
export interface PokemonColor {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name:
    | 'black'
    | 'blue'
    | 'brown'
    | 'gray'
    | 'green'
    | 'pink'
    | 'purple'
    | 'red'
    | 'white'
    | 'yellow';
  /** The name of this resource listed in different languages */
  names: Name[];
  /** A list of the Pokémon species that have this color */
  pokemon_species: NamedAPIResource[];
}

/**
 * ## Pokemon Form
 * Some Pokémon may appear in one of multiple, visually different forms.
 * These differences are purely cosmetic. For variations within a Pokémon species,
 * which do differ in more than just visuals, the 'Pokémon' entity is used to represent such a variety.
 */
export interface PokemonForm {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** The order in which forms should be sorted within all forms.
   * Multiple forms may have equal order, in which case they should fall back on sorting by name
   */
  order: number;
  /** The order in which forms should be sorted within a species' forms */
  form_order: number;
  /** True for exactly one form used as the default for each Pokémon */
  is_default: boolean;
  /** Whether or not this form can only happen during battle */
  is_battle_only: boolean;
  /** Whether or not this form requires mega evolution */
  is_mega: boolean;
  /** The name of this form */
  form_name: string;
  /** The Pokémon that can take on this form */
  pokemon: NamedAPIResource;
  /** A set of sprites used to depict this Pokémon form in the game */
  sprites: PokemonFormSprites;
  /** The version group this Pokémon form was introduced in */
  version_group: NamedAPIResource;
  /** The form specific full name of this Pokémon form, or empty if the form does not have a specific name */
  names: Name[];
  /** The form specific form name of this Pokémon form, or empty if the form does not have a specific name */
  form_names: Name[];
  /** A list of details showing types this Pokémon has */
  types: PokemonType[];
}

/**
 * Sprites used to depict this Pokémon form in the game
 */
export interface PokemonFormSprites {
  /** The default depiction of this Pokémon form from the front in battle */
  front_default: string | null;
  /** The female depiction of this Pokémon form from the front in battle */
  front_female: string | null;
  /** The shiny depiction of this Pokémon form from the front in battle */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon form from the front in battle */
  front_shiny_female: string | null;
  /** The default depiction of this Pokémon form from the back in battle */
  back_default: string | null;
  /** The female depiction of this Pokémon form from the back in battle */
  back_female: string | null;
  /** The shiny depiction of this Pokémon form from the back in battle */
  back_shiny: string | null;
  /** The shiny female depiction of this Pokémon form from the back in battle */
  back_shiny_female: string | null;
}

/**
 * ## Pokemon Habitat
 * Habitats are generally different terrain Pokémon can be found in
 * but can also be areas designated for rare or legendary Pokémon
 */
export interface PokemonHabitat {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name:
    | 'cave'
    | 'forest'
    | 'grassland'
    | 'mountain'
    | 'rare'
    | 'rough-terrain'
    | 'sea'
    | 'urban'
    | 'waters-edge';
  /** The name of this resource listed in different languages */
  names: Name[];
  /** A list of the Pokémon species that can be found in this habitat */
  pokemon_species: NamedAPIResource[];
}

/**
 * ## Pokemon Shape
 * Shapes used for sorting Pokémon in a Pokédex
 */
export interface PokemonShape {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** The "scientific" name of this Pokémon shape listed in different languages */
  awesome_names: AwesomeName[];
  /** The name of this resource listed in different languages */
  names: Name[];
  /** A list of the Pokémon species that have this shape */
  pokemon_species: NamedAPIResource[];
}

/**
 * The "scientific" name of the Pokémon shape listed in different languages
 */
export interface AwesomeName {
  /** The localized "scientific" name for an API resource in a specific language */
  awesome_name: string;
  /** The language this "scientific" name is in */
  language: NamedAPIResource;
}

/**
 * ## Pokemon Species
 * A Pokémon Species forms the basis for at least one Pokémon.
 * Attributes of a Pokémon species are shared across all varieties of Pokémon within the species.
 * A good example is Wormadam; Wormadam is the species which can be found in three different varieties,
 * Wormadam-Trash, Wormadam-Sandy and Wormadam-Plant */
export interface PokemonSpecies {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** The order in which species should be sorted. Based on National Dex order, except families are grouped together and sorted by stage */
  order: number;
  /** The chance of this Pokémon being female, in eighths; or -1 for genderless */
  gender_rate: number;
  /** The base capture rate; up to 255. The higher the number, the easier the catch */
  capture_rate: number;
  /** The happiness when caught by a normal Pokéball; up to 255. The higher the number, the happier the Pokémon */
  base_happiness: number;
  /** Whether or not this is a baby Pokémon */
  is_baby: boolean;
  /** Whether or not this is a legendary Pokémon */
  is_legendary: boolean;
  /** Whether or not this is a mythical Pokémon */
  is_mythical: boolean;
  /** Initial hatch counter: one must walk 255 × (hatch_counter + 1) steps before this Pokémon's egg hatches, unless utilizing bonuses like Flame Body's */
  hatch_counter: number;
  /** Whether or not this Pokémon has visual gender differences */
  has_gender_differences: boolean;
  /** Whether or not this Pokémon has multiple forms and can switch between them */
  forms_switchable: boolean;
  /** The rate at which this Pokémon species gains levels */
  growth_rate: NamedAPIResource;
  /** A list of Pokedexes and the indexes reserved within them for this Pokémon species */
  pokedex_numbers: PokemonSpeciesDexEntry[];
  /** A list of egg groups this Pokémon species is a member of */
  egg_groups: NamedAPIResource[];
  /** The color of this Pokémon for Pokédex search */
  color: NamedAPIResource;
  /** The shape of this Pokémon for Pokédex search */
  shape: NamedAPIResource;
  /** The Pokémon species that evolves into this Pokemon_species */
  evolves_from_species: NamedAPIResource;
  /** The evolution chain this Pokémon species is a member of */
  evolution_chain: APIResource;
  /** The habitat this Pokémon species can be encountered in */
  habitat: NamedAPIResource;
  /** The generation this Pokémon species was introduced in */
  generation: NamedAPIResource;
  /** The name of this resource listed in different languages */
  names: Name[];
  /** A list of encounters that can be had with this Pokémon species in pal park */
  pal_park_encounters: PalParkEncounterArea[];
  /** A list of flavor text entries for this Pokémon species */
  flavor_text_entries: FlavorText[];
  /** Descriptions of different forms Pokémon take on within the Pokémon species */
  form_descriptions: Description[];
  /** The genus of this Pokémon species listed in multiple languages */
  genera: Genus[];
  /** A list of the Pokémon that exist within this Pokémon species */
  varieties: PokemonSpeciesVariety[];
}

/**
 * The genus of the given Pokémon species listed in multiple languages
 */
export interface Genus {
  /** The localized genus for the referenced Pokémon species */
  genus: string;
  /** The language this genus is in */
  language: NamedAPIResource;
}

/** Pokedexes and the indexes reserved within them for the given Pokémon species */
export interface PokemonSpeciesDexEntry {
  /** The index number within the Pokédex */
  entry_number: number;
  /** The Pokédex the referenced Pokémon species can be found in */
  pokedex: NamedAPIResource;
}

/**
 * Encounter that can be had with the given Pokémon species in pal park
 */
export interface PalParkEncounterArea {
  /** The base score given to the player when the referenced Pokémon is caught during a pal park run */
  base_score: number;
  /** The base rate for encountering the referenced Pokémon in this pal park area */
  rate: number;
  /** The pal park area where this encounter happens */
  area: NamedAPIResource;
}

/**
 * Pokémons that exist within this Pokémon species
 */
export interface PokemonSpeciesVariety {
  /** Whether this variety is the default variety */
  is_default: boolean;
  /** The Pokémon variety */
  pokemon: NamedAPIResource;
}
