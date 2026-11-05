/* Constants & utils */
import { CATEGORY, DEFAULT_THRESHOLDS, TREND } from "./constants";

/**
 * Category of a unit (topic, subfield or field) from its capacity ratio and trend (D-102).
 *
 * Increasing trend: ratio = 1 leader; > consolidated consolidated; > consolidating
 *   consolidating; < emerging emerging; the gap in between has no category.
 * Decreasing trend: ratio > consolidating is at risk of disappearing (it includes
 *   > 0.75 and = 1); the rest has no category.
 * No production in the trend window: no production.
 *
 * The ratio is capped to [0, 1] and a non-finite ratio counts as 0.
 *
 * @param {{ products: number, trend: string, ratio: number }} unit
 * @param {Object} [thresholds] - Overrides of DEFAULT_THRESHOLDS.
 * @returns {string} CATEGORY value.
 */
export function categoryOf({ products, trend, ratio }, thresholds = DEFAULT_THRESHOLDS) {
  const t = { ...DEFAULT_THRESHOLDS, ...thresholds };
  if (!products || trend === TREND.NONE) return CATEGORY.NONE;

  const r = Number.isFinite(ratio) ? Math.min(Math.max(ratio, 0), 1) : 0;

  if (trend === TREND.INCREASING) {
    if (r >= t.leader) return CATEGORY.LEADER;
    if (r > t.consolidated) return CATEGORY.CONSOLIDATED;
    if (r > t.consolidating) return CATEGORY.CONSOLIDATING;
    if (r < t.emerging) return CATEGORY.EMERGING;
    return CATEGORY.UNCATEGORIZED;
  }

  return r > t.consolidating ? CATEGORY.AT_RISK : CATEGORY.UNCATEGORIZED;
}

/**
 * Category of the new model (D-122): the capacity ratio crossed with the trend. Seven
 * categories, no "sin categoría":
 *   leader        ratio = 1, increasing or stable
 *   consolidated  ratio > 0.75, increasing or stable
 *   consolidating ratio > 0.50, increasing or stable
 *   at risk       ratio > 0.50 and decreasing
 *   emerging      ratio <= 0.50 and increasing
 *   low capacity  ratio <= 0.50 and stable or decreasing
 *   none          no production in the trend window
 * The ratio is capped to [0, 1] and a non-finite ratio counts as 0.
 *
 * @param {{ products: number, trend: string, ratio: number }} unit - `products` = works in the trend window.
 * @param {Object} [thresholds] - Overrides of DEFAULT_THRESHOLDS (consolidated, consolidating, leader).
 * @returns {string} CATEGORY value.
 */
export function categoryByCapacity({ products, trend, ratio }, thresholds = DEFAULT_THRESHOLDS) {
  const t = { ...DEFAULT_THRESHOLDS, ...thresholds };
  if (!products || trend === TREND.NONE) return CATEGORY.NONE;
  const r = Number.isFinite(ratio) ? Math.min(Math.max(ratio, 0), 1) : 0;
  if (trend === TREND.DECREASING) return r > t.consolidating ? CATEGORY.AT_RISK : CATEGORY.LOW_CAPACITY;
  if (r >= t.leader) return CATEGORY.LEADER;
  if (r > t.consolidated) return CATEGORY.CONSOLIDATED;
  if (r > t.consolidating) return CATEGORY.CONSOLIDATING;
  return trend === TREND.INCREASING ? CATEGORY.EMERGING : CATEGORY.LOW_CAPACITY;
}
