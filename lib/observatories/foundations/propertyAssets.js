/* Constants & utils */
import { YEAR_RANGE } from "./constants";

/** Number of groups or units in the ranking of the card (F58). */
export const PI_TOP = 10;

/**
 * Card «11b · Propiedad intelectual y patentes» of Board 3 (F58, D-153, D-156). Pure computation over the key `pi`
 * of the bundle: `rows[i] = [type, state, year of concession (0 = no year), country, subtype, [groups], [units]]`, with
 * the indexes of `pi.tipos`, `pi.estados`, `pi.paises`, `pi.subtipos` and of `groups` and `facs` of the board. The
 * catalogues are read from the bundle by position, never by name (the names of the states changed in B117).
 *
 * Filters that answer: years (with the year of concession), unit, centre (through the groups of the asset). The rest
 * (scope, document of policy, subunit, subfield) do not apply to this data. The year rule: with the complete range
 * (2010–2026, the default) every asset counts, also the ones before 2010 and the ones without year; when the range is
 * narrowed only the assets with year inside it count.
 *
 * @param {Object} ds - Dataset of Board 3 (`createFoundationsDataset`).
 * @param {Object} filters - Filters of Board 3.
 * @returns {Object|null} `null` when the bundle has no `pi` (test data).
 */
export function computePropertyAssets(ds, filters) {
  const pi = ds.raw.pi;
  if (!pi || !Array.isArray(pi.rows)) return null;
  let y0 = +filters.yearFrom || YEAR_RANGE.min;
  let y1 = +filters.yearTo || YEAR_RANGE.max;
  if (y0 > y1) [y0, y1] = [y1, y0];
  const fullRange = y0 <= YEAR_RANGE.min && y1 >= YEAR_RANGE.max;
  const centerGroups = filters.centerIndex >= 0 ? ds.centerGroups[filters.centerIndex] : null;
  const unit = filters.facultyIndex >= 0 ? filters.facultyIndex : -1;

  /* Filters other than the year: unit and centre (the centre is reached through the groups of the asset). */
  const rest = pi.rows.filter((r) => (unit < 0 || r[6].includes(unit)) && (!centerGroups || r[5].some((g) => centerGroups.has(g))));
  const inYears = (r) => (r[2] > 0 ? (fullRange || (r[2] >= y0 && r[2] <= y1)) : fullRange);
  const rows = rest.filter(inYears);

  const count = (list, pick, size) => {
    const counts = new Array(size).fill(0);
    for (const r of list) counts[pick(r)]++;
    return counts;
  };
  const named = (names, counts) => names.map((label, i) => ({ label, value: counts[i] })).filter((x) => x.value > 0).sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "es"));

  /* Series by year of concession: from the first to the last year the bundle has, whatever the filter. */
  const allYears = pi.rows.map((r) => r[2]).filter((y) => y > 0);
  const first = Math.min(...allYears);
  const last = Math.max(...allYears);
  const years = Array.from({ length: last - first + 1 }, (_, i) => first + i);
  const perYear = new Map();
  for (const r of rows) if (r[2] > 0) perYear.set(r[2], (perYear.get(r[2]) || 0) + 1);

  const colombia = pi.paises.indexOf("Colombia");
  const countryCounts = count(rows, (r) => r[3], pi.paises.length);
  const others = named(pi.paises, countryCounts).filter((x) => x.label !== "Colombia");

  /* Rankings: an asset counts once for each unit or group it has (a group only if it belongs to the centre chosen). */
  const tally = (pick, label) => {
    const m = new Map();
    for (const r of rows) for (const k of new Set(pick(r))) m.set(k, (m.get(k) || 0) + 1);
    return [...m.entries()].map(([k, value]) => ({ label: label(k), value })).sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "es")).slice(0, PI_TOP);
  };
  const raw = ds.raw;

  const notResponding = [
    filters.scopeIndex >= 0 && "ámbito",
    filters.policyIndex >= 0 && "documento de política",
    filters.departmentIndex >= 0 && "subunidad",
    filters.subfieldIndex >= 0 && "subcampo",
  ].filter(Boolean);

  return {
    total: rows.length,
    withGroup: rows.filter((r) => r[5].length > 0).length,
    /* Assets without year that pass the other filters (they only count with the complete range). */
    withoutYear: rest.filter((r) => !(r[2] > 0)).length,
    fullRange,
    byType: named(pi.tipos, count(rows, (r) => r[0], pi.tipos.length)),
    byState: named(pi.estados, count(rows, (r) => r[1], pi.estados.length)),
    years,
    values: years.map((y) => perYear.get(y) || 0),
    countries: { colombia: colombia >= 0 ? countryCounts[colombia] : 0, others: others.reduce((s, x) => s + x.value, 0), top: others.slice(0, 5), otherCountries: others.length },
    byUnit: tally((r) => r[6], (k) => raw.facs[k]),
    byGroup: tally((r) => (centerGroups ? r[5].filter((g) => centerGroups.has(g)) : r[5]), (k) => raw.groups[k][1]),
    patents: pi.patentes || { n: 0, tipos: {} },
    notResponding,
  };
}
