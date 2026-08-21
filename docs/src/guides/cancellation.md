---
description: "Cancel pokenode-ts requests with an AbortSignal or a timeout — derive a scoped client with with(), sharing the cache and in-flight requests of the client it came from."
---

# Cancellation

Clients carry no timeout of their own. Use `with()` to derive a **scoped** client that does:

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

Pass both and whichever fires first wins.

:::tip Why isn't this a constructor option?
A signal covers one unit of work, and a client outlives many. Build a client around a single signal
and it's dead the moment that signal aborts.
:::

## Scoping a whole request

`MainClient.with()` scopes all twelve sections at once, which is usually what a server handler
wants:

```ts
app.get('/pokemon/:name', async (request, reply) => {
  const scoped = api.with({ signal: request.signal, timeout: 2000 });

  const pokemon = await scoped.pokemon.getPokemonByName(request.params.name);
  const species = await scoped.utility.getResourceByUrl(pokemon.species);

  return { pokemon, species };
});
```

Derive one scoped client per unit of work — a request, a job — rather than one per call.

## What a scoped client shares

A derived client shares the whole transport it came from: the cache, the `ETag` validators, and the
requests already on the wire. So a scoped call joins an identical unscoped one instead of repeating
it:

```ts
const scoped = api.with({ timeout: 2000 });

// One round trip, not two.
await Promise.all([api.berry.getBerryById(1), scoped.berry.getBerryById(1)]);
```

`with()` returns a new client and leaves the original alone.

## Cancelling shared work

Since several callers can share one round trip, a request is only cancelled once the last caller
interested in it has gone. One caller aborting rejects that caller; the rest keep waiting on the
same request.

A caller with no scope never gives up, so it holds the request open for everybody. If it got there
first, a scoped caller that aborts detaches from the response but can't cancel the connection.

## What an abort throws

Whatever your runtime throws: a `DOMException` named `AbortError`, or `TimeoutError` for a timeout.
Abort with your own reason and that's what comes back.

```ts
const controller = new AbortController();
const request = api.berry.with({ signal: controller.signal }).getBerryById(1);

controller.abort(new Error('client disconnected'));

await request; // rejects with: Error: client disconnected
```

Aborts are never wrapped, so `PokenodeError.isPokenodeError(error)` is `false` for them. See
[Errors](./errors).

The [logger](./logging) reports a cancelled request as a `cancelled` event at `debug`, carrying the
`reason`. It isn't an `error`, so a handler that scopes every request won't log its own timeouts as
failures.

## Composing with a custom fetch

A [custom `fetch`](./fetch) can attach a signal of its own — a process-wide ceiling, say. The two
compose, and the earlier abort wins.
