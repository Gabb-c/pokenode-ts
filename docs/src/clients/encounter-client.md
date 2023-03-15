# Encounter Client

## Usage

The Encounter Client provide methods to access the [Encounter Endpoinds](https://pokeapi.co/docs/v2#encounters-section):

- `getEncounterMethodByName`
- `getEncounterMethodByID`
- `getEncounterConditionByName`
- `getEncounterConditionById`
- `getEncounterConditionValueByName`
- `getEncounterConditionValueById`
- `listEncunterMethods`
- `listEncounterConditions`
- `listEncounterConditionValues`

## Example

```js
import { EncounterClient, EncounterMethods } from 'pokenode-ts'; // import the EncounterClient (EncounterMethods enum is fully optional)

(async () => {
  const api = new EncounterClient(); // create an EncounterClient

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
