const ISSN_LABELS = {
  eissn: "e-ISSN",
  pissn: "p-ISSN",
  issn_l: "ISSN-L",
  issn: "ISSN",
};

const ISSN_PRIORITY = ["eissn", "pissn", "issn_l", "issn"];

/**
 * Formats the ISSN values returned by a source for Ant Design Descriptions.
 *
 * The API returns ISSNs as an array of objects, where each object can contain
 * fields such as `eissn`, `pissn`, `issn_l`, or `issn`. The result uses
 * readable labels, prioritizes electronic and print ISSNs, and removes values
 * repeated by less specific identifiers such as `issn_l` or `issn`.
 *
 * @param {Array<Object>} sourceISSNs - ISSN objects returned in `source.issn`.
 * @returns {Array<{key: string, label: string, children: string}>} Items
 * formatted for the `items` prop of Ant Design's `Descriptions` component.
 */
export default function formatSourceISSNs(sourceISSNs = []) {
  if (!Array.isArray(sourceISSNs)) return [];

  const candidates = sourceISSNs
    .flatMap((issnItem, index) =>
      Object.entries(issnItem).map(([type, value]) => ({
        type,
        key: `issn-${type}-${index}`,
        label: ISSN_LABELS[type] || type.toUpperCase(),
        children: value,
      })),
    )
    .sort(
      (first, second) =>
        (ISSN_PRIORITY.indexOf(first.type) === -1
          ? ISSN_PRIORITY.length
          : ISSN_PRIORITY.indexOf(first.type)) -
        (ISSN_PRIORITY.indexOf(second.type) === -1
          ? ISSN_PRIORITY.length
          : ISSN_PRIORITY.indexOf(second.type)),
    );

  const displayedValues = new Set();
  return candidates.filter((item) => {
    if (displayedValues.has(item.children)) return false;
    displayedValues.add(item.children);
    return true;
  });
}
