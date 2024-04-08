import type { Berry, NamedAPIResourceList } from "../../../src/models";

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
