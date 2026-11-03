/* Constants & utils */
import { CAPACITY_COLORS } from "../palette";

/**
 * Constants of the thematic capacity model (Board 1 of the VRI-UdeA observatory, D-102).
 * Everything that is a business parameter lives here so it can be injected or changed later.
 */

/** Years used to measure the production trend (D-102: 2026 is incomplete). */
export const TREND_WINDOW_YEARS = Object.freeze([2021, 2022, 2023, 2024, 2025]);

/** Years that the filters accept. */
export const YEAR_RANGE = Object.freeze({ min: 2010, max: 2026 });

/**
 * Ratio thresholds that define the categories (D-102, 3 Nov 2026):
 * emerging < 0.25, consolidating > 0.50, consolidated > 0.75, leader = 1.
 */
export const DEFAULT_THRESHOLDS = Object.freeze({
  emerging: 0.25,
  consolidating: 0.5,
  consolidated: 0.75,
  leader: 1,
});

export const TREND = Object.freeze({
  NONE: "none",
  INCREASING: "increasing",
  DECREASING: "decreasing",
});

export const TREND_RULE = Object.freeze({ STRICT: "strict", SLOPE: "slope" });

export const RATIO_BASIS = Object.freeze({ GLOBAL: "global", NATIONAL: "national" });

export const DIMENSION = Object.freeze({
  TOPIC: "topic",
  SUBFIELD: "subfield",
  FIELD: "field",
});

export const CATEGORY = Object.freeze({
  LEADER: "leader",
  CONSOLIDATED: "consolidated",
  CONSOLIDATING: "consolidating",
  EMERGING: "emerging",
  AT_RISK: "atRisk",
  UNCATEGORIZED: "uncategorized",
  NONE: "none",
});

/** Display order of the categories in the calculator. */
export const CATEGORY_ORDER = Object.freeze([
  CATEGORY.LEADER,
  CATEGORY.CONSOLIDATED,
  CATEGORY.CONSOLIDATING,
  CATEGORY.EMERGING,
  CATEGORY.AT_RISK,
  CATEGORY.UNCATEGORIZED,
  CATEGORY.NONE,
]);

/* Visible texts (Spanish, as in the published artifact). */
export const CATEGORY_LABELS = Object.freeze({
  [CATEGORY.LEADER]: "líder",
  [CATEGORY.CONSOLIDATED]: "consolidado",
  [CATEGORY.CONSOLIDATING]: "en consolidación",
  [CATEGORY.EMERGING]: "emergente",
  [CATEGORY.AT_RISK]: "riesgo de desaparecer",
  [CATEGORY.UNCATEGORIZED]: "sin categoría",
  [CATEGORY.NONE]: "sin producción",
});

/** Colours come from the palettes of lib/constants.js (see ../palette.js). */
export const CATEGORY_COLORS = CAPACITY_COLORS;
