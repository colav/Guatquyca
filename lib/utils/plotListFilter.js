/* Utilities */
import { PLOTLIST, PLOTS_BY_ENTITY } from "../constants";

/**
 * Filters the plot list based on the given entity.
 *
 * @param {string} entity - The entity to filter plots by.
 * @returns {Array} The filtered plot list.
 */
export default function plotListFilter(entity) {
  const entityPlotsSet = new Set(PLOTS_BY_ENTITY[entity]);

  return PLOTLIST.map((plot) => {
    const filteredChildren = plot.children.filter((child) =>
      entityPlotsSet.has(child.value)
    );
    if (filteredChildren.length > 0) {
      return { ...plot, children: filteredChildren };
    }
    return null;
  }).filter((plot) => plot !== null);
}
