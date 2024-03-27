/**
 * dateBuilder is a helper function that converts a Unix timestamp to a human-readable date string.
 *
 * @param {number} unixTimestamp - The Unix timestamp to convert.
 * @returns {string} - The converted date string, or "No disponible" if the timestamp is -1.
 */
export default function dateBuilder(unixTimestamp) {
  return unixTimestamp === -1
    ? "No disponible"
    : new Date(parseInt(unixTimestamp) * 1000).toLocaleDateString();
}
