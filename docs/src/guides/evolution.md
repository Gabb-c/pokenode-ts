---
description: "Evolution chains in pokenode-ts — flatten the recursive chain into steps, find the path to one species, and read an evolution's thirty nullable fields as a typed list of conditions."
---

# Evolution chains

`/evolution-chain` answers with a tree. `flattenChain` turns it into a list of steps:

```ts
import { flattenChain, MainClient } from 'pokenode-ts';

const api = new MainClient();
const species = await api.pokemon.getPokemonSpeciesByName('eevee');
const chain = await api.resolve(species.evolution_chain);

for (const step of flattenChain(chain)) {
  console.log(`${step.from.name} → ${step.to.name}`);
}
// eevee → vaporeon
// eevee → jolteon
// … eight in all
```

Each step carries `from`, `to`, its `depth` in the chain (`1` for a first evolution), whether `to`
is a baby, and the `details` describing how it happens.

The species the chain starts from is not a step — it is what everything else evolves from, and the
API gives it nothing to describe.

## One game at a time

`details` is a list of **alternatives**, not a sequence: the API publishes one per version group.
Leafeon carries six — five mossy-rock locations across the games that had them, and a Leaf Stone in
Sword/Shield.

`versionGroup` keeps only the details tagged with that version group:

```ts
flattenChain(chain, { versionGroup: 'sword-shield' });
// leafeon, glaceon, sylveon — the steps whose method Sword/Shield introduced
```

:::warning
A detail's `version_group` is the game that **introduced** that method, not every game it applies
in. Eevee's Water Stone detail is tagged `red-blue` and nothing else, so filtering to `sword-shield`
drops Vaporeon — even though Sword/Shield evolves Eevee into Vaporeon exactly as before. Use this to
answer "what changed in this game", not "what can this game do".
:::

A step with nothing left is dropped, but the chain below it is still walked: every edge is filtered
on its own terms, so an evolution missing from a game does not hide the one after it.

## The path to one species

```ts
import { pathTo } from 'pokenode-ts';

pathTo(chain, 'dustox')?.map((step) => step.to.name); // ['cascoon', 'dustox']
pathTo(chain, 'wurmple'); // [] — it is what the chain starts from
pathTo(chain, 'pikachu'); // undefined — not in this chain
```

`[]` and `undefined` are different answers to different questions, so they are different values.

## Reading an evolution's conditions

`EvolutionDetail` has some thirty fields and almost all of them are `null`. `requirementsOf` gives
back only what is set, as a discriminated union:

```ts
import { requirementsOf } from 'pokenode-ts';

requirementsOf(step.details[0]);
// [
//   { kind: 'trigger', trigger: { name: 'level-up', … } },
//   { kind: 'min-happiness', happiness: 160 },
//   { kind: 'known-move-type', type: { name: 'fairy', … } },
// ]
```

The trigger leads, so rendering one is a walk over a single array, and `kind` makes a `switch` over
it exhaustive.

Every field is read against the value the API uses for "unset" rather than for truthiness — worth
knowing if you walk the detail yourself, because `relative_physical_stats` is `0` when Attack has to
*equal* Defense, and `time_of_day` is `''`.

### As a sentence

```ts
import { formatRequirements, requirementsOf } from 'pokenode-ts';

formatRequirements(requirementsOf(detail));
// 'level up, with at least 160 happiness, knowing a fairy-type move'
```

This is the only English in the library, and a separate export for that reason: rendering your own —
in another language, or as anything other than a sentence — drops it and its phrase table from your
bundle.

Resources are named the way the API names them, not the way a game displays them: `water stone`,
not `Water Stone`. The display name is `localize(item.names)`, it costs a request, and `name` is
where you put it:

```ts
const items = await api.resolveAll(links);
const display = new Map(items.map((item) => [item.name, localize(item.names, 'fr')?.name]));

formatRequirements(requirements, {
  name: (resource) => display.get(resource.name) ?? resource.name,
});
// 'use Pierre Eau'
```

The namer applies to every kind that names a resource — items, moves, species, locations, regions,
forms, types. It's the half of a translation `phrases` can't do: the library supplies the connective
words, the API supplies the names, and `name` is the only way the second half can reach you, since
fetching them is a request this function can't make.

### Changing the words

`phrases` replaces the wording of the kinds you name and keeps the rest — including the sentence
around them, and the rule that says an item is used once rather than twice:

```ts
formatRequirements(requirements, {
  phrases: { 'min-happiness': ({ happiness }) => `at ${happiness} friendship` },
});
// 'level up, at 160 friendship, during the night'
```

Each renderer is handed the requirement it is for, narrowed to that `kind`, so its fields are
there. The defaults are exported as `REQUIREMENT_PHRASES` — spread them to translate the whole
table, or read one to build on it:

```ts
import { REQUIREMENT_PHRASES } from 'pokenode-ts';

formatRequirements(requirements, {
  phrases: { ...REQUIREMENT_PHRASES, trigger: () => 'troca', 'min-level': ({ level }) => `no nível ${level}` },
});
```

An override can also fall back to the default for what it doesn't handle, which is how you reword
two of the sixteen triggers without restating the other fourteen:

```ts
formatRequirements(requirements, {
  phrases: {
    trigger: (requirement) => MINE[requirement.trigger.name] ?? REQUIREMENT_PHRASES.trigger(requirement),
  },
});
```

`requirementPhrases(namer)` builds the same table around a namer, if you want to hold one rather
than pass `name` on every call.

## What the data cannot tell you

Wurmple evolves into Silcoon or Cascoon on a hidden personality value. The API gives both branches
identical details — `level-up` at level 7 — so nothing here can separate them. Same shape, same
conditions, two outcomes.
