/* Static data */
import coarData from "@/lib/data/coar.json";

/**
 * Formats the API response data to match the structure of coar.json for the "coar" entry,
 * keeping only the items present in the API response and adding the "value" key.
 * Other entries (e.g., Google Scholar, ScienTi) remain unchanged.
 *
 * @param {Array} data - The product_types array from the API response.
 * @returns {Array} - The formatted data with the transformed "coar" entry.
 */
export function coarFilterFormatter(data) {
  const coarEntry = data.find((item) => item.value === "coar");
  if (!coarEntry) {
    return data;
  }

  // Create a map of API children for quick lookup (title to value)
  const apiChildrenMap = new Map(
    coarEntry.children.map((child) => [child.title, child.value])
  );

  // Helper function to filter and transform nodes
  const filterNode = (node) => {
    if (!node.children) {
      if (apiChildrenMap.has(node.id)) {
        return {
          ...node,
          value: apiChildrenMap.get(node.id) || node.id,
        };
      }
      return null;
    }

    // Recursively filter children
    const filteredChildren = node.children.map(filterNode).filter(Boolean);

    const hasValidChildren = filteredChildren.length > 0;
    const isInApi = apiChildrenMap.has(node.id);

    // Only include node if it's in API or has valid children
    if (isInApi || hasValidChildren) {
      const newNode = {
        ...node,
        value: isInApi
          ? apiChildrenMap.get(node.id) || node.id
          : `coar_${node.id}`,
      };
      if (hasValidChildren) {
        newNode.children = filteredChildren;
      } else {
        delete newNode.children; // Remove empty children
      }
      return newNode;
    }

    return null;
  };

  // Filter and transform the coarData children
  const filteredCoarChildren = coarData.children
    .map((node) => filterNode(node))
    .filter((node) => node !== null);

  // Create the new coar entry
  const newCoarEntry = {
    ...coarEntry,
    children: filteredCoarChildren,
  };

  // Return the data array with the updated coar entry
  return data.map((item) => (item.value === "coar" ? newCoarEntry : item));
}
