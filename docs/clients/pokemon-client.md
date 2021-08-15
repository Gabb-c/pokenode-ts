# Pokemon Client

## Usage

The Pokemon Client provide methods to access the [Pokémon Endpoinds](https://pokeapi.co/docs/v2#pokemon-section):

- `getAbilityByName`(name: `string`) => [Ability](typings/pokemon-typings?id=ability)
- `getAbilityById`(id: `number`) => [Ability](typings/pokemon-typings?id=ability)
- `getCharacteristicByName`(name: `string`) => [Characteristic](typings/pokemon-typings?id=characteristic)
- `getCharacteristicById`(id: `number`) => [Characteristic](typings/pokemon-typings?id=characteristic)
- `getEggGroupByName`(name: `string`) => [EggGroup](typings/pokemon-typings?id=egg-group)
- `getEggGroupById`(id: `number`) => [EggGroup](typings/pokemon-typings?id=egg-group)
- `getGenderByName`(name: `string`) => [Gennder](typings/pokemon-typings?id=gender)
- `getGenderById`(id: `number`) => [Gender](typings/pokemon-typings?id=gender)
- `getGrowthRateByName`(name: `string`) => [GrowthRate](typings/pokemon-typings?id=growth-rate)
- `getGrowthRateById`(id: `number`) => [GrowthRate](typings/pokemon-typings?id=growth-rate)
- `getNatureByName`(name: `string`) => [Nature](typings/pokemon-typings?id=nature)
- `getNatureById`(id: `number`) => [Nature](typings/pokemon-typings?id=nature)
- `getPokeathlonStatByName`(name: `string`) => [PokeathlonStat](typings/pokemon-typings?id=pokeathlon-stat)
- `getPokeathlonStatById`(id: `number`) => [PokeathlonStat](typings/pokemon-typings?id=pokeathlon-stat)
- `getPokemonByName`(name: `string`) => [Pokemon](typings/pokemon-typings?id=pokemon)
- `getPokemonById`(id: `number`) => [Pokemon](typings/pokemon-typings?id=pokemon)
- `getPokemonLocationAreaById`(id: `number`) => [PokemonLocationArea](typings/pokemon-typings?id=pokemon-location-area)
- `getPokemonColorByName`(name: `string`) => [PokemonColor](typings/pokemon-typings?id=pokemon-color)
- `getPokeomnColorById`(id: `number`) => [PokemonColor](typings/pokemon-typings?id=pokemon-color)
- `getPokemonFormByName`(name: `string`) => [PokemonForm](typings/pokemon-typings?id=pokemon-form)
- `getPokemonFormById`(id: `number`) => [PokemonForm](typings/pokemon-typings?id=pokemon-form)
- `getPokemonHabitatByName`(name: `string`) => [PokemonHabitat](typings/pokemon-typings?id=pokemon-habitat)
- `getPokemonHabitatById`(id: `number`) => [PokemonHabitat](typings/pokemon-typings?id=pokemon-habitat)
- `getPokemonShapeByName`(name: `string`) => [PokemonShape](typings/pokemon-typings?id=pokemon-shape)
- `getPokemonShapeById`(id: `number`) => [PokemonShape](typings/pokemon-typings?id=pokemon-shape)
- `getPokemonSpeciesByName`(name: `string`) => [PokemonSpecies](typings/pokemon-typings?id=pokemon-species)
- `getPokemonSpeciesById`(id: `number`) => [PokemonSpecies](typings/pokemon-typings?id=pokemon-species)
- `getStatByName`(name: `string`) => [Stat](typings/pokemon-typings?id=pokemon-stat)
- `getStatById`(id: `number`) => [Stat](typings/pokemon-typings?id=Stat)
- `getTypeByName`(name: `string`) => [Type](typings/pokemon-typings?id=type)
- `getTypeById`(id: `number`) => [Type](typings/pokemon-typings?id=type)
- `listAbilities`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listCharacteristics`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listEggGroups`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listGenders`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listGrowthRates`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listNatures`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listPokeathlonStats`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listPokemons`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listPokemonColors`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listPokemonForms`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listPokemonHabitats`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listPokemonShapes`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listPokemonSpecies`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listStats`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listTypes`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)

## Example

```js
import { PokemonClient, EggGroups } from 'pokenode-ts'; // import the PokemonClient (EggGroups enum is fully optional)

(async () => {
  const api = new PokemonClient(); // create an PokemonClient

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
  const api = new PokemonClient(); // create an PokemonClient

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
