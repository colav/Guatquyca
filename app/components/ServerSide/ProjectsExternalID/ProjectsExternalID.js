/* UI Library Components */
import { Tag } from "antd";

/**
 * ProjectsExternalID is a server-side functional component that displays external IDs for projects.
 *
 * @param {Array} data - The data containing the source and other details.
 * @returns {JSX.Element} The ProjectsExternalID component.
 */
export default function ProjectsExternalID({ idList }) {
  return (
    <div style={{ marginBottom: "15px" }}>
      {idList.map((item, index) => (
        <div>
          {item.source === "minciencias" && (
            <Tag key={index} color="blue">
              ID Minciencias : {item.id}
            </Tag>
          )}
          {item.provenance === "siiu" && (
            <Tag key={index} color="blue">
              ID SIIU: {item.id}
            </Tag>
          )}
        </div>
      ))}
    </div>
  );
}
