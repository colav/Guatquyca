/* Constants & utils */
import { availableOptions } from "../optionAvailability";
import { PAIR_LEVEL, PAIR_LEVEL_MAX_CODE } from "./constants";
import { filterFacts } from "./compute";

/** Filters that clear each list when its own filter is taken off. */
const CLEARED = {
  scope: { scope: "" },
  policyDoc: { policyDoc: "" },
  axis: { axisIds: [] },
  center: { centerIndex: -1 },
  unit: { facultyIndex: -1 },
  subunit: { departmentIndex: -1 },
  topic: { topicKey: "" },
};

/**
 * Options with products for each filter with list of Board 1 (F75, D-178): scope, document, axis, centre, unit, subunit and
 * field-subfield-topic. The products are the ones of `filterFacts` (the same definition that counts the board), the document and
 * the scope are read from the pairs product–axis of the confidence of the board (F74). With an axis chosen the scope and the
 * document only show the ones that contain it (D-163).
 *
 * @param {Object} dataset
 * @param {Object} filters
 * @param {Array} [passing] - The facts that pass all the filters, if the caller has them.
 * @returns {{ scope: Set<string>, policyDoc: Set<string>, axis: Set<number>, center: Set<number>, unit: Set<number>, subunit: Set<number>, topic: Set<number> }}
 */
export function factOptionAvailability(dataset, filters, passing = null) {
  const max = PAIR_LEVEL_MAX_CODE[filters.pairLevel] ?? PAIR_LEVEL_MAX_CODE[PAIR_LEVEL.CORE];
  const byId = new Map(dataset.axes.map((e) => [e.id, e]));
  const chosenAxes = (filters.axisIds || []).map((id) => byId.get(id)).filter(Boolean);
  const hasAxes = chosenAxes.length > 0;
  const withPairs = dataset.hasFactDetails;
  const items = passing || filterFacts(dataset, filters);
  const dims = [
    { key: "scope", chosen: !!filters.scope && !hasAxes },
    { key: "policyDoc", chosen: !!filters.policyDoc && !hasAxes },
    { key: "axis", chosen: hasAxes },
    { key: "center", chosen: filters.centerIndex >= 0 },
    { key: "unit", chosen: filters.facultyIndex >= 0 },
    { key: "subunit", chosen: filters.departmentIndex >= 0 },
    { key: "topic", chosen: !!filters.topicKey },
  ];
  const visit = (key, f, set) => {
    if (key === "center") for (const c of f[8]) set.add(c);
    else if (key === "unit") for (const u of f[6]) set.add(u);
    else if (key === "subunit") for (const d of f[7]) set.add(d);
    else if (key === "topic") set.add(f[0]);
    else if (withPairs) {
      for (const [axis, code] of f[12]) {
        if (code > max) continue;
        const e = byId.get(axis);
        if (!e) continue;
        /* The scope and the document are one condition on the axes (nivel and agenda of the same axis): while one is chosen, the other only lists what its axes have. */
        /* The list of axes is the one of the document and of the scope chosen (chain of F61 and F64). */
        if (key === "axis") { if ((!filters.policyDoc || e.agenda === filters.policyDoc) && (!filters.scope || e.nivel === filters.scope)) set.add(axis); }
        else if (key === "scope") { if (!filters.policyDoc || e.agenda === filters.policyDoc) set.add(e.nivel); }
        else if (!filters.scope || e.nivel === filters.scope) set.add(e.agenda);
      }
    } else {
      for (const axis of dataset.topicAxes[f[0]]) {
        const e = byId.get(axis);
        if (!e) continue;
        /* The list of axes is the one of the document and of the scope chosen (chain of F61 and F64). */
        if (key === "axis") { if ((!filters.policyDoc || e.agenda === filters.policyDoc) && (!filters.scope || e.nivel === filters.scope)) set.add(axis); }
        else if (key === "scope") { if (!filters.policyDoc || e.agenda === filters.policyDoc) set.add(e.nivel); }
        else if (!filters.scope || e.nivel === filters.scope) set.add(e.agenda);
      }
    }
  };
  const result = availableOptions({ items, dims, without: (key) => filterFacts(dataset, { ...filters, ...CLEARED[key] }), visit });
  if (hasAxes) {
    result.scope = new Set(chosenAxes.map((e) => e.nivel));
    result.policyDoc = new Set(chosenAxes.map((e) => e.agenda));
  }
  return result;
}
