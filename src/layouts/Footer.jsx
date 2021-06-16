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
const Button = require("antd/lib/button").default;

/* Icons */
const GithubOutlined = require("@ant-design/icons/GithubOutlined").default;
const MailOutlined = require("@ant-design/icons/MailOutlined").default;
const LinkOutlined = require("@ant-design/icons/LinkOutlined").default;

const Footer = () => {
  return (
    <Layout.Footer
      style={{
        textAlign: "center",
        maxWidth: "100%",
        borderRight: "15px solid #EAEAE6",
        marginLeft: "50px",
        borderLeft: "15px solid #EAEAE6",
        borderBottom: "15px solid #EAEAE6",
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
          <a href="https://www.unaula.edu.co/">
            <img
              className="footer__logo"
              src={logo_unaula}
              alt="Logotipo Universidad Autónoma Latinoamericana"
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
      </Row>
      <Row gutter={[5, 5]}>
        <Divider style={{ marginTop: "20px" }} />
        <Col xs={24} md={8}>
          Encuéntranos en:
          <br />
          <Button
            type="link"
            href="https://github.com/colav"
            icon={<GithubOutlined />}
          >
            @colav
          </Button>
          <br />
          <Button
            type="link"
            href="http://colav.udea.edu.co/"
            icon={<LinkOutlined />}
          >
            Web
          </Button>
          <br />
          <Button
            type="link"
            href="mailto:grupocolav@udea.edu.co"
            icon={<MailOutlined />}
          >
            Contacto
          </Button>
        </Col>
        <Col xs={24} md={8}>
          Legales:
          <br />
          Política de datos
          <br />
          Política de privacidad
          <br />
          FAQ
        </Col>
        <Col xs={24} md={8}>
          CoLaV App Versión 0.9.1
          <br />
          Última actualización: 16/06/2021
          <br />
          Hecho en Colombia
        </Col>
      </Row>
    </Layout.Footer>
  );
};

export default Footer;
