---
description: "Build PokéAPI sprite URLs without a request — official artwork, HOME, Dream World and Showdown sprites, shiny, back-facing and gendered."
---

# Sprites

A Pokémon response carries its sprite URLs, but reaching them costs a request. `getPokemonSpriteUrl`
builds the same URLs offline, from an ID alone:

```ts
import { getPokemonSpriteUrl } from 'pokenode-ts';

getPokemonSpriteUrl(25);
// https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png

getPokemonSpriteUrl(25, { variant: 'official-artwork' });
// .../sprites/pokemon/other/official-artwork/25.png

getPokemonSpriteUrl(25, { variant: 'showdown', back: true, shiny: true });
// .../sprites/pokemon/other/showdown/back/shiny/25.gif
```

Sprites are keyed by ID — a name is not addressable. Reach for
[`getPokemonByName`](/clients/pokemon-client) first if that is all you have.

A list page has no IDs either, only links. [`resourceId()`](./helpers#resourceid) reads one out of a
link, which is how a grid of every Pokémon renders off a single list request:

```ts
import { getPokemonSpriteUrl, resourceId } from 'pokenode-ts';

page.results.map((link) => getPokemonSpriteUrl(resourceId(link)));
```

## Variants

| `variant` | Set | Format | `shiny` | `back` | `female` |
| --- | --- | --- | :---: | :---: | :---: |
| `default` | The in-game sprites | PNG | ✅ | ✅ | ✅ |
| `official-artwork` | Ken Sugimori artwork | PNG | ✅ | ❌ | ❌ |
| `home` | Pokémon HOME renders | PNG | ✅ | ❌ | ✅ |
| `dream-world` | Dream World artwork | SVG | ❌ | ❌ | ✅ |
| `showdown` | Animated Showdown sprites | GIF | ✅ | ✅ | ✅ |

A combination a set does not publish is a type error, not a broken URL:

```ts
getPokemonSpriteUrl(25, { variant: 'official-artwork', back: true });
//                                                     ~~~~ there are no back-facing artworks
```

:::warning
The repository does not hold every combination for every Pokémon. Recent generations have no
back-facing sprites, and a species that looks the same in both genders has no `female` one. This
builds a well-formed URL — it does not promise the file exists. Fall back to the sprite URLs on the
response, or to `null`, when an image fails to load.
:::

## Where the URLs point

Sprites live in [PokeAPI/sprites](https://github.com/PokeAPI/sprites), served over
`raw.githubusercontent.com` from the `master` branch — the same host the API's own responses use.
The root is exported as `BASE_URL.SPRITES` if you need to build a path this helper does not cover,
such as an item or a per-generation sprite.
