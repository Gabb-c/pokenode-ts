# Encounter Client

## Usage

The Encounter Client provide methods to access the [Encounter Endpoinds](https://pokeapi.co/docs/v2#encounters-section):

- `getEncounterMethodByName`(name: `string`) => [EncounterMethod](typings/encounter-typings?id=encounter-method)
- `getEncounterMethodByID`(id: `number`) => [EncounterMethod](typings/encounter-typings?id=encounter-method)
- `getEncounterConditionByName`(name: `string`) => [EncounterCondition](typings/encounter-typings?id=encounter-condition)
- `getEncounterConditionById`(id: `number`) => [EncounterCondition](typings/encounter-typings?id=encointer-condition)
- `getEncounterConditionValueByName`(name: `string`) => [EncounterConditionValue](typings/encounter-typings?id=encounter-condition-value)
- `getEncounterConditionValueById`(id: `number`) => [EncounterConditionValue](typings/encounter-typings?id=encointer-condition-value)
- `listEncunterMethods`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listEncounterConditions`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listEncounterConditionValues`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)

## Example

```js
import { EncounterClient, EncounterMethods } from 'pokenode-ts'; // import the EncounterClient (EncounterMethods enum is fully optional)

const api = new BerryClient(); // create an EncounterClient

const encounter = await api
  .getEncounterMethodById(EncounterMethods.SURF) // using method getEncounterMethodById()
  .then((response) => response)
  .catch((error) => console.log(error));

console.log(encounter);
```

Will output:

```json
{
  "id": 5,
  "name": "surf",
  "names": [
    {
      "language": {
        "name": "de",
        "url": "https://pokeapi.co/api/v2/language/6/"
      },
      "name": "Surfen"
    },
    {
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      },
      "name": "Surfing"
    }
  ],
  "order": 14
}
```

## More

> For more information about the Encounter Client endpoints, check out the [PokéAPI Documentation](https://pokeapi.co/docs/v2#encounters-section).
