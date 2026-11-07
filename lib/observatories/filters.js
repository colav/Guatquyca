/* Constants & utils */
import { DEFAULT_FILTERS } from "./capacity/compute";
import { DIMENSION, RATIO_BASIS, YEAR_RANGE } from "./capacity/constants";

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
  ratioBasis: "basis",
  axisIds: "axis",
  topicKey: "topic",
  odsNumber: "ods",
};

/** Names of the URL parameters that belong to the filters (the rest, such as `source`, are kept as they are). */
export const FILTER_PARAM_NAMES = Object.values(PARAMS);

/** List of axis ids of the URL («3,17»): integers without repeats; anything else is ignored. */
const idList = (value) => [...new Set((value || "").split(",").map((v) => Number.parseInt(v, 10)).filter((n) => Number.isInteger(n) && n >= 0))];
const sameList = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

/** ODS number of the URL: an integer from 1 to 17; anything else is «all» (0). */
const odsNumber = (value) => {
  const n = Number.parseInt(value, 10);
  return Number.isInteger(n) && n >= 1 && n <= 17 ? n : 0;
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
    ratioBasis: oneOf(get("ratioBasis"), Object.values(RATIO_BASIS), DEFAULT_FILTERS.ratioBasis),
    axisIds: idList(get("axisIds")),
    topicKey: get("topicKey") || DEFAULT_FILTERS.topicKey,
    odsNumber: odsNumber(get("odsNumber")),
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
    if (key === "axisIds") {
      if (filters.axisIds && filters.axisIds.length) params.set(name, filters.axisIds.join(","));
    } else if (filters[key] !== DEFAULT_FILTERS[key]) params.set(name, String(filters[key]));
  }
  return params.toString();
}

/** True when two filter states are equal. */
export function sameFilters(a, b) {
  return Object.keys(PARAMS).every((k) => (k === "axisIds" ? sameList(a.axisIds || [], b.axisIds || []) : a[k] === b[k]));
}
