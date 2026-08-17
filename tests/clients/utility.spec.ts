import { UtilityClient } from "@clients";
import { BASE_URL, LANGUAGES } from "@constants";
import type {
  Berry,
  BerryFirmness,
  EvolutionChain,
  Language,
  Machine,
  Move,
  NamedAPIResourceList,
  Pokemon,
  PokemonSpecies,
  Stat,
  Type,
  Version,
  VersionEncounterDetail,
} from "@models";

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

/*
 * A link knows what it points at, so following one needs no type argument. These
 * assertions never run a request — they fail at `pnpm typecheck` if inference
 * stops flowing from a model field to the resource it resolves to.
 */
describe("resource links", () => {
  const api = new UtilityClient();
  // Thunks, never invoked: `expectTypeOf` evaluates whatever it is handed, and
  // a call here would leave the suite issuing real requests.
  const follow = {
    species: () => api.getResourceByUrl({} as Pokemon["species"]),
    evolutionChain: () => api.getResourceByUrl({} as PokemonSpecies["evolution_chain"]),
    stat: () => api.getResourceByUrl({} as Pokemon["stats"][number]["stat"]),
    type: () => api.getResourceByUrl({} as Pokemon["types"][number]["type"]),
    named: () => api.getResourceByUrl<Pokemon>("https://pokeapi.co/api/v2/pokemon/1"),
    bare: () => api.getResourceByUrl("https://pokeapi.co/api/v2/pokemon/1"),
    languages: () => api.listLanguages(),
    // Outside the Pokémon models, and through a shape shared by every section.
    berryFirmness: () => api.getResourceByUrl({} as Berry["firmness"]),
    machineMove: () => api.getResourceByUrl({} as Machine["move"]),
    encounterVersion: () => api.getResourceByUrl({} as VersionEncounterDetail["version"]),
  };

  it("should infer the resource a link resolves to", () => {
    expectTypeOf(follow.species).returns.resolves.toEqualTypeOf<PokemonSpecies>();
    expectTypeOf(follow.evolutionChain).returns.resolves.toEqualTypeOf<EvolutionChain>();
    expectTypeOf(follow.stat).returns.resolves.toEqualTypeOf<Stat>();
    expectTypeOf(follow.type).returns.resolves.toEqualTypeOf<Type>();
    expectTypeOf(follow.berryFirmness).returns.resolves.toEqualTypeOf<BerryFirmness>();
    expectTypeOf(follow.machineMove).returns.resolves.toEqualTypeOf<Move>();
    expectTypeOf(follow.encounterVersion).returns.resolves.toEqualTypeOf<Version>();
  });

  it("should still take a bare url with the type named", () => {
    expectTypeOf(follow.named).returns.resolves.toEqualTypeOf<Pokemon>();
    // Without a link there is nothing to infer from.
    expectTypeOf(follow.bare).returns.resolves.toEqualTypeOf<unknown>();
  });

  it("should type the elements of a list", () => {
    expectTypeOf(follow.languages).returns.resolves.toEqualTypeOf<NamedAPIResourceList<Language>>();
  });
});
