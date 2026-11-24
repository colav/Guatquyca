/**
 * Official FWCI of the published artifacts (D-102): citations per UdeA work divided by the
 * world average citations per work of the topic, subfield or field.
 *
 * @param {{ citations: number, count: number, worldMean: number }} unit
 * @returns {number} NaN when it cannot be computed.
 */
export function officialFwci({ citations, count, worldMean }) {
  if (!count || !(worldMean > 0)) return NaN;
  return citations / count / worldMean;
}

/**
 * Year-adjusted FWCI (D-102: calculated and stored apart, to decide later). Each work is
 * normalized by the world mean of its own publication year and the values are averaged.
 * The world means by year are injected; while they do not exist the result is NaN.
 *
 * @param {{ year: number, citations: number }[]} works
 * @param {Object<number, number>} worldMeanByYear - Year -> world average citations per work.
 * @returns {number}
 */
export function yearAdjustedFwci(works, worldMeanByYear) {
  if (!works.length || !worldMeanByYear) return NaN;
  let sum = 0;
  for (const work of works) {
    const mean = worldMeanByYear[work.year];
    if (!(mean > 0)) return NaN;
    sum += work.citations / mean;
  }
  return sum / works.length;
}
