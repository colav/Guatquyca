/**
 * URLBuilder is a function that builds a URL from the current URL and the searchParams.
 *
 * @param {string} pathname - The current URL.
 * @param {Object} searchParams - An object with the keys and values of the query parameters from the URL.
 * @param {Object} paramsToSet - An optional object with the keys and values to replace on searchParams.
 * @returns {string} The built URL.
 */
export default function URLBuilder(pathname, searchParams, paramsToSet = {}) {
  // Merge searchParams and paramsToSet, with paramsToSet taking precedence
  const params = { ...searchParams, ...paramsToSet };

  // Create a URLSearchParams object from params
  const urlParams = new URLSearchParams(params);

  // Return the built URL
  return `${pathname}?${urlParams.toString()}`;
}
