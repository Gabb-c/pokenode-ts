---
description: "Pass a custom fetch to pokenode-ts to route requests through a proxy, add retries, attach headers, or impose a timeout — no undici-specific options needed."
---

# Custom Fetch

Clients call the global `fetch` by default. Pass your own to route requests through a proxy, add
retries, attach headers, or record metrics:

```ts
interface ClientOptions {
  fetch?: (input: string, init?: RequestInit) => Promise<Response>;
}
```

There is deliberately no `agent` or `dispatcher` option: those are undici-specific, absent from the
standard `RequestInit`, and meaningless outside Node. A fetch wrapper covers them and everything
else.

## Proxies and custom agents

On Node, pair undici's `fetch` with a dispatcher — the global `fetch` ignores one:

```ts
import { PokemonClient } from 'pokenode-ts';
import { fetch as undiciFetch, ProxyAgent } from 'undici';

const dispatcher = new ProxyAgent('http://corp-proxy:8080');

const api = new PokemonClient({
  fetch: (url, init) => undiciFetch(url, { ...init, dispatcher }),
});
```

A process-wide `setGlobalDispatcher(new ProxyAgent(...))` also works and needs nothing from us. Use
the `fetch` option when you want per-client isolation — two clients, two upstreams.

## Retries

Clients attempt each request once. Pass `retry` and a failed one is attempted again:

```ts
const api = new PokemonClient({ retry: {} });
```

```ts
interface RetryOptions {
  attempts?: number; // total tries, first included, default 3
  statuses?: number[]; // default [429, 500, 502, 503, 504]
  initialDelay?: number; // ms before the second try, doubling, default 300
  maxDelay?: number; // ceiling on any single wait, default 5000
}
```

Retrying is opt-in because a client that quietly triples its own traffic is not something to discover
after the fact.

**What is retried.** The listed statuses, and a transport failure — a dropped connection, a DNS
error. Nothing else: a 404 is an answer, not a hiccup, and a cancelled request stays cancelled.

**How long it waits.** Half of a doubling window plus jitter across the other half, capped at
`maxDelay`. Clients that failed together therefore do not come back together, and none comes back
instantly. A [scoped](./cancellation) timeout applies during the wait too — the request gives up
mid-backoff rather than after it.

**`Retry-After`.** Honored as written, whether the server sends seconds or a date. If it asks for
longer than `maxDelay`, the client stops rather than coming back sooner than it was told to.

Each retry is reported to the [logger](./logging) as an `event: 'retry'` payload; the attempt that
finally succeeds or fails reports as a normal response or error.

::: tip
Retrying and [caching](./cache) compose: only the successful attempt is cached. Retrying and request
sharing compose too — concurrent callers of the same URL share one sequence of attempts, not one
sequence each.
:::

## Extra headers

```ts
const api = new PokemonClient({
  baseURL: 'https://pokeapi.internal/api/v2',
  fetch: (url, init) =>
    fetch(url, { ...init, headers: { ...init?.headers, Authorization: `Bearer ${token}` } }),
});
```

## Cancellation and timeouts

Reach for [`with()`](./cancellation) rather than a fetch wrapper — one signal per client is one
signal for the client's whole life, and the first abort ends it:

```ts
const api = new PokemonClient();

await api.with({ timeout: 5000 }).getPokemonByName('luxray');
```

A wrapper is still the right tool for a policy that applies to every request no matter who made it —
a process-wide ceiling, say. Both compose: whichever signal aborts first wins.

An abort surfaces as whatever your runtime throws — a `DOMException` named `AbortError` or
`TimeoutError` — not as a pokenode error. `PokenodeError.isPokenodeError` returns `false` for it.

:::warning
Without a scope or a signal, a request waits as long as the connection stays open. `fetch` has no
default timeout and neither do we.
:::

:::tip
**Forward `init`.** It carries the `Accept` header. A wrapper that ignores it drops that header,
and drops anything the client adds in future versions.
:::
