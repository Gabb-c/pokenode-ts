import { finiteOr } from "../../src/internal/options";

describe("finiteOr", () => {
  it.each([
    ["a finite number", 7, 7],
    ["zero", 0, 0],
    ["a negative number", -3, -3],
    ["undefined", undefined, 5],
    ["NaN", Number.NaN, 5],
    ["Infinity", Number.POSITIVE_INFINITY, 5],
  ])("should map %s", (_label, value, expected) => {
    expect(finiteOr(value, 5)).toBe(expected);
  });
});
