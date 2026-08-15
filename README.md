<div align="center">

# Pokenode-ts

**A typed [PokéAPI](https://pokeapi.co/) client with zero runtime dependencies.**

[![npm version](https://img.shields.io/npm/v/pokenode-ts?logo=npm)](https://www.npmjs.com/package/pokenode-ts)
[![CI](https://github.com/Gabb-c/pokenode-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/Gabb-c/pokenode-ts/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/Gabb-c/pokenode-ts/branch/main/graph/badge.svg?token=whfY8GNSpS)](https://codecov.io/gh/Gabb-c/pokenode-ts)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Gabb-c_pokenode-ts&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Gabb-c_pokenode-ts)
[![install size](https://packagephobia.com/badge?p=pokenode-ts)](https://packagephobia.com/result?p=pokenode-ts)

[Documentation](https://pokenode-ts.vercel.app/) ·
[Getting started](https://pokenode-ts.vercel.app/guides/getting-started) ·
[Migrating to 2.0](https://pokenode-ts.vercel.app/guides/migration)

</div>

---

## Features

- 🛠️ **Built-in types** — every response is typed from the PokéAPI schema, checked at compile time.
- 🪶 **Zero dependencies** — built on native `fetch`. Runs in Node 20+, Deno, Bun, browsers, and edge runtimes.
- 📦 **Caching you control** — in-memory by default, or bring Redis, a KV namespace, or anything implementing `CacheStore`.
- 🔌 **Bring your own transport** — pass a custom `fetch` for proxies, retries, headers, or timeouts.
- 🌲 **Pluggable logging** — send the request lifecycle to the console, to pino, or nowhere at all.
- 🧭 **One client or twelve** — reach for a focused client, or `MainClient` to get all of them sharing one cache.

## Installation

```bash
npm install pokenode-ts
```

`pnpm add`, `yarn add`, and `bun add` work the same way.

## Usage

```ts
import { PokemonClient } from 'pokenode-ts';

const api = new PokemonClient();

const pokemon = await api.getPokemonByName('luxray');

console.log(pokemon.name); // "luxray"
console.log(pokemon.types.map((slot) => slot.type.name)); // ["electric"]
```

Need several sections of the API? `MainClient` bundles all twelve clients behind one object and
gives them a single shared cache:

```ts
import { MainClient } from 'pokenode-ts';

const api = new MainClient();

await api.pokemon.getPokemonByName('luxray');
await api.berry.getBerryByName('cheri');
```

## Error handling

A non-2xx response rejects with a `PokenodeError`. Match it with the guard rather than
`instanceof` — a dependency tree that loads both the ESM and the CJS build ends up with two
distinct classes, and `instanceof` against the wrong one is silently `false`:

```ts
import { PokemonClient, PokenodeError } from 'pokenode-ts';

try {
  await new PokemonClient().getPokemonByName('missingno');
} catch (error) {
  if (PokenodeError.isPokenodeError(error)) {
    console.log(error.status); // 404
    console.log(error.statusText); // "Not Found"
    console.log(error.url); // the request URL
    console.log(error.body); // parsed JSON body, when the response had one
  }
}
```

Transport failures — offline, DNS, an abort from a signal you supplied — are not wrapped and reject
with whatever the runtime threw. Clients impose no timeout; supply one through a custom `fetch`:

```ts
new PokemonClient({
  fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(5000) }),
});
```

See the [Errors guide](https://pokenode-ts.vercel.app/guides/errors) for the full picture.

## Documentation

Full guides and a page per client live at **[pokenode-ts.vercel.app](https://pokenode-ts.vercel.app/)**:

| Guide | |
| --- | --- |
| [Getting started](https://pokenode-ts.vercel.app/guides/getting-started) | Installation, first request, choosing a client |
| [Errors](https://pokenode-ts.vercel.app/guides/errors) | What throws, what doesn't, and how to tell |
| [Cache](https://pokenode-ts.vercel.app/guides/cache) | Tuning the default store, or supplying your own |
| [Logging](https://pokenode-ts.vercel.app/guides/logging) | The `Logger` interface |
| [Custom Fetch](https://pokenode-ts.vercel.app/guides/fetch) | Proxies, retries, headers, timeouts |
| [Migrating to 2.0](https://pokenode-ts.vercel.app/guides/migration) | Coming from the Axios-based 1.x |

## Contributing

Bug reports, docs fixes, and pull requests are welcome — see
[CONTRIBUTING.md](.github/CONTRIBUTING.md). Commits follow
[Conventional Commits](https://www.conventionalcommits.org/); releases are cut from `main` by
release-please and published to npm from CI with provenance.

## Fair use

The PokéAPI is free and community-run. Pokenode-ts caches responses by default, which is most of
what its [fair use policy](https://pokeapi.co/docs/v2#fairuse) asks for. If you need heavy or
sustained traffic, [run your own instance](https://github.com/PokeAPI/pokeapi#docker) and point
`baseURL` at it.

## Support

- Liked it? [Give it a star ⭐](https://github.com/Gabb-c/pokenode-ts)
- Found a problem? [Open an issue 🔎](https://github.com/Gabb-c/pokenode-ts/issues)
- Want to help? [Submit a PR 📑](https://github.com/Gabb-c/pokenode-ts/pulls)
- Find it useful? [Buy me a coffee ❤️](https://github.com/sponsors/Gabb-c)

## License

[MIT](.github/LICENSE)

![Analytics](https://repobeats.axiom.co/api/embed/f71a113e3161e1d054170c94e4ac3fcfc960cdd4.svg 'Repobeats analytics image')
