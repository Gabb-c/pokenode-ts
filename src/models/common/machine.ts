import type { VersionGroup } from "../game/version";
import type { Machine } from "../machine/machine";
import type { APIResource, NamedAPIResource } from "./resource";

/**
 * The machine that teaches a move from an item.
 */
export interface MachineVersionDetail {
  /** The machine that teaches a move from an item. */
  machine: APIResource<Machine>;
  /** The version group of this specific machine. */
  version_group: NamedAPIResource<VersionGroup>;
}
