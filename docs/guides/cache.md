# Cache

With `Axios Cache Interceptor` you can store request results to prevent unneeded network requests.

## Basic Usage

To enable cache requests:

```js
import { BerryClient, Constants } from 'pokenode-ts';

const api = new BerryClient({ cacheOptions: { enabled: true } });
```

:::tip
For more information, check out [Axios Cache Interceptor Documentation](https://axios-cache-interceptor.js.org/)
:::
