# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`pokenode-ts` — typed PokéAPI client, zero runtime dependencies, built on native `fetch`. Ships dual ESM/CJS from `src/index.ts` to `lib/`. Package manager is **pnpm** (`packageManager` pin); Node >= 20.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm test` | Vitest, watch mode |
| `pnpm test run tests/berry/berry.spec.ts` | Single file, single run (no `--`; pnpm swallows the filter after it) |
| `pnpm test run tests/berry -t "list of berries"` | Single test by name |
| `pnpm test:types` | Type-level tests only (`*.test-d.ts`, `--typecheck.only`) |
| `pnpm test:coverage` | Single run + lcov/html coverage |
| `pnpm lint` | Biome check, writes fixes |
| `pnpm lint:ci` | Biome check, no writes — what CI runs |
| `pnpm build` | tsdown build; runs `publint` + `attw` as part of it |
| `pnpm docs:dev` | VitePress docs site locally |
| `npx tsc --noEmit` | Typecheck (no dedicated script; lefthook runs this pre-commit) |

Match CI before opening a PR: `pnpm lint:ci && pnpm test:coverage && pnpm test:types && pnpm build`.

## Architecture

**Layers.** `src/models/` (pure types mirroring PokéAPI schemas) → `src/constants/` (endpoint paths + name→ID enum maps) → `src/clients/` (one class per PokéAPI section) → `src/index.ts` (single public barrel).

**`BaseClient` (`src/clients/base.ts`) holds all transport logic.** Every section client is a thin subclass whose methods just call `getResource(endpoint, id)`, `getResourceByURL(url)`, or `getListResource(endpoint, offset, limit)`. Adding an endpoint means: add the path to `src/constants/endpoints.ts`, the response type under `src/models/`, and a one-line method on the section client. Do not put fetch/cache/logging logic in a section client.

The request pipeline in `BaseClient.request` is: cache lookup → in-flight dedupe map (concurrent identical URLs share one round trip) → `fetch`. Two invariants are load-bearing and documented inline:

- **URL normalization** — `getResource` builds `/berry/1` while `getResourceByURL` receives PokéAPI links ending in `/`. Both are normalized to one cache key or each caches the other's misses.
- **URL joining is string concatenation, not `new URL(path, base)`** — the base carries a `/api/v2` path that URL resolution would discard.
- **`toEndpointPath`** re-resolves foreign absolute URLs against the client's own `baseURL` by parsed URL components (a raw-string version-marker search matches hosts like `api.v2.example.com`).

**`MainClient`** composes all eleven section clients and passes them one shared `CacheStore`, so a resource fetched through one is served from cache by the rest.

**Cache** (`src/config/cache.ts`) — `CacheStore` is a 2-required-method interface (`get`/`set`, optional `delete`/`clear`), every method may return a promise so Redis/KV backends work unchanged. Default `MemoryCache` is LRU + TTL. `clear` is optional on purpose: the library must not flush someone's shared Redis.

**Errors** (`src/config/errors.ts`) — non-2xx rejects with `PokenodeError`; transport failures propagate untouched. `PokenodeError` is matched via the static `isPokenodeError` guard on a `kind` brand, **not** `instanceof` — a tree loading both the ESM and CJS build has two distinct classes. Keep the guard in any new error-handling code and docs.

**Path aliases** (`tsconfig.json`, resolved in tests by `vite-tsconfig-paths`): `@clients`, `@config/*`, `@constants`, `@models`, `@package`. Use them in `src/` and `tests/`; `base.ts` and `main.client.ts` use relative imports to avoid cycles through the barrel.

## Testing

Vitest with `globals: true` — no `import { describe, it }` needed. Specs live in `tests/<section>/`: `*.spec.ts` for behavior, `*.test-d.ts` for type-level assertions (`expectTypeOf`).

**Only the berry suite is mocked.** `tests/utils/setup.ts` registers `BERRY_HANDLERS` with MSW and sets `onUnhandledRequest: "bypass"`, so every other section suite hits the **live PokéAPI** — those fail without network, and an upstream data rename is upstream drift, not a regression. `tests/clients`, `tests/config`, and `tests/logger` are hermetic. New mocked suites follow the berry layout: `mocks/data.ts` + `mocks/handlers.ts` built with `tests/utils/base-handler.ts`, then spread into `HANDLERS` in `setup.ts`.

`retry: 3` and a 10s timeout are set globally to absorb live-API flakiness.

## Conventions

- Biome owns formatting and linting (100 cols, 2 spaces, LF). Don't hand-format around it or loosen a rule to pass a diff.
- Conventional Commits, enforced by commitlint on `commit-msg`. release-please reads the history to pick the version and write the changelog, so `feat:`/`fix:`/`!` choices are functional, not cosmetic.
- lefthook runs biome + `tsc --noEmit` on staged files pre-commit.
- Behavior changes must update the matching page under `docs/src/` (guides + one page per client).
- `main` is the only long-lived branch; branch `<type>/<kebab-description>` off it.

## PokéAPI & Pokémon references

Check these before changing models, endpoints, or constants — the API schema is the source of truth for `src/models/`.

- **PokéAPI v2 docs** — https://pokeapi.co/docs/v2 (per-section anchors, e.g. `#berries-section`, are what client JSDoc links to)
- **PokéAPI repo** — https://github.com/PokeAPI/pokeapi (schema changes, data updates, self-hosting via Docker)
- **PokéAPI sprites repo** — https://github.com/PokeAPI/sprites (what the sprite URLs in responses point at)
- **PokéAPI fair use policy** — https://pokeapi.co/docs/v2#fairuse (why caching is on by default; run a local instance for heavy traffic)
- **PokéAPI Insomnia collection** — https://insomnia.rest/run/?label=Pok%C3%A9API&uri=https%3A%2F%2Fraw.githubusercontent.com%2FGabb-c%2Fpokeapi-insomnia-collection%2Fmain%2Fpokeapi.json (poke at raw responses by hand)
- **Bulbapedia** — https://bulbapedia.bulbagarden.net (game-mechanics meaning behind fields: natures, flavors, growth rates, egg groups)
- **Serebii** — https://www.serebii.net (fastest for newly released game data)
- **Smogon** — https://www.smogon.com/dex/ (competitive semantics of stats, abilities, moves)
