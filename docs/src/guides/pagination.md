---
description: "Walk every page of a PokéAPI list endpoint with pokenode-ts — paginate() yields entries one at a time, and resolves each link with bounded concurrency when you ask it to."
---

# Pagination

Every `list*` method returns one page:

```ts
const page = await api.berry.listBerries(0, 20);

page.count; // 64
page.results; // 20 links
```

To walk the whole section, hand that method to `paginate()` and let it manage the offset:

```ts
import { MainClient } from 'pokenode-ts';

const api = new MainClient();

for await (const berry of api.berry.paginate((offset, limit) =>
  api.berry.listBerries(offset, limit),
)) {
  console.log(berry.name);
}
```

`paginate()` is on every section client, and works with any list method — including the five sections
whose entries have no name (`machine`, `contest-effect`, `super-contest-effect`, `evolution-chain`,
`characteristic`), whose entries come back carrying a `url` and nothing else.

## Resolving as you go

The entries a list yields are links. Pass `resolve` to fetch each one and get the resource itself:

```ts
for await (const berry of api.berry.paginate(
  (offset, limit) => api.berry.listBerries(offset, limit),
  { resolve: true },
)) {
  console.log(berry.name, berry.growth_time);
}
```

Entries are yielded in the order the API listed them, whatever order the responses arrive in.

## Options

```ts
interface PaginateOptions {
  pageSize?: number; // entries per request, default 20
  resolve?: boolean; // fetch each link, default false
  concurrency?: number; // links resolved at a time, default 4
}
```

`pageSize` defaults to 20 because that is what the PokéAPI itself returns for a list with no `limit`,
so a walk with no options requests exactly what a hand-written loop would. Raise it to cut the number
of round trips a full walk costs — the whole Pokémon section is ~66 requests at 20 per page, ~14 at
100:

```ts
api.pokemon.paginate((offset, limit) => api.pokemon.listPokemons(offset, limit), { pageSize: 100 });
```

:::warning
`concurrency` defaults to 4 on purpose. Walking a whole section resolved is hundreds of requests, and
the [PokéAPI fair-use policy](https://pokeapi.co/docs/v2#fairuse) asks clients to be gentle. Raise it
against a local instance, not against pokeapi.co.
:::

## Stopping early

Break out of the loop and no further page is requested:

```ts
for await (const berry of api.berry.paginate((offset, limit) =>
  api.berry.listBerries(offset, limit),
)) {
  if (berry.name.startsWith('lum')) {
    found = berry;
    break; // nothing more is fetched
  }
}
```

To put a deadline on a walk, run it through a [scoped client](./cancellation):

```ts
const scoped = api.with({ timeout: 30_000 });

for await (const berry of scoped.berry.paginate((offset, limit) =>
  scoped.berry.listBerries(offset, limit),
)) {
  // …
}
```

:::tip
Every page and every resolved resource goes through the client's [cache](./cache), so a second walk
over the same section costs nothing while the entries are still fresh.
:::
