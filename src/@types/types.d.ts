/* eslint camelcase: 0 */
declare module 'berries' {
  export type Berry = {
    id: number;
    name: string;
    growth_time: number;
    max_harvest: number;
    natural_gift_power: number;
    size: number;
    smoothness: number;
    soil_dryness: number;
    firmness: BerryFirmness;
    flavors: BerryFlavorMap[];
  };

  export type BerryFirmness = {
    id: number;
    name: string;
    berries: Berry[];
    names: Name[];
  };

  export type BerryFlavorMap = {
    potency: number;
    flavor: string;
  };
}

declare module 'utility' {
  export type Name = {
    name: string;
    language: Language;
  };

  export type Language = {
    id: number;
    name: string;
    official: boolean;
    iso639: string;
    iso3166: string;
    names: Name[];
  };
}
