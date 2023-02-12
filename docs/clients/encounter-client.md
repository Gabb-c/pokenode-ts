# Encounter Client

## Usage

The Encounter Client provide methods to access the [Encounter Endpoinds](https://pokeapi.co/docs/v2#encounters-section):

- `getEncounterMethodByName`(name: `string`) : [EncounterMethod](/docs/typings/encounter-typings#encounter-method)
- `getEncounterMethodByID`(id: `number`) : [EncounterMethod](/docs/typings/encounter-typings#encounter-method)
- `getEncounterConditionByName`(name: `string`) : [EncounterCondition](/docs/typings/encounter-typings#encounter-condition)
- `getEncounterConditionById`(id: `number`) : [EncounterCondition](/docs/typings/encounter-typings#encounter-condition)
- `getEncounterConditionValueByName`(name: `string`) : [EncounterConditionValue](/docs/typings/encounter-typings#encounter-condition-value)
- `getEncounterConditionValueById`(id: `number`) : [EncounterConditionValue](/docs/typings/encounter-typings#encounter-condition-value)
- `listEncunterMethods`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)
- `listEncounterConditions`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)
- `listEncounterConditionValues`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)

## Example

```js
import { EncounterClient, EncounterMethods } from 'pokenode-ts'; // import the EncounterClient (EncounterMethods enum is fully optional)

(async () => {
  const api = new EncounterClient(); // create a EncounterClient

  await api
    .getEncounterMethodById(EncounterMethods.SURF)
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
})();
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
