---
description: "Log the request lifecycle in pokenode-ts by passing pino, winston, console or any logger with debug and error. Nothing is logged unless you ask."
---

# Logging

## Logs

Every client can report the requests and responses it handles. Nothing is logged unless you pass a
`logger`.

## Bring your logger

`Logger` is the shape logging libraries already have — `debug` and `error`, each taking one object.
Pass yours straight in:

```ts
import { PokemonClient } from 'pokenode-ts';
import { pino } from 'pino';

const api = new PokemonClient({ logger: pino() });
```

```ts
import winston from 'winston';

const api = new PokemonClient({ logger: winston.createLogger() });
```

```ts
const api = new PokemonClient({ logger: console });
```

pino, winston, bunyan, roarr and `console` all satisfy the interface as they are. Requests and
responses are logged at `debug`; failures at `error`. The client never picks a level of its own, and
never logs at all without a `logger`.

::: warning Coming from 2.0
2.0 shipped a `Logger` with `request`, `response` and `error` methods taking positional arguments,
which meant writing an adapter for whatever logger you already had. That interface is gone — delete
the adapter and pass the logger itself. A hand-written implementation moves to the two methods
below.
:::

## What arrives

One object per event, with every field at the top level so a structured logger indexes them:

| `event` | Method | Fields |
| --- | --- | --- |
| `request` | `debug` | `method`, `url` |
| `response` | `debug` | `url`, `status`, `source`, `durationMs` |
| `error` | `error` | `url`, `err`, `error` |

```jsonc
// pino
{"level":30,"event":"response","msg":"pokeapi response","url":"https://pokeapi.co/api/v2/berry/1","status":200,"source":"network","durationMs":84.2}
```

Two fields are deliberately duplicated, and both are there so that no library needs an adapter:

- **`msg` and `message`** carry the same text. pino, bunyan and roarr read `msg`; winston reads
  `message`. A logger that reads neither simply sees two extra string fields.
- **`err` and `error`** carry the same value. pino runs its error serializer only on `err` — an
  `Error` under any other key reaches the log as `{}`, with no message and no stack — while other
  libraries look for `error`.

Filter on `event` to tell the three apart:

```ts
const logger = {
  debug: (payload) => {
    if (payload.event === 'response') metrics.histogram('pokeapi.duration', payload.durationMs);
  },
  error: ({ url }) => metrics.increment('pokeapi.errors', { url }),
};
```

The payload types are exported as `LogRequestPayload`, `LogResponsePayload` and `LogErrorPayload`.

## Pretty console output

`console` logs the payload as an object. `consoleLogger` formats it as one line instead:

```ts
import { BerryClient, consoleLogger } from 'pokenode-ts';

const api = new BerryClient({ logger: consoleLogger });
```

Will output:

```
// success
[ Request Config ] GET | https://pokeapi.co/api/v2/berry/cheri
[ Response ] STATUS 200 | CACHE | 0.3ms

// error
[ Request Config ] GET | https://pokeapi.co/api/v2/berry/cheri
[ Response Error ] https://pokeapi.co/api/v2/berry/cheri | CODE PokenodeError | Request to https://pokeapi.co/api/v2/berry/cheri failed with status 404
```

## Details worth knowing

Every call reports, whether or not it caused a request. `source` says which of the three happened:

| `source` | Meaning |
| --- | --- |
| `network` | A round trip was made. |
| `cache` | Served by the `CacheStore`; nothing left the process. Status is reported as `200`. |
| `in-flight` | An identical request was already on the wire and this call shared it. |

That distinction is what keeps counts honest. Two concurrent calls for the same resource produce
**two** `request` events and **two** `response` events, but only one round trip — so count `source
== 'network'` for what the PokéAPI actually saw, and all three for what your application asked for.

`durationMs` covers everything the client did, so a cache hit and a shared request are timed like
any other resolution; a store that lives across a network shows up here.

`method` arrives uppercase, matching RFC 9110 and OpenTelemetry's `http.request.method`, so it can
be forwarded as a label without normalising it first.

::: tip Credentials never reach your logger
A `baseURL` pointing at an instance behind basic auth — `https://user:secret@poke.internal/api/v2`
— is logged as `https://poke.internal/api/v2`. The request still goes out with the credentials; only
the payload is redacted.
:::
