/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Space, Tag } from "antd";

const LABELS = {
  eissn: "e-ISSN",
  pissn: "p-ISSN",
  issn: "ISSN",
  issn_l: "ISSN-L",
  scimago: "SCImago",
  scienti: "ScienTI",
};

/**
 * SourcesExternalIDSTags
 *
 * A React component that renders a list of tags for external IDs.
 * Filters out IDs with the source "openalex" and ensures unique IDs are displayed.
 *
 * @param {Array} externalIDs - An array of external ID objects.
 * @param {string} externalIDs[].id - The unique identifier.
 * @param {string} externalIDs[].source - The source of the identifier.
 * @returns {JSX.Element} A list of tags representing the external IDs.
 *
 */
export default function SourcesExternalIDSTags({ externalIDs }) {
  // Filter out "openalex" and remove duplicates by `id`
  const filteredIDs = externalIDs
    .filter((externalID) => externalID.source !== "openalex")
    .filter(
      (externalID, index, self) =>
        index === self.findIndex((id) => id.id === externalID.id)
    );

  return (
    <Space size={[0, 8]} wrap className={styles.external_ids_container}>
      {filteredIDs.map((externalID) => (
        <Tag
          color="purple"
          key={`${externalID.source}-${externalID.id}`}
          bordered={false}
        >
          {
            <span className={styles.bold}>
              {LABELS[externalID.source] || <b>{externalID.source}</b>}
            </span>
          }
          : {externalID.id}
        </Tag>
      ))}
    </Space>
  );
}
