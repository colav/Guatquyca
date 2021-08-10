import React from "react";

import { Link } from "react-router-dom";

/* Logos */
import logo_udea from "../logos/logo_udea.svg";
import logo_uec from "../logos/logo_uec.svg";
import logo_unaula from "../logos/logo_unaula.svg";
import logo_colav from "../logos/logo_colav.svg";

/* UI Library Components */
const Col = require("antd/lib/col").default;
const Row = require("antd/lib/row").default;
const Layout = require("antd/lib/layout").default;
const Divider = require("antd/lib/divider").default;
const Button = require("antd/lib/button").default;

/* Icons */
const GithubOutlined = require("@ant-design/icons/GithubOutlined").default;
const MailOutlined = require("@ant-design/icons/MailOutlined").default;

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
          <a href="http://www.udea.edu.co/" target="_blank" rel="noreferrer">
            <img
              className="footer__logo"
              src={logo_udea}
              alt="Logotipo Universidad de Antioquia"
            />
          </a>
        </Col>
        <Col xs={24} md={8} style={{ maxWidth: "400px" }}>
          <a href="https://www.unaula.edu.co/" target="_blank" rel="noreferrer">
            <img
              className="footer__logo"
              src={logo_unaula}
              alt="Logotipo Universidad Autónoma Latinoamericana"
            />
          </a>
        </Col>
        <Col xs={24} md={8} style={{ maxWidth: "400px" }}>
          <a
            href="https://www.uexternado.edu.co/"
            target="_blank"
            rel="noreferrer"
          >
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
          <div style={{ marginBottom: "5px" }}>
            <b>Producto desarrollado por:</b>
          </div>
          <a href="http://colav.udea.edu.co/" target="_blank" rel="noreferrer">
            <img
              src={logo_colav}
              alt="Logotipo Colav"
              style={{ maxWidth: "120px", margin: "5px" }}
            />
          </a>
          <br />
          <Button
            type="link"
            href="https://github.com/colav"
            icon={<GithubOutlined />}
            target="_blank"
            rel="noreferrer"
          >
            @colav
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
          <div style={{ marginBottom: "10px" }}>
            <b>ImpactU:</b>
          </div>
          <Link to="/app/about">Acerca de ImpactU</Link>
          <br />
          <Link to="/app/participants">Instituciones participantes</Link>
          <br />
          <Link to="/app/help">Ayuda</Link>
          <br />
          <Link
            to={{ pathname: "http://impactu.colav.co:8888/apidoc/index.html" }}
            target="_blank"
            rel="noreferrer"
          >
            API
          </Link>
        </Col>
        <Col xs={24} md={8}>
          <div style={{ marginBottom: "10px" }}>
            <b>Información:</b>
          </div>
          ImpactU Versión 0.9.1
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
