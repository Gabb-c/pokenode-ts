# Item Client

## Usage

The Item Client provide methods to access the [Item Endpoinds](https://pokeapi.co/docs/v2#items-section):

- `getItemByName`(name: `string`) => [Item](typings/item-typings?id=item)
- `getItemByID`(id: `number`) => [Item](typings/item-typings?id=item)
- `getItemAttributeByName`(name: `string`) => [ItemAttribute](typings/item-typings?id=item-attribute)
- `getItemAttributeById`(id: `number`) => [ItemAttribute](typings/item-typings?id=item-attribute)
- `getItemCategoryByName`(name: `string`) => [ItemCategory](typings/item-typings?id=item-category)
- `getItemCategoryById`(id: `number`) => [ItemCategory](typings/item-typings?id=item-category)
- `getItemFlingEffectByName`(name: `string`) => [ItemFlingEffect](typings/item-typings?id=item-fling-effect)
- `getItemFlingEffectById`(id: `number`) => [ItemFlingEffect](typings/item-typings?id=item-fling-effect)
- `getItemPocketById`(id: `number`) => [ItemPocket](typings/item-typings?id=item-pocket)
- `getItemPocketByName`(name: `string`) => [ItemPocket](typings/item-typings?id=item-pocket)
- `listItems`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listItemAttributes`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listItemCategories`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listItemFlingEffects`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listItemPockets`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)

## Example

```js
import { ItemClient, ItemCategories } from 'pokenode-ts'; // import the ItemClient (ItemCategories enum is fully optional)

const api = new BerryClient(); // create a ItemClient

const item = await api
  .getItemCategoryById(ItemCategories.MEDICINE) // using method getItemCategoryById()
  .then((response) => response)
  .catch((error) => console.log(error));

console.log(item);
```

Will output:

```json
{
  "id": 3,
  "items": [
    {
      "name": "cheri-berry",
      "url": "https://pokeapi.co/api/v2/item/126/"
    },
    {
      "name": "chesto-berry",
      "url": "https://pokeapi.co/api/v2/item/127/"
    },
    {
      "name": "pecha-berry",
      "url": "https://pokeapi.co/api/v2/item/128/"
    },
    {
      "name": "rawst-berry",
      "url": "https://pokeapi.co/api/v2/item/129/"
    },
    {
      "name": "aspear-berry",
      "url": "https://pokeapi.co/api/v2/item/130/"
    },
    {
      "name": "leppa-berry",
      "url": "https://pokeapi.co/api/v2/item/131/"
    },
    {
      "name": "oran-berry",
      "url": "https://pokeapi.co/api/v2/item/132/"
    },
    {
      "name": "persim-berry",
      "url": "https://pokeapi.co/api/v2/item/133/"
    },
    {
      "name": "lum-berry",
      "url": "https://pokeapi.co/api/v2/item/134/"
    },
    {
      "name": "sitrus-berry",
      "url": "https://pokeapi.co/api/v2/item/135/"
    }
  ],
  "name": "medicine",
  "names": [
    {
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      },
      "name": "Medicine"
    }
  ],
  "pocket": {
    "name": "berries",
    "url": "https://pokeapi.co/api/v2/item-pocket/5/"
  }
}
```

## More

> For more information about the Item Client endpoints, check out the [PokéAPI Documentation](https://pokeapi.co/docs/v2#items-section).
