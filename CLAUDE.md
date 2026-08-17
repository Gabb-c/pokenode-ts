# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`pokenode-ts` — typed PokéAPI client, zero runtime dependencies, built on native `fetch`. Ships dual ESM/CJS from `src/index.ts` to `lib/`. Package manager is **pnpm** (`packageManager` pin); Node >= 22.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm test` | Vitest, watch mode |
| `pnpm test run tests/berry/berry.spec.ts` | Single file, single run (no `--`; pnpm swallows the filter after it) |
| `pnpm test run tests/berry -t "list of berries"` | Single test by name |
| `pnpm test:run` | Vitest, unit project, single run |
| `pnpm typecheck` | `tsc --noEmit` twice: root config (`src`, no Vitest globals) then `tests/tsconfig.json` |
| `pnpm test:live` | Drift check against the real PokéAPI — needs network, not part of CI on PRs |
| `pnpm test:coverage` | Single run + lcov/html coverage |
| `pnpm lint` | Biome check, writes fixes |
| `pnpm lint:ci` | Biome check, no writes — what CI runs |
| `pnpm build` | tsdown build; runs `publint` + `attw` as part of it |
| `pnpm docs:dev` | VitePress docs site locally |

Match CI before opening a PR: `pnpm lint:ci && pnpm typecheck && pnpm test:coverage && pnpm build`.

## Architecture

**Layers.** `src/models/` (pure types mirroring PokéAPI schemas) → `src/constants/` (endpoint paths + name→ID enum maps) → `src/clients/` (one class per PokéAPI section) → `src/index.ts` (single public barrel).

**`BaseClient` (`src/clients/base.ts`) holds all transport logic.** Every section client is a thin subclass whose methods just call `getResource(endpoint, id)`, `getResourceByURL(url)`, or `getListResource(endpoint, offset, limit)`. Adding an endpoint means: add the path to `src/constants/endpoints.ts`, the response type under `src/models/`, and a one-line method on the section client. Do not put fetch/cache/logging logic in a section client.

The request pipeline in `BaseClient.request` is: cache lookup → in-flight dedupe map (concurrent identical URLs share one round trip) → `fetch`. Two invariants are load-bearing and documented inline:

- **URL normalization** — `getResource` builds `/berry/1` while `getResourceByURL` receives PokéAPI links ending in `/`. Both are normalized to one cache key or each caches the other's misses.
- **URL joining is string concatenation, not `new URL(path, base)`** — the base carries a `/api/v2` path that URL resolution would discard.
- **`toEndpointPath`** re-resolves foreign absolute URLs against the client's own `baseURL` by parsed URL components (a raw-string version-marker search matches hosts like `api.v2.example.com`).

**`MainClient`** composes all twelve section clients and passes them one shared `CacheStore`, so a resource fetched through one is served from cache by the rest.

**Cache** (`src/config/cache.ts`) — `CacheStore` is a 2-required-method interface (`get`/`set`, optional `delete`/`clear`), every method may return a promise so Redis/KV backends work unchanged. Default `MemoryCache` is LRU + TTL. `clear` is optional on purpose: the library must not flush someone's shared Redis.

**Resource links** (`src/models/Common/resource.ts`) — `NamedAPIResource<T>`/`APIResource<T>` carry `T` on a phantom `unique symbol` key, which is what types `getResourceByUrl(link)`. Nominal per declaration, so a link crossing the ESM/CJS boundary degrades to `unknown` — same dual-build split as `PokenodeError` below. The five sections whose list entries have no `name` (`machine`, `contest-effect`, `super-contest-effect`, `evolution-chain`, `characteristic`) return `APIResourceList<T>` via `BaseClient.getUnnamedListResource`, not `NamedAPIResourceList<T>`.

**Errors** (`src/config/errors.ts`) — non-2xx rejects with `PokenodeError`; transport failures propagate untouched. `PokenodeError` is matched via the static `isPokenodeError` guard on a `kind` brand, **not** `instanceof` — a tree loading both the ESM and CJS build has two distinct classes. Keep the guard in any new error-handling code and docs.

**Path aliases** (`tsconfig.json`, resolved in tests by Vite's native `resolve.tsconfigPaths`): `@clients`, `@config/*`, `@constants`, `@models`, `@package`. That option is a boolean — it resolves aliases from the nearest file *named* `tsconfig.json` whose `include` matches, which is why the test config is `tests/tsconfig.json` and not a root-level `tsconfig.test.json`. Use the aliases in `src/` and `tests/`; `base.ts` and `main.client.ts` use relative imports to avoid cycles through the barrel.

## Testing

Vitest with `globals: true` — no `import { describe, it }` needed. Three tiers, split into Vitest
projects in `vitest.config.ts`:

| Tier | Where | Run by | Network |
| --- | --- | --- | --- |
| Unit — endpoint mapping | `tests/clients/<section>.spec.ts` | `pnpm test` (`unit` project) | none, stubbed `fetch` |
| Transport — cache, dedupe, errors, URL normalization | `tests/clients/base.spec.ts`, `tests/clients/main.spec.ts` | `pnpm test` (`unit` project) | none, MSW |
| Drift | `tests/live/*.live.spec.ts` | `pnpm test:live` (`live` project), weekly cron only | **live PokéAPI** |

**`pnpm test` is hermetic and must stay that way.** `tests/helpers/setup.ts` starts MSW with *no*
default handlers and `onUnhandledRequest: "error"`, so any request a test did not explicitly mock
fails the run instead of leaking to pokeapi.co.

Section clients are one-line delegations to `BaseClient`, so their tests assert **the URL a method
builds**, not the payload — a stubbed `fetch` returns `{ id: 1 }` and the table checks where the
request went. Adding a client method means adding an `[method, path, call]` row to the `it.each`
table in the matching `tests/clients/<section>.spec.ts`, asserted by `expectEndpoint` from
`tests/helpers/stub-fetch.ts`. The table drives `it.each` from the spec file itself so each file
declares its own tests — a helper that registered them would leave Sonar (rule S2187) seeing an
empty test file. Anything
needing a real `Response` (status codes, abort signals, cache behavior) belongs in `base.spec.ts`
with MSW instead.

`tests/live/drift.live.spec.ts` asserts the key set of one resource per section — plus the nested
shapes a top-level key set never reaches — against what `src/models` declares. Rows are built by
`caseFor` in `tests/helpers/model-keys.ts`, which infers the model from the fetch and makes the
compiler prove the key list is exactly its `keyof`, so `pnpm typecheck` catches a list that has
drifted from its type. A failure in the live run is upstream drift, not a regression; it means the
models need updating. `.github/workflows/live.yml` runs it weekly, skips the check when the PokéAPI
itself is down, and files a `live-drift` issue on failure.

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
