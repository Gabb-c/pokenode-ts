![logo](docs/_media/facebook_cover_photo_2.png)

<p align="center">
  <img alt="Build" src="https://img.shields.io/github/workflow/status/Gabb-c/pokenode-ts/Build?color=000000&labelColor=480ca8&style=for-the-badge&logo=nodedotjs&logoColor=white">
  <img alt="Codecov" src="https://img.shields.io/codecov/c/github/Gabb-c/pokenode-ts?color=000000&labelColor=f72585&&style=for-the-badge&token=whfY8GNSpS&logo=codecov&logoColor=white">
  <img alt="Snyk" src="https://img.shields.io/snyk/vulnerabilities/github/Gabb-c/pokenode-ts?style=for-the-badge&color=000000&labelColor=70e000&logo=snyk" />
  <a href="https://www.npmjs.com/package/pokenode-ts">
  <img alt="NPM Downloads" src="https://img.shields.io/npm/dt/pokenode-ts?style=for-the-badge&color=000000&labelColor=CB3837&logo=npm" />
  </a>
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

## Open in VS Code

Open Pokenode-ts in your Code, either using the [Remote Repositories extension](https://code.visualstudio.com/blogs/2021/06/10/remote-repositories), or [cloning in a Dev Container](https://code.visualstudio.com/docs/remote/containers):

[![Open in VS Code](https://img.shields.io/badge/VSCode-0078d7.svg?&style=for-the-badge&logo=visual-studio-code&logoColor=white&label=Open%20in&color=000000&labelColor=007acc)](https://open.vscode.dev/Gabb-c/pokenode-ts)

## Leave your feedback

- Did you like pokenode-ts? Give us a star ⭐
- Found a problem? Let us know by [creating an issue 🔎📑](https://github.com/Gabb-c/pokenode-ts/issues)
- Want to contribute? [Submit a PR](https://github.com/Gabb-c/pokenode-ts/pulls)

## Donate

Please consider donating if you think pokenode-ts is helpful to you or that my work is valuable. I am happy if you can buy me a coffee ❤️

<a href="https://www.buymeacoffee.com/pokenodets">
  <img alt="bmc-button" src="https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black">
</a>
<a href="https://ko-fi.com/pokenodets">
  <img alt="kofi-button" src="https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white">
</a>
<a href="https://www.paypal.com/donate?business=8TYDGB7874HT2&no_recurring=0&item_name=development&currency_code=USD">
  <img alt="paypal-button" src="https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white">
</a>
