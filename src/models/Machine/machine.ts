import { NamedAPIResource } from '../Common';

/**
 * ## Machine
 * Machines are the representation of items that teach moves to Pokémon.
 * They vary from version to version, so it is not certain that one specific
 * [TM (Technical Machine)](https://bulbapedia.bulbagarden.net/wiki/TM) or
 * [HM (Hidden Machine)](https://bulbapedia.bulbagarden.net/wiki/HM) corresponds to a single Machine.
 */
export interface Machine {
  /** The identifier for this resource */
  id: number;
  /** The TM or HM item that corresponds to this machine */
  item: NamedAPIResource;
  /** The move that is taught by this machine */
  move: NamedAPIResource;
  /** The version group that this machine applies to */
  version_group: NamedAPIResource;
}
