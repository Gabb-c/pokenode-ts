# Pokemon Client

## Usage

The Pokemon Client provide methods to access the [Pokémon Endpoinds](https://pokeapi.co/docs/v2#pokemon-section):

- `getAbilityByName`
- `getAbilityById`
- `getCharacteristicByName`
- `getCharacteristicById`
- `getEggGroupByName`
- `getEggGroupById`
- `getGenderByName`
- `getGenderById`
- `getGrowthRateByName`
- `getGrowthRateById`
- `getNatureByName`
- `getNatureById`
- `getPokeathlonStatByName`
- `getPokeathlonStatById`
- `getPokemonByName`
- `getPokemonById`
- `getPokemonLocationAreaById`
- `getPokemonColorByName`
- `getPokeomnColorById`
- `getPokemonFormByName`
- `getPokemonFormById`
- `getPokemonHabitatByName`
- `getPokemonHabitatById`
- `getPokemonShapeByName`
- `getPokemonShapeById`
- `getPokemonSpeciesByName`
- `getPokemonSpeciesById`
- `getStatByName`
- `getStatById`
- `getTypeByName`
- `getTypeById`
- `listAbilities`
- `listCharacteristics`
- `listEggGroups`
- `listGenders`
- `listGrowthRates`
- `listNatures`
- `listPokeathlonStats`
- `listPokemons`
- `listPokemonColors`
- `listPokemonForms`
- `listPokemonHabitats`
- `listPokemonShapes`
- `listPokemonSpecies`
- `listStats`
- `listTypes`

## Example

```js
import { PokemonClient, EggGroups } from 'pokenode-ts'; // import the PokemonClient (EggGroups enum is fully optional)

(async () => {
  const api = new PokemonClient(); // create a PokemonClient

  await api
    .getEggGroupById(EggGroups.MONSTER)
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
})();
```

Or:

```js
import { PokemonClient, EggGroups } from 'pokenode-ts'; // import the PokemonClient

(async () => {
  const api = new PokemonClient(); // create a PokemonClient

  await api
    .getEggGroupByName('monster')
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
})();
```

Will output:

```json
{
  "id": 1,
  "name": "monster",
  "names": [
    {
      "language": {
        "name": "ja-Hrkt",
        "url": "https://pokeapi.co/api/v2/language/1/"
      },
      "name": "かいじゅう"
    },
    {
      "language": {
        "name": "ko",
        "url": "https://pokeapi.co/api/v2/language/3/"
      },
      "name": "괴수"
    },
    {
      "language": {
        "name": "fr",
        "url": "https://pokeapi.co/api/v2/language/5/"
      },
      "name": "Monstrueux"
    },
    ...
  ],
  "pokemon_species": [
    {
      "name": "bulbasaur",
      "url": "https://pokeapi.co/api/v2/pokemon-species/1/"
    },
    {
      "name": "ivysaur",
      "url": "https://pokeapi.co/api/v2/pokemon-species/2/"
    },
    ...
  ]
}
```

## More

> For more information about the Pokemon Client endpoints, check out the [PokéAPI Documentation](https://pokeapi.co/docs/v2#pokemon-section).
