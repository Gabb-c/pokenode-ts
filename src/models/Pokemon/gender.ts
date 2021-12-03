import { NamedAPIResource } from '../Common';

/**
 * ## Gender
 * Genders were introduced in Generation II for the purposes of breeding Pokémon
 * but can also result in visual differences or even different evolutionary lines.
 * - Check out [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Gender) for greater details.
 */
export interface Gender {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: 'male' | 'female' | 'genderless';
  /** A list of Pokémon species that can be this gender and how likely it is that they will be */
  pokemon_species_details: PokemonSpeciesGender[];
  /** A list of Pokémon species that required this gender in order for a Pokémon to evolve into them */
  required_for_evolution: NamedAPIResource[];
}

/**
 * Pokémon species that can be this gender and how likely it is that they will be
 */
export interface PokemonSpeciesGender {
  /** The chance of this Pokémon being female, in eighths; or -1 for genderless */
  rate: number;
  /** A Pokémon species that can be the referenced gender */
  pokemon_species: NamedAPIResource;
}
