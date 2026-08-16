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

### Which URLs are accepted

The URL must name an endpoint under the client's `baseURL`. Anything else throws a `TypeError`
rather than issuing a request somewhere unexpected:

```ts
await utility.getResourceByUrl('https://example.com/hello'); // TypeError
await utility.getResourceByUrl('/pokemon/1'); // TypeError — not absolute
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
