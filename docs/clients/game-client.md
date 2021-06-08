# Game Client

## Usage

The Game Client provide methods to access the [Game Endpoinds](https://pokeapi.co/docs/v2#games-section):

- `getGenerationByName`(name: `string`) => [Generation](/game-typings?id=generation)
- `getGenerationById`(id: `number`) => [Generation](/game-typings?id=generation)
- `getPokedexByName`(name: `string`) => [Pokedex](/game-typings?id=pokedex)
- `getPokedexById`(id: `number`) => [Pokedex](/game-typings?id=pokedex)
- `getVersionByName`(name: `string`) => [Version](/game-typings?id=version)
- `getVersionById`(id: `number`) => [Version](/game-typings?id=version)
- `getVersionGroupByName`(name: `string`) => [VersionGroup](/game-typings?id=version-group)
- `getVersionGroupById`(id: `number`) => [VersionGroup](/game-typings?id=version-group)
- `listGenerations`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listPokedexes`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listVersion`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listVersionGroups`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)

## Example

```js
import { GameClient, Pokedexes } from 'pokenode'; // import the GameClient (Pokedexes enum is fully optional)

const api = new GameClient(); // create an GameClient

const pokedex = api.getPokedexById(Pokedexes.NATIONAL) // using method getPokedexById()
  .then((response) => response)
  .catch((error) => console.log(error));

console.log(pokedex);
```

Will output:

```json
{
  "descriptions": [
    {
      "description": "Pokédex National complet",
      "language": {
        "name": "fr",
        "url": "https://pokeapi.co/api/v2/language/5/"
      }
    },
    {
      "description": "Komplette Nationale Dex",
      "language": {
        "name": "de",
        "url": "https://pokeapi.co/api/v2/language/6/"
      }
    },
    {
      "description": "Pokédex Nacional completa",
      "language": {
        "name": "es",
        "url": "https://pokeapi.co/api/v2/language/7/"
      }
    },
    {
      "description": "Entire National dex",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      }
    }
  ],
  "id": 1,
  "is_main_series": true,
  "name": "national",
  "names": [
    {
      "language": {
        "name": "fr",
        "url": "https://pokeapi.co/api/v2/language/5/"
      },
      "name": "National"
    },
    {
      "language": {
        "name": "de",
        "url": "https://pokeapi.co/api/v2/language/6/"
      },
      "name": "National"
    },
    {
      "language": {
        "name": "es",
        "url": "https://pokeapi.co/api/v2/language/7/"
      },
      "name": "Nacional"
    },
    {
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      },
      "name": "National"
    }
  ],
  "pokemon_entries": [
    {
      "entry_number": 1,
      "pokemon_species": {
        "name": "bulbasaur",
        "url": "https://pokeapi.co/api/v2/pokemon-species/1/"
      }
    },
    {
      "entry_number": 2,
      "pokemon_species": {
        "name": "ivysaur",
        "url": "https://pokeapi.co/api/v2/pokemon-species/2/"
      }
    },
    ...
  ],
  "region": null,
  "version_groups": []
}
```

## More

> For more information about the Game Client endpoints, check out the [PokéAPI Documentation](https://pokeapi.co/docs/v2#games-section).
