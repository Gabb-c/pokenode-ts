/* eslint camelcase: 0 */
declare module 'berries' {
  export type Berry = {
    id: number;
    name: string;
    growth_time: number;
    max_harvest: number;
    natural_gift_power: number;
    size: number;
    smoothness: number;
    soil_dryness: number;
    firmness: BerryFirmness;
    flavors: BerryFlavorMap[];
    item: Item;
    natural_gift_type: Type;
  };
  export type BerryFlavorMap = {
    potency: number;
    flavor: BerryFlavor;
  };

  export type BerryFirmness = {
    id: number;
    name: string;
    berries: Berry[];
    names: Name[];
  };

  export type BerryFlavor = {
    id: number;
    name: string;
    berries: FlavorBerryMap[];
    contest_type: ContestType;
    names: Name[];
  };

  export type FlavorBerryMap = {
    potency: number;
    flavor: Berry;
  };
}

declare module 'contests' {
  export type ContestType = {
    id: number;
    name: string;
    berry_flavor: BerryFlavor;
    names: ContestName[];
  };

  export type ContestName = {
    name: string;
    color: string;
    language: Language;
  };

  export type ContestEffect = {
    id: number;
    appeal: number;
    jam: number;
    effect_entries: Effect[];
    flavor_text_entries: FlavorText[];
  };

  export type SuperContestEffect = {
    id: number;
    appeal: number;
    jam: number;
    flavor_text_entries: FlavorText[];
    moves: Moves[];
  };
}

declare module 'encounters' {
  export type EncounterMethod = {
    id: number;
    name: string;
    order: number;
    names: Name[];
  };
  export type EncounterCondition = {
    id: number;
    name: string;
    names: Name[];
    values: EncounterConditionValue[];
  };
  export type EncounterConditionValue = {
    id: number;
    name: string;
    condition: EncounterCondition;
    names: Name[];
  };
}

declare module 'evolution' {
  export type EvolutionChain = {
    id: number;
    baby_trigger_item: Item;
    chain: ChainLink;
  };

  export type ChainLink = {
    is_baby: boolean;
    species: PokemonSpecies;
    evolution_details: EvolutionDetail[];
    evolves_to: ChainLink[];
  };

  export type EvolutionDetail = {
    item: Item;
    trigger: EvolutionTrigger;
    gender: number;
    held_item: Item;
    known_move: Move;
    known_move_type: Type;
    location: Location;
    min_level: number;
    min_happiness: number;
    min_beauty: number;
    min_affection: number;
    needs_overworld_rain: boolean;
    party_species: PokemonSpecies;
    party_type: Type;
    relative_physical_stats: number;
    time_of_day: string;
    trade_species: PokemonSpecies;
    turn_upside_down: boolean;
  };

  export type EvolutionTrigger = {
    id: number;
    name: string;
    names: Name[];
    pokemon_species: PokemonSpecies[];
  };
}
declare module 'games' {
  export type Generation = {
    id: number;
    name: string;
    abilities: Ability[];
    names: Name[];
    main_region: Region;
    moves: Move[];
    pokemon_species: PokemonSpecies[];
    types: Types[];
    version_groups: VersionGroup[];
  };

  export type Pokedex = {
    id: number;
    name: string;
    is_main_series: boolean;
    descriptions: Description[];
    names: Name[];
    pokemon_entries: PokemonEntry[];
    region: Region;
    version_groups: VersionGroup[];
  };

  export type PokemonEntry = {
    entry_number: number;
    pokemon_species: PokemonSpecies;
  };

  export type Version = {
    id: number;
    name: string;
    names: Names[];
    version_group: VersionGroup;
  };

  export type VersionGroup = {
    id: number;
    name: string;
    order: number;
    generation: Generation;
    move_learn_methods: MoveLearnMethod[];
    pokedexes: Pokedex[];
    regions: Region[];
    versions: Version[];
  };
}

declare module 'items' {
  export type Item = {
    id: number;
    name: string;
    cost: number;
    fling_power: number;
    fling_effect: ItemFlingEffect;
    attributes: ItemAttribute[];
    category: ItemCategory;
    effect_entries: VerboseEffect[];
    flavor_text_entries: VersionGroupFlavorText[];
    game_indices: GenerationGameIndex[];
    names: Name[];
    sprites: ItemSprites;
    held_by_pokemon: ItemHolderPokemon[];
    baby_trigger_for: EvolutionChain;
    machines: MachineVersionDetail[];
  };

  export type ItemSprites = {
    default: number;
  };

  export type ItemHolderPokemon = {
    pokemon: Pokemon;
    version_details: ItemHolderPokemonVersionDetail[];
  };

  export type ItemHolderPokemonVersionDetail = {
    rarity: number;
    version: Version;
  };

  export type ItemCategory = {
    id: number;
    name: string;
    items: Item[];
    names: Name[];
    pocket: ItemPocket;
  };

  export type ItemFlingEffect = {
    id: number;
    name: string;
    effect_entries: Effect[];
    items: Item[];
  };

  export type ItemAttribute = {
    id: number;
    name: string;
    items: Item[];
    names: Name[];
    descriptions: Description[];
  };
  export type ItemPocket = {
    id: number;
    name: string;
    categories: ItemCategory;
    names: Name[];
  };
}

declare module 'locations' {
  export type Location = {
    id: number;
    name: string;
    region: Region;
    names: Name[];
    game_indices: GenerationGameIndex[];
    areas: LocationArea[];
  };

  export type LocationArea = {
    id: number;
    name: string;
    game_index: number;
    encounter_method_rates: EncounterMethodRate[];
    location: Location;
    names: Name[];
    pokemon_encounters: PokemonEncounter[];
  };

  export type EncounterMethodRate = {
    encounter_method: EncounterMethod;
    version_details: EncounterVersionDetails[];
  };
  export type EncounterVersionDetails = {
    rate: number;
    version: Version;
  };
  export type PokemonEncounter = {
    pokemon: Pokemon;
    version_details: VersionEncounterDetail;
  };

  export type PalParkArea = {
    id: number;
    name: string;
    names: Name[];
    pokemon_encounters: PalParkEncounterSpecies[];
  };

  export type PalParkEncounterSpecies = {
    base_score: number;
    rate: number;
    pokemon_species: PokemonSpecies;
  };

  export type Region = {
    id: number;
    locations: Location[];
    name: string;
    names: Name[];
    main_generation: Generation;
    pokedexes: Pokedex[];
    version_groups: VersionGroup[];
  };
}

declare module 'machines' {
  export type Machine = {
    id: number;
    item: Item;
    move: Move;
    version_group: VersionGroup;
  };
}

declare module 'moves' {
  export type Machine = {
    id: number;
    name: string;
    accuracy: number;
    effect_chance: number;
    pp: number;
    priority: number;
    power: number;
    contest_combos: ContestComboSets;
    contest_type: ContestType;
    contest_effect: ContestEffect;
    damage_class: MoveDamageClass;
    effect_entries: VerboseEffect[];
    effect_changes: AbilityEffectChange[];
    flavor_text_entries: MoveFlavorText[];
    generation: Generation;
    machines: MachineVersionDetail[];
    meta: MoveMetaData;
    name: Name[];
    past_values: PastMoveStatValues[];
    stat_changes: MoveStatChange[];
    super_contest_effect: SuperContestEffect;
    target: MoveTarget;
    type: Type;
  };
  export type ContestComboSets = {
    normal: ContestComboDetail;
    super: ContestComboDetail;
  };
}

declare module 'utility' {
  export type Name = {
    name: string;
    language: Language;
  };

  export type Language = {
    id: number;
    name: string;
    official: boolean;
    iso639: string;
    iso3166: string;
    names: Name[];
  };

  export type Effect = {
    effect: string;
    language: Language;
  };

  export type Description = {
    description: string;
    language: Language;
  };
  export type VerboseEffect = {
    effect: string;
    short_effect: string;
    language: Language;
  };

  export type VersionGroupFlavorText = {
    text: string;
    language: Language;
    version_group: VersionGroup;
  };
}
