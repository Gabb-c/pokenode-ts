# Main Client

## Usage

The Main Client provide methods to access all of the [PokéAPI Endpoinds](https://pokeapi.co/docs/v2):

- [Berry](/clients/berry-client)
- [Contest](/clients/contest-client)
- [Encounter](/clients/encounter-client)
- [Evolution](/clients/evolution-client)
- [Game](/clients/game-client)
- [Item](/clients/item-client)
- [Location](/clients/location-client)
- [Machine](/clients/machine-client)
- [Move](/clients/move-client)
- [Pokemon](/clients/pokemon-client)
- [Utility](/clients/utility-client)

## Example

```js
import { MainClient } from 'pokenode-ts';

(async () => {
  const api = new MainClient();

  await api.berry
    .getBerryByName('cheri')
    .then((data) => console.log(data.name)) // will output "cheri"
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

## More

> For more information about the PokéAPI endpoints, check out the [PokéAPI Documentation](https://pokeapi.co/docs/v2).
