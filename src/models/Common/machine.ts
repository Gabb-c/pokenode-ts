import type { VersionGroup } from "../Game/version";
import type { Machine } from "../Machine/machine";
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
