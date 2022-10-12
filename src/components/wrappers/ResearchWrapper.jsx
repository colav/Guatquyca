import React, { useState, useEffect } from 'react';

/* UI Library Components */
import { Tabs } from 'antd';

/* Charts */

/* Tabs */
import ProductsTab from '../tabs/ProductsTab';
import ProjectsTab from '../tabs/ProjectsTab';
import NewsTab from '../tabs/NewsTab';

const ResearchWrapper = ({ core }) => {
  const items = [
    {
      label: 'Productos',
      key: 'products',
      children: <ProductsTab core={core} />,
    },
    {
      label: 'Proyectos',
      key: 'projects',
      children: <ProjectsTab />,
    },
    {
      label: 'Noticias',
      key: 'news',
      children: <NewsTab />,
    },
  ];

  return <Tabs type="card" items={items} />;
};

export default ResearchWrapper;
