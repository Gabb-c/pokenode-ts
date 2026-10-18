/**
 * A numeric option, or `fallback` when it is absent or not finite.
 *
 * `NaN` is what `Number(process.env.X)` yields for a typo, and it slips past every
 * comparison and clamp, so it falls back rather than being clamped.
 */
export const finiteOr = (value: number | undefined, fallback: number): number =>
  value !== undefined && Number.isFinite(value) ? value : fallback;
