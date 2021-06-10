# Machine Client

## Usage

The Machine Client provide methods to access the [Machine Endpoinds](https://pokeapi.co/docs/v2#machines-section):

- `getMachineById`(id: `number`) => [Machine](typings/machine-typings?id=machine)
- `listMachines`(offset?: `number`, limit?: `number`) => [NamedAPIResourceList](typings/common-typings?id=named-api-resource-list)

## Example

```js
import { MachineClient } from 'pokenode-ts'; // import the MachineClient

const api = new MachineClient(); // create a MachineClient

const machine = await api.getMachineById(1) // using method getMachineById()
  .then((response) => response)
  .catch((error) => console.log(error));

console.log(machine);
```

Will output:

```json
{
  "id": 1,
  "item": {
    "name": "tm01",
    "url": "https://pokeapi.co/api/v2/item/305/"
  },
  "move": {
    "name": "mega-punch",
    "url": "https://pokeapi.co/api/v2/move/5/"
  },
  "version_group": {
    "name": "red-blue",
    "url": "https://pokeapi.co/api/v2/version-group/1/"
  }
}
```

## More

> For more information about the Machine Client endpoints, check out the [PokéAPI Documentation](https://pokeapi.co/docs/v2#machines-section).
