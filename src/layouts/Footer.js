import React from "react";

/* Logos */
import logo_udea from "../logos/logo_udea.svg";
import logo_uec from "../logos/logo_uec.svg";
import logo_unaula from "../logos/logo_unaula.svg";

/* UI Library Components */
const Col = require("antd/lib/col").default;
const Row = require("antd/lib/row").default;
const Layout = require("antd/lib/layout").default;
const Divider = require("antd/lib/divider").default;

const Footer = () => {
  return (
    <Layout.Footer
      style={{
        textAlign: "center",
        maxWidth: "100%",
        borderRight: "10px solid #EAEAE6",
        marginLeft: "50px",
        borderLeft: "10px solid #EAEAE6",
        borderBottom: "10px solid #EAEAE6",
      }}
    >
      <Row gutter={[100, 10]} justify="center" align="middle">
        <Col span={24}>Una colaboración entre:</Col>
        <Col xs={24} md={8} style={{ maxWidth: "400px" }}>
          <a href="http://www.udea.edu.co/">
            <img
              className="footer__logo"
              src={logo_udea}
              alt="Logotipo Universidad de Antioquia"
            />
          </a>
        </Col>
        <Col xs={24} md={8} style={{ maxWidth: "400px" }}>
          <a href="https://www.uexternado.edu.co/">
            <img
              className="footer__logo"
              src={logo_uec}
              alt="Logotipo Universidad Externado de Colombia"
            />
          </a>
        </Col>
        <Col xs={24} md={8} style={{ maxWidth: "400px" }}>
          <a href="https://www.unaula.edu.co/">
            <img
              className="footer__logo"
              src={logo_unaula}
              alt="Logotipo Universidad Autónoma Latinoamericana"
            />
          </a>
        </Col>
      </Row>
      <Row gutter={[5, 5]} justify="center" align="middle">
        <Divider style={{ marginTop: "20px" }} />
        <Col xs={24} md={8}>
          Colav App Versión 1.0.0
        </Col>
        <Col xs={24} md={8}>
          Hecho en Colombia
        </Col>
        <Col xs={24} md={8}>
          Licencia MIT
        </Col>
      </Row>
    </Layout.Footer>
  );
};

export default Footer;
