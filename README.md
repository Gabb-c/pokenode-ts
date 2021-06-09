# Pokenode

> The PokéAPI Node.js wrapper made with TypeScript.

## What it is

A lightweight Node.js wrapper for the PokéAPI with built-in types. An easy way to integrate your app with the PokéAPI.

## Features

- Bulit-in typings
- Axios with auto-cache reqests
- Logging configuration

## Basic Example

```js
import { PokemonClient } from 'pokenode';

const api = new PokemonClient();

const pokemon = await api.getPokemonByName('luxray')
  .then((data) => data)
  .catch((error) => console.log(error));

console.log(pokemon.name); // will output 'Luxray'
```

## Insomnia Collection

If you want to test the PokéAPI endpoints, we recommend using Insomnia:

<div display="flex">
  <a href="https://insomnia.rest/run/?label=Pok%C3%A9API&uri=https%3A%2F%2Fraw.githubusercontent.com%2FGabb-c%2Fpokeapi-insomnia-collection%2Fmain%2Fpokeapi.json">
    <img alt="Run in Insomnia" src="https://img.shields.io/badge/Insomnia-5849be?style=for-the-badge&logo=Insomnia&logoColor=white&label=Run%20in&labelColor=black">
  </a>
  <a href="https://insomnia.rest/download">
    <img alt="Insomnia Download" src="https://img.shields.io/badge/Insomnia-5849be?style=for-the-badge&logo=Insomnia&logoColor=white&label=Download&labelColor=black"/>
  </a>
</div>

## Donate

Please consider donating if you think pokenode is helpful to you or that my work is valuable :heart:

## Community

Users and the development team are usually in the Discord server.
