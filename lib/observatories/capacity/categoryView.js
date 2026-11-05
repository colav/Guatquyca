/* Constants & utils */
import { CATEGORY } from "./constants";

/**
 * Which categories the scatter shows (F43c, D-137). Without a selection all are shown and no button is
 * off; a click leaves only that category, a click on the active one shows all again and Ctrl, Shift or
 * Meta add more. It is a view of the panels 1 and 2, not a filter of the board. It travels in the URL as
 * `?cat=lider,emergente`; the `?ocultas=` of F43b (hide mode) is ignored.
 */

/** Name of the URL parameter. */
export const CATEGORY_PARAM = "cat";

/** Slug of each category in the URL. */
export const CATEGORY_SLUGS = Object.freeze({
  [CATEGORY.LEADER]: "lider",
  [CATEGORY.CONSOLIDATED]: "consolidado",
  [CATEGORY.CONSOLIDATING]: "en-consolidacion",
  [CATEGORY.EMERGING]: "emergente",
  [CATEGORY.AT_RISK]: "riesgo",
  [CATEGORY.LOW_CAPACITY]: "capacidad-baja",
  [CATEGORY.UNCATEGORIZED]: "sin-categoria",
  [CATEGORY.NONE]: "sin-produccion",
});

const BY_SLUG = Object.fromEntries(Object.entries(CATEGORY_SLUGS).map(([category, slug]) => [slug, category]));

/**
 * Categories of the URL value; unknown ones are ignored.
 *
 * @param {string|null} value - "lider,emergente".
 * @returns {string[]}
 */
export function parseCategories(value) {
  if (!value) return [];
  return [...new Set(value.split(",").map((s) => BY_SLUG[s.trim()]).filter(Boolean))];
}

/** URL value of a list of categories ("" when there is none). */
export function serializeCategories(categories) {
  return categories.map((c) => CATEGORY_SLUGS[c]).filter(Boolean).join(",");
}

/**
 * New selection after a click on a category: a plain click isolates it (a click on the only one
 * active shows all again); Ctrl, Shift or Meta adds it or removes it.
 *
 * @param {string[]} selected - Current selection ([] = all).
 * @param {string} category
 * @param {boolean} [additive]
 * @returns {string[]}
 */
export function toggleCategory(selected, category, additive = false) {
  if (additive) return selected.includes(category) ? selected.filter((c) => c !== category) : [...selected, category];
  return selected.length === 1 && selected[0] === category ? [] : [category];
}
