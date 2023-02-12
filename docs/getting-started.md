## Installation

Install pokenode-ts with your favorite package manager:

```bash
npm i pokenode-ts
# or
yarn add pokenode-ts # Recommended
```

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

## Insomnia Collection

If you want to test the PokéAPI endpoints, we recommend using [Insomnia](https://insomnia.rest/):

<div display="flex">
  <a href="https://insomnia.rest/run/?label=Pok%C3%A9API&uri=https%3A%2F%2Fraw.githubusercontent.com%2FGabb-c%2Fpokeapi-insomnia-collection%2Fmain%2Fpokeapi.json">
    <img alt="Run in Insomnia" src="https://img.shields.io/badge/Insomnia-5849be?style=for-the-badge&logo=Insomnia&logoColor=white&label=Run%20in&labelColor=black"/>
  </a>
  <a href="https://insomnia.rest/download">
    <img alt="Insomnia Download" src="https://img.shields.io/badge/Insomnia-5849be?style=for-the-badge&logo=Insomnia&logoColor=white&label=Download&labelColor=black"/>
  </a>
</div>
