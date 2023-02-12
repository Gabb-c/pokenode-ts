# Pokemon Client

## Usage

The Pokemon Client provide methods to access the [Pokémon Endpoinds](https://pokeapi.co/docs/v2#pokemon-section):

- `getAbilityByName`(name: `string`) : [Ability](/docs/typings/pokemon-typings#ability)
- `getAbilityById`(id: `number`) : [Ability](/docs/typings/pokemon-typings#ability)
- `getCharacteristicByName`(name: `string`) : [Characteristic](/docs/typings/pokemon-typings#characteristic)
- `getCharacteristicById`(id: `number`) : [Characteristic](/docs/typings/pokemon-typings#characteristic)
- `getEggGroupByName`(name: `string`) : [EggGroup](/docs/typings/pokemon-typings#egg-group)
- `getEggGroupById`(id: `number`) : [EggGroup](/docs/typings/pokemon-typings#egg-group)
- `getGenderByName`(name: `string`) : [Gennder](/docs/typings/pokemon-typings#gender)
- `getGenderById`(id: `number`) : [Gender](/docs/typings/pokemon-typings#gender)
- `getGrowthRateByName`(name: `string`) : [GrowthRate](/docs/typings/pokemon-typings#growth-rate)
- `getGrowthRateById`(id: `number`) : [GrowthRate](/docs/typings/pokemon-typings#growth-rate)
- `getNatureByName`(name: `string`) : [Nature](/docs/typings/pokemon-typings#nature)
- `getNatureById`(id: `number`) : [Nature](/docs/typings/pokemon-typings#nature)
- `getPokeathlonStatByName`(name: `string`) : [PokeathlonStat](/docs/typings/pokemon-typings#pokeathlon-stat)
- `getPokeathlonStatById`(id: `number`) : [PokeathlonStat](/docs/typings/pokemon-typings#pokeathlon-stat)
- `getPokemonByName`(name: `string`) : [Pokemon](/docs/typings/pokemon-typings#pokemon)
- `getPokemonById`(id: `number`) : [Pokemon](/docs/typings/pokemon-typings#pokemon)
- `getPokemonLocationAreaById`(id: `number`) : [PokemonLocationArea](/docs/typings/pokemon-typings#pokemon-location-area)
- `getPokemonColorByName`(name: `string`) : [PokemonColor](/docs/typings/pokemon-typings#pokemon-color)
- `getPokeomnColorById`(id: `number`) : [PokemonColor](/docs/typings/pokemon-typings#pokemon-color)
- `getPokemonFormByName`(name: `string`) : [PokemonForm](/docs/typings/pokemon-typings#pokemon-form)
- `getPokemonFormById`(id: `number`) : [PokemonForm](/docs/typings/pokemon-typings#pokemon-form)
- `getPokemonHabitatByName`(name: `string`) : [PokemonHabitat](/docs/typings/pokemon-typings#pokemon-habitat)
- `getPokemonHabitatById`(id: `number`) : [PokemonHabitat](/docs/typings/pokemon-typings#pokemon-habitat)
- `getPokemonShapeByName`(name: `string`) : [PokemonShape](/docs/typings/pokemon-typings#pokemon-shape)
- `getPokemonShapeById`(id: `number`) : [PokemonShape](/docs/typings/pokemon-typings#pokemon-shape)
- `getPokemonSpeciesByName`(name: `string`) : [PokemonSpecies](/docs/typings/pokemon-typings#pokemon-species)
- `getPokemonSpeciesById`(id: `number`) : [PokemonSpecies](/docs/typings/pokemon-typings#pokemon-species)
- `getStatByName`(name: `string`) : [Stat](/docs/typings/pokemon-typings#pokemon-stat)
- `getStatById`(id: `number`) : [Stat](/docs/typings/pokemon-typings#Stat)
- `getTypeByName`(name: `string`) : [Type](/docs/typings/pokemon-typings#type)
- `getTypeById`(id: `number`) : [Type](/docs/typings/pokemon-typings#type)
- `listAbilities`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)
- `listCharacteristics`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)
- `listEggGroups`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)
- `listGenders`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)
- `listGrowthRates`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)
- `listNatures`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)
- `listPokeathlonStats`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)
- `listPokemons`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)
- `listPokemonColors`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)
- `listPokemonForms`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)
- `listPokemonHabitats`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)
- `listPokemonShapes`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)
- `listPokemonSpecies`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)
- `listStats`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)
- `listTypes`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)

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
