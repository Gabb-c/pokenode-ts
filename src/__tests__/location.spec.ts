import { expect, test, it, beforeAll } from 'vitest';
import { Location, LocationArea, PalParkArea, Region, NamedAPIResourceList } from '../models';
import { PalParkAreas, Regions } from '../constants';
import { LocationClient } from '../clients';

test('Location Client', () => {
  let client: LocationClient;
  beforeAll(() => {
    client = new LocationClient();
  });

  // Location
  it('check if it returns a location passig a name', async () => {
    const data = await client
      .getLocationByName('canalave-city')
      .then((response: Location) => response);

    expect(data.id).toBe(1);
  });
  it('check if it returns a location passing an ID', async () => {
    const data = await client.getLocationById(1).then((response: Location) => response);

    expect(data.name).toBe('canalave-city');
  });
  it('check if it returns a list of locations', async () => {
    const data = await client.listLocations().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Location Area
  it('check if it returns a location area passig a name', async () => {
    const data = await client
      .getLocationAreaByName('canalave-city-area')
      .then((response: LocationArea) => response);

    expect(data.id).toBe(1);
  });
  it('check if it returns a location area passing an ID', async () => {
    const data = await client.getLocationAreaById(1).then((response: LocationArea) => response);

    expect(data.name).toBe('canalave-city-area');
  });
  it('check if it returns a list of location areas', async () => {
    const data = await client
      .listLocationAreas()
      .then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Pal Park Area
  it('check if it returns a pal park area passig a name', async () => {
    const data = await client
      .getPalParkAreaByName('forest')
      .then((response: PalParkArea) => response);

    expect(data.id).toBe(PalParkAreas.FOREST);
  });
  it('check if it returns a pal park area passing an ID', async () => {
    const data = await client
      .getPalParkAreaById(PalParkAreas.FOREST)
      .then((response: PalParkArea) => response);

    expect(data.name).toBe('forest');
  });
  it('check if it returns a list of pal park areas', async () => {
    const data = await client.listPalParkAreas().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
  // Regions
  it('check if it returns a region passig a name', async () => {
    const data = await client.getRegionByName('kanto').then((response: Region) => response);

    expect(data.id).toBe(Regions.KANTO);
  });
  it('check if it returns a region passing an ID', async () => {
    const data = await client.getRegionById(Regions.KANTO).then((response: Region) => response);

    expect(data.name).toBe('kanto');
  });
  it('check if it returns a list of regions', async () => {
    const data = await client.listRegions().then((response: NamedAPIResourceList) => response);

    expect(data.results.length).toBeGreaterThan(0);
  });
});
