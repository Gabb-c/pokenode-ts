// Relative rather than through `@clients`, which does not export `base.ts`.
import type { ResourceLink } from "../clients/base";

/**
 * The trailing id of a PokéAPI resource URL, with or without the final slash.
 *
 * Signed: `move-ailment/-1` is the "unknown" ailment, and it is a resource the
 * API lists and serves like any other.
 */
const TRAILING_ID = /\/(-?\d+)\/?$/;

/**
 * The id inside a resource URL, without a request.
 *
 * ```ts
 * const page = await api.pokemon.listPokemons(0, 20);
 *
 * page.results.map((link) => getPokemonSpriteUrl(resourceId(link)));
 * ```
 *
 * A list page gives names and URLs and no ids, while the sprite repository is
 * keyed by id alone — this is what joins the two, and it is what lets a grid of
 * every Pokémon render off one list request instead of one request per card.
 *
 * The id is read off the URL rather than fetched, so it is only as good as the
 * link: a URL the API did not write is not promised to end in one.
 *
 * @param resource The link, as a URL or as the resource object carrying one.
 * @returns The id.
 * @throws {TypeError} If the URL does not end in an id.
 */
export const resourceId = (resource: ResourceLink<unknown>): number => {
  const url = typeof resource === "string" ? resource : resource.url;
  const match = TRAILING_ID.exec(url);

  if (match === null) {
    throw new TypeError(`No resource id in URL: ${url}`);
  }

  return Number(match[1]);
};
