# Migrating from 1.x to 2.0

Version 2.0 replaces Axios with the platform's native `fetch`. `pokenode-ts` now ships with **no
runtime dependencies** and runs anywhere `fetch` exists — Node 20+, Deno, Bun, browsers, and edge
runtimes.

Every client method keeps the same name, arguments, and return type. Installation, client options,
and error handling change.

## Installation

Axios and its cache interceptor are no longer peer dependencies. Uninstall them if nothing else in
your project uses them:

```bash
npm uninstall axios axios-cache-interceptor
npm install pokenode-ts
```

## Cache options

`cacheOptions` is replaced by a single `cache` slot: omit it for the default in-memory store, pass
`false` to disable caching, or supply your own. Anything shaped for the old interceptor —
`storage`, `generateKey`, `interpretHeader`, `methods` — no longer type-checks.

```js
// 1.x
new BerryClient({ cacheOptions: { ttl: 1000 * 60 * 5, methods: ['get'] } });

// 2.0
new BerryClient({ cache: new MemoryCache({ ttl: 300000, maxEntries: 500 }) });
```

If you supplied a custom `storage` to `axios-cache-interceptor`, the replacement is a `CacheStore`
implementation — see [Bring your own store](/guides/cache#bring-your-own-store).

See the [Cache guide](/guides/cache) for the full behavior.

## Logging

`logs: true` is replaced by a `logger` slot, so requests can be reported somewhere other than the
console. Pass the bundled `consoleLogger` for the 1.x behavior:

```js
// 1.x
new BerryClient({ logs: true });

// 2.0
new BerryClient({ logger: consoleLogger });
```

See the [Logging guide](/guides/logging) for the `Logger` interface.

## Renamed and removed exports

- `ClientArgs` is now `ClientOptions`. The fields are unchanged apart from `logs`.
- `ENDPOINTS.POKEMON_LOCATION_AREA` is gone. It held the template `/pokemon/:id/encounters` rather
  than an endpoint, and never worked without a string replacement. Use
  `PokemonClient#getPokemonLocationAreaById`, which was always the supported route.

## MainClient

`MainClient` no longer extends `BaseClient`, so `mainClient instanceof BaseClient` is now `false`.
Its sub-clients are unchanged, and they now share one cache rather than holding one each.

## Errors

Failed requests used to reject with an `AxiosError`. A non-2xx response now rejects with a
`PokenodeError`, which carries the response details directly:

```js
import { PokenodeError, BerryClient } from 'pokenode-ts';

try {
  await new BerryClient().getBerryByName('not-a-berry');
} catch (error) {
  if (PokenodeError.isPokenodeError(error)) {
    console.log(error.status);     // 404
    console.log(error.statusText); // 'Not Found'
    console.log(error.url);        // the request URL
    console.log(error.body);       // parsed JSON body, when the response had one
  }
}
```

:::tip
Prefer the `isPokenodeError` guard over `instanceof`. A dependency tree that loads both the ESM and
the CJS build of pokenode-ts ends up with two distinct classes, and `instanceof` against the wrong
one is silently `false`. The guard matches on a brand instead, so it holds either way.
:::

Transport failures — offline, DNS — are not wrapped. They reject with the native `TypeError` that
`fetch` produced.

## Timeouts and cancellation

Neither 1.x nor 2.0 imposes a timeout, and clients add no `AbortSignal` of their own. Supply one
through a [custom fetch](/guides/fetch):

```js
new BerryClient({
  fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(5000) }),
});
```

An abort rejects with the runtime's own `DOMException`, not with a pokenode error.
