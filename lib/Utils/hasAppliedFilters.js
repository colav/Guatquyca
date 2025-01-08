/**
 * Checks if the URL has any query parameters of applied filters.
 *
 * This function iterates over the query parameters and checks if any of them
 * are considered filter parameters. The parameters "max", "page", and "sort"
 * are excluded from this check as they are not considered filter parameters.
 * If any other query parameter is found, the function assumes it's a filter
 * parameter and returns true, indicating that filters have been applied.
 *
 * @param {URLSearchParams} query - The query parameters.
 * @returns {boolean} True if any filter parameters are present, false otherwise.
 */
export default function hasAppliedFilters(query) {
  const excludedParams = ["max", "page", "sort"];
  for (const param of query.keys()) {
    if (!excludedParams.includes(param)) {
      return true;
    }
  }
  return false;
}
