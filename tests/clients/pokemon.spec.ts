import { BASE_URL } from "@constants";
import { HttpResponse, http } from "msw";

import { PokemonClient } from "../../src/clients/pokemon.client";
import { server } from "../utils/setup";

describe("PokemonClient", () => {
  it("should address encounters as a path below the pokemon endpoint", async () => {
    const urls: string[] = [];

    server.use(
      http.get(`${BASE_URL.REST}/pokemon/25/encounters`, ({ request }) => {
        urls.push(request.url);
        return HttpResponse.json([]);
      }),
    );

    await expect(new PokemonClient().getPokemonLocationAreaById(25)).resolves.toEqual([]);
    expect(urls).toEqual([`${BASE_URL.REST}/pokemon/25/encounters`]);
  });
});
