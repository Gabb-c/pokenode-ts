import { BerryClient } from "@clients";
import { BERRIES, BERRY_FIRMNESSES, BERRY_FLAVORS } from "@constants";
import {
  MOCK_BERRY,
  MOCK_BERRY_FIRMNESS,
  MOCK_BERRY_FIRMNESS_LIST,
  MOCK_BERRY_FLAVOR,
  MOCK_BERRY_FLAVOR_LIST,
  MOCK_BERRY_LIST,
} from "./mocks/data";

describe("Berry Client", () => {
  let client: BerryClient;

  beforeAll(() => {
    client = new BerryClient();
  });

  // Client
  it("should be instantiated correctly", () => expect(client).toBeDefined());

  it("should fetch a berry by ID/Name and return the correct data", async () => {
    await expect(client.getBerryByName("cheri")).resolves.toEqual(MOCK_BERRY);
    await expect(client.getBerryById(BERRIES.CHERI)).resolves.toEqual(MOCK_BERRY);
  });

  it("should fetch a list of berries and return valid results", async () => {
    await expect(client.listBerries()).resolves.toEqual(MOCK_BERRY_LIST);
  });

  // Berry Firmness Tests
  it("should fetch a berry firmness by name and return the correct data", async () => {
    await expect(client.getBerryFirmnessById(BERRY_FIRMNESSES.VERY_SOFT)).resolves.toEqual(
      MOCK_BERRY_FIRMNESS,
    );
    await expect(client.getBerryFirmnessByName("very-soft")).resolves.toEqual(MOCK_BERRY_FIRMNESS);
  });

  it("should fetch a list of berry firmnesses and return valid results", async () => {
    await expect(client.listBerryFirmnesses()).resolves.toEqual(MOCK_BERRY_FIRMNESS_LIST);
  });

  // Berry Flavor Tests
  it("should fetch a berry flavor by name and return the correct data", async () => {
    await expect(client.getBerryFlavorById(BERRY_FLAVORS.SPICY)).resolves.toEqual(
      MOCK_BERRY_FLAVOR,
    );
    await expect(client.getBerryFlavorByName("spicy")).resolves.toEqual(MOCK_BERRY_FLAVOR);
  });

  it("should fetch a list of berry flavors and return valid results", async () => {
    await expect(client.listBerryFlavors()).resolves.toEqual(MOCK_BERRY_FLAVOR_LIST);
  });

  // Berry - Edge Cases and Errors
  it("should handle fetching a non-existing berry by name with an error", async () => {
    await expect(client.getBerryByName("nonexistentberry")).rejects.toThrow();
  });

  it("should handle fetching a non-existing berry by negative ID with an error", async () => {
    await expect(client.getBerryById(-1)).rejects.toThrow();
  });

  // Berry Firmness - Edge Cases and Errors
  it("should handle fetching a non-existing berry firmness by name with an error", async () => {
    await expect(client.getBerryFirmnessByName("nonexistentfirmness")).rejects.toThrow();
  });

  it("should handle fetching a non-existing berry firmness by negative ID with an error", async () => {
    await expect(client.getBerryFirmnessById(-1)).rejects.toThrow();
  });

  // Berry Flavor - Edge Cases and Errors
  it("should handle fetching a non-existing berry flavor by name with an error", async () => {
    await expect(client.getBerryFlavorByName("nonexistentflavor")).rejects.toThrow();
  });

  it("should handle fetching a non-existing berry flavor by negative ID with an error", async () => {
    await expect(client.getBerryFlavorById(-1)).rejects.toThrow();
  });

  // Common Error Scenarios
  it("should handle API errors while fetching a berry with an error", async () => {
    await expect(client.getBerryByName("errorberry")).rejects.toThrow();
  });

  it("should handle API errors while fetching berry firmness with an error", async () => {
    await expect(client.getBerryFirmnessById(999)).rejects.toThrow();
  });

  it("should handle API errors while fetching berry flavors with an error", async () => {
    await expect(client.getBerryFlavorByName("errorflavor")).rejects.toThrow();
  });
});
