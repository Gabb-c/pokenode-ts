import { http, HttpResponse } from "msw";
import type { Berry } from "../../src/models";

const MOCKED_RESPONSE = {
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

const getBerryByName = http.get<never, never, Berry>(
  "https://pokeapi.co/api/v2/berry/cheri",
  async () => HttpResponse.json(MOCKED_RESPONSE),
);

export const berryHandlers = [getBerryByName];
