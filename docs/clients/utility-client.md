# Utility Client

## Usage

The Utility Client provide methods to access the [Languages Endpoinds](https://pokeapi.co/docs/v2#languages-section) and resources:

- `getLanguageByName`(name: `string`) : [Language](/docs/typings/common-typings#language)
- `getLanguageById`(id: `number`) : [Language](/docs/typings/common-typings#language)
- `getResourceByUrl`(url: `string`) : `any`
- `listLanguagesF`(offset?: `number`, limit?: `number`) : [NamedAPIResourceList](/docs/typings/common-typings#named-api-resource-list)

## Example

```ts
import { UtilityClient } from 'pokenode-ts'; // import the UtilityClient

(async () => {
  const api = new UtilityClient(); // create a UtilityClient

  await api
    .getResourceByUrl('https://pokeapi.co/api/v2/pokemon/luxray') // using method getResourceByUrl() (pokemon endpoint)
    .then((response: Pokemon) => console.log(response)) // The resource will be a Pokemon (Luxray)
    .catch((error) => console.log(error));
})();
```

```js
import { UtilityClient, Languages } from 'pokenode-ts'; // import the UtilityClient

(async () => {
  const api = new UtilityClient(); // create a UtilityClient

  const lang = await api
    .getLanguageById(Languages.KO) // using method getLanguageById()
    .then((response) => response)
    .catch((error) => console.log(error));
})();
```

Will output:

```json
{
  "id": 3,
  "iso3166": "kr",
  "iso639": "ko",
  "name": "ko",
  "names": [
    {
      "language": {
        "name": "ja-Hrkt",
        "url": "https://pokeapi.co/api/v2/language/1/"
      },
      "name": "韓国語"
    },
    {
      "language": {
        "name": "ko",
        "url": "https://pokeapi.co/api/v2/language/3/"
      },
      "name": "한국어"
    },
    {
      "language": {
        "name": "fr",
        "url": "https://pokeapi.co/api/v2/language/5/"
      },
      "name": "Coréen"
    },
    {
      "language": {
        "name": "de",
        "url": "https://pokeapi.co/api/v2/language/6/"
      },
      "name": "Koreanisch"
    },
    {
      "language": {
        "name": "es",
        "url": "https://pokeapi.co/api/v2/language/7/"
      },
      "name": "Coreano"
    },
    {
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      },
      "name": "Korean"
    }
  ],
  "official": true
}
```
