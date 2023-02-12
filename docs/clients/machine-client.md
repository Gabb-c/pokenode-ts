# Machine Client

## Usage

The Machine Client provide methods to access the [Machine Endpoinds](https://pokeapi.co/docs/v2#machines-section):

- `getMachineById`(id: `number`) : [Machine](/docs/typings/machine-typings#machine)
- `listMachines`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)

## Example

```js
import { MachineClient } from 'pokenode-ts'; // import the MachineClient

(async () => {
  const api = new MachineClient(); // create an MachineClient

  await api
    .getMachineById(1)
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
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
