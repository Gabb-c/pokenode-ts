import { ENDPOINTS } from "@constants";
import type {
  Ability,
  APIResourceList,
  Characteristic,
  EggGroup,
  Gender,
  GrowthRate,
  LocationAreaEncounter,
  NamedAPIResourceList,
  Nature,
  PokeathlonStat,
  Pokemon,
  PokemonColor,
  PokemonForm,
  PokemonHabitat,
  PokemonShape,
  PokemonSpecies,
  Stat,
  Type,
} from "@models";
import { BaseClient } from "./base";

/**
 * ### Pokémon Client
 *
 * Client used to access the Pokémon Endpoints:
 *  - [Abilities](https://pokeapi.co/docs/v2#abilities)
 *  - [Characteristics](https://pokeapi.co/docs/v2#characteristics)
 *  - [Egg Groups](https://pokeapi.co/docs/v2#egg-groups)
 *  - [Genders](https://pokeapi.co/docs/v2#genders)
 *  - [Growth Rates](https://pokeapi.co/docs/v2#growth-rates)
 *  - [Natures](https://pokeapi.co/docs/v2#natures)
 *  - [Pokéathlon Stats](https://pokeapi.co/docs/v2#pokeathlon-stats)
 *  - [Pokémon](https://pokeapi.co/docs/v2#pokemon)
 *  - [Pokémon Location Areas](https://pokeapi.co/docs/v2#pokemon-location-areas)
 *  - [Pokémon Colors](https://pokeapi.co/docs/v2#pokemon-colors)
 *  - [Pokémon Forms](https://pokeapi.co/docs/v2#pokemon-forms)
 *  - [Pokémon Habitats](https://pokeapi.co/docs/v2#pokemon-habitats)
 *  - [Pokémon Shapes](https://pokeapi.co/docs/v2#pokemon-shapes)
 *  - [Pokémon Species](https://pokeapi.co/docs/v2#pokemon-species)
 *  - [Stats](https://pokeapi.co/docs/v2#stats)
 *  - [Types](https://pokeapi.co/docs/v2#types)
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#pokemon-section)
 */
export class PokemonClient extends BaseClient {
  /** Get an Ability by its name. */
  public async getAbilityByName(name: string): Promise<Ability> {
    return this.getResource(ENDPOINTS.ABILITY, name);
  }

  /** Get an Ability by its ID. */
  public async getAbilityById(id: number): Promise<Ability> {
    return this.getResource(ENDPOINTS.ABILITY, id);
  }

  /** Get a Characteristic by its ID. */
  public async getCharacteristicById(id: number): Promise<Characteristic> {
    return this.getResource(ENDPOINTS.CHARACTERISTIC, id);
  }

  /** Get an Egg Group by its name. */
  public async getEggGroupByName(name: string): Promise<EggGroup> {
    return this.getResource(ENDPOINTS.EGG_GROUP, name);
  }

  /** Get an Egg Group by its ID. */
  public async getEggGroupById(id: number): Promise<EggGroup> {
    return this.getResource(ENDPOINTS.EGG_GROUP, id);
  }

  /** Get a Gender by its name. */
  public async getGenderByName(name: string): Promise<Gender> {
    return this.getResource(ENDPOINTS.GENDER, name);
  }

  /** Get a Gender by its ID. */
  public async getGenderById(id: number): Promise<Gender> {
    return this.getResource(ENDPOINTS.GENDER, id);
  }

  /** Get a Growth Rate by its name. */
  public async getGrowthRateByName(name: string): Promise<GrowthRate> {
    return this.getResource(ENDPOINTS.GROWTH_RATE, name);
  }

  /** Get a Growth Rate by its ID. */
  public async getGrowthRateById(id: number): Promise<GrowthRate> {
    return this.getResource(ENDPOINTS.GROWTH_RATE, id);
  }

  /** Get a Nature by its name. */
  public async getNatureByName(name: string): Promise<Nature> {
    return this.getResource(ENDPOINTS.NATURE, name);
  }

  /** Get a Nature by its ID. */
  public async getNatureById(id: number): Promise<Nature> {
    return this.getResource(ENDPOINTS.NATURE, id);
  }

  /** Get a Pokéathlon Stat by its name. */
  public async getPokeathlonStatByName(name: string): Promise<PokeathlonStat> {
    return this.getResource(ENDPOINTS.POKEATHLON_STAT, name);
  }

  /** Get a Pokéathlon Stat by its ID. */
  public async getPokeathlonStatById(id: number): Promise<PokeathlonStat> {
    return this.getResource(ENDPOINTS.POKEATHLON_STAT, id);
  }

  /** Get a Pokémon by its name. */
  public async getPokemonByName(name: string): Promise<Pokemon> {
    return this.getResource(ENDPOINTS.POKEMON, name);
  }

  /** Get a Pokémon by its ID. */
  public async getPokemonById(id: number): Promise<Pokemon> {
    return this.getResource(ENDPOINTS.POKEMON, id);
  }

  /**
   * Get the areas a Pokémon can be encountered in, by its ID.
   * @returns Every location area the Pokémon appears in, with its encounter details.
   */
  public async getPokemonLocationAreaById(id: number): Promise<LocationAreaEncounter[]> {
    // Encounters hang off a single Pokémon rather than being an endpoint of
    // their own, so the path below `/pokemon` is addressed directly.
    return this.getResource(ENDPOINTS.POKEMON, id, "encounters");
  }

  /** Get a Pokémon Color by its name. */
  public async getPokemonColorByName(name: string): Promise<PokemonColor> {
    return this.getResource(ENDPOINTS.POKEMON_COLOR, name);
  }

  /** Get a Pokémon Color by its ID. */
  public async getPokemonColorById(id: number): Promise<PokemonColor> {
    return this.getResource(ENDPOINTS.POKEMON_COLOR, id);
  }

  /** Get a Pokémon Form by its name. */
  public async getPokemonFormByName(name: string): Promise<PokemonForm> {
    return this.getResource(ENDPOINTS.POKEMON_FORM, name);
  }

  /** Get a Pokémon Form by its ID. */
  public async getPokemonFormById(id: number): Promise<PokemonForm> {
    return this.getResource(ENDPOINTS.POKEMON_FORM, id);
  }

  /** Get a Pokémon Habitat by its name. */
  public async getPokemonHabitatByName(name: string): Promise<PokemonHabitat> {
    return this.getResource(ENDPOINTS.POKEMON_HABITAT, name);
  }

  /** Get a Pokémon Habitat by its ID. */
  public async getPokemonHabitatById(id: number): Promise<PokemonHabitat> {
    return this.getResource(ENDPOINTS.POKEMON_HABITAT, id);
  }

  /** Get a Pokémon Shape by its name. */
  public async getPokemonShapeByName(name: string): Promise<PokemonShape> {
    return this.getResource(ENDPOINTS.POKEMON_SHAPE, name);
  }

  /** Get a Pokémon Shape by its ID. */
  public async getPokemonShapeById(id: number): Promise<PokemonShape> {
    return this.getResource(ENDPOINTS.POKEMON_SHAPE, id);
  }

  /** Get a Pokémon Species by its name. */
  public async getPokemonSpeciesByName(name: string): Promise<PokemonSpecies> {
    return this.getResource(ENDPOINTS.POKEMON_SPECIES, name);
  }

  /** Get a Pokémon Species by its ID. */
  public async getPokemonSpeciesById(id: number): Promise<PokemonSpecies> {
    return this.getResource(ENDPOINTS.POKEMON_SPECIES, id);
  }

  /** Get a Stat by its name. */
  public async getStatByName(name: string): Promise<Stat> {
    return this.getResource(ENDPOINTS.STAT, name);
  }

  /** Get a Stat by its ID. */
  public async getStatById(id: number): Promise<Stat> {
    return this.getResource(ENDPOINTS.STAT, id);
  }

  /** Get a Type by its name. */
  public async getTypeByName(name: string): Promise<Type> {
    return this.getResource(ENDPOINTS.TYPE, name);
  }

  /** Get a Type by its ID. */
  public async getTypeById(id: number): Promise<Type> {
    return this.getResource(ENDPOINTS.TYPE, id);
  }

  /** List Abilities. Page defaults to 20 entries from offset 0. */
  public async listAbilities(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<Ability>> {
    return this.getListResource<Ability>(ENDPOINTS.ABILITY, offset, limit);
  }

  /** List Characteristics. Page defaults to 20 entries from offset 0. */
  public async listCharacteristics(
    offset?: number,
    limit?: number,
  ): Promise<APIResourceList<Characteristic>> {
    return this.getUnnamedListResource<Characteristic>(ENDPOINTS.CHARACTERISTIC, offset, limit);
  }

  /** List Egg Groups. Page defaults to 20 entries from offset 0. */
  public async listEggGroups(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<EggGroup>> {
    return this.getListResource<EggGroup>(ENDPOINTS.EGG_GROUP, offset, limit);
  }

  /** List Genders. Page defaults to 20 entries from offset 0. */
  public async listGenders(offset?: number, limit?: number): Promise<NamedAPIResourceList<Gender>> {
    return this.getListResource<Gender>(ENDPOINTS.GENDER, offset, limit);
  }

  /** List Growth Rates. Page defaults to 20 entries from offset 0. */
  public async listGrowthRates(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<GrowthRate>> {
    return this.getListResource<GrowthRate>(ENDPOINTS.GROWTH_RATE, offset, limit);
  }

  /** List Natures. Page defaults to 20 entries from offset 0. */
  public async listNatures(offset?: number, limit?: number): Promise<NamedAPIResourceList<Nature>> {
    return this.getListResource<Nature>(ENDPOINTS.NATURE, offset, limit);
  }

  /** List Pokéathlon Stats. Page defaults to 20 entries from offset 0. */
  public async listPokeathlonStats(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<PokeathlonStat>> {
    return this.getListResource<PokeathlonStat>(ENDPOINTS.POKEATHLON_STAT, offset, limit);
  }

  /** List Pokémon. Page defaults to 20 entries from offset 0. */
  public async listPokemons(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<Pokemon>> {
    return this.getListResource<Pokemon>(ENDPOINTS.POKEMON, offset, limit);
  }

  /** List Pokémon Colors. Page defaults to 20 entries from offset 0. */
  public async listPokemonColors(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<PokemonColor>> {
    return this.getListResource<PokemonColor>(ENDPOINTS.POKEMON_COLOR, offset, limit);
  }

  /** List Pokémon Forms. Page defaults to 20 entries from offset 0. */
  public async listPokemonForms(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<PokemonForm>> {
    return this.getListResource<PokemonForm>(ENDPOINTS.POKEMON_FORM, offset, limit);
  }

  /** List Pokémon Habitats. Page defaults to 20 entries from offset 0. */
  public async listPokemonHabitats(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<PokemonHabitat>> {
    return this.getListResource<PokemonHabitat>(ENDPOINTS.POKEMON_HABITAT, offset, limit);
  }

  /** List Pokémon Shapes. Page defaults to 20 entries from offset 0. */
  public async listPokemonShapes(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<PokemonShape>> {
    return this.getListResource<PokemonShape>(ENDPOINTS.POKEMON_SHAPE, offset, limit);
  }

  /** List Pokémon Species. Page defaults to 20 entries from offset 0. */
  public async listPokemonSpecies(
    offset?: number,
    limit?: number,
  ): Promise<NamedAPIResourceList<PokemonSpecies>> {
    return this.getListResource<PokemonSpecies>(ENDPOINTS.POKEMON_SPECIES, offset, limit);
  }

  /** List Stats. Page defaults to 20 entries from offset 0. */
  public async listStats(offset?: number, limit?: number): Promise<NamedAPIResourceList<Stat>> {
    return this.getListResource<Stat>(ENDPOINTS.STAT, offset, limit);
  }

  /** List Types. Page defaults to 20 entries from offset 0. */
  public async listTypes(offset?: number, limit?: number): Promise<NamedAPIResourceList<Type>> {
    return this.getListResource<Type>(ENDPOINTS.TYPE, offset, limit);
  }
}
