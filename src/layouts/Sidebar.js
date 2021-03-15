import React, { useState } from "react";
const Layout = require("antd/lib/layout").default;
const Menu = require("antd/lib/menu").default;
const Affix = require("antd/lib/affix").default;
const UserOutlined = require("@ant-design/icons/UserOutlined").default;
const FilterOutlined = require("@ant-design/icons/FilterOutlined").default;
const ToolOutlined = require("@ant-design/icons/ToolOutlined").default;
const SettingOutlined = require("@ant-design/icons/SettingOutlined").default;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Affix>
      <Layout.Sider
        collapsible
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        collapsedWidth="60px"
        style={{
          overflow: "auto",
          height: "100vh",
          top: "80px",
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
    </Affix>
  );
};

export default Sidebar;
