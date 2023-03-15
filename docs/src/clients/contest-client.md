# Contest Client

## Usage

The Contest Client provide methods to access the [Contest Endpoinds](https://pokeapi.co/docs/v2#contests-section):

- `getContestTypeByName`
- `getContestTypeByID`
- `getContestEffectById`
- `getSuperContestEffectById`
- `listContestTypes`
- `listContestEffects`
- `listSuperContestEffects`

## Example

```js
import { ContestClient } from 'pokenode-ts'; // import the ContestClient

(async () => {
  const api = new ContestClient(); // create a ContestClient

  await api
    .getContestTypeByName('tough')
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
})();
```

Or:

```js
import { ContestClient, ContestTypes } from 'pokenode-ts'; // import the ContestClient and the ContestTypes enum

(async () => {
  const api = new ContestClient(); // create a ContestClient

  await api
    .getContestTypeById(ContestTypes.TOUGH)
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
})();
```

Will output:

```json
{
  "berry_flavor": {
    "name": "sour",
    "url": "https://pokeapi.co/api/v2/berry-flavor/5/"
  },
  "id": 5,
  "name": "tough",
  "names": [
    {
      "color": "Jaune",
      "language": {
        "name": "fr",
        "url": "https://pokeapi.co/api/v2/language/5/"
      },
      "name": "Robustesse"
    },
    {
      "color": "Yellow",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      },
      "name": "Tough"
    }
  ]
}
```

## More

> For more information about the Contest Client endpoints, check out the [PokéAPI Documentation](https://pokeapi.co/docs/v2#contests-section).
