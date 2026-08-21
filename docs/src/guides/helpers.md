---
description: "Pure helpers in pokenode-ts — localize() picks the entry in the language you want out of the names, flavor texts, descriptions and effects the PokéAPI publishes per language."
---

# Helpers

Functions that work on data you already have. They make no requests, so they need no client.

## localize

Names, flavor texts, descriptions and effects arrive as one entry per language:

```ts
species.names;
// [
//   { name: 'イーブイ', language: { name: 'ja-hrkt', … } },
//   { name: 'Eevee',   language: { name: 'en', … } },
//   …
// ]
```

`localize()` picks one:

```ts
import { localize, MainClient } from 'pokenode-ts';

const api = new MainClient();
const species = await api.pokemon.getPokemonSpeciesByName('eevee');

localize(species.names)?.name; // 'Eevee'
localize(species.names, 'ja')?.name; // 'イーブイ'
localize(species.flavor_text_entries)?.flavor_text;
```

It accepts anything the API publishes per language (`Name`, `FlavorText`, `Description`, `Effect`,
`VerboseEffect`) and returns the entry's own type, so its fields are still there.

Language tags are lower case, the way the PokéAPI writes them. All fourteen: `ja-hrkt`, `ja-roma`,
`ko`, `zh-hant`, `fr`, `de`, `es`, `it`, `en`, `cs`, `ja`, `zh-hans`, `pt-br`, `es-419`.
`api.utility.listLanguages()` is the live list.

Matching ignores case, so `ja-Hrkt` finds the same entry as `ja-hrkt`.

### When the language is missing

You get `undefined`. Pick your own fallback:

```ts
const name = localize(species.names, 'ko') ?? localize(species.names, 'en');
```

### When there's more than one

Some sections list several entries per language — flavor text, one per game version. `localize()`
returns the first. Filter first if you want a particular one:

```ts
const scarlet = species.flavor_text_entries.filter(
  (entry) => entry.version.name === 'scarlet',
);

localize(scarlet)?.flavor_text;
```

:::tip
Flavor text from the older games carries hard line breaks (`\n`) and form feeds (`\f`) from the
original cartridges. Replace them before rendering.
:::
