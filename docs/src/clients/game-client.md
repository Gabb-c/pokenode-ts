# Game Client

## Usage

The Game Client provide methods to access the [Game Endpoinds](https://pokeapi.co/docs/v2#games-section):

- `getGenerationByName`
- `getGenerationById`
- `getPokedexByName`
- `getPokedexById`
- `getVersionByName`
- `getVersionById`
- `getVersionGroupByName`
- `getVersionGroupById`
- `listGenerations`
- `listPokedexes`
- `listVersion`
- `listVersionGroups`

## Example

```js
import { GameClient } from 'pokenode-ts'; // import the GameClient

(async () => {
  const api = new GameClient(); // create a GameClient

  await api
    .getPokedexByName('national')
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
})();
```

Or:

```js
import { GameClient, Pokedexes } from 'pokenode-ts'; // import the GameClient and the Pokedexes enum

(async () => {
  const api = new GameClient(); // create a GameClient

  await api
    .getPokedexById(Pokedexes.NATIONAL)
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
})();
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
