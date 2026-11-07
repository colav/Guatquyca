/* Constants & utils */
import { SCOPE, YEAR_RANGE } from "./constants";

/** Milliseconds the board waits after the last change before it recomputes (150 to 250 ms, F22). */
export const COLLAB_FILTER_DEBOUNCE_MS = 200;

/** Filters of Board 2 with their default values (report section 4). */
export const DEFAULT_COLLAB_FILTERS = Object.freeze({
  scope: "",
  policyDoc: "",
  centerIndex: -1,
  yearFrom: YEAR_RANGE.min,
  yearTo: YEAR_RANGE.max,
  facultyIndex: -1,
  departmentIndex: -1,
  subfieldIndex: -1,
  axisId: -1,
});

const PARAMS = {
  scope: "scope",
  policyDoc: "doc",
  centerIndex: "center",
  yearFrom: "from",
  yearTo: "to",
  facultyIndex: "faculty",
  departmentIndex: "department",
  subfieldIndex: "subfield",
  axisId: "axis",
};

const index = (value) => (value !== null && value !== "" && Number.isInteger(+value) && +value >= 0 ? +value : -1);
const year = (value, fallback) => {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? Math.min(Math.max(n, YEAR_RANGE.min), YEAR_RANGE.max) : fallback;
};

/**
 * Reads the filters of Board 2 from URL search params. Invalid values fall back to the defaults.
 *
 * @param {{ get: (key: string) => string | null }} searchParams
 * @returns {Object}
 */
export function parseCollabFilters(searchParams) {
  const get = (k) => searchParams.get(PARAMS[k]);
  const scope = get("scope");
  return {
    scope: Object.values(SCOPE).includes(scope) ? scope : DEFAULT_COLLAB_FILTERS.scope,
    policyDoc: get("policyDoc") || DEFAULT_COLLAB_FILTERS.policyDoc,
    centerIndex: index(get("centerIndex")),
    yearFrom: year(get("yearFrom"), DEFAULT_COLLAB_FILTERS.yearFrom),
    yearTo: year(get("yearTo"), DEFAULT_COLLAB_FILTERS.yearTo),
    facultyIndex: index(get("facultyIndex")),
    departmentIndex: index(get("departmentIndex")),
    subfieldIndex: index(get("subfieldIndex")),
    /* One axis; a list of Board 1 («3,17») gives its first id (F59). */
    axisId: index((get("axisId") || "").split(",")[0].trim()),
  };
}

/** Query string with only the filters that differ from the defaults (without "?"). */
export function serializeCollabFilters(filters) {
  const params = new URLSearchParams();
  for (const [key, name] of Object.entries(PARAMS)) {
    if (filters[key] !== DEFAULT_COLLAB_FILTERS[key]) params.set(name, String(filters[key]));
  }
  return params.toString();
}

/**
 * Invalid combination of axis and document (F61, D-163): when the axis is not one of the document, the axis wins and the
 * document is dropped. Returns the patch to apply, or null when the filters are consistent.
 *
 * @param {{ axisById: Map }} ds - Dataset of Board 2.
 * @param {Object} f - Filters.
 * @returns {{ policyDoc: string }|null}
 */
export function reconcileAxisDocument(ds, f) {
  if (!f.policyDoc || !(f.axisId >= 0)) return null;
  const axis = ds.axisById ? ds.axisById.get(f.axisId) : null;
  return axis && axis.agenda !== f.policyDoc ? { policyDoc: "" } : null;
}

/** True when two filter states are equal. */
export function sameCollabFilters(a, b) {
  return Object.keys(PARAMS).every((k) => a[k] === b[k]);
}
