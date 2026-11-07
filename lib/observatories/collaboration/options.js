/* Constants & utils */
import { availableOptions } from "../optionAvailability";
import { AXIS_CONFIDENCE_MAX, SCOPE } from "./constants";
import { filterWorks, inScope } from "./compute";

const CLEARED = {
  scope: { scope: "" },
  policyDoc: { policyDoc: "" },
  axis: { axisId: -1 },
  center: { centerIndex: -1 },
  unit: { facultyIndex: -1 },
  subunit: { departmentIndex: -1 },
  subfield: { subfieldIndex: -1 },
};
const SCOPES = Object.values(SCOPE);

/** Axes of each work (high or medium confidence), built once per dataset from the same pairs that `axisWorks` reads. */
const axesOfWorkCache = new WeakMap();
function axesOfWork(ds) {
  if (!axesOfWorkCache.has(ds)) {
    const m = new Map();
    for (const e of ds.axisById.values()) {
      e.direct.forEach((wi, k) => {
        const w = ds.raw.works[wi];
        if (w && e.direct_conf[k] <= AXIS_CONFIDENCE_MAX) {
          if (!m.has(w)) m.set(w, []);
          m.get(w).push(e.id);
        }
      });
    }
    axesOfWorkCache.set(ds, m);
  }
  return axesOfWorkCache.get(ds);
}

/**
 * Options with products for each filter with list of Board 2 (F75, D-178): scope, document, axis, centre, unit, subunit and
 * subfield. The works are the ones of `filterWorks` (the same definition that counts the board). With an axis chosen the
 * document only shows the one that contains it (D-163).
 *
 * @param {Object} ds - Dataset of the board.
 * @param {Object} filters
 * @param {Array} [passing] - The works that pass all the filters, if the caller has them.
 */
export function workOptionAvailability(ds, filters, passing = null) {
  const axisChosen = filters.axisId >= 0 && ds.axisById.has(filters.axisId);
  const items = passing || filterWorks(ds, filters);
  const axesOf = ds.hasAxisPairs ? axesOfWork(ds) : new Map();
  const dims = [
    { key: "scope", chosen: !!filters.scope },
    { key: "policyDoc", chosen: !!filters.policyDoc && !axisChosen },
    { key: "axis", chosen: axisChosen },
    { key: "center", chosen: filters.centerIndex >= 0 },
    { key: "unit", chosen: filters.facultyIndex >= 0 },
    { key: "subunit", chosen: filters.departmentIndex >= 0 },
    { key: "subfield", chosen: filters.subfieldIndex >= 0 },
  ];
  const visit = (key, w, set) => {
    if (key === "scope") {
      for (const s of SCOPES) if (inScope(ds, s, w)) set.add(s);
    } else if (key === "policyDoc") {
      if (ds.hasAxisPairs) for (const name of ds.policyDocs) { if (ds.docWorks(name).has(w)) set.add(name); }
      else ds.policyDocs.forEach((name, i) => { if (ds.agendaTopicSets[i].has(w[12])) set.add(name); });
    } else if (key === "axis") {
      const list = axesOf.get(w);
      /* The list of axes is the one of the document chosen (F61). */
      if (list) for (const id of list) if (!filters.policyDoc || ds.axisById.get(id).agenda === filters.policyDoc) set.add(id);
    } else if (key === "center") {
      for (const g of w[8]) { const c = ds.groupCenter[g]; if (c >= 0) set.add(c); }
    } else if (key === "unit") for (const u of w[6]) set.add(u);
    else if (key === "subunit") for (const d of w[7]) set.add(d);
    else if (w[2] >= 0) set.add(w[2]);
  };
  const result = availableOptions({ items, dims, without: (key) => filterWorks(ds, { ...filters, ...CLEARED[key] }), visit });
  if (axisChosen) result.policyDoc = new Set([ds.axisById.get(filters.axisId).agenda]);
  return result;
}
