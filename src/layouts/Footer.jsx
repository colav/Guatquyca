import React from 'react';

/* utils */
import { Link } from 'react-router-dom';

/* Media */
import logo_udea from '../media/logo_udea.svg';
import logo_uec from '../media/logo_uec.svg';
import logo_unaula from '../media/logo_unaula.svg';
import logo_univalle from '../media/logo_univalle.svg';
import logo_colav from '../media/logo_colav.svg';

/* UI Library Components */
import { Button, Col, Divider, Layout, Row } from 'antd';

/* Icons */
import { GithubOutlined, MailOutlined } from '@ant-design/icons';

const Footer = () => {
  return (
    <Layout.Footer id="layout--footer">
      <Row gutter={[100, 10]} justify="center" align="middle">
        <Col span={24}>Una colaboración entre:</Col>
        <Col xs={24} md={5} style={{ maxWidth: '370px' }}>
          <a href="http://www.udea.edu.co/" target="_blank" rel="noreferrer">
            <img
              className="footer__logo"
              src={logo_udea}
              alt="Logotipo Universidad de Antioquia"
            />
          </a>
        </Col>
        <Col xs={24} md={5} style={{ maxWidth: '370px' }}>
          <a href="https://www.unaula.edu.co/" target="_blank" rel="noreferrer">
            <img
              className="footer__logo"
              src={logo_unaula}
              alt="Logotipo Universidad Autónoma Latinoamericana"
            />
          </a>
        </Col>
        <Col xs={24} md={5} style={{ maxWidth: '370px' }}>
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
        <Col xs={24} md={5} style={{ maxWidth: '370px' }}>
          <a
            href="https://www.univalle.edu.co/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              className="footer__logo"
              src={logo_univalle}
              alt="Logotipo Universidad Del Valle"
            />
          </a>
        </Col>
      </Row>
      <Row gutter={[5, 5]}>
        <Divider style={{ marginTop: '20px' }} />
        <Col xs={24} md={8}>
          <div style={{ marginBottom: '5px' }}>
            <b>Producto desarrollado por:</b>
          </div>
          <a href="http://colav.udea.edu.co/" target="_blank" rel="noreferrer">
            <img
              src={logo_colav}
              alt="Logotipo Colav"
              style={{ maxWidth: '120px', margin: '5px' }}
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
          <div style={{ marginBottom: '10px' }}>
            <b>ImpactU:</b>
          </div>
          <Link to="/app/about">Acerca de ImpactU</Link>
          <br />
          <Link to="/app/principles">Principios</Link>
          <br />
          <Link to="/app/open-source">Código Abierto</Link>
          <br />
          <a
            href="http://apis.colav.co/apidoc/index.html"
            target="_blank"
            rel="noreferrer"
          >
            Datos Abiertos
          </a>
        </Col>
        <Col xs={24} md={8}>
          <div style={{ marginBottom: '10px' }}>
            <b>Información:</b>
          </div>
          ImpactU Versión 2.1.9a
          <br />
          Última actualización: 13/09/2023
          <br />
          Hecho en Colombia
        </Col>
      </Row>
    </Layout.Footer>
  );
};

export default Footer;
