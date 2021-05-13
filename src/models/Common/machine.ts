/* eslint-disable camelcase */

import { NamedAPIResource } from './resource';

/**
 * The machine that teaches a move from an item
 */
export interface MachineVersionDetail {
  /** The machine that teaches a move from an item */
  machine: NamedAPIResource;
  /** The version group of this specific machine */
  version_group: NamedAPIResource;
}
