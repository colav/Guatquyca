import React, { useEffect } from 'react';

/* Wrappers */
import CitationsWrapper from '../wrappers/CitationsWrapper';
import CoauthorsWrapper from '../wrappers/CoauthorsWrapper';
import CollegesWrapper from '../wrappers/CollegesWrapper';
import MediaWrapper from '../wrappers/MediaWrapper';
import ProductionWrapper from '../wrappers/ProductionWrapper';

/* Components */
import CommonTitleCard from '../CommonTitleCard';
import ErrorWarning from '../ErrorWarning';
import ListCard from '../ListCard';

/* UI Library Components */
import { Col, Row, Tabs } from 'antd';

/* Utilities */
import URLBuilder from '../../helpers/URLBuilder';
import { APIRequest } from '../../apis/clustercien';
import history from '../../history';
const queryString = require('query-string');

/* UI Library Sub-components */
const { TabPane } = Tabs;

const Faculties = ({ core }) => {
  let parsedGlobalURL = queryString.parse(history.location.search);
  parsedGlobalURL['data'] = 'info';
  const builtURL = `${history.location.pathname}?${queryString.stringify(
    parsedGlobalURL
  )}`;
  const [state, setUrl] = APIRequest(builtURL);

  window.addEventListener('popstate', () => {
    core.setCurrentURL(URLBuilder());
  });

  useEffect(() => {
    setUrl(builtURL);
  }, [builtURL, setUrl]);

  if (state.isError) {
    return <ErrorWarning />;
  } else if (state.isLoading) {
    return '';
  }
  return (
    <Row gutter={[15, 15]}>
      <CommonTitleCard
        title={state.data.name}
        abbreviation={state.data.abbreviations}
        external_urls={state.data.external_urls}
        institution={state.data.institution}
        logo={state.data.institution[0].logo}
        setCurrentURL={core.setCurrentURL}
      />
      <Col xs={24}>
        <Tabs defaultActiveKey={'affiliations'} type="card" tabBarGutter={5}>
          <TabPane tab="Afiliaciones" key="affiliations">
            <Row gutter={[15, 15]}>
              <Col xs={24} md={8}>
                <ListCard
                  title={'departments'}
                  list={state.data.departments}
                  setCurrentURL={core.setCurrentURL}
                />
              </Col>
              <Col xs={24} md={8}>
                <ListCard
                  title={'groups'}
                  list={state.data.groups}
                  setCurrentURL={core.setCurrentURL}
                />
              </Col>
              <Col xs={24} md={8}>
                <ListCard
                  title={'authors'}
                  list={state.data.authors}
                  setCurrentURL={core.setCurrentURL}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Producción" key="production" forceRender>
            <ProductionWrapper core={core} />
          </TabPane>
          <TabPane tab="Citaciones" key="citations" forceRender>
            <CitationsWrapper />
          </TabPane>
          <TabPane tab="Coautorías" key="coauthors" forceRender>
            <CoauthorsWrapper core={core} />
          </TabPane>
          <TabPane tab="Colegios Invisibles" key="colleges">
            <CollegesWrapper core={core} />
          </TabPane>
          <TabPane tab="Noticias" key="news">
            <MediaWrapper />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export default Faculties;