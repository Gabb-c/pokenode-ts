import { LISTS, NESTED, RESOURCES, SPRITES } from "../helpers/drift-cases";
import { mistypedFields, sortKeys } from "../helpers/model-keys";

/**
 * Tier 3: the only suite that talks to the real PokéAPI.
 *
 * It exists to answer one question the hermetic suites structurally cannot —
 * *has the upstream response shape changed?* — so it asserts the key set of one
 * stable resource per model rather than any particular value. A failure here is
 * upstream drift, and means `src/models` is out of date; it is not a regression
 * in the client.
 *
 * A case names a model and says how to fetch one. The keys it expects are read
 * out of `src/models` by `caseFor`, so there is no list here to fall out of step
 * with a type: a model that gains a field needs no edit to this file. The
 * compiler checks that the fetch really does return the model named.
 *
 * Coverage is deliberately total: every endpoint in `src/constants/endpoints.ts`
 * has a case, and so does every shape reachable from one. A model with no case
 * is a model that can drift silently, which is the one failure mode this tier
 * exists to prevent, so `tests/live/coverage.spec.ts` fails the unit
 * tier when one is missing. That the endpoint list itself is complete is
 * `constants.live.spec.ts`'s question — it is a constant, not a model.
 *
 * Key sets and the coarse kind of each field are what this checks:
 * {@link mistypedFields} catches a `number` arriving as a string or as `null`
 * against an annotation that does not allow it. What it does not check is
 * *which* value arrived — that is `values.live.spec.ts`, and only for the fields
 * declared as a union of literals. Asserting ordinary values here would fail on
 * every content update upstream, which is the worse deal.
 *
 * The cases live in `tests/helpers/drift-cases.ts` so the unit tier can check
 * their coverage without the network.
 *
 * Runs on a schedule, never on a pull request. See `.github/workflows/live.yml`.
 */

describe("PokéAPI contract", () => {
  it.each(RESOURCES)("%s should keep the shape the model declares", async (_model, get, shape) => {
    const resource = await get();

    expect(sortKeys(Object.keys(resource))).toEqual(shape.keys);
    expect(mistypedFields(shape, resource)).toEqual([]);
  });

  it.each(NESTED)("nested %s should keep the shape the model declares", async (_m, get, shape) => {
    const resource = await get();

    expect(sortKeys(Object.keys(resource))).toEqual(shape.keys);
    expect(mistypedFields(shape, resource)).toEqual([]);
  });

  it.each(SPRITES)("sprite %s should keep the shape the model declares", async (_m, get, shape) => {
    const resource = await get();

    expect(sortKeys(Object.keys(resource))).toEqual(shape.keys);
    expect(mistypedFields(shape, resource)).toEqual([]);
  });

  it.each(LISTS)("list %s should keep the shape the model declares", async (_m, get, shape) => {
    const resource = await get();

    expect(sortKeys(Object.keys(resource))).toEqual(shape.keys);
    expect(mistypedFields(shape, resource)).toEqual([]);
  });
});
