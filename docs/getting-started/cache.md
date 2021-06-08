# Cache

## What is it

With `Axios-cache` you can store request results to prevent unneeded network requests.

## Basic Usage

To enable cache requests:

```js
import { BerryClient, Constants } from 'pokenode';

const api = new BerryClient({}, {}, { maxAge: 5000 exclude: { query: false } }); // Enable cache with 5 seconds including requests with query parameters.

// First call will cache the response
// The next calls within 5 seconds will come from the cache

```

## Cache options

Properties for cacheOptions object:

```js
{
  // {Number} Maximum time for storing each request in milliseconds,
  // defaults to 0
  maxAge: 0,
  // {Number} Maximum number of cached request (last in, first out queue system),
  // defaults to `false` for no limit. *Cannot be overridden per request*
  limit: false,
  // {Object} An instance of localforage, defaults to a custom in memory store.
  // *Cannot be overridden per request*
  store: new MemoryStore(),
  // {String|Function} Generate a unique cache key for the request.
  // Will use request url and serialized params by default.
  key: req => req.url + serializeQuery(req.params),
  // {Function} Invalidate stored cache. By default will remove cache when
  // making a request with method not `GET`, `POST`, `PUT`, `PATCH` or `DELETE` query.
  invalidate: async (cfg, req) => {
    const method = req.method.toLowerCase()
    if (method !== 'get') {
      await cfg.store.removeItem(cfg.uuid)
    }
  },
  // {Object} Define which kind of requests should be excluded from cache.
  exclude: {
    // {Array} List of regular expressions to match against request URLs.
    paths: [],
    // {Boolean} Exclude requests with query parameters.
    query: true,
    // {Function} Method which returns a `Boolean` to determine if request
    // should be excluded from cache.
    filter: null,
    // {Array} HTTP methods which will be excluded from cache.
    // Defaults to `['post', 'patch', 'put', 'delete']`
    // Any methods listed will also trigger cache invalidation while using the default `config.invalidate` method.
    //
    // Note: the HEAD method is always excluded (hard coded).
    // the OPTIONS method is ignored by this library as it is automatically handled by browsers/clients to resolve cross-site request permissions
    methods: ['post', 'patch', 'put', 'delete']
  },
  // {Boolean} Clear cached item when it is stale.
  clearOnStale: true,
  // {Boolean} Clear all cache when a cache write error occurs
  // (prevents size quota problems in `localStorage`).
  clearOnError: true,
  // {Function|Boolean} Determine if stale cache should be read when a network error occurs.
  readOnError: false,
  // {Boolean} Determine if response headers should be read to set `maxAge` automatically.
  // Will try to parse `cache-control` or `expires` headers.
  readHeaders: false,
  // {Boolean} Ignore cache, will force to interpret cache reads as a `cache-miss`.
  // Useful to bypass cache for a given request.
  ignoreCache: false,
  // {Function|Boolean} Print out debug log to console.
  debug: false
}
```

## More

For more information, check out [axios-cache-adapter documentation](https://github.com/RasCarlito/axios-cache-adapter).
