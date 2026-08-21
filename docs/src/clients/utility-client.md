---
description: "Fetch languages and follow any resource URL the PokéAPI hands you, with the typed UtilityClient."
---

# Utility Client

Covers the PokéAPI's [utility section](https://pokeapi.co/docs/v2#utility-section): languages, and
a generic way to follow any resource URL the API hands you.

```ts
import { UtilityClient } from 'pokenode-ts';

const api = new UtilityClient();

const english = await api.getLanguageByName('en');

console.log(english.official); // true
```

## Methods

### Languages

| Method | Returns |
| --- | --- |
| `getLanguageByName(name)` | `Language` |
| `getLanguageById(id)` | `Language` |
| `listLanguages(offset?, limit?)` | `NamedAPIResourceList` |

### Resources

| Method | Returns |
| --- | --- |
| `getResourceByUrl(link)` | What the link points at |
| `getResourceByUrl<T>(url)` | `T` |

## Following a resource URL

Most PokéAPI responses are full of references rather than nested objects — `{ name, url }` pairs
pointing at other resources. `getResourceByUrl` follows one without working out which client and
method it belongs to.

::: tip
Every client carries `resolve()` and `resolveAll()`, which do exactly this — `api.pokemon.resolve(link)`
saves reaching for a `UtilityClient` you otherwise have no use for. `getResourceByUrl` is the name
this went out under in 2.0, and it stays.
:::

Pass the link itself and the result is typed for you — the link carries what it points at:

```ts
import { UtilityClient, PokemonClient } from 'pokenode-ts';

const species = await new PokemonClient().getPokemonSpeciesByName('eevee');

const chain = await new UtilityClient().getResourceByUrl(species.evolution_chain);
//    ^? EvolutionChain
```

Passing `species.evolution_chain.url` instead works too, but a bare string carries nothing to infer
from, so the type has to be named:

```ts
import type { EvolutionChain } from 'pokenode-ts';

const chain = await utility.getResourceByUrl<EvolutionChain>(species.evolution_chain.url);
```

::: warning A named type parameter is unchecked
`getResourceByUrl<T>(url)` returns whatever you claim it returns — nothing validates the response
against `T` at runtime. Passing the link instead of its `url` avoids the question entirely.
:::

The same works for paginated lists, whose `next` and `previous` fields are URLs. Those are plain
strings, so they still take a type argument — and the list knows its own element type:

```ts
import { UtilityClient, PokemonClient, type NamedAPIResourceList, type Pokemon } from 'pokenode-ts';

const utility = new UtilityClient();
let page = await new PokemonClient().listPokemons(0, 20);
//  ^? NamedAPIResourceList<Pokemon>

while (page.next) {
  page = await utility.getResourceByUrl<NamedAPIResourceList<Pokemon>>(page.next);
}

// Every entry of `page.results` follows straight through:
const first = await utility.getResourceByUrl(page.results[0]);
//    ^? Pokemon
```

### Lists without names

Five sections have nothing to name their entries by — `machine`, `contest-effect`,
`super-contest-effect`, `evolution-chain` and `characteristic` are identified by URL alone. Those
methods return `APIResourceList` instead, whose entries are `{ url }` with no `name`:

```ts
const machines = await new MachineClient().listMachines();
//    ^? APIResourceList<Machine>

const machine = await utility.getResourceByUrl(machines.results[0]);
//    ^? Machine
```

Everything else about them is the same — pagination, and following an entry through
`getResourceByUrl`.

::: warning A link that crosses the ESM/CJS boundary loses its type
A link carries what it points at through a type-level marker, and the package ships separate
declarations for its ESM and CJS builds, each with its own copy of that marker. A
`NamedAPIResource` obtained through one build and passed to a `getResourceByUrl` from the other
still assigns cleanly, but the marker no longer matches, so `T` falls back to `unknown` instead of
the resource type.

One install is enough: it happens whenever two places in a build resolve pokenode-ts under different
module formats — a dependency between you and the library requiring it while you import it, a single
file mixing `import` and `require` resolution, or two copies in `node_modules`. If a link ever comes
back as `unknown` for no visible
reason, that is why — name the type explicitly (`getResourceByUrl<Machine>(link.url)`) and it
behaves as before. It is the same split that makes [`PokenodeError.isPokenodeError`](/guides/errors)
the way to identify an error rather than `instanceof`.
:::

### Which URLs are accepted

The URL must be absolute, and it must name an endpoint — a path sitting below an API version
segment, as in `/api/v2/berry/1`. Anything else throws a `TypeError` rather than issuing a request
somewhere unexpected:

```ts
await utility.getResourceByUrl('https://example.com/hello'); // TypeError — names no endpoint
await utility.getResourceByUrl('/pokemon/1'); // TypeError — not absolute
```

A URL that names an endpoint but points at **another host** is not fetched from that host. The path
below the version segment is re-resolved against this client's own `baseURL`, so a link copied from
pokeapi.co and followed by a client aimed at your instance reaches your instance:

```ts
const api = new UtilityClient({ baseURL: 'https://poke.internal/api/v2' });

await api.getResourceByUrl('https://pokeapi.co/api/v2/berry/1');
// requests https://poke.internal/api/v2/berry/1
```

Trailing slashes are fine. The PokéAPI's own links end in one, and they resolve to the same cache
entry as the equivalent call through a typed method — `getBerryById(1)` and following
`https://pokeapi.co/api/v2/berry/1/` cost one request between them, not two.

## Using constants

```ts
import { UtilityClient, LANGUAGES } from 'pokenode-ts';

const api = new UtilityClient();

const english = await api.getLanguageById(LANGUAGES.EN); // LANGUAGES.EN === 9
```

::: warning
`LANGUAGES.ROOMAJI` was renamed to `LANGUAGES.JA_ROMA` in 2.0, following the PokéAPI's own rename of
language 2. The id is unchanged. See the [migration guide](/guides/migration).
:::
