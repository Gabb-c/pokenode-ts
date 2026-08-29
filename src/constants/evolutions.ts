export const EVOLUTION_TRIGGERS = {
  LEVEL_UP: 1,
  TRADE: 2,
  USE_ITEM: 3,
  SHED: 4,
  SPIN: 5,
  TOWER_OF_DARKNESS: 6,
  TOWER_OF_WATERS: 7,
  THREE_CRITICAL_HITS: 8,
  TAKE_DAMAGE: 9,
  OTHER: 10,
  AGILE_STYLE_MOVE: 11,
  STRONG_STYLE_MOVE: 12,
  RECOIL_DAMAGE: 13,
  USE_MOVE: 14,
  THREE_DEFEATED_BISHARP: 15,
  GIMMIGHOUL_COINS: 16,
  /**
   * @deprecated Misspelled: the endpoint names this trigger `tower-of-waters`.
   *   Use {@link EVOLUTION_TRIGGERS.TOWER_OF_WATERS}. Removed in 3.0.
   */
  TOWER_OF_WATER: 7,
} as const;
