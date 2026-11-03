/* Constants & utils */
import { DEFAULT_FILTERS } from "./capacity/compute";
import { DIMENSION, RATIO_BASIS, TREND_RULE, YEAR_RANGE } from "./capacity/constants";

/** Milliseconds the board waits after the last change before it recomputes (150 to 250 ms, F22). */
export const FILTER_DEBOUNCE_MS = 200;

const PARAMS = {
  scope: "scope",
  policyDoc: "doc",
  centerIndex: "center",
  facultyIndex: "faculty",
  departmentIndex: "department",
  yearFrom: "from",
  yearTo: "to",
  dimension: "dimension",
  trendRule: "rule",
  ratioBasis: "basis",
};

const oneOf = (value, allowed, fallback) => (allowed.includes(value) ? value : fallback);
const index = (value) => (value !== null && value !== "" && Number.isInteger(+value) && +value >= 0 ? +value : -1);
const year = (value, fallback) => {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? Math.min(Math.max(n, YEAR_RANGE.min), YEAR_RANGE.max) : fallback;
};

/**
 * Reads the board filters from URL search params. Invalid values fall back to the defaults.
 *
 * @param {{ get: (key: string) => string | null }} searchParams
 * @returns {Object} filters
 */
export function parseFilters(searchParams) {
  const get = (k) => searchParams.get(PARAMS[k]);
  return {
    scope: get("scope") || DEFAULT_FILTERS.scope,
    policyDoc: get("policyDoc") || DEFAULT_FILTERS.policyDoc,
    centerIndex: index(get("centerIndex")),
    facultyIndex: index(get("facultyIndex")),
    departmentIndex: index(get("departmentIndex")),
    yearFrom: year(get("yearFrom"), DEFAULT_FILTERS.yearFrom),
    yearTo: year(get("yearTo"), DEFAULT_FILTERS.yearTo),
    dimension: oneOf(get("dimension"), Object.values(DIMENSION), DEFAULT_FILTERS.dimension),
    trendRule: oneOf(get("trendRule"), Object.values(TREND_RULE), DEFAULT_FILTERS.trendRule),
    ratioBasis: oneOf(get("ratioBasis"), Object.values(RATIO_BASIS), DEFAULT_FILTERS.ratioBasis),
  };
}

/**
 * Query string with only the filters that differ from the defaults (shareable URL).
 *
 * @param {Object} filters
 * @returns {string} Without the leading "?".
 */
export function serializeFilters(filters) {
  const params = new URLSearchParams();
  for (const [key, name] of Object.entries(PARAMS)) {
    if (filters[key] !== DEFAULT_FILTERS[key]) params.set(name, String(filters[key]));
  }
  return params.toString();
}

/** True when two filter states are equal. */
export function sameFilters(a, b) {
  return Object.keys(PARAMS).every((k) => a[k] === b[k]);
}
