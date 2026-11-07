/* Constants & utils */
import { availableOptions } from "../optionAvailability";
import { PRODUCT } from "./constants";
import { filterProducts } from "./compute";

const CLEARED = {
  scope: { scopeIndex: -1 },
  policyDoc: { policyIndex: -1 },
  center: { centerIndex: -1 },
  unit: { facultyIndex: -1 },
  subunit: { departmentIndex: -1 },
  subfield: { subfieldIndex: -1, fieldIndex: -1 },
};

/** Centre of each group, built once per dataset from `centerGroups`. */
const centerOfGroupCache = new WeakMap();
function centerOfGroup(ds) {
  if (!centerOfGroupCache.has(ds)) {
    const m = new Map();
    ds.centerGroups.forEach((groups, c) => groups.forEach((g) => m.set(g, c)));
    centerOfGroupCache.set(ds, m);
  }
  return centerOfGroupCache.get(ds);
}

/**
 * Options with products for each filter with list of Board 3 (F75, D-178): scope, document, centre, unit, subunit and subfield.
 * The products are the ones of `filterProducts` (the same definition that counts the board, with the expansion by topics of the
 * entity filters), so a change of that rule (X-05) reaches the lists. The documents are the ones with axes: the other four
 * only add goals and have no products.
 *
 * @param {Object} ds - Dataset of the board.
 * @param {Object} filters
 * @param {Array} [passing] - The products that pass all the filters, if the caller has them.
 */
export function productOptionAvailability(ds, filters, passing = null) {
  const items = passing || filterProducts(ds, filters).F;
  const documents = (ds.raw.agendas || ds.raw.agendas_all).map((name) => ds.raw.agendas_all.indexOf(name));
  const centers = centerOfGroup(ds);
  const dims = [
    { key: "scope", chosen: filters.scopeIndex >= 0 },
    { key: "policyDoc", chosen: filters.policyIndex >= 0 },
    { key: "center", chosen: filters.centerIndex >= 0 },
    { key: "unit", chosen: filters.facultyIndex >= 0 },
    { key: "subunit", chosen: filters.departmentIndex >= 0 },
    { key: "subfield", chosen: filters.subfieldIndex >= 0 || filters.fieldIndex >= 0 },
  ];
  const visit = (key, p, set) => {
    if (key === "scope") set.add(p[PRODUCT.SCOPE]);
    else if (key === "policyDoc") { for (const i of documents) if (p[PRODUCT.AGENDA_MASK] & (1 << i)) set.add(i); }
    else if (key === "center") { for (const g of p[PRODUCT.GROUPS]) { const c = centers.get(g); if (c !== undefined) set.add(c); } }
    else if (key === "unit") for (const u of p[PRODUCT.FACULTIES]) set.add(u);
    else if (key === "subunit") for (const d of p[PRODUCT.DEPARTMENTS]) set.add(d);
    else if (p[PRODUCT.TOPIC] >= 0) set.add(ds.topicMeta[p[PRODUCT.TOPIC]][0]);
  };
  return availableOptions({ items, dims, without: (key) => filterProducts(ds, { ...filters, ...CLEARED[key] }).F, visit });
}
