import { expect, it, beforeAll, describe, expectTypeOf } from 'vitest';
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
import {
  EggGroups,
  Genders,
  GrowthRates,
  Natures,
  PokeathlonStats,
  PokemonColors,
  PokemonHabitats,
  PokemonShapes,
  Stats,
  Types,
} from '../constants';
import { PokemonClient } from '../clients';

describe('Pokemon Client', () => {
  let client: PokemonClient;
  beforeAll(() => {
    client = new PokemonClient();
  });

  // Pokemon Client
  it('check if the pokemon client was instantiated correctly', () => {
    expectTypeOf(client).toEqualTypeOf<PokemonClient>();
  });

  // Ability
  it('check if it returns an Ability passig a name', async () => {
    const data = await client.getAbilityByName('stench');

    expectTypeOf(data).toEqualTypeOf<Ability>();
    expect(data.id).toBe(1);
  });
  it('check if it returns an Ability passing an ID', async () => {
    const data = await client.getAbilityById(1);

    expectTypeOf(data).toEqualTypeOf<Ability>();
    expect(data.name).toBe('stench');
  });
  it('check if it returns a list of abilities', async () => {
    const data = await client.listAbilities();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });
  // Characteristic
  it('check if it returns a Characteristic passing an ID', async () => {
    const data = await client.getCharacteristicById(1);

    expectTypeOf(data).toEqualTypeOf<Characteristic>();
    expect(data.id).toBe(1);
  });
  it('check if it returns a list of Characteristics', async () => {
    const data = await client.listCharacteristics();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });
  // Egg Group
  it('check if it returns an Egg Group passig a name', async () => {
    const data = await client.getEggGroupByName('dragon');

    expectTypeOf(data).toEqualTypeOf<EggGroup>();
    expect(data.id).toBe(EggGroups.DRAGON);
  });
  it('check if it returns an Egg Group passing an ID', async () => {
    const data = await client.getEggGroupById(EggGroups.DITTO);

    expectTypeOf(data).toEqualTypeOf<EggGroup>();
    expect(data.name).toBe('ditto');
  });
  it('check if it returns a list of Egg Groups', async () => {
    const data = await client.listEggGroups();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });
  // Gender
  it('check if it returns a Gender passig a name', async () => {
    const data = await client.getGenderByName('male');

    expectTypeOf(data).toEqualTypeOf<Gender>();
    expect(data.id).toBe(Genders.MALE);
  });
  it('check if it returns a Gender passing an ID', async () => {
    const data = await client.getGenderById(Genders.FEMALE);

    expectTypeOf(data).toEqualTypeOf<Gender>();
    expect(data.name).toBe('female');
  });
  it('check if it returns a list of Genders', async () => {
    const data = await client.listGenders();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });
  // Growth Rate
  it('check if it returns a Growth Rate passing a name', async () => {
    const data = await client.getGrowthRateByName('medium');

    expectTypeOf(data).toEqualTypeOf<GrowthRate>();
    expect(data.id).toBe(GrowthRates.MEDIUM);
  });
  it('check if it returns a Growth Rate passing an ID', async () => {
    const data = await client.getGrowthRateById(GrowthRates.SLOW);

    expectTypeOf(data).toEqualTypeOf<GrowthRate>();
    expect(data.name).toBe('slow');
  });
  it('check if it returns a list of Growth Rates', async () => {
    const data = await client.listGrowthRates();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });
  // Nature
  it('check if it returns a Nature passing a name', async () => {
    const data = await client.getNatureByName('bashful');

    expectTypeOf(data).toEqualTypeOf<Nature>();
    expect(data.id).toBe(Natures.BASHFUL);
  });
  it('check if it returns a Nature passing an ID', async () => {
    const data = await client.getNatureById(13);

    expectTypeOf(data).toEqualTypeOf<Nature>();
    expect(data.id).toBe(Natures.BASHFUL);
  });
  it('check if it returns a Nature passing an ID', async () => {
    const data = await client.getGrowthRateById(GrowthRates.SLOW);

    expectTypeOf(data).toEqualTypeOf<GrowthRate>();
    expect(data.name).toBe('slow');
  });
  it('check if it returns a list of Natures', async () => {
    const data = await client.listNatures();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });
  // Pokeathlon Stat
  it('check if it returns a Pokeathlon Stat passing a name', async () => {
    const data = await client.getPokeathlonStatByName('power');

    expectTypeOf(data).toEqualTypeOf<PokeathlonStat>();
    expect(data.id).toBe(PokeathlonStats.POWER);
  });
  it('check if it returns a Pokeathlon Stat passing an ID', async () => {
    const data = await client.getPokeathlonStatById(PokeathlonStats.JUMP);

    expectTypeOf(data).toEqualTypeOf<PokeathlonStat>();
    expect(data.name).toBe('jump');
  });
  it('check if it returns a list of Pokeathlon Stats', async () => {
    const data = await client.listPokeathlonStats();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });
  // Pokemon
  it('check if it returns a Pokemon passing a name', async () => {
    const data = await client.getPokemonByName('luxray');

    expectTypeOf(data).toEqualTypeOf<Pokemon>();
    expect(data.name).toBe('luxray');
  });
  it('check if it returns a Pokemon passing an ID', async () => {
    const data = await client.getPokemonById(1);

    expectTypeOf(data).toEqualTypeOf<Pokemon>();
    expect(data.id).toBe(1);
  });
  it('check if it returns a Pokemon passing an ID', async () => {
    const data = await client.getPokeathlonStatById(PokeathlonStats.JUMP);

    expectTypeOf(data).toEqualTypeOf<PokeathlonStat>();
    expect(data.name).toBe('jump');
  });
  it('check if it returns a list of Pokemon', async () => {
    const data = await client.listPokemons();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });
  // Pokemon Location Areas
  it('check if it returns a Pokemon Location Area passing an ID', async () => {
    const data = await client.getPokemonLocationAreaById(1);

    expectTypeOf(data).toEqualTypeOf<LocationAreaEncounter[]>();
    expect(data.length).toBeGreaterThan(0);
  });
  // Pokemon Colors
  it('check if it returns a Pokemon Color passing a name', async () => {
    const data = await client.getPokemonColorByName('pink');

    expectTypeOf(data).toEqualTypeOf<PokemonColor>();
    expect(data.id).toBe(PokemonColors.PINK);
  });
  it('check if it returns a Pokemon Color passing an ID', async () => {
    const data = await client.getPokemonColorById(PokemonColors.BLUE);

    expectTypeOf(data).toEqualTypeOf<PokemonColor>();
    expect(data.name).toBe('blue');
  });
  it('check if it returns a list of Pokemon Colors', async () => {
    const data = await client.listPokemonColors();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });
  // Pokemon Forms
  it('check if it returns a Pokemon Form passing a name', async () => {
    const data = await client
      .getPokemonFormByName('bulbasaur')
      .then((response: PokemonForm) => response);

    expectTypeOf(data).toEqualTypeOf<PokemonForm>();
    expect(data.id).toBe(1);
  });
  it('check if it returns a Pokemon Form passing an ID', async () => {
    const data = await client.getPokemonFormById(1);

    expectTypeOf(data).toEqualTypeOf<PokemonForm>();
    expect(data.name).toBe('bulbasaur');
  });
  it('check if it returns a list of Pokemon Forms', async () => {
    const data = await client.listPokemonForms();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });
  // Pokemon Habitat
  it('check if it returns a Pokemon Habitat passing a name', async () => {
    const data = await client
      .getPokemonHabitatByName('forest')
      .then((response: PokemonHabitat) => response);

    expectTypeOf(data).toEqualTypeOf<PokemonHabitat>();
    expect(data.id).toBe(PokemonHabitats.FOREST);
  });
  it('check if it returns a Pokemon Habitat passing an ID', async () => {
    const data = await client
      .getPokemonHabitatById(PokemonHabitats.GRASSLAND)
      .then((response: PokemonHabitat) => response);

    expectTypeOf(data).toEqualTypeOf<PokemonHabitat>();
    expect(data.name).toBe('grassland');
  });
  it('check if it returns a list of Pokemon Habitats', async () => {
    const data = await client.listPokemonHabitats();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });
  // Pokemon Shape
  it('check if it returns a Pokemon Shape passing a name', async () => {
    const data = await client
      .getPokemonShapeByName('armor')
      .then((response: PokemonShape) => response);

    expectTypeOf(data).toEqualTypeOf<PokemonShape>();
    expect(data.id).toBe(PokemonShapes.ARMOR);
  });
  it('check if it returns a Pokemon Shape passing an ID', async () => {
    const data = await client
      .getPokemonShapeById(PokemonShapes.BLOB)
      .then((response: PokemonShape) => response);

    expectTypeOf(data).toEqualTypeOf<PokemonShape>();
    expect(data.name).toBe('blob');
  });
  it('check if it returns a list of Pokemon Shapes', async () => {
    const data = await client.listPokemonShapes();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });
  // Pokemon Species
  it('check if it returns a Pokemon Species passing a name', async () => {
    const data = await client.getPokemonSpeciesByName('ivysaur');

    expectTypeOf(data).toEqualTypeOf<PokemonSpecies>();
    expect(data.id).toBe(2);
  });
  it('check if it returns a Pokemon Species passing an ID', async () => {
    const data = await client.getPokemonSpeciesById(2);

    expectTypeOf(data).toEqualTypeOf<PokemonSpecies>();
    expect(data.name).toBe('ivysaur');
  });
  it('check if it returns a list of Pokemon Species', async () => {
    const data = await client.listPokemonSpecies();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });
  // Stat
  it('check if it returns a Stat passing a name', async () => {
    const data = await client.getStatByName('attack');

    expectTypeOf(data).toEqualTypeOf<Stat>();
    expect(data.id).toBe(Stats.ATTACK);
  });
  it('check if it returns a Stat passing an ID', async () => {
    const data = await client.getStatById(Stats.DEFENSE);

    expectTypeOf(data).toEqualTypeOf<Stat>();
    expect(data.name).toBe('defense');
  });
  it('check if it returns a list of Stats', async () => {
    const data = await client.listStats();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });
  // Types
  it('check if it returns a Type passing a name', async () => {
    const data = await client.getTypeByName('dark');

    expectTypeOf(data).toEqualTypeOf<Type>();
    expect(data.id).toBe(Types.DARK);
  });
  it('check if it returns a Type passing an ID', async () => {
    const data = await client.getTypeById(Types.ELECTRIC);

    expectTypeOf(data).toEqualTypeOf<Type>();
    expect(data.name).toBe('electric');
  });
  it('check if it returns a list of Types', async () => {
    const data = await client.listTypes();

    expectTypeOf(data).toEqualTypeOf<NamedAPIResourceList>();
    expect(data.results.length).toBeGreaterThan(0);
  });
});
