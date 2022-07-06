import React from 'react';

/* Components */
import ErrorWarning from '../ErrorWarning';
import CoauthorsList from '../CoauthorsList';
import LoadingCard from '../LoadingCard';

/* Charts */
import MapChart from '../charts/MapChart';
import GraphChart from '../charts/GraphChart';

/* UI Library Components */
import { Col, Row } from 'antd';

/* Utilities */
import history from '../../history';
import { APIRequest } from '../../apis/clustercien';
const queryString = require('query-string');

const CoauthorsWrapper = ({ core }) => {
  let parsedGlobalURL = queryString.parse(history.location.search);
  parsedGlobalURL['data'] = 'coauthors';
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
          <LoadingCard title={'Información de Coautorías'} height={'431px'} />
        </Col>
      </Row>
    );
  } else {
    return (
      <Row gutter={[15, 15]}>
        {state.data.data.geo.length > 0 ? (
          <Col xs={24} xl={16}>
            <MapChart
              rawData={state.data.data.geo}
              title="Alcance Geográfico"
              id="coa_in_"
              height={639}
            />
          </Col>
        ) : (
          ''
        )}
        <CoauthorsList
          data={state.data.data.coauthors || state.data.data.institutions}
          setCurrentURL={core.setCurrentURL}
          height={700}
        />
        {state.data.data.coauthors_network ? (
          <Col xs={24} xl={12}>
            <GraphChart
              data={state.data.data.coauthors_network}
              title="Red de coautoría - Autores"
              type="authors"
            />
          </Col>
        ) : (
          ''
        )}
        {state.data.data.institution_network ? (
          <Col xs={24} xl={12}>
            <GraphChart
              data={state.data.data.institution_network}
              title="Red de coautoría - Instituciones"
              type="institutions"
            />
          </Col>
        ) : (
          ''
        )}
      </Row>
    );
  }
};

export default CoauthorsWrapper;
