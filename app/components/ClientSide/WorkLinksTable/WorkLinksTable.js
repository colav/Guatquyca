/* UI Library Components */
import { Descriptions } from "antd";

/* Utilities */
import RenderedExternalIDs from "@/lib/RenderedExternalIDs";
import RenderedExternalURLs from "@/lib/RenderedExternalURLs";

/**
 * WorkLinksTable component displays external identifiers and URLs for an academic work
 * in a responsive, bordered table using Ant Design's Descriptions component.
 *
 * It combines the rendered external IDs and URLs into a single table.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.external_ids - Array of external identifier objects (e.g., DOI, PMID)
 * @param {Array} props.external_urls - Array of external URL objects (e.g., publisher, repository)
 *
 * @returns {JSX.Element} A responsive table of external identifiers and URLs
 *
 */
export default function WorkLinksTable({ external_ids, external_urls }) {
  return (
    <Descriptions
      column={{ xs: 1, sm: 2, md: 3, lg: 3 }}
      bordered
      size="small"
      styles={{
        content: { fontSize: "12px", padding: "5px" },
        label: { padding: "5px 10px" },
      }}
      items={RenderedExternalIDs(external_ids).concat(
        RenderedExternalURLs(external_urls)
      )}
    />
  );
}
