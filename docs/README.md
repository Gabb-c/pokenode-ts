# Pokenode-ts

> The PokéAPI Node.js wrapper made with TypeScript.

## What it is

A lightweight Node.js wrapper for the PokéAPI with built-in types. An easy way to integrate your app with the PokéAPI.

## Features

- Bulit-in typings
- Axios with auto-cache reqests
- Logging configuration

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

Check out our Documentation page!

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

## Donate

Please consider donating if you think pokenode-ts is helpful to you or that my work is valuable. I am happy if you can [buy me a coffee ❤️](https://www.buymeacoffee.com/pokenodets)

<a href="https://www.buymeacoffee.com/pokenodets">
  <img width="545" alt="bmc-button" src="https://user-images.githubusercontent.com/65926741/124142954-14c3ef00-da61-11eb-962c-ca12bbdc92ef.png">
</a>
