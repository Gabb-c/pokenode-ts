<div align="center">

<img src="https://raw.githubusercontent.com/Gabb-c/pokenode-ts/main/docs/src/public/site-logo.svg" width="96" alt="" />

# Pokenode-ts

**A typed [PokéAPI](https://pokeapi.co/) client with zero runtime dependencies.**

[![npm version](https://img.shields.io/npm/v/pokenode-ts?logo=npm)](https://www.npmjs.com/package/pokenode-ts)
[![CI](https://github.com/Gabb-c/pokenode-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/Gabb-c/pokenode-ts/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Gabb-c_pokenode-ts&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Gabb-c_pokenode-ts)
[![install size](https://packagephobia.com/badge?p=pokenode-ts)](https://packagephobia.com/result?p=pokenode-ts)

[**Documentation**](https://pokenode-ts.vercel.app/) ·
[Getting started](https://pokenode-ts.vercel.app/guides/getting-started) ·
[Migrating to 2.0](https://pokenode-ts.vercel.app/guides/migration)

</div>

---

```bash
npm install pokenode-ts
```

```ts
import { PokemonClient } from 'pokenode-ts';

const api = new PokemonClient();

const luxray = await api.getPokemonByName('luxray');

console.log(luxray.name); // "luxray"
console.log(luxray.types.map((slot) => slot.type.name)); // ["electric"]
```

Need more than one section of the API? `MainClient` bundles all twelve clients behind one object,
sharing a single cache:

```ts
import { MainClient } from 'pokenode-ts';

const api = new MainClient();

await api.pokemon.getPokemonByName('luxray');
await api.berry.getBerryByName('cheri');
```

## Features

- 🛠️ **Typed end to end** — every response mirrors the PokéAPI schema, checked at compile time.
- 🪶 **Zero dependencies** — native `fetch`. Node 22+, Deno, Bun, browsers, edge runtimes.
- 📦 **Caching you control** — in-memory by default; swap in Redis, KV, or any `CacheStore`.
- 🔌 **Your transport** — pass a custom `fetch` for proxies, retries, headers, or timeouts.
- 🌲 **Pluggable logging** — console, pino, a metrics collector, or nothing at all.
- 🧭 **One client or twelve** — a focused client, or `MainClient` sharing one cache across all.

## Documentation

Guides and a page per client live at **[pokenode-ts.vercel.app](https://pokenode-ts.vercel.app/)**.

| Guide | |
| --- | --- |
| [Getting started](https://pokenode-ts.vercel.app/guides/getting-started) | Installation, first request, choosing a client |
| [Errors](https://pokenode-ts.vercel.app/guides/errors) | What throws, what doesn't, and how to tell |
| [Cache](https://pokenode-ts.vercel.app/guides/cache) | Tuning the default store, or supplying your own |
| [Logging](https://pokenode-ts.vercel.app/guides/logging) | The `Logger` interface |
| [Custom Fetch](https://pokenode-ts.vercel.app/guides/fetch) | Proxies, retries, headers, timeouts |
| [Migrating to 2.0](https://pokenode-ts.vercel.app/guides/migration) | Coming from the Axios-based 1.x |

## Fair use

The PokéAPI is free and community-run. Pokenode-ts caches by default, which covers most of what its
[fair use policy](https://pokeapi.co/docs/v2#fairuse) asks. For heavy traffic,
[run your own instance](https://github.com/PokeAPI/pokeapi#docker) and point `baseURL` at it.

## Contributing

Bug reports, docs fixes, and pull requests are welcome — see
[CONTRIBUTING.md](.github/CONTRIBUTING.md). Commits follow
[Conventional Commits](https://www.conventionalcommits.org/).

- Liked it? [Give it a star ⭐](https://github.com/Gabb-c/pokenode-ts)
- Found a problem? [Open an issue 🔎](https://github.com/Gabb-c/pokenode-ts/issues)
- Find it useful? [Buy me a coffee ❤️](https://github.com/sponsors/Gabb-c)

## License

[MIT](LICENSE)

![Analytics](https://repobeats.axiom.co/api/embed/f71a113e3161e1d054170c94e4ac3fcfc960cdd4.svg 'Repobeats analytics image')
