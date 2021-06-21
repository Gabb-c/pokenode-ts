# Evolution Client

## Usage

The Evolution Client provide methods to access the [Evolution Endpoinds](https://pokeapi.co/docs/v2#evolution-section):

- `getEvolutionChainByID`(id: `number`) => [EvolutionChain](typings/evolution-typings?id=evolution-chain)
- `getEvolutionTriggerByName`(name: `string`) => [EvolutionTrigger](typings/evolution-typings?id=evolution-trigger)
- `getEvolutionTriggerByID`(id: `number`) => [EvolutionTrigger](typings/evolution-typings?id=evolution-trigger)
- `listEvolutionChains`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)
- `listEvolutionTriggers`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)

## Example

```js
import { EvolutionClient, EvolutionTriggers } from 'pokenode-ts'; // import the EvolutionClient (EvolutionTriggers enum is fully optional)

const api = new EvolutionClient(); // create an EvolutionClient

const evTrigger = await api
  .getEvolutionTriggerById(EvolutionTriggers.LEVEL_UP) // using method getEvolutionTriggerById()
  .then((response) => response)
  .catch((error) => console.log(error));

console.log(encounter);
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
