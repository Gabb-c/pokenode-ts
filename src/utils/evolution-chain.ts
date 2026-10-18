import type {
  ChainLink,
  EvolutionChain,
  EvolutionDetail,
  NamedAPIResource,
  PokemonSpecies,
} from "@models";

/**
 * ## Evolution Step
 * One edge of an evolution chain: a species, what it evolves into, and every way
 * that happens.
 */
export interface EvolutionStep {
  /** The species that evolves. */
  from: NamedAPIResource<PokemonSpecies>;
  /** What it evolves into. */
  to: NamedAPIResource<PokemonSpecies>;
  /**
   * The ways this step happens, which are alternatives rather than a sequence —
   * the API publishes one per version group, so Leafeon carries five mossy-rock
   * locations and a Leaf Stone. Never empty.
   */
  details: EvolutionDetail[];
  /** How deep in the chain this step sits: `1` for a first evolution. */
  depth: number;
  /** Whether {@link EvolutionStep.to} is a baby Pokémon. */
  isBaby: boolean;
}

/**
 * ## Flatten Options
 * How {@link flattenChain} narrows the chain it walks.
 */
export interface FlattenOptions {
  /**
   * Keep only the details tagged with this version group, by the name the API
   * gives it — `sword-shield`, not `Sword/Shield` — and drop the steps left with
   * none. The tag is the game that introduced the method, not every game it
   * applies in — see {@link flattenChain}.
   */
  versionGroup?: string;
}

/** The details of a link, narrowed to one version group when asked for. */
const detailsFor = (link: ChainLink, versionGroup: string | undefined): EvolutionDetail[] =>
  versionGroup === undefined
    ? link.evolution_details
    : link.evolution_details.filter((detail) => detail.version_group.name === versionGroup);

/**
 * Flattens an evolution chain into one step per evolution, depth-first in the
 * order the API lists them.
 *
 * ```ts
 * const species = await api.pokemon.getPokemonSpeciesByName('eevee');
 * const chain = await api.resolve(species.evolution_chain);
 *
 * for (const step of flattenChain(chain)) {
 *   console.log(`${step.from.name} → ${step.to.name}`);
 * }
 * ```
 *
 * The root is not a step: it is what the chain starts from, and the API gives it
 * no `evolution_details` to describe.
 *
 * `versionGroup` keeps only the details tagged with that version group, which is
 * what picks the Leaf Stone out of Leafeon's six alternatives:
 *
 * ```ts
 * flattenChain(chain, { versionGroup: 'sword-shield' });
 * ```
 *
 * That tag is the game which *introduced* the method, not every game it applies
 * in: Eevee's Water Stone is tagged `red-blue` alone, so filtering to
 * `sword-shield` drops Vaporeon even though Sword/Shield evolves it the same way
 * it always did. The question this answers is what a game changed.
 *
 * A step with nothing left after that is dropped, but the chain below it is
 * still walked — every edge is filtered on its own terms, and `depth` stays the
 * position in the chain rather than in the result.
 */
export const flattenChain = (chain: EvolutionChain, options?: FlattenOptions): EvolutionStep[] => {
  const collect = (link: ChainLink, depth: number): EvolutionStep[] =>
    link.evolves_to.flatMap((next) => {
      const details = detailsFor(next, options?.versionGroup);
      const below = collect(next, depth + 1);

      if (details.length === 0) {
        return below;
      }

      return [
        { from: link.species, to: next.species, details, depth, isBaby: next.is_baby },
        ...below,
      ];
    });

  return collect(chain.chain, 1);
};

/**
 * The steps leading from the root of a chain to `species`.
 *
 * ```ts
 * pathTo(chain, 'dustox')?.map((step) => step.to.name); // ['cascoon', 'dustox']
 * ```
 *
 * Matched against the name the API gives a species, which is not the name a game
 * displays: `localize(species.names)` is `Papilord` in French and finds nothing
 * here. Pass the link itself when you have one.
 *
 * @returns The steps, `[]` when `species` is the root the chain starts from, and
 *   `undefined` when the chain does not contain it. The two empty answers are
 *   different questions, so they are different values.
 */
export const pathTo = (
  chain: EvolutionChain,
  species: string | NamedAPIResource<PokemonSpecies>,
): EvolutionStep[] | undefined => {
  const wanted = typeof species === "string" ? species : species.name;

  const search = (link: ChainLink, trail: EvolutionStep[]): EvolutionStep[] | undefined => {
    if (link.species.name === wanted) {
      return trail;
    }

    for (const next of link.evolves_to) {
      const step: EvolutionStep = {
        from: link.species,
        to: next.species,
        details: next.evolution_details,
        depth: trail.length + 1,
        isBaby: next.is_baby,
      };
      const found = search(next, [...trail, step]);

      if (found !== undefined) {
        return found;
      }
    }

    return undefined;
  };

  return search(chain.chain, []);
};
