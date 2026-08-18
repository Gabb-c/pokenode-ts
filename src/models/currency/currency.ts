import type { Name } from "../common";

/**
 * ## Currency
 * Currencies are what items are bought and sold with. Most items are priced in
 * Pokémon Dollars, but a shop can trade in anything from Battle Points to
 * Volcanic Ash.
 * - See [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Currency) for greater detail.
 */
export interface Currency {
  /** The identifier for this resource. */
  id: number;
  /** The name for this resource. */
  name: string;
  /** The name of this currency listed in different languages. */
  names: Name[];
}
