import React from "react";

/* UI Library Components */
import { Col, Row } from "antd";

/* Charts */
import MapChartHandler from "../charts/MapChartHandler";
import StackedColumnHandler from "../charts/StackedColumnHandler";
import PieChartHandler from "../charts/PieChartHandler";
import GraphChartHandler from "../charts/GraphChartHandler";

const ChartsWrapper = () => {
  return (
    <Row gutter={[15, 15]}>
      <Col xs={24} lg={12}>
        <StackedColumnHandler />
      </Col>
      <Col xs={24} lg={12}>
        <PieChartHandler />
      </Col>
      <Col xs={24} lg={12}>
        <GraphChartHandler />
      </Col>
      <Col xs={24} lg={12}>
        <MapChartHandler />
      </Col>
    </Row>
  );
};

export default ChartsWrapper;
