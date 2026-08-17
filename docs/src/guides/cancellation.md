---
description: "Cancel pokenode-ts requests with an AbortSignal or a timeout — derive a scoped client with with(), share its cache, and give up on work nobody is waiting for anymore."
---

# Cancellation

Clients impose no timeout of their own. To put one on a request — or to cancel it on demand — derive
a **scoped** client with `with()`:

```ts
import { MainClient } from 'pokenode-ts';

const api = new MainClient();

const berry = await api.berry.with({ timeout: 2000 }).getBerryByName('cheri');
```

`with()` takes a `RequestScope`:

```ts
interface RequestScope {
  signal?: AbortSignal;
  timeout?: number; // milliseconds
}
```

Both may be given, and whichever aborts first wins.

## Why not a constructor option

A signal belongs to one unit of work; a client outlives many. A client built around a single signal
is dead the moment that signal aborts — every later request fails before it starts. So cancellation
lives on the derived client, and the constructor keeps what really is client-wide: `baseURL`,
`cache`, `logger`, `fetch`.

## Scoping a whole request

`MainClient.with()` scopes all twelve section clients at once, which is usually what a server handler
wants:

```ts
app.get('/pokemon/:name', async (request, reply) => {
  const scoped = api.with({ signal: request.signal, timeout: 2000 });

  const pokemon = await scoped.pokemon.getPokemonByName(request.params.name);
  const species = await scoped.utility.getResourceByUrl(pokemon.species);

  return { pokemon, species };
});
```

:::tip
Derive one scoped client per unit of work — a request, a job — not one per call. Cloning is cheap,
but it is not free, and `api.with({ … }).get…()` on every line reads worse than hoisting it.
:::

## What a scoped client shares

A derived client shares the cache **and** the in-flight requests of the client it came from. A scoped
call joins an identical unscoped one already on the wire instead of repeating it:

```ts
const scoped = api.with({ timeout: 2000 });

// One round trip, not two.
await Promise.all([api.berry.getBerryById(1), scoped.berry.getBerryById(1)]);
```

The client you derived from is left untouched — `with()` returns a new client, it does not
reconfigure the old one.

## Cancelling shared work

Because several callers can share one round trip, giving up is a group decision: **a request is
cancelled only when the last caller interested in it has gone.** One caller aborting rejects that
caller and leaves the request running for the rest.

A caller with no scope never gives up, so it holds the request open for everybody — including a
scoped caller that joined later. If the unscoped caller got there first, a scoped one that aborts
detaches from the response but cannot cancel the connection.

## What an abort throws

Whatever your runtime throws: a `DOMException` named `AbortError`, or `TimeoutError` for a timeout.
When you abort with a reason of your own, that reason is what you get back.

```ts
const controller = new AbortController();
const request = api.berry.with({ signal: controller.signal }).getBerryById(1);

controller.abort(new Error('client disconnected'));

await request; // rejects with: Error: client disconnected
```

Aborts are never wrapped: `PokenodeError.isPokenodeError(error)` is `false` for them, the same as any
other transport failure. See [Errors](./errors).

## Composing with a custom fetch

A [custom `fetch`](./fetch) can still attach a signal of its own — a process-wide ceiling, say. The
two compose, and the earlier abort wins.
