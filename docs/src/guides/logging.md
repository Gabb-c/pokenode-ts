---
description: "Log the request lifecycle in pokenode-ts by passing pino, winston, console or any logger with debug and error. Nothing is logged unless you ask."
---

# Logging

Clients report the requests and responses they handle. Nothing is logged unless you pass a `logger`.

## Bring your logger

`Logger` is the shape logging libraries already have: `debug` and `error`, each taking one object.
Pass yours straight in.

::: code-group

```ts [pino]
import { PokemonClient } from 'pokenode-ts';
import { pino } from 'pino';

const api = new PokemonClient({ logger: pino() });
```

```ts [winston]
import { PokemonClient } from 'pokenode-ts';
import winston from 'winston';

const api = new PokemonClient({ logger: winston.createLogger() });
```

```ts [console]
import { PokemonClient } from 'pokenode-ts';

const api = new PokemonClient({ logger: console });
```

:::

pino, winston, bunyan, roarr and `console` all satisfy the interface as they are. Requests, responses
and cancellations go to `debug`; failures go to `error`.

::: warning Coming from 2.0
2.0 shipped a `Logger` with `request`, `response` and `error` methods taking positional arguments,
which meant writing an adapter for whatever logger you already had. That interface is gone: delete
the adapter and pass the logger itself. A hand-written implementation moves to the two methods below.
:::

## Events

One object per event, every field at the top level so a structured logger indexes them:

| `event` | Method | Fields |
| --- | --- | --- |
| `request` | `debug` | `method`, `url` |
| `response` | `debug` | `url`, `status`, `source`, `durationMs` |
| `retry` | `debug` | `url`, `attempt`, `delayMs`, `status` |
| `cancelled` | `debug` | `url`, `reason`, `durationMs` |
| `error` | `error` | `url`, `err`, `error` |

```jsonc
// pino
{"level":30,"event":"response","msg":"pokeapi response","url":"https://pokeapi.co/api/v2/berry/1","status":200,"source":"network","durationMs":84.2}
```

Every `request` is closed by exactly one `response`, `cancelled` or `error`.

`retry` only arrives when [`retry`](./fetch#retries) is configured, and only for an attempt followed
by another one — the attempt that ends the request reports as a `response` or an `error` like any
other. Its `status` is absent when the attempt never got a response.

`cancelled` closes a request that its [scope](./cancellation) aborted: a caller that went away, or a
`timeout` that expired. It's `debug` rather than `error`, so a handler that scopes every request
doesn't bury its error rate under its own timeouts. `reason` is the `signal.reason` given to `abort`,
or the `TimeoutError` a `timeout` raised.

Filter on `event` to tell them apart:

```ts
const logger = {
  debug: (payload) => {
    if (payload.event === 'response') metrics.histogram('pokeapi.duration', payload.durationMs);
  },
  error: ({ url }) => metrics.increment('pokeapi.errors', { url }),
};
```

Payload types are exported as `LogRequestPayload`, `LogResponsePayload`, `LogRetryPayload`,
`LogCancelledPayload` and `LogErrorPayload`.

## Fields

**`source`** says where a response came from. Every call reports one, whether or not it caused a
request:

| `source` | Meaning |
| --- | --- |
| `network` | A round trip was made. |
| `cache` | Served by the `CacheStore`; nothing left the process. Status is reported as `200`. |
| `in-flight` | An identical request was already on the wire and this call shared it. |
| `revalidated` | A round trip was made, the API answered `304`, and the body already held for that URL was reused. Only with [`revalidate`](./cache#revalidation). |

Two concurrent calls for the same resource produce **two** `request` events and **two** `response`
events, but only one round trip. Count `network` and `revalidated` for what the PokéAPI actually saw,
and all four for what your application asked for.

**`durationMs`** covers everything the client did, so cache hits and shared requests are timed like
any other resolution. A store that lives across a network shows up here.

**`method`** arrives uppercase, matching RFC 9110 and OpenTelemetry's `http.request.method`, so you
can forward it as a label without normalising it first.

**`msg`/`message`** and **`err`/`error`** are duplicated on purpose, so that no library needs an
adapter. pino, bunyan and roarr read `msg`; winston reads `message`. pino runs its error serializer
only on `err` — an `Error` under any other key reaches the log as `{}`, no message and no stack —
while other libraries look for `error`.

::: tip Credentials never reach your logger
A `baseURL` pointing at an instance behind basic auth — `https://user:secret@poke.internal/api/v2` —
is logged as `https://poke.internal/api/v2`. Credentials leave the URL before the request is built
and travel as an `Authorization: Basic` header, so neither the log payload nor the cache key carries
them. That's also what makes such a `baseURL` work at all, since `fetch` rejects a URL with
credentials in it.
:::

## Pretty console output

`console` logs the payload as an object. `consoleLogger` formats it as one line instead:

```ts
import { BerryClient, consoleLogger } from 'pokenode-ts';

const api = new BerryClient({ logger: consoleLogger });
```

Which outputs:

```
// success
[ Request Config ] GET | https://pokeapi.co/api/v2/berry/cheri
[ Response ] STATUS 200 | CACHE | 0.3ms

// retried, with `retry` configured
[ Retry ] ATTEMPT 1 | STATUS 503 | IN 287ms | https://pokeapi.co/api/v2/berry/cheri

// cancelled by its scope
[ Cancelled ] https://pokeapi.co/api/v2/berry/cheri | AFTER 2000.0ms

// error
[ Request Config ] GET | https://pokeapi.co/api/v2/berry/cheri
[ Response Error ] https://pokeapi.co/api/v2/berry/cheri | CODE PokenodeError | Request to https://pokeapi.co/api/v2/berry/cheri failed with status 404
```
