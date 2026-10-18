import { CurrencyClient } from "@clients";
import { CURRENCIES } from "@constants";

import { type EndpointCase, expectEndpoint, expectEveryMethodCovered } from "../helpers/stub-fetch";

const CASES = [
  ["getCurrencyByName", "/currency/poke-dollar", (c) => c.getCurrencyByName("poke-dollar")],
  ["getCurrencyById", "/currency/1", (c) => c.getCurrencyById(CURRENCIES.POKE_DOLLAR)],
  ["listCurrencies", "/currency?offset=20&limit=50", (c) => c.listCurrencies(20, 50)],
] satisfies EndpointCase<CurrencyClient>[];

describe("CurrencyClient", () => {
  it.each(CASES)("%s should request %s", async (_method, path, call) => {
    await expectEndpoint(CurrencyClient, path, call);
  });

  it("should cover every endpoint method", () => {
    expectEveryMethodCovered(CurrencyClient, CASES);
  });
});
