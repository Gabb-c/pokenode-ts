import { UtilityClient } from "@clients";
import { LANGUAGES } from "@constants";

/**
 * Tier 3, alongside `drift.live.spec.ts`: the name→ID maps in `src/constants`
 * are a copy of upstream data, and a copy is a thing that goes stale.
 *
 * `drift.live.spec.ts` watches response *shapes*; nothing watched the ids. They
 * are the one place a silent wrong answer is possible — an id that has moved or
 * never existed is a 404 at runtime, and `LANGUAGES` sat one language behind the
 * API long enough for the docs to describe a constant the code did not have.
 *
 * Languages are the whole of it for now: the set is small, closed, and the only
 * one of these maps the API publishes as a listable endpoint.
 */

describe("LANGUAGES", () => {
  it("should match the ids the API publishes", async () => {
    const client = new UtilityClient();
    const listed = new Map<string, number>();

    for await (const language of client.paginate("listLanguages", { resolve: true })) {
      listed.set(language.name, language.id);
    }

    // Keyed by name rather than by constant: a language the API has and this map
    // does not is the drift that actually happened, and comparing whole maps is
    // what catches it.
    const declared = Object.fromEntries(
      Object.entries(LANGUAGES).map(([key, id]) => [key.toLowerCase().replace(/_/g, "-"), id]),
    );

    expect(declared).toEqual(Object.fromEntries(listed));
  });
});
