import React from "react";

/* Components */
import SearchBar from "../components/SearchBar";

/* UI Library Components */
const Button = require("antd/lib/button").default;
const Col = require("antd/lib/col").default;
const Layout = require("antd/lib/layout").default;
const Row = require("antd/lib/row").default;

const Header = ({ core }) => {
  return (
    <Layout.Header
      style={{
        width: "100%",
        padding: 0,
        position: "fixed",
        zIndex: 1,
      }}
    >
      <Row align="middle">
        <Col xs={0} sm={5} md={5} lg={5} xl={5}>
          <Button type="primary" href="/app" style={{ marginLeft: "20px" }}>
            Home
          </Button>
        </Col>
        <Col xs={24} sm={14} lg={12} xl={14}>
          <SearchBar setCurrentURL={core.setCurrentURL} />
        </Col>
      </Row>
    </Layout.Header>
  );
};

export default Header;
