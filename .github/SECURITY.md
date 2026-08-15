# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| 2.x | ✅ |
| 1.x | ❌ — see the [migration guide](https://pokenode-ts.vercel.app/guides/migration) |

Fixes land on the latest minor of 2.x. There are no backports to 1.x, which depended on Axios and
`axios-cache-interceptor`; upgrading is the fix for anything reported against it.

## Reporting a vulnerability

**Do not open a public issue.**

1. Go to [Security Advisories](https://github.com/Gabb-c/pokenode-ts/security/advisories/new).
2. Click **Report a vulnerability** to open a private report.

Please include:

- **Description** — what the issue is and how it can be exploited.
- **Reproduction** — the smallest code that demonstrates it.
- **Affected versions** — which versions you tested, and which are affected.
- **Impact** — what an attacker gains.
- **Mitigations** — any workaround you found.

You can expect an acknowledgement within a few days. If a fix is warranted, it ships in a patch
release and the advisory is published with credit to you unless you'd rather stay anonymous.

## Scope

pokenode-ts is a client library with no runtime dependencies and no server component. It makes
`GET` requests to the PokéAPI and caches the responses. The likeliest real issues are therefore:

- URL construction — a caller-supplied name or `getResourceByUrl` argument reaching an unintended host.
- Cache key collisions, where one resource is served in place of another.
- Anything that lets a response body escape the parsing boundary.

The following are **out of scope**, though we'd still like to hear about them through a normal issue:

- Vulnerabilities in the PokéAPI itself — report those to [PokeAPI/pokeapi](https://github.com/PokeAPI/pokeapi).
- Denial of service caused by your own unbounded request volume. The library imposes no rate limit;
  the [PokéAPI's fair use policy](https://pokeapi.co/docs/v2#fairuse) is yours to respect.
- Issues that only occur with a deliberately hostile `CacheStore`, `Logger`, or `fetch` that you
  supplied yourself. Those are injection points by design and are trusted.

## Keeping yourself safe

Stay on the latest 2.x. Since the library has no runtime dependencies, keeping up to date means
your supply chain surface here is the package alone — and every release since 2.0 is published from
CI via [npm trusted publishing](https://docs.npmjs.com/trusted-publishers), so releases carry a
provenance attestation you can verify with `npm audit signatures`.
