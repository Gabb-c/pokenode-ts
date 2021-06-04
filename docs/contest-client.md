# Contest Client

## Usage

The Contest Client provide methods to access the [Contest Endpoinds](https://pokeapi.co/docs/v2#contests-section):

- `getContestTypeByName`(name: `string`) => [ContestType](/contest-typings?id=contest-type)
- `getContestTypeByID`(id: `number`) => [ContestType](/contest-typings?id=contest-type)
- `getContestEffectById`(name: `string`) => [ContestEffect](/contest-typings?id=contest-effect)
- `getSuperContestEffectById`(id: `number`) => [SuperContestEffect](/contest-typings?id=super-contest-effect)
- `listContestTypes`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](/common-typings?id=named-api-resource-list)
- `listContestEffects`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](/common-typings?id=named-api-resource-list)
- `listSuperContestEffects`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](/common-typings?id=named-api-resource-list)

## Example

```js
import { ContestClient, ContestTypes } from 'pokenode'; // import the ContestClient (ContestTypes enum is fully optional)

const api = new ContestClient(); // create a ContestClient

const contest = api.getContestTypeById(ContestTypes.TOUGH) // using method getContestTypeId()
  .then((response) => response)
  .catch((error) => console.log(error));

console.log(contest);
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
