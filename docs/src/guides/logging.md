# Logging

## Logs

Every client in Pokenode-ts can display logs from requests and responses.

## Basic Logging

To enable logs just pass `logs: true`:

```js
import { BerryClient } from 'pokenode-ts';

const api = new BerryClient({ logs: true }); // Enable logs
```

Will output:

```log
// success
[ Request Config ] GET | /berry/cheri
[ Response ] STATUS 200 | CACHED

// error
[ Request Config ] GET | /berry/cheri
[ Response Error ] CODE ERR_BAD_REQUEST | Request failed with status code 404
```
