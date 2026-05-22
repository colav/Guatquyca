/* Constants */
import { ROR_TYPES } from "@/lib/constants";

/* UI Library Components */
import { Tag, Tooltip } from "antd";

/**
 * RORTypesTagList
 *
 * Renders a list of tags for ROR types if present. Filters the provided
 * `types` array for entries where `source === 'ror'` and displays a
 * tooltiped `Tag` for each translated type.
 *
 * @param {Array<Object>} types - Array of type objects from the API
 *   (each object may contain `source` and `type` fields).
 * @returns {JSX.Element|null} A container with `Tag` elements or `null` when
 *   no ROR types are available.
 */
export default function RORTypesTagList({ types }) {
  const rorTypes = (types || []).filter((type) => type?.source === "ror");

  if (rorTypes.length === 0) {
    return null;
  }

  return (
    <div>
      {rorTypes.map((type, index) => {
        const originalType = type?.type || "";
        const translatedType =
          ROR_TYPES[originalType.toLowerCase()] || originalType;

        return (
          <Tooltip
            key={`${originalType || "ror-type"}-${index}`}
            title={`Tipo según ROR: ${originalType}`}
          >
            <Tag color="geekblue" bordered style={{ fontWeight: 500 }}>
              {translatedType}
            </Tag>
          </Tooltip>
        );
      })}
    </div>
  );
}
