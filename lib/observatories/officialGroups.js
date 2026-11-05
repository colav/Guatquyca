/**
 * Groups of the official registry (BD_Grupos, sheet "Grupos") against the groups that ImpactU links
 * to products (D-131, Luis, 5 Nov 2026, Q56). The 9 groups of the registry that have no product in
 * ImpactU are not added to any list; the boards say so wherever they quote a number of groups. The
 * registry totals are not in the bundles (they are a fact of the Excel of Gabriel), so they are kept
 * here, in one place, with their source; the figures of the lists come from the data.
 *
 * @module lib/observatories/officialGroups
 */

/** Totals of the registry at the cut of 2026 (D-131): 359 groups, 324 active and 35 inactive. */
export const OFFICIAL_GROUPS = Object.freeze({ total: 359, active: 324, inactive: 35 });

const fmt = (n) => n.toLocaleString("es-CO");

/**
 * Note about the groups of the list of UdeA groups: «350 de 359 grupos del registro oficial; 9 no
 * tienen productos en ImpactU». Provisional text: Luis approves it.
 *
 * @param {number} listed - Groups of the list of the bundle.
 * @returns {string}
 */
export function officialGroupsNote(listed) {
  return `${fmt(listed)} de ${fmt(OFFICIAL_GROUPS.total)} grupos del registro oficial; ${fmt(OFFICIAL_GROUPS.total - listed)} no tienen productos en ImpactU`;
}

/** Same note for the active groups: «317 de 324 grupos activos del registro oficial; 7 no tienen productos en ImpactU». */
export function officialActiveGroupsNote(listed) {
  return `${fmt(listed)} de ${fmt(OFFICIAL_GROUPS.active)} grupos activos del registro oficial; ${fmt(OFFICIAL_GROUPS.active - listed)} no tienen productos en ImpactU`;
}
