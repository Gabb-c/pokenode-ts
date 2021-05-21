import { NamedAPIResource } from './resource';

/**
 * The generation relevent to this game index
 */
export interface GenerationGameIndex {
  /** The internal id of an API resource within game data */
  game_index: number;
  /** The generation relevent to this game index */
  generation: NamedAPIResource;
}
