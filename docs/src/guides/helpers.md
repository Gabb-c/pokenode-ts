---
description: "Pure helpers in pokenode-ts — localize() picks the entry in the language you want out of the names, flavor texts, descriptions and effects the PokéAPI publishes per language, and resourceId() reads the id out of a resource link."
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

You get `undefined`. Name a `fallback` to try another language before giving up:

```ts
localize(species.names, { language: 'ko', fallback: 'en' })?.name;
```

There is no fallback unless you ask for one: which language to settle for is a decision about your
product, not a default.

### When there's more than one

Some sections list several entries per language — flavor text, one per game version. `localize()`
returns the first, which is an arbitrary game's Pokédex entry. `localizeAll()` returns all of them,
so you can pick:

```ts
import { localizeAll } from 'pokenode-ts';

const entries = localizeAll(species.flavor_text_entries, 'en');

entries.find((entry) => entry.version.name === 'scarlet')?.flavor_text;
```

The version is on the entry, and which field carries it depends on the section: `version` on flavor
text, `version_group` on the sections that change per group.

:::tip
Flavor text from the older games carries hard line breaks (`\n`) and form feeds (`\f`) from the
original cartridges. Replace them before rendering.
:::

## resourceId

Every list page gives you names and URLs, and no ids:

```ts
const page = await api.pokemon.listPokemons(0, 20);

page.results[0]; // { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
```

`resourceId()` reads the id out of the link, without a request:

```ts
import { getPokemonSpriteUrl, resourceId, MainClient } from 'pokenode-ts';

const api = new MainClient();
const page = await api.pokemon.listPokemons(0, 1302);

const dex = page.results.map((link) => ({
  name: link.name,
  sprite: getPokemonSpriteUrl(resourceId(link)),
}));
```

That is a grid of every Pokémon off one request. [`getPokemonSpriteUrl()`](./sprites) is keyed by
id, and this is what turns a list link into one.

It takes a URL or the resource carrying it — `link.species`, `slot.type`, `chain.results[0]`, a
string — and throws a `TypeError` when the URL does not end in an id.
