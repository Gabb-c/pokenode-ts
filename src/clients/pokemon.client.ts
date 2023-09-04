import { ENDPOINTS } from "../constants";
import {
  Ability,
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
} from "../models";
import { BaseClient } from "./base";
import { AxiosError, AxiosResponse } from "axios";

/**
 * ### Pokemon Client
 *
 * Client used to access the Pokemon Endpoints:
 *  - [Abilities](https://pokeapi.co/docs/v2#abilities)
 *  - [Characteristics](https://pokeapi.co/docs/v2#characteristics)
 *  - [Egg Groups](https://pokeapi.co/docs/v2#egg-groups)
 *  - [Genders](https://pokeapi.co/docs/v2#genders)
 *  - [Growth Rates](https://pokeapi.co/docs/v2#growth-rates)
 *  - [Natures](https://pokeapi.co/docs/v2#natures)
 *  - [Pokeathlon Stats](https://pokeapi.co/docs/v2#pokeathlon-stats)
 *  - [Pokemon](https://pokeapi.co/docs/v2#pokemon)
 *  - [Pokemon Location Areas](https://pokeapi.co/docs/v2#pokemon-location-areas)
 *  - [Pokemon Colors](https://pokeapi.co/docs/v2#pokemon-colors)
 *  - [Pokemon Forms](https://pokeapi.co/docs/v2#pokemon-forms)
 *  - [Pokemon Habitats](https://pokeapi.co/docs/v2#pokemon-habitats)
 *  - [Pokemon Shapes](https://pokeapi.co/docs/v2#pokemon-shapes)
 *  - [Pokemon Species](https://pokeapi.co/docs/v2#pokemon-species)
 *  - [Stats](https://pokeapi.co/docs/v2#stats)
 *  - [Types](https://pokeapi.co/docs/v2#types)
 * ---
 * See [PokéAPI Documentation](https://pokeapi.co/docs/v2#pokemon-section)
 */
export class PokemonClient extends BaseClient {
  /**
   * Get an Ability by it's name
   * @param name The Ability name
   * @returns An Ability
   */
  public async getAbilityByName(name: string): Promise<Ability> {
    return new Promise<Ability>((resolve, reject) => {
      this.api
        .get<Ability>(`${ENDPOINTS.ABILITY}/${name}`)
        .then((response: AxiosResponse<Ability>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get an Ability by it's ID
   * @param id The Ability ID
   * @returns An Ability
   */
  public async getAbilityById(id: number): Promise<Ability> {
    return new Promise<Ability>((resolve, reject) => {
      this.api
        .get<Ability>(`${ENDPOINTS.ABILITY}/${id}`)
        .then((response: AxiosResponse<Ability>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Characteristic by it's ID
   * @param id The Characteristic ID
   * @returns A Characteristic
   */
  public async getCharacteristicById(id: number): Promise<Characteristic> {
    return new Promise<Characteristic>((resolve, reject) => {
      this.api
        .get<Characteristic>(`${ENDPOINTS.CHARACTERISTIC}/${id}`)
        .then((response: AxiosResponse<Characteristic>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get an Egg Group by it's name
   * @param name The Egg Group name
   * @returns An Egg Group
   */
  public async getEggGroupByName(name: string): Promise<EggGroup> {
    return new Promise<EggGroup>((resolve, reject) => {
      this.api
        .get<EggGroup>(`${ENDPOINTS.EGG_GROUP}/${name}`)
        .then((response: AxiosResponse<EggGroup>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get an Egg Group by it's ID
   * @param id The Egg Group ID
   * @returns An Egg Group
   */
  public async getEggGroupById(id: number): Promise<EggGroup> {
    return new Promise<EggGroup>((resolve, reject) => {
      this.api
        .get<EggGroup>(`${ENDPOINTS.EGG_GROUP}/${id}`)
        .then((response: AxiosResponse<EggGroup>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Gender by it's name
   * @param name The gender name
   * @returns An Egg Group
   */
  public async getGenderByName(name: string): Promise<Gender> {
    return new Promise<Gender>((resolve, reject) => {
      this.api
        .get<Gender>(`${ENDPOINTS.GENDER}/${name}`)
        .then((response: AxiosResponse<Gender>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Gender by it's ID
   * @param id The Gender ID
   * @returns A Gender
   */
  public async getGenderById(id: number): Promise<Gender> {
    return new Promise<Gender>((resolve, reject) => {
      this.api
        .get<Gender>(`${ENDPOINTS.GENDER}/${id}`)
        .then((response: AxiosResponse<Gender>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Growth Rate by it's name
   * @param name The Growth Rate name
   * @returns A Growth Rate
   */
  public async getGrowthRateByName(name: string): Promise<GrowthRate> {
    return new Promise<GrowthRate>((resolve, reject) => {
      this.api
        .get<GrowthRate>(`${ENDPOINTS.GROWTH_RATE}/${name}`)
        .then((response: AxiosResponse<GrowthRate>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Growth Rate by it's ID
   * @param id The Growth Rate ID
   * @returns A Growth Rate
   */
  public async getGrowthRateById(id: number): Promise<GrowthRate> {
    return new Promise<GrowthRate>((resolve, reject) => {
      this.api
        .get<GrowthRate>(`${ENDPOINTS.GROWTH_RATE}/${id}`)
        .then((response: AxiosResponse<GrowthRate>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Nature by it's name
   * @param name The Nature name
   * @returns A Nature
   */
  public async getNatureByName(name: string): Promise<Nature> {
    return new Promise<Nature>((resolve, reject) => {
      this.api
        .get<Nature>(`${ENDPOINTS.NATURE}/${name}`)
        .then((response: AxiosResponse<Nature>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Nature by it's ID
   * @param id The Nature ID
   * @returns A Nature
   */
  public async getNatureById(id: number): Promise<Nature> {
    return new Promise<Nature>((resolve, reject) => {
      this.api
        .get<Nature>(`${ENDPOINTS.NATURE}/${id}`)
        .then((response: AxiosResponse<Nature>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Pokeathlon Stat by it's name
   * @param name The Pokeathlon Stat name
   * @returns A Pokeathlon Stat
   */
  public async getPokeathlonStatByName(name: string): Promise<PokeathlonStat> {
    return new Promise<PokeathlonStat>((resolve, reject) => {
      this.api
        .get<PokeathlonStat>(`${ENDPOINTS.POKEATHLON_STAT}/${name}`)
        .then((response: AxiosResponse<PokeathlonStat>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Pokeathlon Stat by it's ID
   * @param id The Pokeathlon Stat ID
   * @returns A Pokeathlon Stat
   */
  public async getPokeathlonStatById(id: number): Promise<PokeathlonStat> {
    return new Promise<PokeathlonStat>((resolve, reject) => {
      this.api
        .get<PokeathlonStat>(`${ENDPOINTS.POKEATHLON_STAT}/${id}`)
        .then((response: AxiosResponse<PokeathlonStat>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Pokemon by it's name
   * @param name The Pokemon name
   * @returns A Pokemon Stat
   */
  public async getPokemonByName(name: string): Promise<Pokemon> {
    return new Promise<Pokemon>((resolve, reject) => {
      this.api
        .get<Pokemon>(`${ENDPOINTS.POKEMON}/${name}`)
        .then((response: AxiosResponse<Pokemon>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Pokemon by it's ID
   * @param id The Pokemon ID
   * @returns A Pokemon
   */
  public async getPokemonById(id: number): Promise<Pokemon> {
    return new Promise<Pokemon>((resolve, reject) => {
      this.api
        .get<Pokemon>(`${ENDPOINTS.POKEMON}/${id}`)
        .then((response: AxiosResponse<Pokemon>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Pokemon Location Area by it's ID
   * @param id The Pokemon Location Area ID
   * @returns A Pokemon Location Area
   */
  public async getPokemonLocationAreaById(id: number): Promise<LocationAreaEncounter[]> {
    return new Promise<LocationAreaEncounter[]>((resolve, reject) => {
      this.api
        .get<LocationAreaEncounter[]>(
          `${ENDPOINTS.POKEMON_LOCATION_AREA.replace(":id", id.toString())}`,
        )
        .then((response: AxiosResponse<LocationAreaEncounter[]>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Pokemon Color by it's name
   * @param name The Pokemon Color name
   * @returns A Pokemon Color
   */
  public async getPokemonColorByName(name: string): Promise<PokemonColor> {
    return new Promise<PokemonColor>((resolve, reject) => {
      this.api
        .get<PokemonColor>(`${ENDPOINTS.POKEMON_COLOR}/${name}`)
        .then((response: AxiosResponse<PokemonColor>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Pokemon Color by it's ID
   * @param id The Pokemon Color ID
   * @returns A Pokemon Color
   */
  public async getPokemonColorById(id: number): Promise<PokemonColor> {
    return new Promise<PokemonColor>((resolve, reject) => {
      this.api
        .get<PokemonColor>(`${ENDPOINTS.POKEMON_COLOR}/${id}`)
        .then((response: AxiosResponse<PokemonColor>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Pokemon Form by it's name
   * @param name The Pokemon Form name
   * @returns A Pokemon Form
   */
  public async getPokemonFormByName(name: string): Promise<PokemonForm> {
    return new Promise<PokemonForm>((resolve, reject) => {
      this.api
        .get<PokemonForm>(`${ENDPOINTS.POKEMON_FORM}/${name}`)
        .then((response: AxiosResponse<PokemonForm>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Pokemon Form by it's ID
   * @param id The Pokemon Form ID
   * @returns A Pokemon Form
   */
  public async getPokemonFormById(id: number): Promise<PokemonForm> {
    return new Promise<PokemonForm>((resolve, reject) => {
      this.api
        .get<PokemonForm>(`${ENDPOINTS.POKEMON_FORM}/${id}`)
        .then((response: AxiosResponse<PokemonForm>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Pokemon Habitat by it's name
   * @param name The Pokemon Habitat name
   * @returns A Pokemon Habitat
   */
  public async getPokemonHabitatByName(name: string): Promise<PokemonHabitat> {
    return new Promise<PokemonHabitat>((resolve, reject) => {
      this.api
        .get<PokemonHabitat>(`${ENDPOINTS.POKEMON_HABITAT}/${name}`)
        .then((response: AxiosResponse<PokemonHabitat>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Pokemon Habitat by it's ID
   * @param id The Pokemon Habitat Form ID
   * @returns A Pokemon Habitat
   */
  public async getPokemonHabitatById(id: number): Promise<PokemonHabitat> {
    return new Promise<PokemonHabitat>((resolve, reject) => {
      this.api
        .get<PokemonHabitat>(`${ENDPOINTS.POKEMON_HABITAT}/${id}`)
        .then((response: AxiosResponse<PokemonHabitat>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Pokemon Shape by it's name
   * @param name The Pokemon Shape name
   * @returns A Pokemon Shape
   */
  public async getPokemonShapeByName(name: string): Promise<PokemonShape> {
    return new Promise<PokemonShape>((resolve, reject) => {
      this.api
        .get<PokemonShape>(`${ENDPOINTS.POKEMON_SHAPE}/${name}`)
        .then((response: AxiosResponse<PokemonShape>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Pokemon Shape by it's ID
   * @param id The Pokemon Shape Form ID
   * @returns A Pokemon Shape
   */
  public async getPokemonShapeById(id: number): Promise<PokemonShape> {
    return new Promise<PokemonShape>((resolve, reject) => {
      this.api
        .get<PokemonShape>(`${ENDPOINTS.POKEMON_SHAPE}/${id}`)
        .then((response: AxiosResponse<PokemonShape>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Pokemon Species by it's name
   * @param name The Pokemon Species name
   * @returns A Pokemon Species
   */
  public async getPokemonSpeciesByName(name: string): Promise<PokemonSpecies> {
    return new Promise<PokemonSpecies>((resolve, reject) => {
      this.api
        .get<PokemonSpecies>(`${ENDPOINTS.POKEMON_SPECIES}/${name}`)
        .then((response: AxiosResponse<PokemonSpecies>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Pokemon Species by it's ID
   * @param id The Pokemon Species Form ID
   * @returns A Pokemon Species
   */
  public async getPokemonSpeciesById(id: number): Promise<PokemonSpecies> {
    return new Promise<PokemonSpecies>((resolve, reject) => {
      this.api
        .get<PokemonSpecies>(`${ENDPOINTS.POKEMON_SPECIES}/${id}`)
        .then((response: AxiosResponse<PokemonSpecies>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Stat by it's name
   * @param name The Stat name
   * @returns A Stat
   */
  public async getStatByName(name: string): Promise<Stat> {
    return new Promise<Stat>((resolve, reject) => {
      this.api
        .get<Stat>(`${ENDPOINTS.STAT}/${name}`)
        .then((response: AxiosResponse<Stat>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Stat by it's ID
   * @param id The Stat ID
   * @returns A Stat
   */
  public async getStatById(id: number): Promise<Stat> {
    return new Promise<Stat>((resolve, reject) => {
      this.api
        .get<Stat>(`${ENDPOINTS.STAT}/${id}`)
        .then((response: AxiosResponse<Stat>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Type by it's name
   * @param name The Type name
   * @returns A Type
   */
  public async getTypeByName(name: string): Promise<Type> {
    return new Promise<Type>((resolve, reject) => {
      this.api
        .get<Type>(`${ENDPOINTS.TYPE}/${name}`)
        .then((response: AxiosResponse<Type>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * Get a Type by it's ID
   * @param id The Type ID
   * @returns A Type
   */
  public async getTypeById(id: number): Promise<Type> {
    return new Promise<Type>((resolve, reject) => {
      this.api
        .get<Type>(`${ENDPOINTS.TYPE}/${id}`)
        .then((response: AxiosResponse<Type>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Abilities
   * @param offset The first item that you will get
   * @param limit How many Abilities per page
   * @returns A list of Abilities
   */
  public async listAbilities(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = this.getListURL(ENDPOINTS.ABILITY, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Characteristics
   * @param offset The first item that you will get
   * @param limit How many Characteristics per page
   * @returns A list of Characteristics
   */
  public async listCharacteristics(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = this.getListURL(ENDPOINTS.CHARACTERISTIC, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Egg Groups
   * @param offset The first item that you will get
   * @param limit How many Egg Groups per page
   * @returns A list of Egg Groups
   */
  public async listEggGroups(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = this.getListURL(ENDPOINTS.EGG_GROUP, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Genders
   * @param offset The first item that you will get
   * @param limit How many Genders per page
   * @returns A list of Genders
   */
  public async listGenders(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = this.getListURL(ENDPOINTS.GENDER, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Growth Rates
   * @param offset The first item that you will get
   * @param limit How many Growth Rates per page
   * @returns A list of Growth Rates
   */
  public async listGrowthRates(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = this.getListURL(ENDPOINTS.GROWTH_RATE, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Natures
   * @param offset The first item that you will get
   * @param limit How many Growth Natures per page
   * @returns A list of Natures
   */
  public async listNatures(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = this.getListURL(ENDPOINTS.NATURE, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Pokeathlon Stats
   * @param offset The first item that you will get
   * @param limit How many Pokeathlon Stats per page
   * @returns A list of Pokeathlon Stats
   */
  public async listPokeathlonStats(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = this.getListURL(ENDPOINTS.POKEATHLON_STAT, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Pokemons
   * @param offset The first item that you will get
   * @param limit How many Pokemons Stats per page
   * @returns A list of Pokemons
   */
  public async listPokemons(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = this.getListURL(ENDPOINTS.POKEMON, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Pokemon Colors
   * @param offset The first item that you will get
   * @param limit How many Pokemon Colors per page
   * @returns A list of Pokemon Colors
   */
  public async listPokemonColors(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = this.getListURL(ENDPOINTS.POKEMON_COLOR, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Pokemon Forms
   * @param offset The first item that you will get
   * @param limit How many Pokemon Forms per page
   * @returns A list of Pokemon Forms
   */
  public async listPokemonForms(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = this.getListURL(ENDPOINTS.POKEMON_FORM, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Pokemon Habitats
   * @param offset The first item that you will get
   * @param limit How many Pokemon Habitats per page
   * @returns A list of Pokemon Habitats
   */
  public async listPokemonHabitats(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = this.getListURL(ENDPOINTS.POKEMON_HABITAT, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Pokemon Shapes
   * @param offset The first item that you will get
   * @param limit How many Pokemon Shapes per page
   * @returns A list of Pokemon Shapes
   */
  public async listPokemonShapes(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = this.getListURL(ENDPOINTS.POKEMON_SHAPE, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Pokemon Species
   * @param offset The first item that you will get
   * @param limit How many Pokemon Species per page
   * @returns A list of Pokemon Species
   */
  public async listPokemonSpecies(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = this.getListURL(ENDPOINTS.POKEMON_SPECIES, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Stats
   * @param offset The first item that you will get
   * @param limit How many Stats per page
   * @returns A list of Stats
   */
  public async listStats(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = this.getListURL(ENDPOINTS.STAT, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }

  /**
   * List Types
   * @param offset The first item that you will get
   * @param limit How many Types per page
   * @returns A list of Types
   */
  public async listTypes(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      const url = this.getListURL(ENDPOINTS.TYPE, offset, limit);
      this.api
        .get<NamedAPIResourceList>(url)
        .then((response: AxiosResponse<NamedAPIResourceList>) => resolve(response.data))
        .catch((error: AxiosError<string>) => reject(error));
    });
  }
}
