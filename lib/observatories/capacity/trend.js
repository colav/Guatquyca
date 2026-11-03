/* Constants & utils */
import { TREND, TREND_RULE } from "./constants";

/**
 * Production trend over the trend window (one count per year).
 *
 * strict: increasing = no year falls with respect to the previous one (D-102:
 *   "progression without decay year to year"); anything else is decreasing.
 * slope: increasing = the regression slope of the counts is >= 0.
 *
 * @param {number[]} counts - Works per year, in chronological order.
 * @param {string} [rule] - TREND_RULE value.
 * @returns {string} TREND value; NONE when there is no production in the window.
 */
export function trendOf(counts, rule = TREND_RULE.STRICT) {
  const total = counts.reduce((a, b) => a + b, 0);
  if (!total) return TREND.NONE;

  if (rule === TREND_RULE.STRICT) {
    for (let i = 1; i < counts.length; i++) {
      if (counts[i] < counts[i - 1]) return TREND.DECREASING;
    }
    return TREND.INCREASING;
  }

  const n = counts.length;
  const mean = (n - 1) / 2;
  let numerator = 0;
  let denominator = 0;
  counts.forEach((y, i) => {
    numerator += (i - mean) * y;
    denominator += (i - mean) * (i - mean);
  });
  return numerator / denominator >= 0 ? TREND.INCREASING : TREND.DECREASING;
}
