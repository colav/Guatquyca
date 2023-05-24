import React from "react";

/* UI Library Components */
import { Tabs } from "antd";

/* Tabs */
import NewsTab from "../tabs/NewsTab";
import ProductsTab from "../tabs/ProductsTab";
import ProjectsTab from "../tabs/ProjectsTab";

/* Utilities */
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const ResearchWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleTabChange = (activeKey) => {
    navigate(
      `${location.pathname}?type=${searchParams.get(
        "type"
      )}&id=${searchParams.get("id")}&section=research&tab=${activeKey}`
    );
  };

  const getActiveTabFromURL = () => {
    return searchParams.get("tab");
  };

  const activeTab = getActiveTabFromURL();

  const items = [
    {
      label: "Productos",
      key: "products",
      children: <ProductsTab />,
    },
    {
      label: "Proyectos",
      key: "projects",
      children: <ProjectsTab />,
      disabled: true,
    },
    {
      label: "Noticias",
      key: "news",
      children: <NewsTab />,
      disabled: true,
    },
  ];

  return (
    <Tabs
      activeKey={activeTab}
      onChange={handleTabChange}
      items={items}
      type="card"
      destroyInactiveTabPane
    />
  );
};

export default ResearchWrapper;
