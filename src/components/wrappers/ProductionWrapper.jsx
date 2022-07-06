import React, { useState, useEffect } from 'react';

/* Components */
import DocumentList from '../DocumentList';
import ErrorWarning from '../ErrorWarning';
import LoadingCard from '../LoadingCard';

/* Charts */
import DoughnutChart from '../charts/DoughnutChart';
import VennChart from '../charts/VennChart';

/* UI Library Components */
import { Col, Row } from 'antd';

/* Utilities */
import history from '../../history';
import { APIRequest } from '../../apis/clustercien';
import { infoTexts } from '../../helpers/infoTexts';

/* Utilities */
const queryString = require('query-string');

const ProductionWrapper = ({ core }) => {
  let parsedGlobalURL = queryString.parse(history.location.search);
  parsedGlobalURL['data'] = 'production';
  const builtURL = `${history.location.pathname}?${queryString.stringify(
    parsedGlobalURL
  )}&max=10&page=1`;
  const [productionURL, setProductionURL] = useState(builtURL);
  const [state, setUrl] = APIRequest(builtURL);
  let parsedLocalURL = queryString.parseUrl(productionURL);

  const onPageChange = ({ page, pageSize }) => {
    let newQuery = {
      ...parsedLocalURL.query,
      max: pageSize.toString(),
      page: page.toString(),
    };
    setProductionURL(
      `${parsedLocalURL.url}?${queryString.stringify(newQuery)}`
    );
    window.scrollTo(0, 650);
  };

  useEffect(() => {
    setUrl(productionURL);
  }, [setUrl, productionURL]);

  if (!state.isLoading) {
    setTimeout(() => {
      core.setFilters(state.data.filters);
    }, 10);
  }

  if (state.isError) {
    return <ErrorWarning />;
  }
  if (state.isLoading) {
    return (
      <Row gutter={[15, 15]}>
        <Col xs={24} sm={24} md={12}>
          <LoadingCard title="Open Access" height={'461px'} />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <LoadingCard title="Fuentes Bibliográficas" height={'461px'} />
        </Col>
        <Col xs={24}>
          <LoadingCard title="Artículos" height={'450px'} />
        </Col>
      </Row>
    );
  }
  return (
    <Row gutter={[15, 15]}>
      <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
        <DoughnutChart
          data={state.data.open_access}
          title="Open Access"
          id="pro_oa_"
          infoText={infoTexts.OpenAccess}
        />
      </Col>
      <VennChart
        data={state.data.venn_source}
        infoText={infoTexts.BiblioSource}
      />
      <Col span={24}>
        <DocumentList
          data={state.data}
          core={core}
          parsedURL={parsedLocalURL.query}
          setProductionURL={setProductionURL}
          onPageChange={onPageChange}
          setUrl={setUrl}
        />
      </Col>
    </Row>
  );
};

export default ProductionWrapper;
