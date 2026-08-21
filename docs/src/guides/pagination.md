---
description: "Walk every page of a PokéAPI list endpoint with pokenode-ts — paginate() yields entries one at a time and can resolve each link for you."
---

# Pagination

Every `list*` method returns a single page:

```ts
const page = await api.berry.listBerries(0, 20);

page.count; // 64
page.results; // 20 links
```

`paginate()` walks all of them. Name the list method and it manages the offset:

```ts
import { MainClient } from 'pokenode-ts';

const api = new MainClient();

for await (const berry of api.berry.paginate('listBerries')) {
  console.log(berry.name);
}
```

Only that client's own list methods are accepted, and your editor completes them —
`api.berry.paginate('listMachines')` won't type-check. Entry types come from the method you name, so
there's nothing to annotate.

It's on every section client, including the five whose entries have no name (`machine`,
`contest-effect`, `super-contest-effect`, `evolution-chain`, `characteristic`). Those yield entries
carrying just a `url`.

## Walking your own list

Pass a function instead of a name for a list this client doesn't serve:

```ts
for await (const berry of api.berry.paginate((offset, limit) =>
  api.berry.listBerries(offset, limit),
)) {
  console.log(berry.name);
}
```

## Resolving as you go

List entries are links. Set `resolve` to fetch each one:

```ts
for await (const berry of api.berry.paginate('listBerries', { resolve: true })) {
  console.log(berry.name, berry.growth_time);
}
```

Entries come back in the order the API listed them, regardless of which responses land first.

## Options

```ts
interface PaginateOptions {
  pageSize?: number; // entries per request, default 20
  resolve?: boolean; // fetch each link, default false
  concurrency?: number; // links resolved at a time, default 4
}
```

Raise `pageSize` to cut round trips. The whole Pokémon section is ~66 requests at 20 per page, ~14
at 100:

```ts
api.pokemon.paginate('listPokemons', { pageSize: 100 });
```

:::warning
Walking a section with `resolve` is hundreds of requests. `concurrency` defaults to 4 because the
[PokéAPI fair-use policy](https://pokeapi.co/docs/v2#fairuse) asks clients to go easy. Raise it
against a local instance, not against pokeapi.co.
:::

## Stopping early

`break` out of the loop and no further page is requested:

```ts
for await (const berry of api.berry.paginate('listBerries')) {
  if (berry.name.startsWith('lum')) {
    found = berry;
    break; // nothing more is fetched
  }
}
```

For a deadline on the whole walk, use a [scoped client](./cancellation):

```ts
const scoped = api.with({ timeout: 30_000 });

for await (const berry of scoped.berry.paginate('listBerries')) {
  // …
}
```

:::tip
Pages and resolved resources both go through the [cache](./cache), so a second walk over the same
section is free while the entries are still fresh.
:::
