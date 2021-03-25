import React, { useState, useEffect } from "react";
const Layout = require("antd/lib/layout").default;
const Menu = require("antd/lib/menu").default;
const UserOutlined = require("@ant-design/icons/UserOutlined").default;
const FilterOutlined = require("@ant-design/icons/FilterOutlined").default;
const ToolOutlined = require("@ant-design/icons/ToolOutlined").default;
const SettingOutlined = require("@ant-design/icons/SettingOutlined").default;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    let elem = document.querySelector(".ant-layout-content");
    collapsed ? (elem.style.opacity = 1) : (elem.style.opacity = 0.2);
  }, [collapsed]);

  return (
    <Layout.Sider
      collapsible
      collapsed={collapsed}
      onCollapse={() => setCollapsed(!collapsed)}
      collapsedWidth="50px"
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        top: "80px",
        zIndex: 2,
        left: 0,
        borderTop: "5px solid #EAEAE6",
      }}
    >
      <Menu
        mode="inline"
        style={{
          borderRight: 0,
        }}
      >
        <Menu.Item disabled="true" key="0">
          <SettingOutlined style={{ fontSize: "18px", color: "#eaaf63" }} />
        </Menu.Item>
        <Menu.Item key="1">
          <UserOutlined />
          <span className="nav-text">Filtro 1</span>
        </Menu.Item>
        <Menu.Item key="2">
          <FilterOutlined />
          <span className="nav-text">Filtro 2</span>
        </Menu.Item>
        <Menu.Item key="3">
          <ToolOutlined />
          <span className="nav-text">Filtro 3</span>
        </Menu.Item>
      </Menu>
    </Layout.Sider>
  );
};

export default Sidebar;
