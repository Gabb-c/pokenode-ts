# Evolution Client

## Usage

The Evolution Client provide methods to access the [Evolution Endpoinds](https://pokeapi.co/docs/v2#evolution-section):

- `getEvolutionChainByID`(id: `number`) : [EvolutionChain](/docs/typings/evolution-typings#evolution-chain)
- `getEvolutionTriggerByName`(name: `string`) : [EvolutionTrigger](/docs/typings/evolution-typings#evolution-trigger)
- `getEvolutionTriggerByID`(id: `number`) : [EvolutionTrigger](/docs/typings/evolution-typings#evolution-trigger)
- `listEvolutionChains`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)
- `listEvolutionTriggers`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)

## Example

```js
import { EvolutionClient } from 'pokenode-ts'; // import the EvolutionClient

(async () => {
  const api = new EvolutinClient(); // create a EncounterClient

  await api
    .getEvolutionTriggerByName('level-up')
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
})();
```

Or:

```js
import { EvolutionClient, EvolutionTriggers } from 'pokenode-ts'; // import the EvolutionClient and the EvolutionTriggers enum

(async () => {
  const api = new EvolutinClient(); // create a EncounterClient

  await api
    .getEvolutionTriggerById(EvolutionTriggers.LEVEL_UP)
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
})();
```

Will output:

```json
{
  "id": 1,
  "name": "level-up",
  "names": [
    {
      "language": {
        "name": "fr",
        "url": "https://pokeapi.co/api/v2/language/5/"
      },
      "name": "Montée de niveau"
    },
    {
      "language": {
        "name": "de",
        "url": "https://pokeapi.co/api/v2/language/6/"
      },
      "name": "Levelaufstieg"
    },
    {
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      },
      "name": "Level up"
    }
  ],
  "pokemon_species": [
    {
      "name": "ivysaur",
      "url": "https://pokeapi.co/api/v2/pokemon-species/2/"
    },
    {
      "name": "venusaur",
      "url": "https://pokeapi.co/api/v2/pokemon-species/3/"
    },
    ...
  ],
}
```

## More

> For more information about the Evolution Client endpoints, check out the [PokéAPI Documentation](https://pokeapi.co/docs/v2#evolution-section).
