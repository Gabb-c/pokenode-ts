# Logging

## Logs

Every client in Pokenode-ts can display logs from requests and responses thanks to [Pino.js](https://github.com/pinojs/pino), a super fast all natural json logger.

## Basic Logging

To enable basic plain json logs just pass the `logOptions` with `enabled: true`:

```js
import { BerryClient } from 'pokenode-ts';

const api = new BerryClient({ logOptions: { enabled: true } }); // Enable logs
```

Will output:

```json
// Axios request log
{"level":30,"time":1622569877122,"pid":13379,"hostname":"mypc","msg":"[ Request Config ] GET | /berry/cheri | Cached"}

// Axios Response Data log
{"level":30,"time":1622569877219,"pid":13379,"hostname":"mypc","firmness":{"name":"soft","url":"https://pokeapi.co/api/v2/berry-firmness/2/"},"flavors":[{"flavor":{"name":"spicy","url":"https://pokeapi.co/api/v2/berry-flavor/1/"},"potency":10},{"flavor":{"name":"dry","url":"https://pokeapi.co/api/v2/berry-flavor/2/"},"potency":0},{"flavor":{"name":"sweet","url":"https://pokeapi.co/api/v2/berry-flavor/3/"},"potency":0},{"flavor":{"name":"bitter","url":"https://pokeapi.co/api/v2/berry-flavor/4/"},"potency":0},{"flavor":{"name":"sour","url":"https://pokeapi.co/api/v2/berry-flavor/5/"},"potency":0}],"growth_time":3,"id":1,"item":{"name":"cheri-berry","url":"https://pokeapi.co/api/v2/item/126/"},"max_harvest":5,"name":"cheri","natural_gift_power":60,"natural_gift_type":{"name":"fire","url":"https://pokeapi.co/api/v2/type/10/"},"size":20,"smoothness":25,"soil_dryness":15}
```

## Pretty logging

:::tip
By default, Pino log lines are newline delimited JSON (NDJSON). This is perfect for production usage and long term storage. It's not so great for development environments. Thus, Pino logs can be prettified by using a Pino prettifier module like [pino-pretty](https://github.com/pinojs/pino-pretty).
:::

To enable pretty printing:

```js
import { BerryClient } from 'pokenode-ts';

const api = new BerryClient({
  logOptions: {
    enabled: true,
    transport: {
      target: 'pino-pretty'
    },
  },
});

// Enable pretty logs (recommended for development)
```

Will output:

```txt
// Axios Request Config log

INFO [1622554026120] (26906 on yourpc): [ Request Config ] GET | /berry/1

```

```json
// Axios Response Data log

{
  "firmness": {
    "name": "soft",
    "url": "https://pokeapi.co/api/v2/berry-firmness/2/"
  },
  "flavors": [
    {
      "flavor": {
        "name": "spicy",
        "url": "https://pokeapi.co/api/v2/berry-flavor/1/"
      },
      "potency": 10
    },
    {
      "flavor": {
        "name": "dry",
        "url": "https://pokeapi.co/api/v2/berry-flavor/2/"
      },
      "potency": 0
    },
    {
      "flavor": {
        "name": "sweet",
        "url": "https://pokeapi.co/api/v2/berry-flavor/3/"
      },
      "potency": 0
    },
    {
      "flavor": {
        "name": "bitter",
        "url": "https://pokeapi.co/api/v2/berry-flavor/4/"
      },
      "potency": 0
    },
    {
      "flavor": {
        "name": "sour",
        "url": "https://pokeapi.co/api/v2/berry-flavor/5/"
      },
      "potency": 0
    }
  ],
  "growth_time": 3,
  "id": 1,
  "item": {
    "name": "cheri-berry",
    "url": "https://pokeapi.co/api/v2/item/126/"
  },
  "max_harvest": 5,
  "name": "cheri",
  "natural_gift_power": 60,
  "natural_gift_type": {
    "name": "fire",
    "url": "https://pokeapi.co/api/v2/type/10/"
  },
  "size": 20,
  "smoothness": 25,
  "soil_dryness": 15
}
```

:::tip
For more information, check out [Pino.js documentation](https://getpino.io/#/).
:::
