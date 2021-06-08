# Pokemon Client

## Usage

The Pokemon Client provide methods to access the [Pokémon Endpoinds](https://pokeapi.co/docs/v2#pokemon-section):

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
import { MoveClient, MoveAilments } from 'pokenode'; // import the MachineClient (MoveAilments enum is fully optional)

const api = new MachineClient(); // create a MoveClient

const move = api.getMoveAilmentById(MoveAilments.PARALYSIS) // using method getMoveAilmentById()
  .then((response) => response)
  .catch((error) => console.log(error));

console.log(move);
```

Will output:

```json

```

## More

> For more information about the Pokemon Client endpoints, check out the [PokéAPI Documentation](https://pokeapi.co/docs/v2#pokemon-section).
