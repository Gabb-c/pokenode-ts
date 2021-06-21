# Berry Client

## Usage

The Berry Client provide methods to access the [Berry Endpoinds](https://pokeapi.co/docs/v2#berries-section):

- `getBerryByName`(name: `string`) => [Berry](typings/berry-typings?id=berry)
- `getBerryById`(id: `number`) => [Berry](typings/berry-typings?id=berry)
- `getBerryFirmnessByName`(name: `string`) => [BerryFirmness](typings/berry-typings?id=berry-firmness)
- `getBerryFirmnessById`(id: `number`) => [BerryFirmness](typings/berry-typings?id=berry-firmness)
- `getBerryFlavorByName`(name: `string`) => [BerryFlavor](typings/berry-typings?id=berry-flavor)
- `getBerryFlavorById`(id: `number`) => [BerryFlavor](typings/berry-typings?id=berry-flavor)
- `listBerries`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listBerryFirmness`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listBerryFlavors`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)

## Example

```js
import { BerryClient, Berries } from 'pokenode-ts'; // import the BerryClient (Berries enum is fully optional)

const api = new BerryClient(); // create a BerryClient

const berry = await api
  .getBerryById(Berries.CHERI) // using method getBerryById()
  .then((response) => response)
  .catch((error) => console.log(error));

console.log(berry);
```

Will output:

```json
{
  "firmness": {
    "name": "soft",
    "url": "https://pokeapi.co/api/v2/berry-firmness/2/"
  },
  "flavors": [
    {
      "flavor": {
        "name": "spicy",
        "url": "https://pokeapi.co/api/v2/berry-flavor/1/"
      },
      "potency": 10
    },
    {
      "flavor": {
        "name": "dry",
        "url": "https://pokeapi.co/api/v2/berry-flavor/2/"
      },
      "potency": 0
    },
    {
      "flavor": {
        "name": "sweet",
        "url": "https://pokeapi.co/api/v2/berry-flavor/3/"
      },
      "potency": 0
    },
    {
      "flavor": {
        "name": "bitter",
        "url": "https://pokeapi.co/api/v2/berry-flavor/4/"
      },
      "potency": 0
    },
    {
      "flavor": {
        "name": "sour",
        "url": "https://pokeapi.co/api/v2/berry-flavor/5/"
      },
      "potency": 0
    }
  ],
  "growth_time": 3,
  "id": 1,
  "item": {
    "name": "cheri-berry",
    "url": "https://pokeapi.co/api/v2/item/126/"
  },
  "max_harvest": 5,
  "name": "cheri",
  "natural_gift_power": 60,
  "natural_gift_type": {
    "name": "fire",
    "url": "https://pokeapi.co/api/v2/type/10/"
  },
  "size": 20,
  "smoothness": 25,
  "soil_dryness": 15
}
```

## More

> For more information about the Berry Client endpoints, check out the [PokéAPI Documentation](https://pokeapi.co/docs/v2#berries-section).
