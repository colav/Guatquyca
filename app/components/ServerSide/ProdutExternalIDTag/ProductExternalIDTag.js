/* UI Library Components */
import { Tag } from "antd";

/**
 * ProductExternalIDTag is a server-side functional component that displays external IDs for products.
 *
 * Priority order:
 * 1. source === "minciencias" && provenance === "minciencias"
 * 2. provenance === "minciencias"
 * 3. provenance === "siiu"
 *
 * @param {Array} idList - The data containing the source and other details.
 * @returns {JSX.Element|null} The ProductExternalIDTag component or null if no matching ID.
 */
export default function ProductExternalIDTag({ idList }) {
  const tagItem =
    idList.find(
      ({ source, provenance }) =>
        source === "minciencias" && provenance === "minciencias"
    ) ||
    idList.find(({ provenance }) => provenance === "minciencias") ||
    idList.find(({ provenance }) => provenance === "siiu");

  if (!tagItem) return null;

  const labelMap = {
    minciencias: "ID Minciencias",
    siiu: "ID SIIU",
  };

  const tagLabel = `${labelMap[tagItem.provenance] || "ID Externo"}: ${
    tagItem.id
  }`;

  return (
    <div>
      <Tag color="blue">{tagLabel}</Tag>
    </div>
  );
}
