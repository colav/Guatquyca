import React from 'react';

/* Components */
import ErrorWarning from '../ErrorWarning';
import LoadingCard from '../LoadingCard';
import CollegesTable from '../CollegesTable';

/* UI Library Components */
import { Col, Row } from 'antd';

/* Utilities */
import history from '../../history';
import { APIRequest } from '../../apis/clustercien';
const queryString = require('query-string');

const CollegesWrapper = ({ core }) => {
  let parsedGlobalURL = queryString.parse(history.location.search);
  parsedGlobalURL['data'] = 'colleges';
  const builtURL = `${history.location.pathname}?${queryString.stringify(
    parsedGlobalURL
  )}`;
  const [state] = APIRequest(builtURL);

  if (state.isError) {
    return <ErrorWarning />;
  }
  if (state.isLoading) {
    return (
      <Row gutter={[15, 15]}>
        <Col span={24}>
          <LoadingCard
            title={'Información de los Colegios Invisibles'}
            height={'431px'}
          />
        </Col>
      </Row>
    );
  } else {
    return <CollegesTable data={state.data.data} core={core} parent="col" />;
  }
};

export default CollegesWrapper;
