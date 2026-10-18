import { LISTS, NESTED, RESOURCES, SPRITES } from "../helpers/drift-cases";
import { declaredModels, literalFields } from "../helpers/model-keys";
import { UNSWEPT, VALUES } from "../helpers/value-cases";

/**
 * The live tier only runs on a schedule, so a model or union added without a
 * live case would drift silently until someone noticed. This runs with the unit
 * tier, on every pull request, and needs no network: it reads the case tables,
 * never runs them.
 */
describe("live tier coverage", () => {
  it("should give every model under src/models a drift case", () => {
    const cased = new Set([...RESOURCES, ...NESTED, ...SPRITES, ...LISTS].map(([model]) => model));
    const uncased = declaredModels().filter((model) => !cased.has(model));

    expect(uncased, "Add a caseFor row to tests/helpers/drift-cases.ts").toEqual([]);
  });

  it("should sweep every literal union in src/models", () => {
    const swept = new Set(VALUES.map(([, field]) => field));
    const unions = literalFields();
    const unswept = unions
      .filter(({ label, field }) => !swept.has(field) && !UNSWEPT.has(label))
      .map(({ label }) => label);

    expect(unswept, "Add a row to VALUES in tests/helpers/value-cases.ts").toEqual([]);

    const labels = new Set(unions.map(({ label }) => label));
    const stale = [...UNSWEPT.keys()].filter((label) => !labels.has(label));

    expect(stale, "UNSWEPT names a field that is no longer a union of literals").toEqual([]);
  });
});
