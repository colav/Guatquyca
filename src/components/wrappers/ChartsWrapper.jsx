import React from "react";

/* UI Library Components */
import { Col, Row } from "antd";

/* Charts */
import MapChart from "../charts/MapChart";
import StackedColumnHandler from "../charts/StackedColumnHandler";
import PieChart from "../charts/PieChart";
import GraphChart from "../charts/GraphChart";
import Graph from "../charts/Graph";

const ChartsWrapper = () => {
  return (
    <Row gutter={[15, 15]}>
      <Col xs={24} lg={12}>
        <StackedColumnHandler />
      </Col>
      <Col xs={24} lg={12}>
        <PieChart />
      </Col>
      <Col xs={24} lg={12}>
        <Graph />
      </Col>
      <Col xs={24} lg={12}>
        <MapChart />
      </Col>
    </Row>
  );
};

export default ChartsWrapper;
