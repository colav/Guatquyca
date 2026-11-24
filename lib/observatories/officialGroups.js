/**
 * Groups of the official registry (BD_Grupos, sheet "Grupos") against the groups that ImpactU links
 * to products (D-131, D-132). The groups of the registry that have no product in ImpactU are not added
 * to any list (since B114, 13); the boards say so wherever they quote a number of groups. Since B105 the totals come in the
 * bundle of Board 3 (`registro_grupos`: total, activos, inactivos, sin_productos_impactu); the constant
 * below is only the stand-in of the test data (`?source=mock`). With real data and without the key, no note
 * is shown: no figure is invented.
 *
 * @module lib/observatories/officialGroups
 */

/** Totals of the registry at the cut of 2026 (D-131): 359 groups, 324 active and 35 inactive. Only for the test data. */
export const OFFICIAL_GROUPS = Object.freeze({ total: 359, active: 324, inactive: 35 });

const fmt = (n) => n.toLocaleString("es-CO");
const isCount = (n) => Number.isInteger(n) && n >= 0;

/**
 * Totals of the registry for a board: the ones of the bundle (`registro_grupos`), or, only with the test
 * data, the constant (and the difference with the list). `null` when real data do not have the key.
 *
 * @param {{ registro_grupos?: Object, groups: unknown[] }} raw - Bundle of Board 3.
 * @param {boolean} [isMock] - Test data (`?source=mock`).
 * @returns {{ total: number, active: number, inactive: number, withoutProducts: number } | null}
 */
export function groupRegistry(raw, isMock = false) {
  const r = raw.registro_grupos;
  if (r && [r.total, r.activos, r.inactivos, r.sin_productos_impactu].every(isCount)) {
    return { total: r.total, active: r.activos, inactive: r.inactivos, withoutProducts: r.sin_productos_impactu };
  }
  if (isMock) return { ...{ total: OFFICIAL_GROUPS.total, active: OFFICIAL_GROUPS.active, inactive: OFFICIAL_GROUPS.inactive }, withoutProducts: OFFICIAL_GROUPS.total - raw.groups.length };
  return null;
}

/**
 * Note about the groups of the list of UdeA groups (F54, D-152): «346 de 359 grupos de investigación tienen
 * productos en ImpactU; 13 no.». The figures come from the bundle (`registro_grupos`). Provisional text: Luis approves it.
 *
 * @param {number} listed - Groups of the list of the bundle.
 * @param {{ total: number, withoutProducts: number }} registry - From groupRegistry().
 * @returns {string}
 */
export function officialGroupsNote(listed, registry) {
  return `${fmt(listed)} de ${fmt(registry.total)} grupos de investigación tienen productos en ImpactU; ${fmt(registry.withoutProducts)} no.`;
}

/** Same note for the active groups: «N de 324 grupos activos tienen productos en ImpactU; M no.». */
export function officialActiveGroupsNote(listed, registry) {
  return `${fmt(listed)} de ${fmt(registry.active)} grupos activos tienen productos en ImpactU; ${fmt(registry.active - listed)} no.`;
}
