import { UtilityClient } from "@clients";
import { BASE_URL, LANGUAGES } from "@constants";

import { type EndpointCase, testEndpoints } from "../utils/stub-fetch";

describe("UtilityClient", () => {
  testEndpoints(UtilityClient, [
    ["getLanguageByName", (c) => c.getLanguageByName("ja-Hrkt"), "/language/ja-Hrkt"],
    ["getLanguageById", (c) => c.getLanguageById(LANGUAGES.JA_HRKT), "/language/1"],
    // Takes an absolute URL rather than an identifier, and the PokéAPI's own
    // links end in a slash the client has to drop.
    [
      "getResourceByUrl",
      (c) => c.getResourceByUrl(`${BASE_URL.REST}/pokemon/luxray/`),
      "/pokemon/luxray",
    ],
    ["listLanguages", (c) => c.listLanguages(20, 50), "/language?offset=20&limit=50"],
  ] satisfies EndpointCase<UtilityClient>[]);
});
