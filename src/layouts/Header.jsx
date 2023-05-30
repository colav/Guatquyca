import React from "react";
import { Link } from "react-router-dom";

/* Components */
import SearchBar from "../components/SearchBar";

/* Logos */
import logo_impactU_B from "../media/logo_impactU_B.svg";

/* UI Library Components */
import { Col, Layout, Row } from "antd";

const Header = ({ home }) => {
  return (
    <Layout.Header id="layout--header">
      <Row align={"middle"} justify={"center"}>
        <Col xs={24} sm={24} md={8} lg={6} id="header--logo_container">
          <Link to="/app">
            <img
              src={logo_impactU_B}
              alt="Logotipo ImpactU"
              id="header--logo"
            />
          </Link>
        </Col>
        <Col xs={24} sm={24} md={16} lg={12}>
          {!home && <SearchBar />}
        </Col>
        <Col xs={0} lg={6} />
      </Row>
    </Layout.Header>
  );
};

export default Header;
