/**
 * Converts URLSearchParams to a plain JavaScript object.
 *
 * @param {URLSearchParams} searchParams - The URLSearchParams object.
 * @returns {Object} The plain JavaScript object with keys and values.
 */
export const getQueryParamsAsObject = (searchParams) => {
  const params = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};
