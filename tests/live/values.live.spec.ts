import type { Field } from "../helpers/model-keys";
import { type Observed, VALUES } from "../helpers/value-cases";

/**
 * Tier 3, alongside `drift.live.spec.ts` and `constants.live.spec.ts`: the
 * fields `src/models` narrows to a union of literals, checked against the values
 * upstream actually holds.
 *
 * `drift.live.spec.ts` already rejects a value outside a declared union, but it
 * sees one resource per model, so a union whose members are spread across a
 * section is never exercised. `time_of_day` shipped as `"Day" | "Night"` for a
 * release behind exactly that gap: the one chain that suite fetches has
 * `time_of_day: ""`, which the wrong union still permitted.
 *
 * So this checks both directions, and the second is the one that matters:
 *
 * - a **value upstream holds that the union omits** is drift, the same as a new
 *   key, and means the type is out of date;
 * - a **member the union declares that never appears upstream** is a value that
 *   was invented rather than observed — the failure that let `"Day"` through.
 *
 * The second is only sound because every source in `tests/helpers/value-cases.ts`
 * is exhaustive, and `tests/live/coverage.spec.ts` fails the unit tier
 * when a union has no row there.
 */

const literalsOf = (field: Field): Observed =>
  new Set(field.literals === null ? [] : [...field.literals]);

describe.each(VALUES)("%s", (label, field, observe) => {
  it("should declare exactly the values upstream holds", async () => {
    const declared = literalsOf(field);
    const seen = await observe();

    // `null` is `| null` on the annotation rather than a member of the union, so
    // a nullable field reports it as observed and would otherwise look undeclared.
    const observed = new Set([...seen].filter((value) => !(value === null && field.nullable)));

    const undeclared = [...observed].filter((value) => !declared.has(value));
    const unobserved = [...declared].filter((value) => !observed.has(value));

    expect(
      { undeclared, unobserved },
      `${label} is declared \`${field.annotation}\`. ` +
        "Values upstream holds but the type omits are drift; " +
        "values the type declares but upstream never holds were never observed.",
    ).toEqual({ undeclared: [], unobserved: [] });
  });
});
