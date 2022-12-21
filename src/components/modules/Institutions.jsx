import React, { useEffect, useState } from 'react';

/* Wrappers */
import AffiliationWrapper from '../wrappers/AffiliationWrapper';
import ExtensionWrapper from '../wrappers/ExtensionWrapper';
import ResearchWrapper from '../wrappers/ResearchWrapper';
import CooperationWrapper from '../wrappers/CooperationWrapper';

/* Components */
import CommonTitleCard from '../CommonTitleCard';
import ErrorWarning from '../ErrorWarning';

/* UI Library Components */
import { Col, Menu, Row, Tabs } from 'antd';

/* Utilities */
import { useLocation, useSearchParams } from 'react-router-dom';
import { APIRequest } from '../../apis/clustercien';
import FirstCategoryTabs from '../FirstCategoryTabs';
import LoadingCard from '../LoadingCard';

/* Charts */
import MapChart from '../charts/MapChart';

/* UI Library Sub-components */
const { TabPane } = Tabs;

const Institutions = ({ core }) => {
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState('affiliations');
  const [state, setUrl] = APIRequest(
    `${location.pathname}${location.search}&apikey=colavudea&data=info`
  );

  const items = [
    {
      label: 'Afiliaciones',
      key: 'affiliations',
    },
    { label: 'Investigación', key: 'research' },
    { label: 'Extensión', key: 'extension' },
    { label: 'Cooperación', key: 'cooperation' },
  ];

  if (state.isError) {
    return <ErrorWarning />;
  } else if (state.isLoading) {
    return <LoadingCard />;
  }
  return (
    <>
      <Row gutter={[15, 15]}>
        <CommonTitleCard
          title={state.data.name}
          abbreviation={state.data.abbreviations}
          external_urls={state.data.external_urls}
          logo={state.data.logo}
          setCurrentURL={core.setCurrentURL}
        />
      </Row>
      <FirstCategoryTabs items={items} setCurrentTab={setCurrentTab} />
      {/* <MapChart /> */}
      {currentTab === 'affiliations' ? (
        <AffiliationWrapper data={state.data} />
      ) : (
        ''
      )}
      {currentTab === 'research' ? <ResearchWrapper core={core} /> : ''}
      {currentTab === 'extension' ? <ExtensionWrapper /> : ''}
      {currentTab === 'cooperation' ? <CooperationWrapper /> : ''}
    </>
  );
};

export default Institutions;
