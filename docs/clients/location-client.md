# Location Client

## Usage

The Location Client provide methods to access the [Location Endpoinds](https://pokeapi.co/docs/v2#locations-section):

- `getLocationByName`(name: `string`) => [Location](typings/location-typings?id=location)
- `getLocationById`(id: `number`) => [Location](typings/location-typings?id=locaton)
- `getLocationAreaByName`(name: `string`) => [LocationArea](typings/location-typings?id=location-area)
- `getLocatinAreaById`(id: `number`) => [LocationArea](typings/location-typings?id=location-area)
- `getPalParkAreaByName`(name: `string`) => [PalParkArea](typings/location-typings?id=pal-park-area)
- `getPalParkAreaById`(id: `number`) => [PalParkArea](typings/location-typings?id=pal-park-area)
- `getRegionByName`(name: `string`) => [Region](typings/location-typings?id=region)
- `getRegionById`(id: `number`) => [Region](typings/location-typings?id=region)
- `listLocations`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listLocationAreas`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listPalParkAreas`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listRegions`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)

## Example

```js
import { LocationClient, PalParkAreas } from 'pokenode-ts'; // import the LocationClient (PalParkAreas enum is fully optional)

const api = new BerryClient(); // create a LocationClient

const area = await api.getPalParkAreaById(PalParkAreas.FOREST) // using method getPalParkAreaById() 
  .then((response) => response)
  .catch((error) => console.log(error));

console.log(area);
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
