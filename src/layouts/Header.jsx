import React from 'react';
import { Link } from 'react-router-dom';

/* Components */
import SearchBar from '../components/SearchBar';

/* Logos */
import logo_impactU_B from '../media/logo_impactU_B.svg';

/* UI Library Components */
const Col = require('antd/lib/col').default;
const Layout = require('antd/lib/layout').default;
const Row = require('antd/lib/row').default;

const Header = ({ core }) => {
  return (
    <Layout.Header id="layout--header">
      <Row>
        <Col xs={24} sm={7} md={6} id="header--logo_container">
          <Link to="/app">
            <img
              src={logo_impactU_B}
              alt="Logotipo ImpactU"
              id="header__logo"
            />
          </Link>
        </Col>
        <Col xs={24} sm={14} lg={12} xl={13}>
          {!core.home && (
            <SearchBar
              setCurrentURL={core.setCurrentURL}
              setHome={core.setHome}
            />
          )}
        </Col>
      </Row>
    </Layout.Header>
  );
};

export default Header;
