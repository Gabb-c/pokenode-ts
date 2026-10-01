---
layout: home
title: Typed PokéAPI client for TypeScript
description: Typed PokéAPI client for Node, Deno, Bun and browsers. Zero runtime dependencies, built-in caching, and types checked against the live API every day.

hero:
  name: Pokenode-ts
  text: A typed PokéAPI client with zero runtime dependencies
  tagline: Types checked against the live PokéAPI every day, so they say what the API actually sends.
  actions:
    - theme: brand
      text: Get Started
      link: /guides/getting-started
    - theme: alt
      text: Upgrading to 3.0
      link: /guides/migration
    - theme: alt
      text: View on GitHub
      link: https://github.com/Gabb-c/pokenode-ts

features:
  - icon: MainClient
    title: Typed, and kept honest
    details: Every endpoint and field is typed from the PokéAPI schema. A daily job diffs those types against the live API and opens an issue the moment one drifts.
    link: /guides/getting-started
    linkText: Get started
  - icon: "resolve() · paginate()"
    title: Links and pages, handled
    details: <code>resolve(pokemon.species)</code> follows a <code>{ name, url }</code> ref and hands back the species, typed. <code>paginate('listPokemons')</code> walks a whole section and stops fetching when you break.
    link: /guides/pagination
    linkText: Pagination
  - icon: CacheStore
    title: Ready for production
    details: Cached from the first call, as the PokéAPI's fair-use policy asks, with Redis or KV as drop-ins. Opt-in retries that honor <code>Retry-After</code>, timeouts and cancellation. Runs on Node, Deno, Bun, browsers and edge runtimes.
    link: /guides/cache
    linkText: Caching
---

## Install

::: code-group

```bash [npm]
npm install pokenode-ts
```

```bash [pnpm]
pnpm add pokenode-ts
```

```bash [yarn]
yarn add pokenode-ts
```

```bash [bun]
bun add pokenode-ts
```

:::

## Why not just fetch?

The same request, twice: once against the raw API, once through the client.

::: code-group

```ts [fetch]
const res = await fetch('https://pokeapi.co/api/v2/pokemon/luxray');
const pokemon = await res.json(); // any [!code warning]
// a 404 resolves too: nothing here checks res.ok [!code warning]

const speciesRes = await fetch(pokemon.specie.url); // typo compiles, throws at runtime [!code error]
const species = await speciesRes.json(); // any, again [!code warning]

console.log(species.flavor_text_entries[0].flavour_text); // undefined, no error [!code error]
```

```ts [pokenode-ts]
import { MainClient } from 'pokenode-ts';

const api = new MainClient();

const pokemon = await api.pokemon.getPokemonByName('luxray'); // Pokemon
const species = await api.resolve(pokemon.species); // PokemonSpecies

console.log(species.flavor_text_entries[0].flavor_text);
```

:::

`res.json()` hands back `any`, so every typo compiles and only shows up as `undefined` or a
`TypeError` at runtime. `fetch` resolves on a 404, so a missing Pokémon reads as an empty object.
And every run hits the API again, which its fair-use policy asks you not to do.

The client types every response, rejects non-2xx with a
[`PokenodeError`](/guides/errors), and caches from the first call. `resolve` needs no type
annotation: the link carries the type of what it points at. Read the
[getting started guide](/guides/getting-started) to pick a client, or browse them under
**Clients** in the nav.
