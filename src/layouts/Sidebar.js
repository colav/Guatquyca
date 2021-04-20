import React, { useState, useEffect } from "react";

/* Components */
import CountriesFilter from "../components/CountriesFilter";
import YearsRangeFilter from "../components/YearsRangeFilter";

/* Utilities */
import history from "../history";
const queryString = require("query-string");

/* UI Library Components */
const Button = require("antd/lib/button").default;
const Layout = require("antd/lib/layout").default;
const Menu = require("antd/lib/menu").default;

/* Icons */
const FilterOutlined = require("@ant-design/icons/FilterOutlined").default;

const Sidebar = ({ core }, props) => {
  const [collapsed, setCollapsed] = useState(true);
  const [expanded, setExpanded] = useState(!collapsed);
  const [years, setYears] = useState({});
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    let elem = document.querySelector(".ant-layout-content");
    collapsed ? (elem.style.opacity = 1) : (elem.style.opacity = 0.2);
  }, [collapsed]);

  useEffect(() => {
    if (!collapsed) {
      setTimeout(() => setExpanded(!collapsed), 300);
    } else {
      setExpanded(!collapsed);
    }
  }, [collapsed]);

  const onClick = () => {
    let parsedQueryURL = queryString.parse(history.location.search);
    let filteredURL = history.location.pathname;
    if (Object.keys(years).length > 0) {
      if ("start_year" && "end_year" in parsedQueryURL) {
        parsedQueryURL["end_year"] = years.end_year;
        parsedQueryURL["start_year"] = years.start_year;
        filteredURL += `?${queryString.stringify(parsedQueryURL)}`;
      } else {
        filteredURL += `${history.location.search}&${queryString.stringify(
          years
        )}`;
      }
      history.push(filteredURL);
      core.setCurrentURL(filteredURL);
    }
    setCollapsed(!collapsed);
  };

  return (
    <Layout.Sider
      collapsible
      collapsed={collapsed}
      onCollapse={() => setCollapsed(!collapsed)}
      collapsedWidth="50px"
      width="300"
    >
      <Menu
        selectable={false}
        triggerSubMenuAction="click"
        mode="inline"
        style={{
          borderRight: 0,
        }}
      >
        <div className="sidebar-title">
          <FilterOutlined style={{ margin: "16px" }} />
          {expanded ? "Filtros" : ""}
        </div>
        <CountriesFilter core={core} setCountries={setCountries} {...props} />
        <YearsRangeFilter
          core={core}
          years={years}
          setYears={setYears}
          {...props}
        />
      </Menu>
      {expanded ? (
        <Button
          shape="round"
          type="primary"
          className="sidebar-button"
          onClick={onClick}
        >
          Aplicar filtros
        </Button>
      ) : (
        ""
      )}
    </Layout.Sider>
  );
};

export default Sidebar;
