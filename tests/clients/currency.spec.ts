import { CurrencyClient } from "@clients";
import { CURRENCIES } from "@constants";

import { type EndpointCase, testEndpoints } from "../utils/stub-fetch";

describe("CurrencyClient", () => {
  testEndpoints(CurrencyClient, [
    ["getCurrencyByName", (c) => c.getCurrencyByName("poke-dollar"), "/currency/poke-dollar"],
    ["getCurrencyById", (c) => c.getCurrencyById(CURRENCIES.POKE_DOLLAR), "/currency/1"],
    ["listCurrencies", (c) => c.listCurrencies(20, 50), "/currency?offset=20&limit=50"],
  ] satisfies EndpointCase<CurrencyClient>[]);
});
