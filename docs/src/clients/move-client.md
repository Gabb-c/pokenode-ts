# Move Client

## Usage

The Move Client provide methods to access the [Move Endpoinds](https://pokeapi.co/docs/v2#moves-section):

- `getMoveByName`
- `getMoveById`
- `getMoveAilmentByName`
- `getMoveAilmentById`
- `getMoveBattleStyleByName`
- `getMoveBattleStyleById`
- `getMoveCategoryByName`
- `getMoveCategoryById`
- `getMoveDamageClassByName`
- `getMoveDamageClassById`
- `getMoveLearnMethodByName`
- `getMoveLearnMethodById`
- `getMoveTargetByName`
- `getMoveTargetById`
- `listMoves`
- `listMoveAilments`
- `listMoveBattleStyles`
- `listMoveCategories`
- `listMoveDamageClasses`
- `listMoveLearnMethods`
- `listMoveTargets`

## Example

```js
import { MoveClient, MoveAilments } from 'pokenode-ts'; // import the MachineClient and the MoveAilments enum

(async () => {
  const api = new MoveClient(); // create a MoveClient

  await api
    .getMoveAilmentById(MoveAilments.PARALYSIS)
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
```

Or:

```js
import { MoveClient } from 'pokenode-ts'; // import the MachineClient

(async () => {
  const api = new MoveClient(); // create a MoveClient

  await api
    .getMoveAilmentByName('paralysis')
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
```

Will output:

```json
{
  "id": 1,
  "moves": [
    {
      "name": "thunder-punch",
      "url": "https://pokeapi.co/api/v2/move/9/"
    },
    {
      "name": "body-slam",
      "url": "https://pokeapi.co/api/v2/move/34/"
    },
    ...
  ],
  "name": "paralysis",
  "names": [
    {
      "language": {
        "name": "fr",
        "url": "https://pokeapi.co/api/v2/language/5/"
      },
      "name": "Paralysie"
    },
    {
      "language": {
        "name": "es",
        "url": "https://pokeapi.co/api/v2/language/7/"
      },
      "name": "Parálisis"
    },
    {
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      },
      "name": "Paralysis"
    }
  ]
}
```

## More

> For more information about the Move Client endpoints, check out the [PokéAPI Documentation](https://pokeapi.co/docs/v2#moves-section).
