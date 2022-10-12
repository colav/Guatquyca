import React from 'react';

/* UI Library Components */
import { Tabs } from 'antd';

const FirstCategoryTabs = ({ items, setCurrentTab }) => {
  const onChange = (key) => {
    setCurrentTab(key);
  };

  return (
    <div className="first-category-tabs--container">
      <Tabs
        centered
        className="first-category-tabs"
        tabBarStyle={{ marginBottom: 0 }}
        items={items}
        onChange={onChange}
      />
    </div>
  );
};

export default FirstCategoryTabs;
