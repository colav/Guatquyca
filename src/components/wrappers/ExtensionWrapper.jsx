import React from 'react';

/* UI Library Components */
import { Tabs } from 'antd';

/* Tabs */
import EntrepreneurshipTab from '../tabs/EntrepreneurshipTab';

const items = [
  {
    label: 'Emprendimientos',
    key: 'entrepreneurship',
    children: <EntrepreneurshipTab />,
  },
];

const ExtensionWrapper = () => {
  return <Tabs type="card" items={items} />;
};

export default ExtensionWrapper;
