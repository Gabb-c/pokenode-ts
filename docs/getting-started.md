## Installation

Install pokenode using your favorite package manager:

> NPM

```bash
npm i pokenode
```

> Yarn

```bash
yarn add pokenode
```

## Usage

Import the main client:

```js
import { Pokenode } from 'pokenode';

const api = new Pokenode();

const pokemon = await api.pokemon.getPokemonByName('luxray')
  .then((response) => response)
  .catch((error) => console.error(error));

console.log(pokemon.name); // will output 'Luxray'
```

Or use an especific client:

```js
import { PokemonClient } from 'pokenode';

const api = new PokemonClient();

const pokemon = await api.getPokemonByName('luxray')
  .then((response) => response)
  .catch((error) => console.error(error));

console.log(pokemon.name) // will output 'Luxray'
```

## Using Constants

Pokenode has some useful abbreviations for some endpoints if you don't want to use raw strings or search for the ID's ;)

```js
import { Constants } from 'pokenode';

console.log(Constants.Berries.ASPEAR); // will output 5, the Aspear Berry ID
```

Or

```js
import { Berries } from 'pokenode';

console.log(Berries.ASPEAR); // will output 5, the Aspear Berry ID
```
