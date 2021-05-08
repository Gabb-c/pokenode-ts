/* eslint-disable camelcase */

import { Effect, NamedAPIResource } from '../Common';

export interface AbilityEffectChange {
  effect_entries: Effect;
  version_group: NamedAPIResource;
}
