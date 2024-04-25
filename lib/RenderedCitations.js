/**
 * RenderedCitations is a function component that maps over an array of citation objects and returns a formatted string for each citation.
 *
 * @param {Array} citationsCount - An array of citation objects. Each object should have a 'count' property and a 'source' property.
 * @returns {Array} An array of formatted strings. Each string is in the format 'count source |', except for the last string which does not have the trailing '|'.
 */
export default function RenderedCitations(citationsCount) {
  return citationsCount.map(
    (citation, i) =>
      // For each citation, return a string in the format 'count source |'
      // If it's the last citation, do not add the trailing '|'
      ` ${citation.count} ${
        citation.source.charAt(0).toUpperCase() + citation.source.slice(1)
      }${i < citationsCount.length - 1 ? " |" : ""}`
  );
}
