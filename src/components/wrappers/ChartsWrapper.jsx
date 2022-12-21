import React from 'react';

/* UI Library Components */
import { Col, Row } from 'antd';

/* Charts */
import MapChart from '../charts/MapChart';
import StackedColumnChart from '../charts/StackedColumnChart';
import PieChart from '../charts/PieChart';
import GraphChart from '../charts/GraphChart';

const ChartsWrapper = () => {
  return (
    <Row gutter={[15, 15]}>
      <Col span={12}>
        <StackedColumnChart />
      </Col>
      <Col span={12}>
        <PieChart />
      </Col>
      <Col span={12}>
        <GraphChart />
      </Col>
      <Col span={12}>
        <MapChart />
      </Col>
    </Row>
  );
};

export default ChartsWrapper;
