/** Version Sprites. */
export interface VersionSprites {
  /** Generation-I Sprites of this Pokémon. */
  "generation-i": GenerationISprites;
  /** Generation-II Sprites of this Pokémon. */
  "generation-ii": GenerationIISprites;
  /** Generation-III Sprites of this Pokémon. */
  "generation-iii": GenerationIIISprites;
  /** Generation-IV Sprites of this Pokémon. */
  "generation-iv": GenerationIVSprites;
  /** Generation-V Sprites of this Pokémon. */
  "generation-v": GenerationVSprites;
  /** Generation-VI Sprites of this Pokémon. */
  "generation-vi": GenerationVISprites;
  /** Generation-VII Sprites of this Pokémon. */
  "generation-vii": GenerationVIISprites;
  /** Generation-VIII Sprites of this Pokémon. */
  "generation-viii": GenerationVIIISprites;
  /** Generation-IX Sprites of this Pokémon. */
  "generation-ix": GenerationIXSprites;
}

/**
 * A set of sprites used to depict this Pokémon in the game.
 * A visual representation of the various sprites can be found at [PokeAPI/sprites](https://github.com/PokeAPI/sprites#sprites).
 */
export interface PokemonSprites {
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
  /** The shiny female depiction of this Pokémon from the front in battle. */
  front_shiny_female: string | null;
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle. */
  back_shiny: string | null;
  /** The female depiction of this Pokémon from the back in battle. */
  back_female: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle. */
  back_shiny_female: string | null;
  /** Dream World, Official Artwork and Home sprites. */
  other?: OtherPokemonSprites;
  /** Version Sprites of this Pokémon. */
  versions: VersionSprites;
}

/** Other Pokémon Sprites (Dream World and Official Artwork sprites). */
export interface OtherPokemonSprites {
  /** Dream World Sprites of this Pokémon. */
  dream_world: DreamWorld;
  /** Official Artwork Sprites of this Pokémon. */
  "official-artwork": OfficialArtwork;
  /** Home Artwork Sprites of this Pokémon. */
  home: Home;
  /** Pokémon Showdown animated sprites of this Pokémon. */
  showdown: Showdown;
}

/** Dream World sprites. */
export interface DreamWorld {
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
}

/** Official Artwork sprites. */
export interface OfficialArtwork {
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The artwork published for earlier games. */
  versions: OfficialArtworkVersions;
}

/** Official Artwork of earlier games. */
export interface OfficialArtworkVersions {
  /** Generation-I artwork of this Pokémon. */
  "generation-i": OfficialArtworkGenerationI;
  /** Generation-II artwork of this Pokémon. */
  "generation-ii": OfficialArtworkGenerationII;
}

/** Generation-I Official Artwork. */
export interface OfficialArtworkGenerationI {
  /** Red and Blue artwork of this Pokémon. */
  "red-and-blue": OfficialArtworkVersion;
  /** Red and Green artwork of this Pokémon. */
  "red-and-green": OfficialArtworkVersion;
}

/** Generation-II Official Artwork. */
export interface OfficialArtworkGenerationII {
  /** Gold and Silver artwork of this Pokémon. */
  "gold-and-silver": OfficialArtworkVersion;
}

/** The Official Artwork of one game. */
export interface OfficialArtworkVersion {
  /** The default depiction of this Pokémon. */
  front_default: string | null;
}

/** Home sprites. */
export interface Home {
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the front in battle. */
  front_shiny_female: string | null;
}

/** Showdown Sprites. */
export interface Showdown {
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the front in battle. */
  front_shiny_female: string | null;
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The female depiction of this Pokémon from the back in battle. */
  back_female: string | null;
  /** The shiny depiction of this Pokémon from the back in battle. */
  back_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle. */
  back_shiny_female: string | null;
}

/** Generation-I Sprites. */
export interface GenerationISprites {
  /** Red-blue sprites of this Pokémon. */
  "red-blue": RedBlue;
  /** Red-Green sprites of this Pokémon, from the Japanese release. */
  "red-green-japan": RedGreenJapan;
  /** Yellow sprites of this Pokémon. */
  yellow: Yellow;
}

/** Red/Blue Sprites. */
export interface RedBlue {
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The gray depiction of this Pokémon from the back in battle. */
  back_gray: string | null;
  /** The transparent depiction of this Pokémon from the back in battle. */
  back_transparent: string | null;
  /** The transparent gray depiction of this Pokémon from the back in battle. */
  back_transparent_gray: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The gray depiction of this Pokémon from the front in battle. */
  front_gray: string | null;
  /** The transparent depiction of this Pokémon from the front in battle. */
  front_transparent: string | null;
  /** The transparent gray depiction of this Pokémon from the front in battle. */
  front_transparent_gray: string | null;
}

/** Red/Green sprites, from the Japanese release. */
export interface RedGreenJapan {
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The gray depiction of this Pokémon from the back in battle. */
  back_gray: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The gray depiction of this Pokémon from the front in battle. */
  front_gray: string | null;
}

/** Yellow sprites. */
export interface Yellow {
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The Game Boy Color depiction of this Pokémon from the back in battle. */
  back_gbc: string | null;
  /** The gray depiction of this Pokémon from the back in battle. */
  back_gray: string | null;
  /** The transparent depiction of this Pokémon from the back in battle. */
  back_transparent: string | null;
  /** The transparent gray depiction of this Pokémon from the back in battle. */
  back_transparent_gray: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The Game Boy Color depiction of this Pokémon from the front in battle. */
  front_gbc: string | null;
  /** The gray depiction of this Pokémon from the front in battle. */
  front_gray: string | null;
  /** The transparent depiction of this Pokémon from the front in battle. */
  front_transparent: string | null;
  /** The transparent gray depiction of this Pokémon from the front in battle. */
  front_transparent_gray: string | null;
}

/** Generation-II Sprites. */
export interface GenerationIISprites {
  /** Crystal sprites of this Pokémon. */
  crystal: Crystal;
  /** Gold sprites of this Pokémon. */
  gold: Gold;
  /** Silver sprites of this Pokémon. */
  silver: Silver;
}

/** Crystal sprites. */
export interface Crystal {
  /** The animated sprites of this Pokémon. */
  animated: CrystalAnimated;
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle. */
  back_shiny: string | null;
  /** The back shiny transparent depiction of this Pokémon from the back in battle. */
  back_shiny_transparent: string | null;
  /** The transparent depiction of this Pokémon from the back in battle. */
  back_transparent: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The front shiny transparent depiction of this Pokémon from the front in battle. */
  front_shiny_transparent: string | null;
  /** The transparent depiction of this Pokémon from the front in battle. */
  front_transparent: string | null;
}

/** Animated Crystal sprites. */
export interface CrystalAnimated {
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
}

/** Gold sprites of this Pokémon. */
export interface Gold {
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle. */
  back_shiny: string | null;
  /** The transparent shiny depiction of this Pokémon from the back in battle. */
  back_shiny_transparent: string | null;
  /** The transparent depiction of this Pokémon from the back in battle. */
  back_transparent: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The transparent shiny depiction of this Pokémon from the front in battle. */
  front_shiny_transparent: string | null;
  /** The transparent depiction of this Pokémon from the front in battle. */
  front_transparent: string | null;
}

/** Silver sprites. */
export interface Silver {
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle. */
  back_shiny: string | null;
  /** The transparent shiny depiction of this Pokémon from the back in battle. */
  back_shiny_transparent: string | null;
  /** The transparent depiction of this Pokémon from the back in battle. */
  back_transparent: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The transparent shiny depiction of this Pokémon from the front in battle. */
  front_shiny_transparent: string | null;
  /** The transparent depiction of this Pokémon from the front in battle. */
  front_transparent: string | null;
}

/** Generation-III Sprites. */
export interface GenerationIIISprites {
  /** Emerald sprites of this Pokémon. */
  emerald: Emerald;
  /** Firered-Leafgreen sprites of this Pokémon. */
  "firered-leafgreen": FireredLeafgreen;
  /** Menu icons of this Pokémon. */
  icons: GenerationIIIIcons;
  /** Ruby-Sapphire sprites of this Pokémon. */
  "ruby-sapphire": RubySapphire;
}

/** Emerald sprites. */
export interface Emerald {
  /** The animated sprites of this Pokémon. */
  animated: EmeraldAnimated;
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle. */
  back_shiny: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
}

/** Animated Emerald sprites. */
export interface EmeraldAnimated {
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle. */
  back_shiny: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
}

/** Generation-III menu icons. */
export interface GenerationIIIIcons {
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
}

/** FireRed LeafGreen sprites. */
export interface FireredLeafgreen {
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle. */
  back_shiny: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
}

/** Ruby/Sapphire sprites. */
export interface RubySapphire {
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle. */
  back_shiny: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
}

/** Generation-IV Sprites. */
export interface GenerationIVSprites {
  /** Diamond-pearl Generation sprites of this Pokémon. */
  "diamond-pearl": DiamondPearl;
  /** Heartgold-Soulsilver sprites of this Pokémon. */
  "heartgold-soulsilver": HeartgoldSoulsilver;
  /** Menu icons of this Pokémon. */
  icons: GenerationIVIcons;
  /** Platinum sprites of this Pokémon. */
  platinum: Platinum;
}

/** Diamond-Pearl sprites of this Pokémon. */
export interface DiamondPearl {
  /** The animated sprites of this Pokémon. */
  animated: GenerationIVAnimated;
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle. */
  back_shiny: string | null;
  /** The female depiction of this Pokémon from the back in battle. */
  back_female: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle. */
  back_shiny_female: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle. */
  front_shiny_female: string | null;
}

/** HeartGold-SoulSilver sprites of this Pokémon. */
export interface HeartgoldSoulsilver {
  /** The animated sprites of this Pokémon. */
  animated: GenerationIVAnimated;
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle. */
  back_shiny: string | null;
  /** The female depiction of this Pokémon from the back in battle. */
  back_female: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle. */
  back_shiny_female: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle. */
  front_shiny_female: string | null;
}

/** Platinum sprites of this Pokémon. */
export interface Platinum {
  /** The animated sprites of this Pokémon. */
  animated: GenerationIVAnimated;
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle. */
  back_shiny: string | null;
  /** The female depiction of this Pokémon from the back in battle. */
  back_female: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle. */
  back_shiny_female: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle. */
  front_shiny_female: string | null;
}

/** Animated Generation-IV sprites. */
export interface GenerationIVAnimated {
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the front in battle. */
  front_shiny_female: string | null;
}

/** Generation-IV menu icons. */
export interface GenerationIVIcons {
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
}

/** Generation-V Sprites. */
export interface GenerationVSprites {
  /** Black-white sprites of this Pokémon. */
  "black-white": BlackWhite;
  /** Menu icons of this Pokémon. */
  icons: GenerationVIcons;
}

/** Black/White sprites. */
export interface BlackWhite {
  /** The animated sprite of this Pokémon. */
  animated: Animated;
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle. */
  back_shiny: string | null;
  /** The female depiction of this Pokémon from the back in battle. */
  back_female: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle. */
  back_shiny_female: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle. */
  front_shiny_female: string | null;
}
/** Animated sprites of this Pokémon. */
export interface Animated {
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The shiny depiction of this Pokémon from the back in battle. */
  back_shiny: string | null;
  /** The female depiction of this Pokémon from the back in battle. */
  back_female: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle. */
  back_shiny_female: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle. */
  front_shiny_female: string | null;
}

/** Generation-V menu icons. */
export interface GenerationVIcons {
  /** The animated menu icon of this Pokémon. */
  animated: GenerationVAnimatedIcons;
  /** The menu icon of this Pokémon. */
  front_default: string | null;
}

/** Animated Generation-V menu icons. */
export interface GenerationVAnimatedIcons {
  /** The animated menu icon of this Pokémon. */
  front_default: string | null;
}

/** Generation-VI Sprites. */
export interface GenerationVISprites {
  /** Menu icons of this Pokémon. */
  icons: GenerationVIIcons;
  /** Omegaruby-Alphasapphire sprites of this Pokémon. */
  "omega-ruby-alpha-sapphire": OmegarubyAlphasapphire;
  /** X-Y sprites of this Pokémon. */
  "x-y": XY;
}

/** Generation-VI menu icons. */
export interface GenerationVIIcons {
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
}

/** Omega/Ruby Alpha/Sapphire sprites. */
export interface OmegarubyAlphasapphire {
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The female depiction of this Pokémon from the back in battle. */
  back_female: string | null;
  /** The shiny depiction of this Pokémon from the back in battle. */
  back_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle. */
  back_shiny_female: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the front in battle. */
  front_shiny_female: string | null;
}

/** XY sprites. */
export interface XY {
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The female depiction of this Pokémon from the back in battle. */
  back_female: string | null;
  /** The shiny depiction of this Pokémon from the back in battle. */
  back_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle. */
  back_shiny_female: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the front in battle. */
  front_shiny_female: string | null;
}

/** Generation-VII Sprites. */
export interface GenerationVIISprites {
  /** Icon sprites of this Pokémon. */
  icons: GenerationViiIcons;
  /** Let's Go Pikachu and Let's Go Eevee sprites of this Pokémon. */
  "lets-go-pikachu-lets-go-eevee": LetsGoPikachuLetsGoEevee;
  /** Ultra-sun-ultra-moon sprites of this Pokémon. */
  "ultra-sun-ultra-moon": UltraSunUltraMoon;
}

/** Generation VII icons. */
export interface GenerationViiIcons {
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
}

/** Let's Go Pikachu and Let's Go Eevee sprites. */
export interface LetsGoPikachuLetsGoEevee {
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The female depiction of this Pokémon from the back in battle. */
  back_female: string | null;
  /** The shiny depiction of this Pokémon from the back in battle. */
  back_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle. */
  back_shiny_female: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the front in battle. */
  front_shiny_female: string | null;
  /** Menu icons of this Pokémon. */
  icons: LetsGoPikachuLetsGoEeveeIcons;
}

/** Let's Go Pikachu and Let's Go Eevee menu icons. */
export interface LetsGoPikachuLetsGoEeveeIcons {
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
}

/** Ultra Sun Ultra Moon sprites. */
export interface UltraSunUltraMoon {
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The female depiction of this Pokémon from the back in battle. */
  back_female: string | null;
  /** The shiny depiction of this Pokémon from the back in battle. */
  back_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle. */
  back_shiny_female: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the front in battle. */
  front_shiny_female: string | null;
}

/** Generation-VIII Sprites. */
export interface GenerationVIIISprites {
  /** Brilliant Diamond and Shining Pearl sprites of this Pokémon. */
  "brilliant-diamond-shining-pearl": BrilliantDiamondShiningPearl;
  /** Sword and Shield sprites of this Pokémon. */
  "sword-shield": SwordShield;
  /** Legends: Arceus sprites of this Pokémon. */
  "legends-arceus": LegendsArceus;
}

/** Brilliant Diamond and Shining Pearl sprites. */
export interface BrilliantDiamondShiningPearl {
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The female depiction of this Pokémon from the back in battle. */
  back_female: string | null;
  /** The shiny depiction of this Pokémon from the back in battle. */
  back_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle. */
  back_shiny_female: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the front in battle. */
  front_shiny_female: string | null;
  /** Menu icons of this Pokémon. */
  icons: BrilliantDiamondShiningPearlIcons;
}

/** Brilliant Diamond and Shining Pearl menu icons. */
export interface BrilliantDiamondShiningPearlIcons {
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
}

/** Sword and Shield sprites. */
export interface SwordShield {
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The female depiction of this Pokémon from the back in battle. */
  back_female: string | null;
  /** The shiny depiction of this Pokémon from the back in battle. */
  back_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle. */
  back_shiny_female: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the front in battle. */
  front_shiny_female: string | null;
  /** Menu icons of this Pokémon. */
  icons: SwordShieldIcons;
}

/** Sword and Shield menu icons. */
export interface SwordShieldIcons {
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
}

/** Legends: Arceus sprites. */
export interface LegendsArceus {
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The female depiction of this Pokémon from the back in battle. */
  back_female: string | null;
  /** The shiny depiction of this Pokémon from the back in battle. */
  back_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle. */
  back_shiny_female: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the front in battle. */
  front_shiny_female: string | null;
  /** Menu icons of this Pokémon. */
  icons: LegendsArceusIcons;
}

/** Legends: Arceus menu icons. */
export interface LegendsArceusIcons {
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the front in battle. */
  front_shiny_female: string | null;
}

/** Generation-IX Sprites */
export interface GenerationIXSprites {
  /** Pokémon Champions sprites of this Pokémon. */
  champions: Champions;
  /** Scarlet and Violet sprites of this Pokémon. */
  "scarlet-violet": ScarletViolet;
  /** Pokémon Legends: Z-A sprites of this Pokémon. */
  "legends-za": LegendsZA;
}

/** Pokémon Legends: Z-A sprites. */
export interface LegendsZA {
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The female depiction of this Pokémon from the back in battle. */
  back_female: string | null;
  /** The shiny depiction of this Pokémon from the back in battle. */
  back_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle. */
  back_shiny_female: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the front in battle. */
  front_shiny_female: string | null;
  /** Menu icons of this Pokémon. */
  icons: LegendsZAIcons;
}

/** Pokémon Legends: Z-A menu icons. */
export interface LegendsZAIcons {
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the front in battle. */
  front_shiny_female: string | null;
}

/** Pokémon Champions sprites. */
export interface Champions {
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The female depiction of this Pokémon from the back in battle. */
  back_female: string | null;
  /** The shiny depiction of this Pokémon from the back in battle. */
  back_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle. */
  back_shiny_female: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the front in battle. */
  front_shiny_female: string | null;
  /** Menu icons of this Pokémon. */
  icons: ChampionsIcons;
}

/** Pokémon Champions menu icons. */
export interface ChampionsIcons {
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
}

/** Scarlet and Violet sprites. */
export interface ScarletViolet {
  /** The default depiction of this Pokémon from the back in battle. */
  back_default: string | null;
  /** The female depiction of this Pokémon from the back in battle. */
  back_female: string | null;
  /** The shiny depiction of this Pokémon from the back in battle. */
  back_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the back in battle. */
  back_shiny_female: string | null;
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
  /** The shiny depiction of this Pokémon from the front in battle. */
  front_shiny: string | null;
  /** The shiny female depiction of this Pokémon from the front in battle. */
  front_shiny_female: string | null;
  /** Menu icons of this Pokémon. */
  icons: ScarletVioletIcons;
}

/** Scarlet and Violet menu icons. */
export interface ScarletVioletIcons {
  /** The default depiction of this Pokémon from the front in battle. */
  front_default: string | null;
  /** The female depiction of this Pokémon from the front in battle. */
  front_female: string | null;
}
