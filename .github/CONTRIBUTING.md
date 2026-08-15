# Contributing to pokenode-ts

Thanks for taking the time. Bug reports, docs fixes, and pull requests are all welcome.

## Setting up

You need [Node.js](https://nodejs.org/) 20 or newer and [pnpm](https://pnpm.io/installation). The
CI runs the test suite on Node 22 and 24, so either of those is the safest local choice.

```bash
git clone https://github.com/<your-username>/pokenode-ts.git
cd pokenode-ts
pnpm install
```

`pnpm install` also installs the [lefthook](https://lefthook.dev/) git hooks, which format, lint,
and type-check what you stage, and check your commit message.

## Branching

`main` is the only long-lived branch, and releases are cut from it. Branch off `main` and open your
pull request against `main`.

```bash
git switch -c fix/berry-flavor-typo
```

Name branches `<type>/<short-description>` in kebab-case, using the same types as commits below.

> [!NOTE]
> Older versions of this guide described `dev` and `stable` branches. Those are gone — everything
> goes through `main`.

## Commit messages

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/). This is enforced
by commitlint on `commit-msg`, and it is not cosmetic: [release-please](https://github.com/googleapis/release-please)
reads the commit history to decide the next version number and to write `CHANGELOG.md`.

```
<type>(<optional scope>): <description>
```

| Type | Effect on the next release |
| --- | --- |
| `fix:` | Patch bump |
| `feat:` | Minor bump |
| `feat!:` / `fix!:`, or a `BREAKING CHANGE:` footer | Major bump |
| `docs:`, `test:`, `refactor:`, `chore:`, `ci:`, `build:`, `perf:`, `style:` | No release |

Keep the subject under 50 characters and in the imperative mood — "add berry flavor guard", not
"added" or "adds". Add a body only when the *why* isn't clear from the diff.

A breaking change needs the `!` **and** a `BREAKING CHANGE:` footer explaining what consumers have
to do:

```
feat!: replace axios with native fetch

BREAKING CHANGE: axios and axios-cache-interceptor are no longer peer
dependencies. cacheOptions is replaced by cache?: CacheStore | false.
```

One logical change per commit. Squash noise locally before pushing.

## Working on the code

| Command | What it does |
| --- | --- |
| `pnpm test` | Run the test suite in watch mode |
| `pnpm test:live` | Check the real PokéAPI for shape changes (needs network) |
| `pnpm typecheck` | Type-check `src` and `tests` with `tsc --noEmit` |
| `pnpm test:coverage` | Single run with a coverage report |
| `pnpm test:ui` | Vitest's browser UI |
| `pnpm lint` | Biome check, writing fixes |
| `pnpm lint:ci` | Biome check without writing — what CI runs |
| `pnpm build` | Build with tsdown, including `publint` and `attw` checks |
| `pnpm docs:dev` | Run the documentation site locally |

Before opening a pull request, the fastest way to match CI is:

```bash
pnpm lint:ci && pnpm typecheck && pnpm test:coverage && pnpm build
```

The suite is split into three tiers:

- **Unit and transport** (`tests/clients`, `tests/config`) — what `pnpm test` runs. Fully hermetic:
  section clients are driven through a stubbed `fetch`, and everything needing a real `Response`
  goes through MSW. No network, ever. A request that no test mocked fails the run rather than
  reaching pokeapi.co, so `pnpm test` works offline and on a plane.
- **Drift** (`tests/live`) — `pnpm test:live`. The only suite that talks to the real PokéAPI. It
  asserts the *shape* of one resource per section, so a failure means the upstream response changed
  and `src/models` needs updating. It runs on a weekly schedule, never on a pull request.

When you add a client method, add a row to the table in the matching `tests/clients/<section>.spec.ts`
asserting the URL it requests. Payload shape is a compile-time concern and needs no fixture.

## Code style

Biome owns formatting and linting; don't hand-format around it, and don't loosen a rule to make a
diff pass. Beyond that:

- Comments explain **why**, not what. Well-named identifiers cover the rest.
- Types at module boundaries; let inference handle locals.
- No dead code and no commented-out blocks.
- Prefer editing an existing file to adding a new one.

## Pull requests

- One logical change per pull request. Refactors, renames, and dependency bumps stay out of a
  feature or bugfix PR.
- Title the PR the same way you'd write the commit — it is what lands on `main` if the PR is
  squashed, and release-please reads it.
- Add a test for a bug fix. The failing test first, then the fix.
- Update the docs under `docs/src` when you change behavior. A behavior change with stale docs is
  an incomplete change.
- Fill in the [pull request template](https://github.com/Gabb-c/pokenode-ts/blob/main/.github/pull_request_template.md)
  rather than deleting it.

Maintainers review against `main`; CI must be green before merge.

## Releasing

Releases are automatic and maintainer-only, but it's worth knowing how your commit reaches npm:

1. A merge to `main` triggers the `Release` workflow.
2. release-please opens or updates a standing release PR, with the version bump and changelog
   derived from the commits since the last tag.
3. Merging that PR tags the release.
4. The tag triggers a publish to npm using GitHub OIDC ([trusted publishing](https://docs.npmjs.com/trusted-publishers)),
   which also attaches a provenance attestation. No long-lived npm token is involved.

## Reporting things

- **Bugs:** [open a bug report](https://github.com/Gabb-c/pokenode-ts/issues/new?template=bug_report.yml).
- **Ideas:** [open a feature request](https://github.com/Gabb-c/pokenode-ts/issues/new?template=feature_request.yml).
- **Security:** do **not** open a public issue. Follow
  [SECURITY.md](https://github.com/Gabb-c/pokenode-ts/blob/main/.github/SECURITY.md).

## Testing PokéAPI endpoints by hand

An [Insomnia](https://insomnia.rest/) collection of the PokéAPI is available if you want to poke at
the raw responses:

[![Run in Insomnia](https://img.shields.io/badge/Insomnia-5849be?style=for-the-badge&logo=Insomnia&logoColor=white&label=Run%20in&labelColor=black)](https://insomnia.rest/run/?label=Pok%C3%A9API&uri=https%3A%2F%2Fraw.githubusercontent.com%2FGabb-c%2Fpokeapi-insomnia-collection%2Fmain%2Fpokeapi.json)

## Code of Conduct

Participation is governed by the
[Code of Conduct](https://github.com/Gabb-c/pokenode-ts/blob/main/.github/CODE_OF_CONDUCT.md).
