# Machine Client

Covers the PokéAPI's [machines section](https://pokeapi.co/docs/v2#machines-section): the TMs and
HMs that teach moves.

```ts
import { MachineClient } from 'pokenode-ts';

const api = new MachineClient();

const machine = await api.getMachineById(1);

console.log(machine.item.name); // the TM or HM item
console.log(machine.move.name); // the move it teaches
console.log(machine.version_group.name); // the games it applies to
```

## Methods

| Method | Returns |
| --- | --- |
| `getMachineById(id)` | `Machine` |
| `listMachines(offset?, limit?)` | `NamedAPIResourceList` |

::: info
Machines have no names upstream — the same TM number teaches different moves in different games, so
a machine is identified by id alone. That is also why every machine carries a `version_group`.
:::

## Which TM teaches what

A machine ties three things together: the `item` (the TM or HM), the `move` it teaches, and the
`version_group` it applies to. To go from a move to its machines, read `Move.machines`:

```ts
import { MoveClient, MachineClient, UtilityClient, type Machine } from 'pokenode-ts';

const surf = await new MoveClient().getMoveByName('surf');
const utility = new UtilityClient();

for (const entry of surf.machines) {
  const machine = await utility.getResourceByUrl<Machine>(entry.machine.url);

  console.log(`${machine.item.name} in ${machine.version_group.name}`);
}
```
