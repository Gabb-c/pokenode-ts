# pokenode

> The PokéAPI Node.js wrapper made with TypeScript.

## What it is

A lightweight Node.js wrapper for the PokéAPI with built-in types. An easy way to integrate your app with the PokéAPI.

## Features

- Bulit-in typings
- Axios with auto-cache reqests
- Advanced logs with Pino.js

## Basic Example

```js
import { PokemonClient } from 'pokenode';

const api = new PokemonClient();

const pokemon = await api.getPokemonByName('luxray')
  .then((data) => data)
  .catch((error) => console.log(error));

console.log(pokemon.name); // will output 'Luxray'
```

## Donate

Please consider donating if you think pokenode is helpful to you or that my work is valuable. I am happy if you can help me [buy a cup of coffee](). :heart:

## Community

Users and the development team are usually in the [Discord server](https://discord.gg/3NwKFyR).
