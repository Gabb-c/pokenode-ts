# Move Client

## Usage

The Move Client provide methods to access the [Move Endpoinds](https://pokeapi.co/docs/v2#moves-section):

- `getMoveByName`(name: `string`) : [Move](/docs/typings/move-typings#move)
- `getMoveById`(id: `number`) : [Move](/docs/typings/move-typings#move)
- `getMoveAilmentByName`(name: `string`) : [MoveAilment](/docs/typings/move-typings#move-ailment)
- `getMoveAilmentById`(id: `number`) : [MoveAilment](/docs/typings/move-typings#move-ailment)
- `getMoveBattleStyleByName`(name: `string`) : [MoveBattleStyle](/docs/typings/move-typings#move-battle-style)
- `getMoveBattleStyleById`(id: `number`) : [MoveBattleStyle](/docs/typings/move-typings#move-battle-style)
- `getMoveCategoryByName`(name: `string`) : [MoveCategory](/docs/typings/move-typings#move-category)
- `getMoveCategoryById`(id: `number`) : [MoveCategory](/docs/typings/move-typings#move-category)
- `getMoveDamageClassByName`(name: `string`) : [MoveDamageClass](/docs/typings/move-typings#move-damage-class)
- `getMoveDamageClassById`(id: `number`) : [MoveDamageClass](/docs/typings/move-typings#move-damage-class)
- `getMoveLearnMethodByName`(name: `string`) : [MoveLearnMethod](/docs/typings/move-typings#move-learn-method)
- `getMoveLearnMethodById`(id: `number`) : [MoveLearnMethod](/docs/typings/move-typings#move-learn-method)
- `getMoveTargetByName`(name: `string`) : [MoveTarget](/docs/typings/move-typings#move-target)
- `getMoveTargetById`(id: `number`) : [MoveTarget](/docs/typings/move-typings#move-target)
- `listMoves`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)
- `listMoveAilments`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)
- `listMoveBattleStyles`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)
- `listMoveCategories`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)
- `listMoveDamageClasses`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)
- `listMoveLearnMethods`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)
- `listMoveTargets`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)

## Example

```js
import { MoveClient, MoveAilments } from 'pokenode-ts'; // import the MachineClient and the MoveAilments enum

(async () => {
  const api = new MoveClient(); // create an MoveClient

  await api
    .getMoveAilmentById(MoveAilments.PARALYSIS)
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
```

Or:

```js
import { MoveClient } from 'pokenode-ts'; // import the MachineClient

(async () => {
  const api = new MoveClient(); // create an MoveClient

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
