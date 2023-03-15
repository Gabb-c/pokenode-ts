# Cache

With `Axios Cache Interceptor` you can store request results to prevent unneeded network requests.

## Basic Usage

Cache is `enabled by default`. Use the `cacheOptions` property to configure it:

```js
import { BerryClient, Constants } from 'pokenode-ts';

const api = new BerryClient({ cacheOptions: { ... } }); // options here
```

:::tip
For more information, check out [Axios Cache Interceptor Documentation](https://axios-cache-interceptor.js.org/)
:::
