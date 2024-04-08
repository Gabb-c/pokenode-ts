import { beforeAll, describe, expect, it } from "vitest";

import { PokemonClient } from "../../src/clients";
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
} from "../../src/constants";

describe("Pokemon Client", () => {
  let client: PokemonClient;

  beforeAll(() => {
    client = new PokemonClient();
  });

  // Client
  it("(client) should be instantiated correctly", () => expect(client).toBeDefined());

  // Ability
  it("check if it returns an Ability passig a name", async () => {
    const data = await client.getAbilityByName("stench");

    expect(data.id).toBe(1);
  });

  it("check if it returns an Ability passing an ID", async () => {
    const data = await client.getAbilityById(1);

    expect(data.name).toBe("stench");
  });

  it("check if it returns a list of abilities", async () => {
    const data = await client.listAbilities();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Characteristic
  it("check if it returns a Characteristic passing an ID", async () => {
    const data = await client.getCharacteristicById(1);

    expect(data.id).toBe(1);
  });

  it("check if it returns a list of Characteristics", async () => {
    const data = await client.listCharacteristics();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Egg Group
  it("check if it returns an Egg Group passig a name", async () => {
    const data = await client.getEggGroupByName("dragon");

    expect(data.id).toBe(EGG_GROUPS.DRAGON);
  });

  it("check if it returns an Egg Group passing an ID", async () => {
    const data = await client.getEggGroupById(EGG_GROUPS.DITTO);

    expect(data.name).toBe("ditto");
  });

  it("check if it returns a list of Egg Groups", async () => {
    const data = await client.listEggGroups();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Gender
  it("check if it returns a Gender passig a name", async () => {
    const data = await client.getGenderByName("male");

    expect(data.id).toBe(GENDERS.MALE);
  });

  it("check if it returns a Gender passing an ID", async () => {
    const data = await client.getGenderById(GENDERS.FEMALE);

    expect(data.name).toBe("female");
  });

  it("check if it returns a list of Genders", async () => {
    const data = await client.listGenders();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Growth Rate
  it("check if it returns a Growth Rate passing a name", async () => {
    const data = await client.getGrowthRateByName("medium");

    expect(data.id).toBe(GROWTH_RATES.MEDIUM);
  });

  it("check if it returns a Growth Rate passing an ID", async () => {
    const data = await client.getGrowthRateById(GROWTH_RATES.SLOW);

    expect(data.name).toBe("slow");
  });

  it("check if it returns a list of Growth Rates", async () => {
    const data = await client.listGrowthRates();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Nature
  it("check if it returns a Nature passing a name", async () => {
    const data = await client.getNatureByName("bashful");

    expect(data.id).toBe(NATURES.BASHFUL);
  });

  it("check if it returns a Nature passing an ID", async () => {
    const data = await client.getNatureById(13);

    expect(data.id).toBe(NATURES.BASHFUL);
  });

  it("check if it returns a Nature passing an ID", async () => {
    const data = await client.getGrowthRateById(GROWTH_RATES.SLOW);

    expect(data.name).toBe("slow");
  });

  it("check if it returns a list of Natures", async () => {
    const data = await client.listNatures();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Pokeathlon Stat
  it("check if it returns a Pokeathlon Stat passing a name", async () => {
    const data = await client.getPokeathlonStatByName("power");

    expect(data.id).toBe(POKEATHLON_STATS.POWER);
  });

  it("check if it returns a Pokeathlon Stat passing an ID", async () => {
    const data = await client.getPokeathlonStatById(POKEATHLON_STATS.JUMP);

    expect(data.name).toBe("jump");
  });

  it("check if it returns a list of Pokeathlon Stats", async () => {
    const data = await client.listPokeathlonStats();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Pokemon
  it("check if it returns a Pokemon passing a name", async () => {
    const data = await client.getPokemonByName("luxray");

    expect(data.name).toBe("luxray");
  });

  it("check if it returns a Pokemon passing an ID", async () => {
    const data = await client.getPokemonById(1);

    expect(data.id).toBe(1);
  });

  it("check if it returns a Pokemon passing an ID", async () => {
    const data = await client.getPokeathlonStatById(POKEATHLON_STATS.JUMP);

    expect(data.name).toBe("jump");
  });

  it("check if it returns a list of Pokemon", async () => {
    const data = await client.listPokemons();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Pokemon Location Areas
  it("check if it returns a Pokemon Location Area passing an ID", async () => {
    const data = await client.getPokemonLocationAreaById(1);

    expect(data.length).toBeGreaterThan(0);
  });

  // Pokemon Colors
  it("check if it returns a Pokemon Color passing a name", async () => {
    const data = await client.getPokemonColorByName("pink");

    expect(data.id).toBe(POKEMON_COLORS.PINK);
  });

  it("check if it returns a Pokemon Color passing an ID", async () => {
    const data = await client.getPokemonColorById(POKEMON_COLORS.BLUE);

    expect(data.name).toBe("blue");
  });

  it("check if it returns a list of Pokemon Colors", async () => {
    const data = await client.listPokemonColors();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Pokemon Forms
  it("check if it returns a Pokemon Form passing a name", async () => {
    const data = await client.getPokemonFormByName("bulbasaur");

    expect(data.id).toBe(1);
  });

  it("check if it returns a Pokemon Form passing an ID", async () => {
    const data = await client.getPokemonFormById(1);

    expect(data.name).toBe("bulbasaur");
  });

  it("check if it returns a list of Pokemon Forms", async () => {
    const data = await client.listPokemonForms();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Pokemon Habitat
  it("check if it returns a Pokemon Habitat passing a name", async () => {
    const data = await client.getPokemonHabitatByName("forest");

    expect(data.id).toBe(POKEMON_HABITATS.FOREST);
  });

  it("check if it returns a Pokemon Habitat passing an ID", async () => {
    const data = await client.getPokemonHabitatById(POKEMON_HABITATS.GRASSLAND);

    expect(data.name).toBe("grassland");
  });

  it("check if it returns a list of Pokemon Habitats", async () => {
    const data = await client.listPokemonHabitats();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Pokemon Shape
  it("check if it returns a Pokemon Shape passing a name", async () => {
    const data = await client.getPokemonShapeByName("armor");

    expect(data.id).toBe(POKEMON_SHAPES.ARMOR);
  });

  it("check if it returns a Pokemon Shape passing an ID", async () => {
    const data = await client.getPokemonShapeById(POKEMON_SHAPES.BLOB);

    expect(data.name).toBe("blob");
  });

  it("check if it returns a list of Pokemon Shapes", async () => {
    const data = await client.listPokemonShapes();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Pokemon Species
  it("check if it returns a Pokemon Species passing a name", async () => {
    const data = await client.getPokemonSpeciesByName("ivysaur");

    expect(data.id).toBe(2);
  });

  it("check if it returns a Pokemon Species passing an ID", async () => {
    const data = await client.getPokemonSpeciesById(2);

    expect(data.name).toBe("ivysaur");
  });

  it("check if it returns a list of Pokemon Species", async () => {
    const data = await client.listPokemonSpecies();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Stat
  it("check if it returns a Stat passing a name", async () => {
    const data = await client.getStatByName("attack");

    expect(data.id).toBe(STATS.ATTACK);
  });

  it("check if it returns a Stat passing an ID", async () => {
    const data = await client.getStatById(STATS.DEFENSE);

    expect(data.name).toBe("defense");
  });

  it("check if it returns a list of Stats", async () => {
    const data = await client.listStats();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });

  // Types
  it("check if it returns a Type passing a name", async () => {
    const data = await client.getTypeByName("dark");

    expect(data.id).toBe(TYPES.DARK);
  });

  it("check if it returns a Type passing an ID", async () => {
    const data = await client.getTypeById(TYPES.ELECTRIC);

    expect(data.name).toBe("electric");
  });

  it("check if it returns a list of Types", async () => {
    const data = await client.listTypes();

    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(20);
  });
});
