# Currency Client

Covers the PokéAPI's [currencies section](https://pokeapi.co/docs/v2#currencies-section): the
currencies items are bought and sold with, from Pokémon Dollars to Battle Points.

```ts
import { CurrencyClient } from 'pokenode-ts';

const api = new CurrencyClient();

const dollar = await api.getCurrencyByName('poke-dollar');

console.log(dollar.names[0].name); // "Pokémon Dollar"
```

## Methods

### Currencies

| Method | Returns |
| --- | --- |
| `getCurrencyByName(name)` | `Currency` |
| `getCurrencyById(id)` | `Currency` |
| `listCurrencies(offset?, limit?)` | `NamedAPIResourceList` |

## Prices reference currencies

An [`Item`](./item-client) carries a `prices` list rather than a single cost, and each entry names
the currency it is denominated in. The two clients share a cache through
[`MainClient`](./main-client), so resolving a price's currency costs one request no matter how many
items point at it.

```ts
import { MainClient } from 'pokenode-ts';

const api = new MainClient();

const masterBall = await api.item.getItemByName('master-ball');
const [price] = masterBall.prices;

const currency = await api.currency.getCurrencyByName(price.currency.name);

console.log(currency.name, price.sell_price); // "poke-dollar" 0
```

## Using constants

```ts
import { CurrencyClient, CURRENCIES } from 'pokenode-ts';

const api = new CurrencyClient();

const dollar = await api.getCurrencyById(CURRENCIES.POKE_DOLLAR);
```
