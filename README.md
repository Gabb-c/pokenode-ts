![logo](docs/_media/facebook_cover_photo_2.png)

<p align="center">
  <img alt="Build" src="https://img.shields.io/github/workflow/status/Gabb-c/pokenode-ts/Build?color=000000&labelColor=480ca8&style=for-the-badge&logo=nodedotjs&logoColor=white">
  <img alt="Codecov" src="https://img.shields.io/codecov/c/github/Gabb-c/pokenode-ts?color=000000&labelColor=f72585&&style=for-the-badge&token=whfY8GNSpS&logo=codecov&logoColor=white">
  <img alt="NPM" src="https://img.shields.io/npm/v/pokenode-ts?style=for-the-badge&color=000000&labelColor=4cc9f0&label=version&logo=github&logoColor=white">
  <img alt="Snyk" src="https://img.shields.io/snyk/vulnerabilities/github/Gabb-c/pokenode-ts?style=for-the-badge&color=000000&labelColor=70e000&logo=snyk" />
</p>

## What it is

A lightweight Node.js wrapper for the PokéAPI with built-in types. An easy way to integrate your app with the PokéAPI.

## Features

- [Bulit-in typings](https://gabb-c.github.io/pokenode-ts/#/typings/berry-typings?id=berries)
- [Axios with auto-cache reqests](https://gabb-c.github.io/pokenode-ts/#/getting-started/cache)
- [Logging configuration](https://gabb-c.github.io/pokenode-ts/#/getting-started/logs)

## Installation

```bash
npm i pokenode-ts

# or

yarn add pokenode-ts
```

## Basic Example

```js
import { PokemonClient } from 'pokenode-ts';

const api = new PokemonClient();

const pokemon = await api
  .getPokemonByName('luxray')
  .then((data) => data)
  .catch((error) => console.log(error));

console.log(pokemon.name); // will output 'Luxray'
```

Or:

```js
import { MainClient } from 'pokenode-ts';

const api = new MainClient();

const pokemon = await api.pokemon
  .getPokemonByName('luxray')
  .then((response) => response)
  .catch((error) => console.error(error));

console.log(pokemon.name); // will output 'Luxray'
```

## Documentation

Check out our [Documentation page](https://gabb-c.github.io/pokenode-ts/#/)!

## Insomnia Collection

If you want to test the PokéAPI endpoints, we recommend using [Insomnia](https://insomnia.rest/):

<div display="flex">
  <a href="https://insomnia.rest/run/?label=Pok%C3%A9API&uri=https%3A%2F%2Fraw.githubusercontent.com%2FGabb-c%2Fpokeapi-insomnia-collection%2Fmain%2Fpokeapi.json">
    <img alt="Run in Insomnia" src="https://img.shields.io/badge/Insomnia-5849be?style=for-the-badge&logo=Insomnia&logoColor=white&label=Run%20in&labelColor=black">
  </a>
  <a href="https://insomnia.rest/download">
    <img alt="Insomnia Download" src="https://img.shields.io/badge/Insomnia-5849be?style=for-the-badge&logo=Insomnia&logoColor=white&label=Download&labelColor=black"/>
  </a>
</div>
