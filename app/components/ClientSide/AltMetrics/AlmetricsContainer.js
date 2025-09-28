"use client";

/* Components */
import AltMetricBadge from "./AltMetricBadge";
import PaperbuzzBadge from "./PaperbuzzBadge";

/* UI Library Componnts */
import { Col, Row } from "antd";

/**
 * AltmetricsContainer Component
 * Renders Altmetric and Paperbuzz badges for a given DOI.
 *
 * @param {string} doi - The DOI (Digital Object Identifier) for which to display badges.
 * @returns {React.ReactElement} A React Element containing the Altmetric and Paperbuzz badges.
 */
export default function AltmetricsContainer({ doi }) {
  return (
    <Row gutter={9} style={{ marginLeft: "13px", marginTop: "4px" }}>
      <Col>
        <PaperbuzzBadge doi={doi} />
      </Col>
      <Col>
        <AltMetricBadge doi={doi} />
      </Col>
    </Row>
  );
}
