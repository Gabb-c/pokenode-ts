# pokenode-ts

A lightweight Node.js wrapper for the PokéAPI with built-in types. An easy way to integrate your app with the PokéAPI.

## Features

- 🛠️ Built-in typings
- 📦 Axios with auto-cache requests
- 🌲 Logging

## Installation

```bash
# NPM
npm i axios axios-cache-interceptor pokenode-ts

# Yarn
yarn add axios axios-cache-interceptor pokenode-ts

# Pnpm
pnpm i axios axios-cache-interceptor pokenode-ts
```

## Basic Example

Using a client, like [PokemonClient](https://pokenode-ts.vercel.app/clients/pokemon-client):

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

Check out our [Documentation page](https://pokenode-ts.vercel.app/)!

## Security

Every change in this project is analyzed by [SonarCloud](https://sonarcloud.io/)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Gabb-c_pokenode-ts&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Gabb-c_pokenode-ts)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Gabb-c_pokenode-ts&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Gabb-c_pokenode-ts)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=Gabb-c_pokenode-ts&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=Gabb-c_pokenode-ts)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Gabb-c_pokenode-ts&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Gabb-c_pokenode-ts)
[![codecov](https://codecov.io/gh/Gabb-c/pokenode-ts/branch/master/graph/badge.svg?token=whfY8GNSpS)](https://codecov.io/gh/Gabb-c/pokenode-ts)

## Leave your feedback

- Did you like pokenode-ts? [Give us a star ⭐](https://github.com/Gabb-c/pokenode-ts)
- Found a problem? Let us know by [creating an issue 🔎](https://github.com/Gabb-c/pokenode-ts/issues)
- Want to contribute? [Submit a PR 📑](https://github.com/Gabb-c/pokenode-ts/pulls)

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

## Repository Analytics

![Analytics](https://repobeats.axiom.co/api/embed/f71a113e3161e1d054170c94e4ac3fcfc960cdd4.svg 'Repobeats analytics image')
