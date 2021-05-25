import { Name, NamedAPIResource } from '../Common';

/**
 * ## Encounter Method
 * Methods by which the player might can encounter Pokémon in the wild, e.g., walking in tall grass.
 * - Check out [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Wild_Pok%C3%A9mon) for greater detail.
 */
export interface EncounterMethod {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** A good value for sorting */
  order: number;
  /** The name of this resource listed in different languages */
  names: Name[];
}

/**
 * ## Encounter Condition
 * Conditions which affect what pokemon might appear in the wild, e.g., day or night.
 *  - Check out [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Time)
 */
export interface EncounterCondition {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** The name of this resource listed in different languages */
  names: Name[];
  /** A list of possible values for this encounter condition */
  values: NamedAPIResource[];
}

/**
 * ## Encounter Condition Value
 * Encounter condition values are the various states that an encounter
 * condition can have, i.e., time of day can be either **day** or **night**
 * - Check out [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Time)
 */
export interface EncounterConditionValue {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** The condition this encounter condition value pertains to */
  condition: NamedAPIResource;
  /** The name of this resource listed in different languages */
  names: Name[];
}
