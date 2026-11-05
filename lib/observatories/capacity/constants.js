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
  STABLE: "stable",
  DECREASING: "decreasing",
});

/**
 * Band of the "stable" trend (D-121, D-122): the slope of the least-squares line over the trend
 * window, divided by the yearly mean, must be above +TREND_BAND to be increasing and below
 * -TREND_BAND to be decreasing; in between it is stable. A constant: Luis can change it.
 */
export const TREND_BAND = 0.1;

/** A trend measured on fewer products than this in the window is only indicative (marked with *, D-121). */
export const MIN_TREND_VOLUME = 10;

/**
 * Minimum mass to classify a unit by ratio and trend (F45, D-138): with the products of 2021–2025 and the
 * other filters, 0 products is "sin producción", 1 to MIN_PRODUCTS_CLASSIFY - 1 is "presencia puntual"
 * (not classified) and this many or more are classified in the six categories. The asterisk of the
 * indicative trend (MIN_TREND_VOLUME) does not change.
 */
export const MIN_PRODUCTS_CLASSIFY = 5;

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
  LOW_CAPACITY: "lowCapacity",
  PUNCTUAL: "punctual",
  UNCATEGORIZED: "uncategorized",
  NONE: "none",
});

/** Display order of the eight categories of the calculator (D-122, D-138, top to bottom). */
export const CATEGORY_ORDER = Object.freeze([
  CATEGORY.LEADER,
  CATEGORY.CONSOLIDATED,
  CATEGORY.CONSOLIDATING,
  CATEGORY.EMERGING,
  CATEGORY.AT_RISK,
  CATEGORY.LOW_CAPACITY,
  CATEGORY.PUNCTUAL,
  CATEGORY.NONE,
]);

/** Order of the old model (artifact data, `?source=mock`): it still has "sin categoría" instead of "capacidad relativa baja". */
export const CATEGORY_ORDER_LEGACY = Object.freeze([
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
  [CATEGORY.LOW_CAPACITY]: "capacidad relativa baja",
  [CATEGORY.PUNCTUAL]: "presencia puntual",
  [CATEGORY.UNCATEGORIZED]: "sin categoría",
  [CATEGORY.NONE]: "sin producción",
});

/** Colours come from the palettes of lib/constants.js (see ../palette.js). */
export const CATEGORY_COLORS = CAPACITY_COLORS;

/**
 * Confidence levels of the axis–work pairs (facts[12]: 0 high, 1 medium, 2 low; 02 §3.11, D-092).
 * By default the board counts only high and medium (Q8); "all" also counts low.
 */
export const PAIR_LEVEL = Object.freeze({ CORE: "core", ALL: "all" });

/** Highest confidence code each level admits (0 high, 1 medium, 2 low). */
export const PAIR_LEVEL_MAX_CODE = Object.freeze({ core: 1, all: 2 });
