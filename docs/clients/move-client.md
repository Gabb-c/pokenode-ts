# Move Client

## Usage

The Move Client provide methods to access the [Move Endpoinds](https://pokeapi.co/docs/v2#moves-section):

- `getMoveByName`(name: `string`) => [Move](typings/move-typings?id=move)
- `getMoveById`(id: `number`) => [Move](typings/move-typings?id=move)
- `getMoveAilmentByName`(name: `string`) => [MoveAilment](typings/move-typings?id=move-ailment)
- `getMoveAilmentById`(id: `number`) => [MoveAilment](typings/move-typings?id=move-ailment)
- `getMoveBattleStyleByName`(name: `string`) => [MoveBattleStyle](typings/move-typings?id=move-battle-style)
- `getMoveBattleStyleById`(id: `number`) => [MoveBattleStyle](typings/move-typings?id=move-battle-style)
- `getMoveCategoryByName`(name: `string`) => [MoveCategory](typings/move-typings?id=move-category)
- `getMoveCategoryById`(id: `number`) => [MoveCategory](typings/move-typings?id=move-category)
- `getMoveDamageClassByName`(name: `string`) => [MoveDamageClass](typings/move-typings?id=move-damage-class)
- `getMoveDamageClassById`(id: `number`) => [MoveDamageClass](typings/move-typings?id=move-damage-class)
- `getMoveLearnMethodByName`(name: `string`) => [MoveLearnMethod](typings/move-typings?id=move-learn-method)
- `getMoveLearnMethodById`(id: `number`) => [MoveLearnMethod](typings/move-typings?id=move-learn-method)
- `getMoveTargetByName`(name: `string`) => [MoveTarget](typings/move-typings?id=move-target)
- `getMoveTargetById`(id: `number`) => [MoveTarget](typings/move-typings?id=move-target)
- `listMoves`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listMoveAilments`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listMoveBattleStyles`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listMoveCategories`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listMoveDamageClasses`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listMoveLearnMethods`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listMoveTargets`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)

## Example

```js
import { MoveClient, MoveAilments } from 'pokenode-ts'; // import the MachineClient (MoveAilments enum is fully optional)

const api = new MoveClient(); // create a MoveClient

const move = await api
  .getMoveAilmentById(MoveAilments.PARALYSIS) // using method getMoveAilmentById()
  .then((response) => response)
  .catch((error) => console.log(error));

console.log(move);
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
