<div align="center">

<img src="https://raw.githubusercontent.com/Gabb-c/pokenode-ts/main/docs/src/public/site-logo.svg" width="96" alt="pokenode-ts-logo" />

# Pokenode-ts

**A typed [PokéAPI](https://pokeapi.co/) client with zero runtime dependencies.**

[![npm version](https://img.shields.io/npm/v/pokenode-ts?logo=npm)](https://www.npmjs.com/package/pokenode-ts)
[![min+gzip](https://img.shields.io/bundlejs/size/pokenode-ts?label=min%2Bgzip)](https://bundlejs.com/?q=pokenode-ts)
[![CI](https://github.com/Gabb-c/pokenode-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/Gabb-c/pokenode-ts/actions/workflows/ci.yml)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=Gabb-c_pokenode-ts&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Gabb-c_pokenode-ts)

[**Documentation**](https://pokenode-ts.vercel.app/) ·
[Getting started](https://pokenode-ts.vercel.app/guides/getting-started) ·
[Migrating to 2.0](https://pokenode-ts.vercel.app/guides/migration)

</div>

---

## Install

```bash
npm install pokenode-ts
```

Node 22+, Deno, Bun, browsers, edge runtimes.

## Usage

```ts
import { PokemonClient } from 'pokenode-ts';

const api = new PokemonClient();
const luxray = await api.getPokemonByName('luxray');

luxray.types.map((slot) => slot.type.name); // ["electric"]

const ability = await api.resolve(luxray.abilities[0].ability); // typed Ability
```

`MainClient` bundles all twelve section clients behind one object, sharing a single cache:

```ts
import { MainClient } from 'pokenode-ts';

const api = new MainClient();

await api.pokemon.getPokemonByName('luxray');
await api.berry.getBerryByName('cheri');
```

Non-2xx responses reject with `PokenodeError`. Match it with the static guard — `instanceof`
breaks across the ESM/CJS boundary:

```ts
if (PokenodeError.isPokenodeError(err)) err.status; // 404
```

## Features

- **Typed end to end** — responses mirror the PokéAPI schema, checked at compile time.
- **Zero dependencies** — native `fetch`, nothing else.
- **Caching you control** — in-memory by default, or any `CacheStore` (Redis, KV).
- **Yours to wire up** — a custom `fetch` for proxies and retries; `with({ signal, timeout })` per
  request; a logger, or none.
- **More than a wrapper** — type-chart effectiveness, evolution-chain flattening, sprite URLs,
  localized names.
- **Conditional requests** — ETag revalidation; concurrent identical URLs share one round trip.
- **Pagination** — `for await (const berry of api.berry.paginate('listBerries'))`.
- **One client or twelve** — focused clients, or `MainClient` sharing one cache.

## Fair use

The PokéAPI is free and community-run. Pokenode-ts caches by default, which covers most of what its
[fair use policy](https://pokeapi.co/docs/v2#fairuse) asks. For heavy traffic,
[run your own instance](https://github.com/PokeAPI/pokeapi#docker) and point `baseURL` at it.

## Contributing

Issues and pull requests are welcome — see
[CONTRIBUTING.md](https://github.com/Gabb-c/pokenode-ts/blob/main/.github/CONTRIBUTING.md).
Commits follow [Conventional Commits](https://www.conventionalcommits.org/). If it's useful to you,
[star it](https://github.com/Gabb-c/pokenode-ts) or
[sponsor it](https://github.com/sponsors/Gabb-c).

## License

[MIT](https://github.com/Gabb-c/pokenode-ts/blob/main/LICENSE)
