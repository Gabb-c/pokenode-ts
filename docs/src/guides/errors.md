---
description: "How pokenode-ts reports failures: PokenodeError for non-2xx responses, transport errors left untouched, and why isPokenodeError beats instanceof."
---

# Errors

Clients throw for exactly one thing: a response the PokéAPI answered with a non-2xx status.
Everything else — a dropped connection, a DNS failure, an abort — propagates as whatever the runtime
threw.

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

`body` is `unknown` because the PokéAPI doesn't commit to an error schema, and it's `undefined`
whenever the body wasn't JSON. That covers the most common case: the PokéAPI answers a 404 with the
plain text `Not Found`.

## Use the guard, not `instanceof`

```ts
if (PokenodeError.isPokenodeError(error)) { /* ... */ } // ✅
if (error instanceof PokenodeError) { /* ... */ } // ⚠️
```

`instanceof` compares prototypes. A dependency tree that loads both the ESM and the CJS build of
pokenode-ts — one transitive dependency is enough — ends up with two distinct `PokenodeError`
classes, and a check against the wrong one is silently `false`. The error falls through to your
generic handler with no sign of why.

`isPokenodeError` matches on a brand carried by the instance, so it holds across every copy of the
class.

## What isn't wrapped

| Failure | What you catch |
| --- | --- |
| 404, 500, any non-2xx | `PokenodeError` |
| Offline, DNS failure, refused connection | The runtime's `TypeError` from `fetch` |
| A signal you supplied aborting | `DOMException` named `AbortError` |
| `AbortSignal.timeout()` firing | `DOMException` named `TimeoutError` |
| Malformed URL passed to `getResourceByUrl` | `TypeError` |

`isPokenodeError` returns `false` for everything in the second column. An HTTP error means the API
answered and told you something; the rest mean the request never completed. The two usually want
different handling.

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

## With retries on

With [`retry`](./fetch#retries) configured, a 429 or 5xx doesn't throw straight away. The client
attempts again, and only the last failure becomes the `PokenodeError` you catch, carrying the status
of that final attempt.

A 404 still throws immediately, and an abort is still never retried.

## Nothing is cached on failure

A request that throws leaves the cache untouched, so a retry genuinely retries rather than replaying
the failure. Concurrent calls for the same URL share one request, and share its rejection.

## Timeouts

Clients impose no timeout of their own. Attach one to a unit of work with a
[scoped client](/guides/cancellation):

```ts
await api.with({ timeout: 5000 }).getPokemonByName('luxray');
```
