import { PokemonClient } from "@clients";
import {
  EGG_GROUPS,
  GENDERS,
  GROWTH_RATES,
  NATURES,
  POKEATHLON_STATS,
  POKEMON_COLORS,
  POKEMON_HABITATS,
  POKEMON_SHAPES,
  STATS,
  TYPES,
} from "@constants";

import { type EndpointCase, expectEndpoint } from "../utils/stub-fetch";

describe("PokemonClient", () => {
  it.each([
    ["getAbilityByName", "/ability/stench", (c) => c.getAbilityByName("stench")],
    ["getAbilityById", "/ability/1", (c) => c.getAbilityById(1)],
    ["getCharacteristicById", "/characteristic/1", (c) => c.getCharacteristicById(1)],
    ["getEggGroupByName", "/egg-group/monster", (c) => c.getEggGroupByName("monster")],
    ["getEggGroupById", "/egg-group/1", (c) => c.getEggGroupById(EGG_GROUPS.MONSTER)],
    ["getGenderByName", "/gender/female", (c) => c.getGenderByName("female")],
    ["getGenderById", "/gender/1", (c) => c.getGenderById(GENDERS.FEMALE)],
    ["getGrowthRateByName", "/growth-rate/slow", (c) => c.getGrowthRateByName("slow")],
    ["getGrowthRateById", "/growth-rate/1", (c) => c.getGrowthRateById(GROWTH_RATES.SLOW)],
    ["getNatureByName", "/nature/hardy", (c) => c.getNatureByName("hardy")],
    ["getNatureById", "/nature/1", (c) => c.getNatureById(NATURES.HARDY)],
    [
      "getPokeathlonStatByName",
      "/pokeathlon-stat/speed",
      (c) => c.getPokeathlonStatByName("speed"),
    ],
    [
      "getPokeathlonStatById",
      "/pokeathlon-stat/1",
      (c) => c.getPokeathlonStatById(POKEATHLON_STATS.SPEED),
    ],
    ["getPokemonByName", "/pokemon/luxray", (c) => c.getPokemonByName("luxray")],
    ["getPokemonById", "/pokemon/405", (c) => c.getPokemonById(405)],
    // Addressed as a path below the endpoint, not as an identifier of its own.
    [
      "getPokemonLocationAreaById",
      "/pokemon/25/encounters",
      (c) => c.getPokemonLocationAreaById(25),
    ],
    ["getPokemonColorByName", "/pokemon-color/black", (c) => c.getPokemonColorByName("black")],
    ["getPokemonColorById", "/pokemon-color/1", (c) => c.getPokemonColorById(POKEMON_COLORS.BLACK)],
    ["getPokemonFormByName", "/pokemon-form/bulbasaur", (c) => c.getPokemonFormByName("bulbasaur")],
    ["getPokemonFormById", "/pokemon-form/1", (c) => c.getPokemonFormById(1)],
    ["getPokemonHabitatByName", "/pokemon-habitat/cave", (c) => c.getPokemonHabitatByName("cave")],
    [
      "getPokemonHabitatById",
      "/pokemon-habitat/1",
      (c) => c.getPokemonHabitatById(POKEMON_HABITATS.CAVE),
    ],
    ["getPokemonShapeByName", "/pokemon-shape/ball", (c) => c.getPokemonShapeByName("ball")],
    ["getPokemonShapeById", "/pokemon-shape/1", (c) => c.getPokemonShapeById(POKEMON_SHAPES.BALL)],
    [
      "getPokemonSpeciesByName",
      "/pokemon-species/bulbasaur",
      (c) => c.getPokemonSpeciesByName("bulbasaur"),
    ],
    ["getPokemonSpeciesById", "/pokemon-species/1", (c) => c.getPokemonSpeciesById(1)],
    ["getStatByName", "/stat/hp", (c) => c.getStatByName("hp")],
    ["getStatById", "/stat/1", (c) => c.getStatById(STATS.HP)],
    ["getTypeByName", "/type/normal", (c) => c.getTypeByName("normal")],
    ["getTypeById", "/type/1", (c) => c.getTypeById(TYPES.NORMAL)],
    ["listAbilities", "/ability?offset=20&limit=50", (c) => c.listAbilities(20, 50)],
    ["listCharacteristics", "/characteristic?offset=0&limit=20", (c) => c.listCharacteristics()],
    ["listEggGroups", "/egg-group?offset=0&limit=20", (c) => c.listEggGroups()],
    ["listGenders", "/gender?offset=0&limit=20", (c) => c.listGenders()],
    ["listGrowthRates", "/growth-rate?offset=0&limit=20", (c) => c.listGrowthRates()],
    ["listNatures", "/nature?offset=0&limit=20", (c) => c.listNatures()],
    ["listPokeathlonStats", "/pokeathlon-stat?offset=0&limit=20", (c) => c.listPokeathlonStats()],
    ["listPokemons", "/pokemon?offset=0&limit=20", (c) => c.listPokemons()],
    ["listPokemonColors", "/pokemon-color?offset=0&limit=20", (c) => c.listPokemonColors()],
    ["listPokemonForms", "/pokemon-form?offset=0&limit=20", (c) => c.listPokemonForms()],
    ["listPokemonHabitats", "/pokemon-habitat?offset=0&limit=20", (c) => c.listPokemonHabitats()],
    ["listPokemonShapes", "/pokemon-shape?offset=0&limit=20", (c) => c.listPokemonShapes()],
    ["listPokemonSpecies", "/pokemon-species?offset=0&limit=20", (c) => c.listPokemonSpecies()],
    ["listStats", "/stat?offset=0&limit=20", (c) => c.listStats()],
    ["listTypes", "/type?offset=0&limit=20", (c) => c.listTypes()],
  ] satisfies EndpointCase<PokemonClient>[])(
    "%s should request %s",
    async (_method, path, call) => {
      await expectEndpoint(PokemonClient, path, call);
    },
  );
});
