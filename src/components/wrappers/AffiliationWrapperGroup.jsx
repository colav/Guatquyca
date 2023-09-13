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

const AffiliationWrapperGroup = () => {
  const location = useLocation();
  const [state] = APIRequest(`${location.pathname}${location.search}`);

  if (state.isError) {
    return <ErrorWarning />;
  } else if (state.isLoading) {
    return <LoadingCard />;
  }
  return (
    <Row gutter={15}>
      <Col span={24}>
        <ListCard type={'person'} list={state.data.authors} />
      </Col>
    </Row>
  );
};

export default AffiliationWrapperGroup;
