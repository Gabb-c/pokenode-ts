import { NamedAPIResource, APIResource } from './resource';

/**
 * The machine that teaches a move from an item
 */
export interface MachineVersionDetail {
  /** The machine that teaches a move from an item */
  machine: APIResource;
  /** The version group of this specific machine */
  version_group: NamedAPIResource;
}
