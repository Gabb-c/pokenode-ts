/**
 * Ties a runtime key list to a model's type.
 *
 * `keyof T` cannot be read at runtime, so the live suite has to carry the keys
 * as literals. This makes the compiler prove that literal list is exactly
 * `keyof T`: a key the model does not declare fails to satisfy the constraint,
 * and a key the model declares but the list omits makes `Missing` non-`never`,
 * which no argument can satisfy. `pnpm typecheck` therefore fails the moment a
 * model and its key list disagree, leaving the live run to check only the one
 * thing it alone can — whether the API still agrees with both.
 */
type Exhaustive<T, K extends readonly PropertyKey[]> = [Exclude<keyof T, K[number]>] extends [never]
  ? K
  : { readonly __missingKeys: Exclude<keyof T, K[number]> };

export const modelKeys =
  <T>() =>
  <K extends readonly (keyof T)[]>(keys: K & Exhaustive<T, K>): string[] =>
    [...keys].map(String).sort();
