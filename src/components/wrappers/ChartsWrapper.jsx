import React from 'react';

/* UI Library Components */
import { Col, Row } from 'antd';

/* Charts */
import MapChartHandler from '../charts/MapChartHandler';
import StackedColumnHandler from '../charts/StackedColumnHandler';
import PieChartHandler from '../charts/PieChartHandler';
import GraphChartHandler from '../charts/GraphChartHandler';

/* Utilities */
import { useSearchParams } from 'react-router-dom';

const ChartsWrapper = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');

  return (
    <Row gutter={[15, 15]}>
      <Col xs={24} lg={12}>
        <StackedColumnHandler />
      </Col>
      <Col xs={24} lg={12}>
        {type === 'institution' ? <GraphChartHandler /> : ''}
      </Col>
      <Col xs={24} lg={12}>
        <PieChartHandler />
      </Col>
      <Col xs={24} lg={12}>
        <MapChartHandler />
      </Col>
    </Row>
  );
};

export default ChartsWrapper;
