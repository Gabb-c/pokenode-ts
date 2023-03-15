# Getting Started

## Installation

Install pokenode-ts with your favorite package manager:
:::code-group

```bash [NPM]
npm i pokenode-ts
```

```bash [Yarn]
yarn add pokenode-ts
```

```bash [Pnpm]
pnpm i pokenode-ts
```

```html [Browser]
<script
  src="https://cdn.jsdelivr.net/npm/pokenode-ts/lib/index.global.js"
  crossorigin="anonymous"
></script>
```

:::

## Basic Example

Using a client, like [PokemonClient](https://gabb-c.github.io/pokenode-ts/#/clients/pokemon-client):

```js
import { PokemonClient } from 'pokenode-ts';

(async () => {
  const api = new PokemonClient();

  await api
    .getPokemonByName('luxray')
    .then((data) => console.log(data.name)) // will output "Luxray"
    .catch((error) => console.error(error));
})();
```

Or, using the MainClient:

```js
import { MainClient } from 'pokenode-ts';

(async () => {
  const api = new MainClient();

  await api.pokemon
    .getPokemonByName('luxray')
    .then((data) => console.log(data.name)) // will output "Luxray"
    .catch((error) => console.error(error));
})();
```

## Using Constants

Pokenode-ts has some useful abbreviations for some endpoints if you don't want to use raw strings or search for the ID's ;)

```js
import { Constants } from 'pokenode-ts';

console.log(Constants.Berries.ASPEAR); // will output 5, the Aspear Berry ID
```

Or

```js
import { Berries } from 'pokenode-ts';

console.log(Berries.ASPEAR); // will output 5, the Aspear Berry ID
```

## Leave your feedback

- Did you like pokenode-ts? [Give us a star ⭐](https://github.com/Gabb-c/pokenode-ts)
- Found a problem? Let us know by [creating an issue 🔎📑](https://github.com/Gabb-c/pokenode-ts/issues)
- Want to contribute? [Submit a PR](https://github.com/Gabb-c/pokenode-ts/pulls)
