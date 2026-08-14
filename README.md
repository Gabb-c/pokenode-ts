# Pokenode-ts

**Pokenode-ts** is a lightweight Node.js wrapper for the PokéAPI with built-in types. It provides an easy way to integrate your application with the PokéAPI.

## Features

- 🛠️ **Built-in typings**: TypeScript support with pre-defined types.
- 📦 **Auto-cached requests**: Responses are cached in memory, so repeated lookups skip the network.
- 🌲 **Logging**: Easily log and track your API interactions.
- 🪶 **Zero dependencies**: Built on native `fetch`, so it runs in Node, Deno, Bun, browsers, and edge runtimes.
- 🔌 **Bring your own transport**: Pass a custom `fetch` for proxies, retries, or instrumentation.

## Installation

```bash
# NPM
npm install pokenode-ts

# Yarn
yarn add pokenode-ts

# Pnpm
pnpm add pokenode-ts
```

## Basic Example

```ts
import { PokemonClient } from 'pokenode-ts'; // Import the Client

const api = new PokemonClient(); // Create the Client

const pokemon = await api.getPokemonByName('luxray'); // Make the request

console.log(pokemon.name); // Typesafe response ✨ (Outputs "luxray")
```

## Error Handling

Requests reject with a `PokenodeError` when the PokéAPI answers with a non-2xx status. Use the
`isPokenodeError` guard to catch it:

```ts
import { PokemonClient, PokenodeError } from 'pokenode-ts';

try {
  const pokemon = await new PokemonClient().getPokemonByName('missingno');
} catch (error) {
  if (PokenodeError.isPokenodeError(error)) {
    console.log(error.status);     // 404
    console.log(error.statusText); // 'Not Found'
    console.log(error.url);        // the request URL
    console.log(error.body);       // parsed JSON body, when the response had one
  }
}
```

Prefer the guard over `instanceof`: a dependency tree that loads both the ESM and the CJS build
ends up with two distinct classes, and `instanceof` against the wrong one is silently `false`.

Transport failures — offline, DNS, an abort from a signal you supplied — are not wrapped, and
reject with whatever the runtime threw.

Clients impose no timeout. Pass a signal through a custom `fetch` if you want one:

```ts
new PokemonClient({
  fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(5000) }),
});
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
