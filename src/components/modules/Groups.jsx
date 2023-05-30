import React, { useEffect, useState } from 'react';

/* Hooks */
import { useSearchParams } from 'react-router-dom';

/* Wrappers */
import ExtensionWrapper from '../wrappers/ExtensionWrapper';
import ResearchWrapper from '../wrappers/ResearchWrapper';
import CooperationWrapper from '../wrappers/CooperationWrapper';

/* Components */
import CommonTitleCard from '../CommonTitleCard';
import TopMenu from '../TopMenu';

/* UI Library Components */
import { Row } from 'antd';

const Groups = () => {
  const [searchParams] = useSearchParams();
  const [current, setCurrent] = useState(searchParams.get('section'));

  useEffect(() => {
    document.title = 'Instituciones - ImpactU';
  }, []);

  return (
    <>
      <Row gutter={[15, 15]}>
        <CommonTitleCard />
      </Row>
      <TopMenu current={current} setCurrent={setCurrent} />
      {current === 'research' ? <ResearchWrapper /> : ''}
      {current === 'extension' ? <ExtensionWrapper /> : ''}
      {current === 'cooperation' ? <CooperationWrapper /> : ''}
    </>
  );
};

export default Groups;
