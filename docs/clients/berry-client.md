# Berry Client

The Berry Client provide methods to access the Berry Endpoinds

- `getBerryByName`(name: `string`)
- `getBerryById`(id: `number`)
- `getBerryFirmnessByName`(name: `string`)
- `getBerryFirmnessById`(id: `number`) :
- `getBerryFlavorByName`(name: `string`)
- `getBerryFlavorById`(id: `number`)
- `listBerries`(offset?: `number`, limit?: `number`)
- `listBerryFirmness`(offset?: `number`, limit?: `number`)
- `listBerryFlavors`(offset?: `number`, limit?: `number`)

## Example

```js
import { BerryClient } from 'pokenode-ts'; // import the BerryClient

(async () => {
  const api = new BerryClient(); // create a BerryClient

  await api
    .getBerryByName('cheri')
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
})();
```

Or:

```js
import { BerryClient, Berries } from 'pokenode-ts'; // import the BerryClient and the Berries enum

(async () => {
  const api = new BerryClient(); // create a BerryClient

  await api
    .getBerryById(Berries.CHERI)
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
})();
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

::: tip
For more information about the Berry Client endpoints, check out the [PokéAPI Documentation](https://pokeapi.co/docs/v2#berries-section).
:::
