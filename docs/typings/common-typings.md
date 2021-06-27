# Common Typings

## Named API Resource

The name and the URL of the referenced resource.

```ts
export interface NamedAPIResource {
  /** The name of the referenced resource */
  name: string;
  /** The URL of the referenced resource */
  url: string;
}
```

## Named API Resource List

Calling any API endpoint without a resource ID or name will return a paginated list of available resources for that API.
By default, a list "page" will contain up to 20 resources. If you would like to change this just add a 'limit' query parameter
to the GET request, e.g. ?=60. You can use 'offset' to move to the next page, e.g. ?limit=60&offset=60.

```ts
export interface NamedAPIResourceList {
  /** The total number of resources available from this API */
  count: number;
  /** The URL for the next page in the list */
  next: string | null;
  /** The URL for the previous page in the list */
  previous: string | null;
  /** A list of named API resources */
  results: NamedAPIResource[];
}
```

## API Resource

An URL for another resource in the API.

```ts
export interface APIResource {
  /** The URL of the referenced resource*/
  url: string;
}
```

## Description

The localized description for an API resource in a specific language.

```ts
export interface Description {
  /** The localized description for an API resource in a specific language. */
  description: string;
  /** The language this name is in */
  language: NamedAPIResource;
}
```

## Effect

The localized effect text for an API resource in a specific language.

```ts
export interface Effect {
  /** The localized effect text for an API resource in a specific language. */
  effect: string;
  /** The language this effect is in */
  language: NamedAPIResource;
}
```

## Encounter

Information of a pokemon encounter.

```ts
export interface Encounter {
  /** The lowest level the Pokémon could be encountered at */
  min_level: number;
  /** The highest level the Pokémon could be encountered at */
  max_level: number;
  /** A list of condition values that must be in effect for this encounter to occur */
  condition_values: NamedAPIResource;
  /** Percent chance that this encounter will occur */
  chance: number;
  /** The method by which this encounter happens */
  method: NamedAPIResource;
}
```

## Flavor Text

The localized flavor text for an API resource in a specific language.

```ts
export interface FlavorText {
  /** The localized flavor text for an API resource in a specific language */
  flavor_text: string;
  /** The language this name is in */
  language: NamedAPIResource;
  /** The game version this flavor text is extracted from */
  version: NamedAPIResource;
}
```

## Generation Game Index

The generation relevent to this game index

```ts
export interface GenerationGameIndex {
  /** The internal id of an API resource within game data */
  game_index: number;
  /** The generation relevent to this game index */
  generation: NamedAPIResource;
}
```

## Language

Languages for translations of API resource information.

```ts
export interface Language {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource  */
  name: string;
  /** Whether or not the games are published in this language */
  official: boolean;
  /** The two-letter code of the country where this language is spoken. Note that it is not unique */
  iso639: string;
  /** The two-letter code of the language. Note that it is not unique */
  iso3166: string;
  /** The name of this resource listed in different languages */
  names: Name[];
}
```

## Machine Version Detail

The machine that teaches a move from an item.

```ts
export interface MachineVersionDetail {
  /** The machine that teaches a move from an item */
  machine: NamedAPIResource;
  /** The version group of this specific machine */
  version_group: NamedAPIResource;
}
```

## Name

The localized name for an API resource in a specific language.

```ts
export interface Name {
  /** The localized name for an API resource in a specific language */
  name: string;
  /** The language this name is in */
  language: NamedAPIResource;
}
```

## Verbose Effect

The localized effect for an API resource.

```ts
export interface VerboseEffect {
  /** The localized effect text for an API resource in a specific language */
  effect: string;
  /** The localized effect text in brief */
  short_effect: string;
  /** The language this effect is in */
  language: NamedAPIResource;
}
```

## Version Encounter Detail

Encounters and their specifics details.

```ts
export interface VersionEncounterDetail {
  /** The game version this encounter happens in */
  version: NamedAPIResource;
  /** The total percentage of all encounter potential */
  max_chance: number;
  /** A list of encounters and their specifics */
  encounter_details: Encounter[];
}
```

## Version Game Index

The internal id and version of an API resource.

```ts
export interface VersionGameIndex {
  /** The internal id of an API resource within game data */
  game_index: number;
  /** The version relevent to this game index */
  version: NamedAPIResource;
}
```

## Version Group Flavor Text

The flavor text of an API resource.

```ts
export interface VersionGroupFlavorText {
  /** The localized name for an API resource in a specific language */
  text: string;
  /** The language this name is in */
  language: NamedAPIResource;
  /** The version group which uses this flavor text */
  version_group: NamedAPIResource;
}
```
