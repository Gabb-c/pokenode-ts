---
description: "How pokenode-ts reports failures: PokenodeError for non-2xx responses, transport errors left untouched, and why isPokenodeError beats instanceof."
---

# Errors

Clients throw for exactly one thing: a response the PokéAPI answered with a non-2xx status.
Everything else — a dropped connection, a DNS failure, an abort — propagates as whatever the
runtime threw, untouched.

## PokenodeError

A failed request rejects with a `PokenodeError` carrying the response details:

```ts
import { PokemonClient, PokenodeError } from 'pokenode-ts';

try {
  await new PokemonClient().getPokemonByName('missingno');
} catch (error) {
  if (PokenodeError.isPokenodeError(error)) {
    console.log(error.status); // 404
    console.log(error.statusText); // "Not Found"
    console.log(error.url); // "https://pokeapi.co/api/v2/pokemon/missingno"
    console.log(error.body); // undefined — see below
    console.log(error.message); // "Request to … failed with status 404"
  }
}
```

| Property | Type | |
| --- | --- | --- |
| `status` | `number` | HTTP status code |
| `statusText` | `string` | HTTP status text |
| `url` | `string` | The URL that produced the error |
| `body` | `unknown` | Parsed JSON body, when the response carried one |
| `name` | `"PokenodeError"` | |

`body` is `unknown` rather than a typed shape because the PokéAPI does not commit to an error
schema. It is `undefined` whenever the response body was not JSON — which includes the most common
case, since the PokéAPI answers a 404 with the plain text `Not Found`.

## Retried before it throws

With [`retry`](./fetch#retries) configured, a 429 or a 5xx does not throw straight away — the client
attempts again, and only the last failure becomes the `PokenodeError` you catch. Its `status` is the
status of that final attempt.

Nothing else changes: a 404 still throws immediately, and an abort is still never retried.

## Use the guard, not `instanceof`

```ts
if (PokenodeError.isPokenodeError(error)) { /* ... */ } // ✅
if (error instanceof PokenodeError) { /* ... */ } // ⚠️
```

`instanceof` compares prototypes. A dependency tree that loads both the ESM and the CJS build of
pokenode-ts — easily done, one transitive dependency is enough — ends up with two distinct
`PokenodeError` classes, and an `instanceof` check against the wrong one is silently `false`. The
error would fall through to your generic handler with no sign of why.

`isPokenodeError` matches on a brand carried by the instance instead, so it holds across every
copy of the class.

## What is *not* wrapped

| Failure | What you catch |
| --- | --- |
| 404, 500, any non-2xx | `PokenodeError` |
| Offline, DNS failure, refused connection | The runtime's `TypeError` from `fetch` |
| A signal you supplied aborting | `DOMException` named `AbortError` |
| `AbortSignal.timeout()` firing | `DOMException` named `TimeoutError` |
| Malformed URL passed to `getResourceByUrl` | `TypeError` |

`isPokenodeError` returns `false` for all of the second column. That is deliberate: an HTTP error
means the API answered and told you something, while the rest mean the request never completed.
The two usually want different handling — one is worth retrying, the other is worth reporting.

```ts
try {
  await api.getPokemonByName(name);
} catch (error) {
  if (PokenodeError.isPokenodeError(error) && error.status === 404) {
    return null; // no such Pokémon
  }

  throw error; // network trouble, or a 500 — not ours to swallow
}
```

## Nothing is cached on failure

A request that throws leaves the cache untouched, so a retry genuinely retries rather than
replaying the failure. Concurrent calls for the same URL share one request and therefore share its
rejection.

## Timeouts

Clients impose no timeout — `fetch` has none, and neither do we, so a request waits as long as the
connection stays open. Supply one through a [custom fetch](/guides/fetch):

```ts
const api = new PokemonClient({
  fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(5000) }),
});
```
