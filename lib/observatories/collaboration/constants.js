/**
 * Constants of the collaboration model (Board 2 of the VRI-UdeA observatory, D-102).
 * Rules taken from the handoff report of Board 2 (sections 3, 4 and 7).
 */

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

/** Tabs of the indicator 14 (Eje Temático by type of organization). */
export const AXIS_TABS = Object.freeze([
  { label: "PDD Medellín", agenda: "PDD mpal Medellín" },
  { label: "PDD Antioquia", agenda: "PDD dptal Antioquia" },
  { label: "CONPES 4069", agenda: "CONPES 4069" },
  { label: "CONPES 4144", agenda: "CONPES 4144" },
  { label: "Plan Decenal CTI Medellín", agenda: "Plan Decenal CTI Medellín 2024-2033" },
  { label: "Misión de sabios (focos)", agenda: "Misión de sabios 2019" },
  { label: "Todas las agendas sin Misión", agenda: null },
]);

/** Tabs of the subregion cartogram (09b). */
export const SUBREGION_TABS = Object.freeze([
  "Proyectos (lugar de ejecución)",
  "Proyectos con aportante externo",
  "Productos (mención en título)",
]);

/** Limits of each ranking (as in the artifact). */
export const LIMITS = Object.freeze({ transdisciplinary: 20, organizations: 15, graphNodes: 60, domainGroups: 12, axes: 20, countriesTable: 10 });

/** Minimum shared products for an edge of the collaboration graph, and subfields for the ranking 01. */
export const GRAPH_MIN_EDGE = 2;
export const TRANSDISCIPLINARY_MIN_SUBFIELDS = 2;
