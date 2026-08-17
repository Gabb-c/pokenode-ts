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

```ts
const withRetry = (attempts = 3) =>
  async (url: string, init?: RequestInit): Promise<Response> => {
    let lastError: unknown;

    for (let attempt = 0; attempt < attempts; attempt++) {
      try {
        return await fetch(url, init);
      } catch (error) {
        lastError = error;
        await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 100));
      }
    }

    throw lastError;
  };

const api = new PokemonClient({ fetch: withRetry() });
```

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
