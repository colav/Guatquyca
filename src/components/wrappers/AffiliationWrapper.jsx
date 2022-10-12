import React from 'react';

/* Components */
import ListCard from '../ListCard';

/* UI Library Components */
import { Col, Row } from 'antd';

const AffiliationWrapper = ({ data }) => {
  return (
    <Row gutter={15}>
      <Col xs={24} md={8}>
        <ListCard type={'faculties'} list={data.faculties} />
      </Col>
      <Col xs={24} md={8}>
        <ListCard type={'departments'} list={data.departments} />
      </Col>
      <Col xs={24} md={8}>
        <ListCard type={'groups'} list={data.groups} />
      </Col>
    </Row>
  );
};

export default AffiliationWrapper;
