/**
 * Checks if the apply filter button should be disabled based on the selected values and the URL values.
 *
 * @param {Array} value - The array of selected filter values.
 * @param {URLSearchParams} query - The query parameters from the URL.
 * @param {string} filterName - The name of the filter to check in the query parameters.
 * @returns {boolean} True if the apply filter button should be disabled, false otherwise.
 */
export default function applyFilterButtonChecker(value, query, filterName) {
  const urlValues = new Set(query.get(filterName)?.split(",") || []);
  const valueSet = new Set(value);

  if (valueSet.size === 0) {
    return true;
  }
  if (valueSet.size !== urlValues.size) {
    return false;
  }
  for (const val of valueSet) {
    if (!urlValues.has(val)) {
      return false;
    }
  }
  return true;
}
