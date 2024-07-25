/* Components */
import CitationsIcon from "@/public/media/citations";
import Dimensions from "../Dimensions/Dimensions";
import OpenAlexBadge from "../OpenAlexBadge/OpenAlexBadge";
import ScholarBadge from "../ScholarBadge/ScholarBadge";

/* UI Library Components */
import { Col, Row } from "antd";

/**
 * Displays badges for citation counts from different sources and a link to the work's dimensions.
 * Optionally shows a title.
 *
 * @param {Object[]} citationsCount - Array of objects containing citation sources and their counts.
 * @param {string} doi - The DOI of the work for linking to its dimensions.
 * @param {boolean} showTitle - Flag to show/hide the title.
 * @returns {JSX.Element} The component with citation badges and optionally a title.
 */
export default function CitationsBadges({
  citationsCount,
  doi,
  showTitle = false,
}) {
  let scholarCount = 0;
  let openAlexCount = 0;

  citationsCount.forEach(({ source, count }) => {
    if (source === "scholar") {
      scholarCount = count;
    } else if (source === "openalex") {
      openAlexCount = count;
    }
  });

  return (
    <div>
      {showTitle && (
        <div style={{ marginBottom: "7px" }}>
          <CitationsIcon aria-label="Citations Icon" /> Citaciones:
        </div>
      )}
      <Row
        gutter={15}
        style={{ marginLeft: showTitle === true ? "7px" : "-10px" }}
      >
        <Col>
          <ScholarBadge number={scholarCount} />
        </Col>
        <Col>
          <OpenAlexBadge number={openAlexCount} />
        </Col>
        {doi && (
          <Col>
            <Dimensions doi={doi} />
          </Col>
        )}
      </Row>
    </div>
  );
}
