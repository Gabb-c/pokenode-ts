# Item Client

## Usage

The Item Client provide methods to access the [Item Endpoinds](https://pokeapi.co/docs/v2#items-section):

- `getItemByName`
- `getItemByID`
- `getItemAttributeByName`
- `getItemAttributeById`
- `getItemCategoryByName`
- `getItemCategoryById`
- `getItemFlingEffectByName`
- `getItemFlingEffectById`
- `getItemPocketById`
- `getItemPocketByName`
- `listItems`
- `listItemAttributes`
- `listItemCategories`
- `listItemFlingEffects`
- `listItemPockets`

## Example

```js
import { ItemClient } from 'pokenode-ts'; // import the ItemClient

(async () => {
  const api = new ItemClient(); // create an ItemClient

  await api
    .getItemById(3)
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
})();
```

Or:

```js
import { ItemClient } from 'pokenode-ts'; // import the ItemClient

(async () => {
  const api = new ItemClient(); // create an ItemClient

  await api
    .getItemByName('medicine')
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
})();
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
