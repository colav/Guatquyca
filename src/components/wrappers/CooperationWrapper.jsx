import React from 'react';

/* UI Library Components */
import { Tabs } from 'antd';

/* Tabs */
import AgreementsTab from '../tabs/AgreementsTab';
import MobilityTab from '../tabs/MobilityTab';
import NetworksTab from '../tabs/NetworksTab';

const items = [
  {
    label: 'Convenios',
    key: 'agreements',
    children: <AgreementsTab />,
  },
  {
    label: 'Redes',
    key: 'networks',
    children: <NetworksTab />,
  },
  {
    label: 'Movilidad',
    key: 'mobility',
    children: <MobilityTab />,
  },
];

const ExtensionWrapper = () => {
  return <Tabs type="card" items={items} />;
};

export default ExtensionWrapper;
