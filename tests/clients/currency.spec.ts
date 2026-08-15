import { CurrencyClient } from "@clients";
import { CURRENCIES } from "@constants";

import { type EndpointCase, expectEndpoint } from "../utils/stub-fetch";

describe("CurrencyClient", () => {
  it.each([
    ["getCurrencyByName", "/currency/poke-dollar", (c) => c.getCurrencyByName("poke-dollar")],
    ["getCurrencyById", "/currency/1", (c) => c.getCurrencyById(CURRENCIES.POKE_DOLLAR)],
    ["listCurrencies", "/currency?offset=20&limit=50", (c) => c.listCurrencies(20, 50)],
  ] satisfies EndpointCase<CurrencyClient>[])(
    "%s should request %s",
    async (_method, path, call) => {
      await expectEndpoint(CurrencyClient, path, call);
    },
  );
});
