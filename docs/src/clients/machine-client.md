# Machine Client

## Usage

The Machine Client provide methods to access the [Machine Endpoinds](https://pokeapi.co/docs/v2#machines-section):

- `getMachineById`
- `listMachines`

## Example

```js
import { MachineClient } from 'pokenode-ts'; // import the MachineClient

(async () => {
  const api = new MachineClient(); // create a MachineClient

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
