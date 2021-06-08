import {
  Berry,
  ContestType,
  EncounterMethod,
  EvolutionTrigger,
  Generation,
  Item,
  Location,
  Machine,
  Move,
  Pokemon,
} from '../models';
import {
  Berries,
  ContestTypes,
  EncounterMethods,
  EvolutionTriggers,
  Generations,
} from '../constants';
import { Pokenode } from '../clients';

describe('test Pokenode Client', () => {
  let client: Pokenode;
  beforeAll(() => {
    client = new Pokenode();
  });

  // Berry
  it('check if it returns a berry passig a name', async () => {
    const data = await client.berry.getBerryByName('cheri').then((response: Berry) => response);

    expect(data.id).toBe(Berries.CHERI);
  });
  // Contest
  it('check if it returns a contest type passig a name', async () => {
    const data = await client.contest
      .getContestTypeByName('cool')
      .then((response: ContestType) => response);

    expect(data.id).toBe(ContestTypes.COOL);
  });
  // Encounter
  it('check if it returns an encounter method passig a name', async () => {
    const data = await client.encounter
      .getEncounterMethodByName('surf')
      .then((response: EncounterMethod) => response);

    expect(data.id).toBe(EncounterMethods.SURF);
  });
  // Evolution
  it('check if it returns an evolution trigger method passig a name', async () => {
    const data = await client.evolution
      .getEvolutionTriggerByName('shed')
      .then((response: EvolutionTrigger) => response);

    expect(data.id).toBe(EvolutionTriggers.SHED);
  });
  // Game
  it('check if it returns a generation method passig a name', async () => {
    const data = await client.game
      .getGenerationByName('generation-i')
      .then((response: Generation) => response);

    expect(data.id).toBe(Generations.GENERATION_I);
  });
  // Item
  it('check if it returns an item passig a name', async () => {
    const data = await client.item.getItemByName('master-ball').then((response: Item) => response);

    expect(data.id).toBe(1);
  });
  // Location
  it('check if it returns a location passig a name', async () => {
    const data = await client.location
      .getLocationByName('canalave-city')
      .then((response: Location) => response);

    expect(data.id).toBe(1);
  });
  // Machine
  it('check if it returns a machine passig an ID', async () => {
    const data = await client.machine.getMachineById(1).then((response: Machine) => response);

    expect(data.id).toBe(1);
  });
  // Move
  it('check if it returns a move passig a name', async () => {
    const data = await client.move.getMoveByName('pound').then((response: Move) => response);

    expect(data.id).toBe(1);
  });
  // Pokemon
  it('check if it returns a pokemon passig a name', async () => {
    const data = await client.pokemon
      .getPokemonByName('luxray')
      .then((response: Pokemon) => response);

    expect(data.id).toBe(405);
  });
});
