---
description: "Log the request lifecycle in pokenode-ts with the built-in consoleLogger, or plug in pino or a metrics collector. Nothing is logged unless you ask."
---

# Logging

## Logs

Every client can report the requests and responses it handles. Nothing is logged unless you pass a
`logger`.

## Basic Logging

`consoleLogger` writes the request lifecycle to the console:

```ts
import { BerryClient, consoleLogger } from 'pokenode-ts';

const api = new BerryClient({ logger: consoleLogger });
```

Will output:

```
// success
[ Request Config ] GET | https://pokeapi.co/api/v2/berry/cheri
[ Response ] STATUS 200 | CACHED

// error
[ Request Config ] GET | https://pokeapi.co/api/v2/berry/cheri
[ Response Error ] CODE PokenodeError | Request to https://pokeapi.co/api/v2/berry/cheri failed with status 404
```

## Custom Logging

`Logger` is a three-method interface, so requests can go to a real logger or a metrics collector
instead of the console:

```ts
import { PokemonClient, type Logger } from 'pokenode-ts';
import { pino } from 'pino';

const log = pino();

const logger: Logger = {
  request: (method, url) => log.debug({ method, url }, 'pokeapi request'),
  response: (status, cached) => log.debug({ status, cached }, 'pokeapi response'),
  error: (error) => log.error({ error }, 'pokeapi request failed'),
};

const api = new PokemonClient({ logger });
```

`response` is called for cache hits too, with `cached` set to `true` and a status of `200` — no
request left the process.
