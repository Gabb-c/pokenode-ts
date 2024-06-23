import type { Berry, BerryFirmness, BerryFlavor, NamedAPIResourceList } from "@models";

export const MOCK_BERRY = {
  firmness: {
    name: "soft",
    url: "https://pokeapi.co/api/v2/berry-firmness/2/",
  },
  flavors: [
    {
      flavor: {
        name: "spicy",
        url: "https://pokeapi.co/api/v2/berry-flavor/1/",
      },
      potency: 10,
    },
  ],
  growth_time: 3,
  id: 1,
  item: {
    name: "cheri-berry",
    url: "https://pokeapi.co/api/v2/item/126/",
  },
  max_harvest: 5,
  name: "cheri",
  natural_gift_power: 60,
  natural_gift_type: {
    name: "fire",
    url: "https://pokeapi.co/api/v2/type/10/",
  },
  size: 20,
  smoothness: 25,
  soil_dryness: 15,
} as Berry;

export const MOCK_BERRY_LIST = {
  count: 64,
  next: "https://pokeapi.co/api/v2/berry?offset=20&limit=20",
  previous: null,
  results: [
    {
      name: "cheri",
      url: "https://pokeapi.co/api/v2/berry/1/",
    },
  ],
} as NamedAPIResourceList;

export const MOCK_BERRY_FIRMNESS = {
  berries: [
    {
      name: "pecha",
      url: "https://pokeapi.co/api/v2/berry/3/",
    },
  ],
  id: 1,
  name: "very-soft",
  names: [
    {
      language: {
        name: "ja-Hrkt",
        url: "https://pokeapi.co/api/v2/language/1/",
      },
      name: "とてもやわらかい",
    },
  ],
} as BerryFirmness;

export const MOCK_BERRY_FIRMNESS_LIST = {
  count: 5,
  next: null,
  previous: null,
  results: [
    {
      name: "very-soft",
      url: "https://pokeapi.co/api/v2/berry-firmness/1/",
    },
    {
      name: "soft",
      url: "https://pokeapi.co/api/v2/berry-firmness/2/",
    },
    {
      name: "hard",
      url: "https://pokeapi.co/api/v2/berry-firmness/3/",
    },
    {
      name: "very-hard",
      url: "https://pokeapi.co/api/v2/berry-firmness/4/",
    },
    {
      name: "super-hard",
      url: "https://pokeapi.co/api/v2/berry-firmness/5/",
    },
  ],
} as NamedAPIResourceList;

export const MOCK_BERRY_FLAVOR = {
  berries: [
    {
      berry: {
        name: "rowap",
        url: "https://pokeapi.co/api/v2/berry/64/",
      },
      potency: 10,
    },
  ],
  contest_type: {
    name: "cool",
    url: "https://pokeapi.co/api/v2/contest-type/1/",
  },
  id: 1,
  name: "spicy",
  names: [
    {
      language: {
        name: "ja-Hrkt",
        url: "https://pokeapi.co/api/v2/language/1/",
      },
      name: "からい",
    },
  ],
} as BerryFlavor;

export const MOCK_BERRY_FLAVOR_LIST = {
  count: 5,
  next: null,
  previous: null,
  results: [
    {
      name: "spicy",
      url: "https://pokeapi.co/api/v2/berry-flavor/1/",
    },
  ],
} as NamedAPIResourceList;
