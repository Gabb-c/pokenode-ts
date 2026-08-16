import { UtilityClient } from "@clients";
import { BASE_URL, LANGUAGES } from "@constants";

import { type EndpointCase, expectEndpoint } from "../helpers/stub-fetch";

describe("UtilityClient", () => {
  it.each([
    ["getLanguageByName", "/language/ja-Hrkt", (c) => c.getLanguageByName("ja-Hrkt")],
    ["getLanguageById", "/language/1", (c) => c.getLanguageById(LANGUAGES.JA_HRKT)],
    // Takes an absolute URL rather than an identifier, and the PokéAPI's own
    // links end in a slash the client has to drop.
    [
      "getResourceByUrl",
      "/pokemon/luxray",
      (c) => c.getResourceByUrl(`${BASE_URL.REST}/pokemon/luxray/`),
    ],
    ["listLanguages", "/language?offset=20&limit=50", (c) => c.listLanguages(20, 50)],
  ] satisfies EndpointCase<UtilityClient>[])(
    "%s should request %s",
    async (_method, path, call) => {
      await expectEndpoint(UtilityClient, path, call);
    },
  );
});
