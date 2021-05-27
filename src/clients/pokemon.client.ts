/* eslint-disable import/prefer-default-export */

import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
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
} from '../models';
import client from '../config/axios';
import { Endpoints } from '../constants';

export class PokemonClient {
  private api: AxiosInstance = client;

  /**
   * Get an Ability by it's name
   * @param name The Ability name
   * @returns An Ability
   */
  public getAbilityByName(name: string): Promise<Ability> {
    return new Promise<Ability>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Ability}/${name}`)
        .then((response: AxiosResponse<Ability>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get an Ability by it's ID
   * @param id The Ability ID
   * @returns An Ability
   */
  public getAbilityById(id: number): Promise<Ability> {
    return new Promise<Ability>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Ability}/${id}`)
        .then((response: AxiosResponse<Ability>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Characteristic by it's ID
   * @param id The Characteristic ID
   * @returns A Characteristic
   */
  public getCharacteristicById(id: number): Promise<Characteristic> {
    return new Promise<Characteristic>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Characteristic}/${id}`)
        .then((response: AxiosResponse<Characteristic>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get an Egg Group by it's name
   * @param name The Egg Group name
   * @returns An Egg Group
   */
  public getEggGroupByName(name: string): Promise<EggGroup> {
    return new Promise<EggGroup>((resolve, reject) => {
      this.api
        .get(`${Endpoints.EggGroup}/${name}`)
        .then((response: AxiosResponse<EggGroup>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get an Egg Group by it's ID
   * @param id The Egg Group ID
   * @returns An Egg Group
   */
  public getEggGroupById(id: number): Promise<EggGroup> {
    return new Promise<EggGroup>((resolve, reject) => {
      this.api
        .get(`${Endpoints.EggGroup}/${id}`)
        .then((response: AxiosResponse<EggGroup>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Gender by it's name
   * @param name The gender name
   * @returns An Egg Group
   */
  public getGenderByName(name: string): Promise<Gender> {
    return new Promise<Gender>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Gender}/${name}`)
        .then((response: AxiosResponse<Gender>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Gender by it's ID
   * @param id The Gender ID
   * @returns A Gender
   */
  public getGenderById(id: number): Promise<Gender> {
    return new Promise<Gender>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Gender}/${id}`)
        .then((response: AxiosResponse<Gender>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Growth Rate by it's name
   * @param name The Growth Rate name
   * @returns A Growth Rate
   */
  public getGrowthRateByName(name: string): Promise<GrowthRate> {
    return new Promise<GrowthRate>((resolve, reject) => {
      this.api
        .get(`${Endpoints.GrowthRate}/${name}`)
        .then((response: AxiosResponse<GrowthRate>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Growth Rate by it's ID
   * @param id The Growth Rate ID
   * @returns A Growth Rate
   */
  public getGrowthRateById(id: number): Promise<GrowthRate> {
    return new Promise<GrowthRate>((resolve, reject) => {
      this.api
        .get(`${Endpoints.GrowthRate}/${id}`)
        .then((response: AxiosResponse<GrowthRate>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Nature by it's name
   * @param name The Nature name
   * @returns A Nature
   */
  public getNatureByName(name: string): Promise<Nature> {
    return new Promise<Nature>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Nature}/${name}`)
        .then((response: AxiosResponse<Nature>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Nature by it's ID
   * @param id The Nature ID
   * @returns A Nature
   */
  public getNatureById(id: number): Promise<Nature> {
    return new Promise<Nature>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Nature}/${id}`)
        .then((response: AxiosResponse<Nature>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Pokeathlon Stat by it's name
   * @param name The Pokeathlon Stat name
   * @returns A Pokeathlon Stat
   */
  public getPokeathlonStatByName(name: string): Promise<PokeathlonStat> {
    return new Promise<PokeathlonStat>((resolve, reject) => {
      this.api
        .get(`${Endpoints.PokeathlonStat}/${name}`)
        .then((response: AxiosResponse<PokeathlonStat>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Pokeathlon Stat by it's ID
   * @param id The Pokeathlon Stat ID
   * @returns A Pokeathlon Stat
   */
  public getPokeathlonStatById(id: number): Promise<PokeathlonStat> {
    return new Promise<PokeathlonStat>((resolve, reject) => {
      this.api
        .get(`${Endpoints.PokeathlonStat}/${id}`)
        .then((response: AxiosResponse<PokeathlonStat>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Pokemon by it's name
   * @param name The Pokemon name
   * @returns A Pokemon Stat
   */
  public getPokemonByName(name: string): Promise<Pokemon> {
    return new Promise<Pokemon>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Pokemon}/${name}`)
        .then((response: AxiosResponse<Pokemon>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Pokemon by it's ID
   * @param id The Pokemon ID
   * @returns A Pokemon
   */
  public getPokemonById(id: number): Promise<Pokemon> {
    return new Promise<Pokemon>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Pokemon}/${id}`)
        .then((response: AxiosResponse<Pokemon>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Pokemon Location Area by it's ID
   * @param id The Pokemon Location Area ID
   * @returns A Pokemon Location Area
   */
  public getPokemonLocationAreaById(id: number): Promise<LocationAreaEncounter[]> {
    return new Promise<LocationAreaEncounter[]>((resolve, reject) => {
      this.api
        .get(`${Endpoints.PokemonLocationArea.replace(':id', id.toString())}`)
        .then((response: AxiosResponse<LocationAreaEncounter[]>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Pokemon Color by it's name
   * @param name The Pokemon Color name
   * @returns A Pokemon Color
   */
  public getPokemonColorByName(name: string): Promise<PokemonColor> {
    return new Promise<PokemonColor>((resolve, reject) => {
      this.api
        .get(`${Endpoints.PokemonColor}/${name}`)
        .then((response: AxiosResponse<PokemonColor>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Pokemon Color by it's ID
   * @param id The Pokemon Color ID
   * @returns A Pokemon Color
   */
  public getPokemonColorById(id: number): Promise<PokemonColor> {
    return new Promise<PokemonColor>((resolve, reject) => {
      this.api
        .get(`${Endpoints.PokemonColor}/${id}`)
        .then((response: AxiosResponse<PokemonColor>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Pokemon Form by it's name
   * @param name The Pokemon Form name
   * @returns A Pokemon Form
   */
  public getPokemonFormByName(name: string): Promise<PokemonForm> {
    return new Promise<PokemonForm>((resolve, reject) => {
      this.api
        .get(`${Endpoints.PokemonForm}/${name}`)
        .then((response: AxiosResponse<PokemonForm>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Pokemon Form by it's ID
   * @param id The Pokemon Form ID
   * @returns A Pokemon Form
   */
  public getPokemonFormById(id: number): Promise<PokemonForm> {
    return new Promise<PokemonForm>((resolve, reject) => {
      this.api
        .get(`${Endpoints.PokemonForm}/${id}`)
        .then((response: AxiosResponse<PokemonForm>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Pokemon Habitat by it's name
   * @param name The Pokemon Habitat name
   * @returns A Pokemon Habitat
   */
  public getPokemonHabitatByName(name: string): Promise<PokemonHabitat> {
    return new Promise<PokemonHabitat>((resolve, reject) => {
      this.api
        .get(`${Endpoints.PokemonHabitat}/${name}`)
        .then((response: AxiosResponse<PokemonHabitat>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Pokemon Habitat by it's ID
   * @param id The Pokemon Habitat Form ID
   * @returns A Pokemon Habitat
   */
  public getPokemonHabitatById(id: number): Promise<PokemonHabitat> {
    return new Promise<PokemonHabitat>((resolve, reject) => {
      this.api
        .get(`${Endpoints.PokemonHabitat}/${id}`)
        .then((response: AxiosResponse<PokemonHabitat>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Pokemon Shape by it's name
   * @param name The Pokemon Shape name
   * @returns A Pokemon Shape
   */
  public getPokemonShapeByName(name: string): Promise<PokemonShape> {
    return new Promise<PokemonShape>((resolve, reject) => {
      this.api
        .get(`${Endpoints.PokemonShape}/${name}`)
        .then((response: AxiosResponse<PokemonShape>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Pokemon Shape by it's ID
   * @param id The Pokemon Shape Form ID
   * @returns A Pokemon Shape
   */
  public getPokemonShapeById(id: number): Promise<PokemonShape> {
    return new Promise<PokemonShape>((resolve, reject) => {
      this.api
        .get(`${Endpoints.PokemonShape}/${id}`)
        .then((response: AxiosResponse<PokemonShape>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Pokemon Species by it's name
   * @param name The Pokemon Species name
   * @returns A Pokemon Species
   */
  public getPokemonSpeciesByName(name: string): Promise<PokemonSpecies> {
    return new Promise<PokemonSpecies>((resolve, reject) => {
      this.api
        .get(`${Endpoints.PokemonSpecies}/${name}`)
        .then((response: AxiosResponse<PokemonSpecies>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Pokemon Species by it's ID
   * @param id The Pokemon Species Form ID
   * @returns A Pokemon Species
   */
  public getPokemonSpeciesById(id: number): Promise<PokemonSpecies> {
    return new Promise<PokemonSpecies>((resolve, reject) => {
      this.api
        .get(`${Endpoints.PokemonSpecies}/${id}`)
        .then((response: AxiosResponse<PokemonSpecies>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Stat by it's name
   * @param name The Stat name
   * @returns A Stat
   */
  public getStatByName(name: string): Promise<Stat> {
    return new Promise<Stat>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Stat}/${name}`)
        .then((response: AxiosResponse<Stat>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Stat by it's ID
   * @param id The Stat ID
   * @returns A Stat
   */
  public getStatById(id: number): Promise<Stat> {
    return new Promise<Stat>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Stat}/${id}`)
        .then((response: AxiosResponse<Stat>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Type by it's name
   * @param name The Type name
   * @returns A Type
   */
  public getTypeByName(name: string): Promise<Type> {
    return new Promise<Type>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Type}/${name}`)
        .then((response: AxiosResponse<Type>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * Get a Type by it's ID
   * @param id The Type ID
   * @returns A Type
   */
  public getTypeById(id: number): Promise<Type> {
    return new Promise<Type>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Type}/${id}`)
        .then((response: AxiosResponse<Type>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Abilities
   * @param offset The first item that you will get
   * @param limit How many Abilities per page
   * @returns A list of Abilities
   */
  public listAbilities(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Ability}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Characteristics
   * @param offset The first item that you will get
   * @param limit How many Characteristics per page
   * @returns A list of Characteristics
   */
  public listCharacteristics(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Characteristic}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Egg Groups
   * @param offset The first item that you will get
   * @param limit How many Egg Groups per page
   * @returns A list of Egg Groups
   */
  public listEggGroups(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.EggGroup}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Genders
   * @param offset The first item that you will get
   * @param limit How many Genders per page
   * @returns A list of Genders
   */
  public listGenders(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Gender}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Growth Rates
   * @param offset The first item that you will get
   * @param limit How many Growth Rates per page
   * @returns A list of Growth Rates
   */
  public listGrowthRates(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.GrowthRate}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Natures
   * @param offset The first item that you will get
   * @param limit How many Growth Natures per page
   * @returns A list of Natures
   */
  public listNatures(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Nature}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Pokeathlon Stats
   * @param offset The first item that you will get
   * @param limit How many Pokeathlon Stats per page
   * @returns A list of Pokeathlon Stats
   */
  public listPokeathlonStats(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.PokeathlonStat}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Pokemons
   * @param offset The first item that you will get
   * @param limit How many Pokemons Stats per page
   * @returns A list of Pokemons
   */
  public listPokemons(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Pokemon}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Pokemon Colors
   * @param offset The first item that you will get
   * @param limit How many Pokemon Colors per page
   * @returns A list of Pokemon Colors
   */
  public listPokemonColors(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.PokemonColor}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Pokemon Forms
   * @param offset The first item that you will get
   * @param limit How many Pokemon Forms per page
   * @returns A list of Pokemon Forms
   */
  public listPokemonForms(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.PokemonForm}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Pokemon Habitats
   * @param offset The first item that you will get
   * @param limit How many Pokemon Habitats per page
   * @returns A list of Pokemon Habitats
   */
  public listPokemonHabitats(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.PokemonHabitat}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Pokemon Shapes
   * @param offset The first item that you will get
   * @param limit How many Pokemon Shapes per page
   * @returns A list of Pokemon Shapes
   */
  public listPokemonShapes(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.PokemonShape}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Pokemon Species
   * @param offset The first item that you will get
   * @param limit How many Pokemon Species per page
   * @returns A list of Pokemon Species
   */
  public listPokemonSpecies(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.PokemonSpecies}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Stats
   * @param offset The first item that you will get
   * @param limit How many Stats per page
   * @returns A list of Stats
   */
  public listStats(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Stat}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }

  /**
   * List Types
   * @param offset The first item that you will get
   * @param limit How many Types per page
   * @returns A list of Types
   */
  public listTypes(offset?: number, limit?: number): Promise<NamedAPIResourceList> {
    return new Promise<NamedAPIResourceList>((resolve, reject) => {
      this.api
        .get(`${Endpoints.Type}?offset=${offset}&limit=${limit}`)
        .then((response: AxiosResponse<NamedAPIResourceList>) => {
          resolve(response.data);
        })
        .catch((error: AxiosError<string>) => {
          reject(error);
        });
    });
  }
}
