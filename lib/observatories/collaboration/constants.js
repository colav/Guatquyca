/**
 * Constants of the collaboration model (Board 2 of the VRI-UdeA observatory, D-102).
 * Rules taken from the handoff report of Board 2 (sections 3, 4 and 7).
 */

import { policyRank } from "../policyDocuments";

/** Years that the filters accept. */
export const YEAR_RANGE = Object.freeze({ min: 2010, max: 2026 });

/** Non-academic sectors (the helices count a work in every sector present). */
export const NON_ACADEMIC_SECTORS = Object.freeze(["company", "government", "nonprofit", "healthcare"]);

/** Index of the product type (works[1]). */
export const WORK_TYPE = Object.freeze({ ARTICLE: 0, CHAPTER: 1, BOOK: 2, APPROPRIATION: 3 });

/** Institution flagged in the artifact as an OpenAlex disambiguation error (report section 11). */
export const FLAGGED_INSTITUTION = "Alcaldía de Medellín";

/** Scopes of the filter. */
export const SCOPE = Object.freeze({ LOCAL: "local", DEPARTMENTAL: "dep", NATIONAL: "nal", INTERNATIONAL: "int" });

/** Short names of the tabs of the indicator 14; the other documents use their own name. */
const AXIS_TAB_LABELS = Object.freeze({
  "PDD mpal Medellín": "PDD Medellín",
  "PDD dptal Antioquia": "PDD Antioquia",
  "Plan Decenal CTI Medellín 2024-2033": "Plan Decenal CTI Medellín",
  "Misión de sabios 2019": "Misión de sabios (focos)",
});
const MISSION = "Misión de sabios 2019";

/**
 * Tabs of the indicator 14 (Eje Temático by type of organization), made from the agendas the bundle carries (F69): one
 * per document with axes, in the order of Gabriel, then the Misión de sabios (its foci are shown apart) and, last, the tab
 * with all the agendas but the Misión.
 *
 * @param {string[]} agendas - Names of the agendas of the bundle.
 * @returns {{ label: string, agenda: string|null }[]}
 */
export function axisTabsFor(agendas) {
  const ordered = [...agendas].sort((a, b) => policyRank(a) - policyRank(b));
  const tabs = ordered.filter((a) => a !== MISSION).map((agenda) => ({ label: AXIS_TAB_LABELS[agenda] || agenda, agenda }));
  if (agendas.includes(MISSION)) tabs.push({ label: AXIS_TAB_LABELS[MISSION], agenda: MISSION });
  tabs.push({ label: "Todas las agendas sin Misión", agenda: null });
  return tabs;
}

/** Confidence codes of an axis–product pair that count in the filter of axis (F59, D-159): 0 high and 1 medium, as in Board 1. */
export const AXIS_CONFIDENCE_MAX = 1;

/** Products below which a card that needs a sample shows the small-sample notice with an axis chosen (F59). */
export const SMALL_SAMPLE = 30;

/** Pairs axis–project with this confidence code or lower pass the filter of axis (F59b, D-162): 0 high, 1 medium. */
export const AXIS_PROJECT_CONFIDENCE_MAX = 1;

/** Label of the series of patents in the trend 05b (F66). */
export const PATENT_SERIES_LABEL = "Patentes";

/** Funders shown in the card «Entidades que financian…» (F66). */
export const FUNDERS_SHOWN = 25;

/** Tabs of the subregion cartogram (09b). */
export const SUBREGION_TABS = Object.freeze([
  "Proyectos (lugar de ejecución)",
  "Proyectos con aportante externo",
  "Productos (mención en título)",
]);

/** Limits of each ranking (as in the artifact). */
export const LIMITS = Object.freeze({ transdisciplinary: 20, organizations: 15, graphNodes: 60, axes: 20, countriesTable: 10 });

/** Minimum shared products for an edge of the collaboration graph, and subfields for the ranking 01. */
export const GRAPH_MIN_EDGE = 2;
export const TRANSDISCIPLINARY_MIN_SUBFIELDS = 2;
