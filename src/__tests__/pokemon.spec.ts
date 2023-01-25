import { expect, test, it, beforeAll } from 'vitest';
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

test('Pokemon Client', () => {
  let client: PokemonClient;
  beforeAll(() => {
    client = new PokemonClient();
  });

  // Ability
  it('check if it returns an Ability passig a name', async () => {
    const data = await client.getAbilityByName('stench').then((response: Ability) => response);

    expect(data.id).toBe(1);
  });
  it('check if it returns an Ability passing an ID', async () => {
    const data = await client.getAbilityById(1).then((response: Ability) => response);

    expect(data.name).toBe('stench');
  });
  it('check if it returns a list of abilities', async () => {
    const data = await client.listAbilities().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Characteristic
  it('check if it returns a Characteristic passing an ID', async () => {
    const data = await client.getCharacteristicById(1).then((response: Characteristic) => response);

    expect(data.id).toBe(1);
  });
  it('check if it returns a list of Characteristics', async () => {
    const data = await client
      .listCharacteristics()
      .then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Egg Group
  it('check if it returns an Egg Group passig a name', async () => {
    const data = await client.getEggGroupByName('dragon').then((response: EggGroup) => response);

    expect(data.id).toBe(EggGroups.DRAGON);
  });
  it('check if it returns an Egg Group passing an ID', async () => {
    const data = await client
      .getEggGroupById(EggGroups.DITTO)
      .then((response: EggGroup) => response);

    expect(data.name).toBe('ditto');
  });
  it('check if it returns a list of Egg Groups', async () => {
    const data = await client.listEggGroups().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Gender
  it('check if it returns a Gender passig a name', async () => {
    const data = await client.getGenderByName('male').then((response: Gender) => response);

    expect(data.id).toBe(Genders.MALE);
  });
  it('check if it returns a Gender passing an ID', async () => {
    const data = await client.getGenderById(Genders.FEMALE).then((response: Gender) => response);

    expect(data.name).toBe('female');
  });
  it('check if it returns a list of Genders', async () => {
    const data = await client.listGenders().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Growth Rate
  it('check if it returns a Growth Rate passing a name', async () => {
    const data = await client
      .getGrowthRateByName('medium')
      .then((response: GrowthRate) => response);

    expect(data.id).toBe(GrowthRates.MEDIUM);
  });
  it('check if it returns a Growth Rate passing an ID', async () => {
    const data = await client
      .getGrowthRateById(GrowthRates.SLOW)
      .then((response: GrowthRate) => response);

    expect(data.name).toBe('slow');
  });
  it('check if it returns a list of Growth Rates', async () => {
    const data = await client.listGrowthRates().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Nature
  it('check if it returns a Nature passing a name', async () => {
    const data = await client.getNatureByName('bashful').then((response: Nature) => response);

    expect(data.id).toBe(Natures.BASHFUL);
  });
  it('check if it returns a Nature passing an ID', async () => {
    const data = await client
      .getGrowthRateById(GrowthRates.SLOW)
      .then((response: GrowthRate) => response);

    expect(data.name).toBe('slow');
  });
  it('check if it returns a list of Natures', async () => {
    const data = await client.listNatures().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Pokeathlon Stat
  it('check if it returns a Pokeathlon Stat passing a name', async () => {
    const data = await client
      .getPokeathlonStatByName('power')
      .then((response: PokeathlonStat) => response);

    expect(data.id).toBe(PokeathlonStats.POWER);
  });
  it('check if it returns a Pokeathlon Stat passing an ID', async () => {
    const data = await client
      .getPokeathlonStatById(PokeathlonStats.JUMP)
      .then((response: PokeathlonStat) => response);

    expect(data.name).toBe('jump');
  });
  it('check if it returns a list of Pokeathlon Stats', async () => {
    const data = await client
      .listPokeathlonStats()
      .then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Pokemon
  it('check if it returns a Pokemon passing a name', async () => {
    const data = await client.getPokemonByName('luxray').then((response: Pokemon) => response);

    expect(data.name).toBe('luxray');
  });
  it('check if it returns a Pokemon passing an ID', async () => {
    const data = await client
      .getPokeathlonStatById(PokeathlonStats.JUMP)
      .then((response: PokeathlonStat) => response);

    expect(data.name).toBe('jump');
  });
  it('check if it returns a list of Pokemon', async () => {
    const data = await client.listPokemons().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Pokemon Location Areas
  it('check if it returns a Pokemon Location Area passing an ID', async () => {
    const data = await client
      .getPokemonLocationAreaById(1)
      .then((response: LocationAreaEncounter[]) => response);

    expect(data.length).toBeGreaterThan(0);
  });
  // Pokemon Colors
  it('check if it returns a Pokemon Color passing a name', async () => {
    const data = await client
      .getPokemonColorByName('pink')
      .then((response: PokemonColor) => response);

    expect(data.id).toBe(PokemonColors.PINK);
  });
  it('check if it returns a Pokemon Color passing an ID', async () => {
    const data = await client
      .getPokemonColorById(PokemonColors.BLUE)
      .then((response: PokemonColor) => response);

    expect(data.name).toBe('blue');
  });
  it('check if it returns a list of Pokemon Colors', async () => {
    const data = await client
      .listPokemonColors()
      .then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Pokemon Forms
  it('check if it returns a Pokemon Form passing a name', async () => {
    const data = await client
      .getPokemonFormByName('bulbasaur')
      .then((response: PokemonForm) => response);

    expect(data.id).toBe(1);
  });
  it('check if it returns a Pokemon Form passing an ID', async () => {
    const data = await client.getPokemonFormById(1).then((response: PokemonForm) => response);

    expect(data.name).toBe('bulbasaur');
  });
  it('check if it returns a list of Pokemon Forms', async () => {
    const data = await client.listPokemonForms().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Pokemon Habitat
  it('check if it returns a Pokemon Habitat passing a name', async () => {
    const data = await client
      .getPokemonHabitatByName('forest')
      .then((response: PokemonHabitat) => response);

    expect(data.id).toBe(PokemonHabitats.FOREST);
  });
  it('check if it returns a Pokemon Habitat passing an ID', async () => {
    const data = await client
      .getPokemonHabitatById(PokemonHabitats.GRASSLAND)
      .then((response: PokemonHabitat) => response);

    expect(data.name).toBe('grassland');
  });
  it('check if it returns a list of Pokemon Habitats', async () => {
    const data = await client
      .listPokemonHabitats()
      .then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Pokemon Shape
  it('check if it returns a Pokemon Shape passing a name', async () => {
    const data = await client
      .getPokemonShapeByName('armor')
      .then((response: PokemonShape) => response);

    expect(data.id).toBe(PokemonShapes.ARMOR);
  });
  it('check if it returns a Pokemon Shape passing an ID', async () => {
    const data = await client
      .getPokemonShapeById(PokemonShapes.BLOB)
      .then((response: PokemonShape) => response);

    expect(data.name).toBe('blob');
  });
  it('check if it returns a list of Pokemon Shapes', async () => {
    const data = await client
      .listPokemonShapes()
      .then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Pokemon Species
  it('check if it returns a Pokemon Species passing a name', async () => {
    const data = await client
      .getPokemonSpeciesByName('ivysaur')
      .then((response: PokemonSpecies) => response);

    expect(data.id).toBe(2);
  });
  it('check if it returns a Pokemon Species passing an ID', async () => {
    const data = await client.getPokemonSpeciesById(2).then((response: PokemonSpecies) => response);

    expect(data.name).toBe('ivysaur');
  });
  it('check if it returns a list of Pokemon Species', async () => {
    const data = await client
      .listPokemonSpecies()
      .then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Stat
  it('check if it returns a Stat passing a name', async () => {
    const data = await client.getStatByName('attack').then((response: Stat) => response);

    expect(data.id).toBe(Stats.ATTACK);
  });
  it('check if it returns a Stat passing an ID', async () => {
    const data = await client.getStatById(Stats.DEFENSE).then((response: Stat) => response);

    expect(data.name).toBe('defense');
  });
  it('check if it returns a list of Stats', async () => {
    const data = await client.listStats().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Types
  it('check if it returns a Type passing a name', async () => {
    const data = await client.getTypeByName('dark').then((response: Type) => response);

    expect(data.id).toBe(Types.DARK);
  });
  it('check if it returns a Type passing an ID', async () => {
    const data = await client.getTypeById(Types.ELECTRIC).then((response: Type) => response);

    expect(data.name).toBe('electric');
  });
  it('check if it returns a list of Types', async () => {
    const data = await client.listTypes().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
});
