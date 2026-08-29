---
description: "Type effectiveness in pokenode-ts — multiply an attacking type across a dual-typed defender, build a weakness table, and read the chart as it stood in any generation."
---

# Type effectiveness

The PokéAPI publishes a type's damage relations raw. Turning them into the number you actually
want — what a Fire move does to Ferrothorn — is a multiplication across the defender's types, and
`effectiveness` does it:

```ts
import { effectiveness, MainClient } from 'pokenode-ts';

const api = new MainClient();
const fire = await api.pokemon.getTypeByName('fire');
const ferrothorn = await api.pokemon.getPokemonByName('ferrothorn');

effectiveness(fire, ferrothorn.types.map((slot) => slot.type)); // 4
```

The result is one of `0`, `0.25`, `0.5`, `1`, `2` or `4`.

It reads the **attacking** type's own relations, so it needs that one type fetched — not one per
defending type. The defenders are the links a Pokémon response already carries.

## What a Pokémon is weak to

`defensiveProfile` turns it around: every attacking type's multiplier against one defender, keyed by
type name.

```ts
import { defensiveProfile, MainClient } from 'pokenode-ts';

const api = new MainClient();
const types = [];

for await (const type of api.pokemon.paginate('listTypes', { resolve: true })) {
  types.push(type);
}

const gengar = await api.pokemon.getPokemonByName('gengar');
const profile = defensiveProfile(types, gengar.types.map((slot) => slot.type));

profile.psychic; // 2
profile.normal; // 0
profile.fighting; // 0
```

The eighteen types are one walk, and the client caches them, so every lookup after that is local.

The table is keyed by `TypeName` — the eighteen types a Pokémon can be, plus `stellar` — so a
misspelled lookup is a compile error rather than `undefined`:

```ts
profile.psychick;
//      ~~~~~~~~~ not a type name
```

Every entry is `number | undefined`: `types` is whatever you resolved, and a generation scope
legitimately leaves types out. `unknown` and `shadow` never appear — they hold no damage relations,
so a matchup can't involve them, and `defensiveProfile` skips them if you pass them in.

### Without fetching every type

`defensiveProfile` reads each **attacking** type's relations, so it needs all of them. The same
answer is in the **defending** types' own arrays, which is one or two resources:

```ts
import { defensiveProfileFrom, MainClient } from 'pokenode-ts';

const api = new MainClient();
const gengar = await api.pokemon.getPokemonByName('gengar');
const types = await api.resolveAll(gengar.types.map((slot) => slot.type));

const profile = defensiveProfileFrom(types);

profile.psychic; // 2
profile.normal; // 0
```

Two requests instead of the whole `type` section. Reach for this one unless you need a past
generation — the results agree because the chart is symmetric, and
`tests/live/relations.live.spec.ts` is what keeps that claim honest.

Every type name is present here, where `defensiveProfile` can be missing one: a defending type names
every attacker it interacts with, so anything unlisted is neutral rather than unknown. That is also
why it takes no `generation` — the defender's arrays are the current chart, and they have no way to
say an attacking type did not exist yet.

## Older generations

Type charts have moved. Steel resisted Ghost and Dark until generation VI; Ghost did nothing at all
to Psychic in generation I. Both are in `past_damage_relations`, and naming a generation reads
them:

```ts
const ghost = await api.pokemon.getTypeByName('ghost');

effectiveness(ghost, [psychicLink]); // 2
effectiveness(ghost, [psychicLink], { generation: 'generation-i' }); // 0
effectiveness(ghost, [steelLink], { generation: 'generation-iii' }); // 0.5
effectiveness(ghost, [steelLink]); // 1
```

`relationsFor` gives the whole chart rather than one number:

```ts
import { relationsFor } from 'pokenode-ts';

relationsFor(ghost).half_damage_to; // [dark]
relationsFor(ghost, 'generation-iii')?.half_damage_to; // [dark, steel]
```

Each entry in `past_damage_relations` records the **last** generation it applied to. Ghost's
`generation-v` entry is therefore Ghost from II through V, and the current relations take over at
VI — which is what the resolution above works to.

### Types that did not exist yet

Steel and Dark arrived in generation II, Fairy in generation VI. Asking for a chart from before
that returns `undefined` rather than a guess:

```ts
relationsFor(steel, 'generation-i'); // undefined
effectiveness(steel, [rockLink], { generation: 'generation-i' }); // undefined
```

The types reflect it: without a `generation` the result is a `number`, and only the
generation-scoped call can be `undefined`. `defensiveProfile` leaves such a type out of the table
instead of reporting it as neutral.

Only the **attacking** type is checked this way — the defenders arrive as links, which carry no
generation to check against. When the defender's own typing changed too, `Pokemon.past_types` is
where the historically correct one comes from.
