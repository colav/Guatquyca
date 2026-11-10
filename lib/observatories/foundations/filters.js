/* Constants & utils */
import { YEAR_RANGE } from "./constants";

/** Milliseconds the board waits after the last change before it recomputes (150 to 250 ms, F22). */
export const FOUNDATIONS_FILTER_DEBOUNCE_MS = 200;

/** Filters of Board 3 with their default values (report section 4). Indexes use -1 for "Todos". */
export const DEFAULT_FOUNDATIONS_FILTERS = Object.freeze({
  scopeIndex: -1,
  policyIndex: -1,
  centerIndex: -1,
  yearFrom: YEAR_RANGE.min,
  yearTo: YEAR_RANGE.max,
  facultyIndex: -1,
  departmentIndex: -1,
  subfieldIndex: -1,
  /* Field chosen in the tree of subfields (F76): all its subfields. */
  fieldIndex: -1,
});

const PARAMS = {
  scopeIndex: "scope",
  policyIndex: "doc",
  centerIndex: "center",
  yearFrom: "from",
  yearTo: "to",
  facultyIndex: "faculty",
  departmentIndex: "department",
  subfieldIndex: "subfield",
  fieldIndex: "field",
};

const index = (value) => (value !== null && value !== "" && Number.isInteger(+value) && +value >= 0 ? +value : -1);
const year = (value, fallback) => {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? Math.min(Math.max(n, YEAR_RANGE.min), YEAR_RANGE.max) : fallback;
};

/**
 * Reads the filters of Board 3 from URL search params. Invalid values fall back to the defaults.
 *
 * @param {{ get: (key: string) => string | null }} searchParams
 * @returns {Object}
 */
export function parseFoundationsFilters(searchParams) {
  const get = (k) => searchParams.get(PARAMS[k]);
  const scope = index(get("scopeIndex"));
  return {
    scopeIndex: scope <= 3 ? scope : -1,
    policyIndex: index(get("policyIndex")),
    centerIndex: index(get("centerIndex")),
    yearFrom: year(get("yearFrom"), DEFAULT_FOUNDATIONS_FILTERS.yearFrom),
    yearTo: year(get("yearTo"), DEFAULT_FOUNDATIONS_FILTERS.yearTo),
    facultyIndex: index(get("facultyIndex")),
    departmentIndex: index(get("departmentIndex")),
    subfieldIndex: index(get("subfieldIndex")),
    fieldIndex: index(get("fieldIndex")),
  };
}

/** Query string with only the filters that differ from the defaults (without "?"). */
export function serializeFoundationsFilters(filters) {
  const params = new URLSearchParams();
  for (const [key, name] of Object.entries(PARAMS)) {
    if (filters[key] !== DEFAULT_FOUNDATIONS_FILTERS[key]) params.set(name, String(filters[key]));
  }
  return params.toString();
}

/** True when two filter states are equal. */
export function sameFoundationsFilters(a, b) {
  return Object.keys(PARAMS).every((k) => a[k] === b[k]);
}
