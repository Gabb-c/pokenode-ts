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
    {
      flavor: {
        name: "dry",
        url: "https://pokeapi.co/api/v2/berry-flavor/2/",
      },
      potency: 0,
    },
    {
      flavor: {
        name: "sweet",
        url: "https://pokeapi.co/api/v2/berry-flavor/3/",
      },
      potency: 0,
    },
    {
      flavor: {
        name: "bitter",
        url: "https://pokeapi.co/api/v2/berry-flavor/4/",
      },
      potency: 0,
    },
    {
      flavor: {
        name: "sour",
        url: "https://pokeapi.co/api/v2/berry-flavor/5/",
      },
      potency: 0,
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
    {
      name: "chesto",
      url: "https://pokeapi.co/api/v2/berry/2/",
    },
    {
      name: "pecha",
      url: "https://pokeapi.co/api/v2/berry/3/",
    },
    {
      name: "rawst",
      url: "https://pokeapi.co/api/v2/berry/4/",
    },
    {
      name: "aspear",
      url: "https://pokeapi.co/api/v2/berry/5/",
    },
    {
      name: "leppa",
      url: "https://pokeapi.co/api/v2/berry/6/",
    },
    {
      name: "oran",
      url: "https://pokeapi.co/api/v2/berry/7/",
    },
    {
      name: "persim",
      url: "https://pokeapi.co/api/v2/berry/8/",
    },
    {
      name: "lum",
      url: "https://pokeapi.co/api/v2/berry/9/",
    },
    {
      name: "sitrus",
      url: "https://pokeapi.co/api/v2/berry/10/",
    },
    {
      name: "figy",
      url: "https://pokeapi.co/api/v2/berry/11/",
    },
    {
      name: "wiki",
      url: "https://pokeapi.co/api/v2/berry/12/",
    },
    {
      name: "mago",
      url: "https://pokeapi.co/api/v2/berry/13/",
    },
    {
      name: "aguav",
      url: "https://pokeapi.co/api/v2/berry/14/",
    },
    {
      name: "iapapa",
      url: "https://pokeapi.co/api/v2/berry/15/",
    },
    {
      name: "razz",
      url: "https://pokeapi.co/api/v2/berry/16/",
    },
    {
      name: "bluk",
      url: "https://pokeapi.co/api/v2/berry/17/",
    },
    {
      name: "nanab",
      url: "https://pokeapi.co/api/v2/berry/18/",
    },
    {
      name: "wepear",
      url: "https://pokeapi.co/api/v2/berry/19/",
    },
    {
      name: "pinap",
      url: "https://pokeapi.co/api/v2/berry/20/",
    },
  ],
} as NamedAPIResourceList;

export const MOCK_BERRY_FIRMNESS = {
  berries: [
    {
      name: "pecha",
      url: "https://pokeapi.co/api/v2/berry/3/",
    },
    {
      name: "pamtre",
      url: "https://pokeapi.co/api/v2/berry/32/",
    },
    {
      name: "belue",
      url: "https://pokeapi.co/api/v2/berry/35/",
    },
    {
      name: "wacan",
      url: "https://pokeapi.co/api/v2/berry/38/",
    },
    {
      name: "tanga",
      url: "https://pokeapi.co/api/v2/berry/46/",
    },
    {
      name: "charti",
      url: "https://pokeapi.co/api/v2/berry/47/",
    },
    {
      name: "chilan",
      url: "https://pokeapi.co/api/v2/berry/52/",
    },
    {
      name: "rowap",
      url: "https://pokeapi.co/api/v2/berry/64/",
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
    {
      language: {
        name: "zh-Hant",
        url: "https://pokeapi.co/api/v2/language/4/",
      },
      name: "很柔軟",
    },
    {
      language: {
        name: "fr",
        url: "https://pokeapi.co/api/v2/language/5/",
      },
      name: "Très tendre",
    },
    {
      language: {
        name: "es",
        url: "https://pokeapi.co/api/v2/language/7/",
      },
      name: "Muy blanda",
    },
    {
      language: {
        name: "en",
        url: "https://pokeapi.co/api/v2/language/9/",
      },
      name: "Very Soft",
    },
    {
      language: {
        name: "zh-Hans",
        url: "https://pokeapi.co/api/v2/language/12/",
      },
      name: "很柔软",
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
    {
      berry: {
        name: "leppa",
        url: "https://pokeapi.co/api/v2/berry/6/",
      },
      potency: 10,
    },
    {
      berry: {
        name: "oran",
        url: "https://pokeapi.co/api/v2/berry/7/",
      },
      potency: 10,
    },
    {
      berry: {
        name: "persim",
        url: "https://pokeapi.co/api/v2/berry/8/",
      },
      potency: 10,
    },
    {
      berry: {
        name: "lum",
        url: "https://pokeapi.co/api/v2/berry/9/",
      },
      potency: 10,
    },
    {
      berry: {
        name: "razz",
        url: "https://pokeapi.co/api/v2/berry/16/",
      },
      potency: 10,
    },
    {
      berry: {
        name: "pinap",
        url: "https://pokeapi.co/api/v2/berry/20/",
      },
      potency: 10,
    },
    {
      berry: {
        name: "pomeg",
        url: "https://pokeapi.co/api/v2/berry/21/",
      },
      potency: 10,
    },
    {
      berry: {
        name: "qualot",
        url: "https://pokeapi.co/api/v2/berry/23/",
      },
      potency: 10,
    },
    {
      berry: {
        name: "hondew",
        url: "https://pokeapi.co/api/v2/berry/24/",
      },
      potency: 10,
    },
    {
      berry: {
        name: "nomel",
        url: "https://pokeapi.co/api/v2/berry/30/",
      },
      potency: 10,
    },
    {
      berry: {
        name: "belue",
        url: "https://pokeapi.co/api/v2/berry/35/",
      },
      potency: 10,
    },
    {
      berry: {
        name: "rindo",
        url: "https://pokeapi.co/api/v2/berry/39/",
      },
      potency: 10,
    },
    {
      berry: {
        name: "shuca",
        url: "https://pokeapi.co/api/v2/berry/43/",
      },
      potency: 10,
    },
    {
      berry: {
        name: "charti",
        url: "https://pokeapi.co/api/v2/berry/47/",
      },
      potency: 10,
    },
    {
      berry: {
        name: "apicot",
        url: "https://pokeapi.co/api/v2/berry/57/",
      },
      potency: 10,
    },
    {
      berry: {
        name: "cheri",
        url: "https://pokeapi.co/api/v2/berry/1/",
      },
      potency: 10,
    },
    {
      berry: {
        name: "chople",
        url: "https://pokeapi.co/api/v2/berry/41/",
      },
      potency: 15,
    },
    {
      berry: {
        name: "figy",
        url: "https://pokeapi.co/api/v2/berry/11/",
      },
      potency: 15,
    },
    {
      berry: {
        name: "occa",
        url: "https://pokeapi.co/api/v2/berry/36/",
      },
      potency: 15,
    },
    {
      berry: {
        name: "tamato",
        url: "https://pokeapi.co/api/v2/berry/26/",
      },
      potency: 20,
    },
    {
      berry: {
        name: "tanga",
        url: "https://pokeapi.co/api/v2/berry/46/",
      },
      potency: 20,
    },
    {
      berry: {
        name: "babiri",
        url: "https://pokeapi.co/api/v2/berry/51/",
      },
      potency: 25,
    },
    {
      berry: {
        name: "starf",
        url: "https://pokeapi.co/api/v2/berry/59/",
      },
      potency: 30,
    },
    {
      berry: {
        name: "liechi",
        url: "https://pokeapi.co/api/v2/berry/53/",
      },
      potency: 30,
    },
    {
      berry: {
        name: "spelon",
        url: "https://pokeapi.co/api/v2/berry/31/",
      },
      potency: 30,
    },
    {
      berry: {
        name: "petaya",
        url: "https://pokeapi.co/api/v2/berry/56/",
      },
      potency: 30,
    },
    {
      berry: {
        name: "lansat",
        url: "https://pokeapi.co/api/v2/berry/58/",
      },
      potency: 30,
    },
    {
      berry: {
        name: "enigma",
        url: "https://pokeapi.co/api/v2/berry/60/",
      },
      potency: 40,
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
    {
      language: {
        name: "zh-Hant",
        url: "https://pokeapi.co/api/v2/language/4/",
      },
      name: "辣",
    },
    {
      language: {
        name: "fr",
        url: "https://pokeapi.co/api/v2/language/5/",
      },
      name: "Épicé",
    },
    {
      language: {
        name: "en",
        url: "https://pokeapi.co/api/v2/language/9/",
      },
      name: "Spicy",
    },
    {
      language: {
        name: "zh-Hans",
        url: "https://pokeapi.co/api/v2/language/12/",
      },
      name: "辣",
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
    {
      name: "dry",
      url: "https://pokeapi.co/api/v2/berry-flavor/2/",
    },
    {
      name: "sweet",
      url: "https://pokeapi.co/api/v2/berry-flavor/3/",
    },
    {
      name: "bitter",
      url: "https://pokeapi.co/api/v2/berry-flavor/4/",
    },
    {
      name: "sour",
      url: "https://pokeapi.co/api/v2/berry-flavor/5/",
    },
  ],
} as NamedAPIResourceList;
