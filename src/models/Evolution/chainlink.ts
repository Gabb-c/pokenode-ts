import { NamedAPIResource } from '../Common';
import { EvolutionDetail } from './evolution';

/** Contains evolution details for a Pokémon in the chain.
 * Each link references the next Pokémon in the natural evolution order
 */
export interface ChainLink {
  /** Whether or not this link is for a baby Pokémon. This would only ever be true on the base link */
  is_baby: boolean;
  /** The Pokémon species at this point in the evolution chain */
  species: NamedAPIResource;
  /** All details regarding the specific details of the referenced Pokémon species evolution */
  evolution_detail: EvolutionDetail[];
  /** A List of chain objects */
  envolves_to: ChainLink[];
}
