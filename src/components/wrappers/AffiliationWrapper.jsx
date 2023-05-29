import React from 'react';

/* Components */
import ListCard from '../ListCard';
import ErrorWarning from '../ErrorWarning';
import LoadingCard from '../LoadingCard';

/* UI Library Components */
import { Col, Row } from 'antd';

/* Utilities */
import { APIRequest } from '../../apis/colav';
import { useLocation } from 'react-router-dom';

const AffiliationWrapper = () => {
  const location = useLocation();
  const [state] = APIRequest(`${location.pathname}${location.search}`);

  if (state.isError) {
    return <ErrorWarning />;
  } else if (state.isLoading) {
    return <LoadingCard />;
  }
  return (
    <Row gutter={15}>
      <Col xs={24} md={8}>
        <ListCard type={'faculty'} list={state.data.faculties} />
      </Col>
      <Col xs={24} md={8}>
        <ListCard type={'department'} list={state.data.departments} />
      </Col>
      <Col xs={24} md={8}>
        <ListCard type={'group'} list={state.data.groups} />
      </Col>
    </Row>
  );
};

export default AffiliationWrapper;
