# Pokenode-ts

**Pokenode-ts** is a lightweight Node.js wrapper for the PokéAPI with built-in types. It provides an easy way to integrate your application with the PokéAPI.

## Features

- 🛠️ **Built-in typings**: TypeScript support with pre-defined types.
- 📦 **Axios with auto-cache requests**: Efficiently manage API requests with automatic caching.
- 🌲 **Logging**: Easily log and track your API interactions.

## Installation

```bash
# NPM
npm install axios axios-cache-interceptor pokenode-ts

# Yarn
yarn add axios axios-cache-interceptor pokenode-ts

# Pnpm
pnpm add axios axios-cache-interceptor pokenode-ts
```

## Basic Example

```ts
import { PokemonClient } from 'pokenode-ts'; // Import the Client

const pokemon = await api.getPokemonByName('luxray') // Make the request
  .catch(() => console.log("Oops!"));

console.log(pokemon.name); // Typesafe response ✨ (Outputs "Luxray")
```

## Documentation

Check out our [Documentation page](https://pokenode-ts.vercel.app/)!

## Security

Every change in this project is analyzed by [SonarCloud](https://sonarcloud.io/)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Gabb-c_pokenode-ts&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Gabb-c_pokenode-ts 'Sonar Quality Gate Status')
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Gabb-c_pokenode-ts&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Gabb-c_pokenode-ts 'Sonar Bugs')
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=Gabb-c_pokenode-ts&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=Gabb-c_pokenode-ts 'Sonar Code Smells')
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Gabb-c_pokenode-ts&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Gabb-c_pokenode-ts 'Sonar Quality Gate Status')
[![codecov](https://codecov.io/gh/Gabb-c/pokenode-ts/branch/master/graph/badge.svg?token=whfY8GNSpS)](https://codecov.io/gh/Gabb-c/pokenode-ts 'Codecov Coverage Reports')

## Leave your feedback

- Did you like pokenode-ts? [Give us a star ⭐](https://github.com/Gabb-c/pokenode-ts)
- Found a problem? Let us know by [creating an issue 🔎](https://github.com/Gabb-c/pokenode-ts/issues)
- Want to contribute? [Submit a PR 📑](https://github.com/Gabb-c/pokenode-ts/pulls)

## Donate

If pokenode-ts is valuable to you, please consider [buying me a coffee](https://github.com/sponsors/Gabb-c) ❤️

![Analytics](https://repobeats.axiom.co/api/embed/f71a113e3161e1d054170c94e4ac3fcfc960cdd4.svg 'Repobeats analytics image')
