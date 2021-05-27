import {
  Move,
  MoveAilment,
  MoveBattleStyle,
  MoveCategory,
  MoveDamageClass,
  MoveLearnMethod,
  MoveTarget,
  NamedAPIResourceList,
} from '../models';
import { MoveClient } from '../clients';
import {
  MoveAilmtents,
  MoveBattleStyles,
  MoveCategories,
  MoveDamageClasses,
  MoveLearnMethods,
  MoveTargets,
} from '../constants';

describe('Test Move Client', () => {
  let client: MoveClient;
  beforeAll(() => {
    client = new MoveClient();
  });

  // Move
  it('Check if it returns a move passing an ID', async () => {
    const data = await client.getMoveById(1).then((response: Move) => response);

    expect(data.name).toBe('pound');
  });
  it('Check if it returns a move passing a name', async () => {
    const data = await client.getMoveByName('pound').then((response: Move) => response);

    expect(data.name).toBe('pound');
  });
  it('Check if it returns a list of moves', async () => {
    const data = await client.listMoves().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Move Ailment
  it('Check if it returns a move ailment passing an ID', async () => {
    const data = await client
      .getMoveAilmentById(MoveAilmtents.CONFUSION)
      .then((response: MoveAilment) => response);

    expect(data.id).toBe(6);
  });
  it('Check if it returns a move ailment passing a name', async () => {
    const data = await client
      .getMoveAilmentByName('confusion')
      .then((response: MoveAilment) => response);

    expect(data.id).toBe(MoveAilmtents.CONFUSION);
  });
  it('Check if it returns a list of move ailments', async () => {
    const data = await client.listMoveAilments().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Move Battle Style
  it('Check if it returns a move battle style passing an ID', async () => {
    const data = await client
      .getMoveBattleStyleById(MoveBattleStyles.ATTACK)
      .then((response: MoveBattleStyle) => response);

    expect(data.id).toBe(1);
  });
  it('Check if it returns a move battle style ailment passing a name', async () => {
    const data = await client
      .getMoveBattleStyleByName('attack')
      .then((response: MoveBattleStyle) => response);

    expect(data.id).toBe(MoveBattleStyles.ATTACK);
  });
  it('Check if it returns a list of move battle styles', async () => {
    const data = await client
      .listMoveBattleStyles()
      .then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Move Category
  it('Check if it returns a move category passing an ID', async () => {
    const data = await client
      .getMoveCategoryById(MoveCategories.DAMAGE)
      .then((response: MoveCategory) => response);

    expect(data.name).toBe('damage');
  });
  it('Check if it returns a move category passing a name', async () => {
    const data = await client
      .getMoveCategoryByName('damage+heal')
      .then((response: MoveCategory) => response);

    expect(data.id).toBe(MoveCategories.DAMAGE_HEAL);
  });
  it('Check if it returns a list of move categories', async () => {
    const data = await client
      .listMoveCategories()
      .then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Move Damage Class
  it('Check if it returns a move damage class passing an ID', async () => {
    const data = await client
      .getMoveDamageClassById(MoveDamageClasses.PHYSICAL)
      .then((response: MoveDamageClass) => response);

    expect(data.name).toBe('physical');
  });
  it('Check if it returns a move damage class passing a name', async () => {
    const data = await client
      .getMoveDamageClassByName('special')
      .then((response: MoveDamageClass) => response);

    expect(data.id).toBe(MoveDamageClasses.SPECIAL);
  });
  it('Check if it returns a list of move damage classes', async () => {
    const data = await client
      .listMoveCategories()
      .then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Move Learn Method
  it('Check if it returns a move learn method passing an ID', async () => {
    const data = await client
      .getMoveLearnMethodById(MoveLearnMethods.MACHINE)
      .then((response: MoveLearnMethod) => response);

    expect(data.name).toBe('machine');
  });
  it('Check if it returns a move learn method passing a name', async () => {
    const data = await client
      .getMoveLearnMethodByName('machine')
      .then((response: MoveLearnMethod) => response);

    expect(data.id).toBe(MoveLearnMethods.MACHINE);
  });
  it('Check if it returns a list of move learn methods', async () => {
    const data = await client
      .listMoveLearnMethods()
      .then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Move Target
  it('Check if it returns a move target passing an ID', async () => {
    const data = await client
      .getMoveTargetById(MoveTargets.ALLY)
      .then((response: MoveTarget) => response);

    expect(data.name).toBe('ally');
  });
  it('Check if it returns a move target passing a name', async () => {
    const data = await client.getMoveTargetByName('ally').then((response: MoveTarget) => response);

    expect(data.id).toBe(MoveTargets.ALLY);
  });
  it('Check if it returns a list of move targets', async () => {
    const data = await client.listMoveTargets().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
});
