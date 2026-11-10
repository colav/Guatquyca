/* Constants & utils */
import { TREND, TREND_BAND, TREND_RULE } from "./constants";

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

/**
 * Trend of the new model (D-121): slope of the least-squares line over the window (x = 0…n-1)
 * divided by the yearly mean of the counts. Increasing above +band, decreasing below -band,
 * stable in between; no production in the window is NONE.
 *
 * @param {number[]} counts - Works per year of the window, in chronological order.
 * @param {number} [band] - TREND_BAND by default.
 * @returns {string} TREND value.
 */
export function trendByBand(counts, band = TREND_BAND) {
  const total = counts.reduce((a, b) => a + b, 0);
  if (!total) return TREND.NONE;
  const n = counts.length;
  const mean = (n - 1) / 2;
  let numerator = 0;
  let denominator = 0;
  counts.forEach((y, i) => {
    numerator += (i - mean) * y;
    denominator += (i - mean) * (i - mean);
  });
  const relative = numerator / denominator / (total / n);
  if (relative > band) return TREND.INCREASING;
  if (relative < -band) return TREND.DECREASING;
  return TREND.STABLE;
}
