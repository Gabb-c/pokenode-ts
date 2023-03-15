# Location Client

## Usage

The Location Client provide methods to access the [Location Endpoinds](https://pokeapi.co/docs/v2#locations-section):

- `getLocationByName`
- `getLocationById`
- `getLocationAreaByName`
- `getLocatinAreaById`
- `getPalParkAreaByName`
- `getPalParkAreaById`
- `getRegionByName`
- `getRegionById`
- `listLocations`
- `listLocationAreas`
- `listPalParkAreas`
- `listRegions`

## Example

```js
import { LocationClient, PalParkAreas } from 'pokenode-ts'; // import the LocationClient and the PalParkAreas enum

(async () => {
  const api = new LocationClient(); // create a LocationClient

  await api
    .getPalParkAreaById(PalParkAreas.FOREST)
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
})();
```

Or:

```js
import { LocationClient } from 'pokenode-ts'; // import the LocationClient

(async () => {
  const api = new LocationClient(); // create a LocationClient

  await api
    .getPalParkAreaByName('forest')
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
})();
```

Will output:

```json
{
  "id": 1,
  "name": "forest",
  "names": [
    {
      "language": {
        "name": "fr",
        "url": "https://pokeapi.co/api/v2/language/5/"
      },
      "name": "Forêt"
    },
    {
      "language": {
        "name": "es",
        "url": "https://pokeapi.co/api/v2/language/7/"
      },
      "name": "Bosque"
    },
    {
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      },
      "name": "Forest"
    }
  ],
  "pokemon_encounters": [
    {
      "base_score": 30,
      "pokemon_species": {
        "name": "caterpie",
        "url": "https://pokeapi.co/api/v2/pokemon-species/10/"
      },
      "rate": 50
    },
    {
      "base_score": 50,
      "pokemon_species": {
        "name": "metapod",
        "url": "https://pokeapi.co/api/v2/pokemon-species/11/"
      },
      "rate": 30
    },
    ...
  ]
}
```

## More

> For more information about the Location Client endpoints, check out the [PokéAPI Documentation](https://pokeapi.co/docs/v2#locations-section).
