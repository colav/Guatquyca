/**
 * Formats a number with thousands separators using the 'es-CO' locale.
 *
 * @param {number|string} number - The number to format. If not a number, returns the input as is.
 * @returns {string|*} The formatted number as a string, or the original input if not a number.
 */
export function formatNumber(number) {
  return typeof number === "number" ? number.toLocaleString("es-CO") : number;
}
