/* Icons */
import { GithubOutlined, MailOutlined } from "@ant-design/icons";

/* Next */
import Link from "next/link";
import Image from "next/image";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Button, Col, Divider, Layout, Row } from "antd";

/* UI Library Sub-components */
const Footer = Layout;

/**
 * Foot is a "server-side" function component that displays a footer.
 *
 * @returns {JSX.Element} A footer component.
 */
export default function Foot() {
  return (
    <Footer id={styles.footer_container}>
      <Row gutter={[20, 10]} justify="space-around" align="middle">
        <Col span={24} id={styles.title}>
          Fundadores:
        </Col>
        <Col xs={24} md={4} className={styles.width_370}>
          <Link href="/affiliation/institution/03bp5hc83/affiliations">
            <Image
              className={styles.logo}
              src={"/media/logo_udea.svg"}
              alt="Logotipo Universidad de Antioquia"
              width={250}
              height={100}
            />
          </Link>
        </Col>
        <Col xs={24} md={4} className={styles.width_370}>
          <Link href="/affiliation/institution/05tkb8v92/affiliations">
            <Image
              className={styles.logo}
              src={"/media/logo_unaula.svg"}
              alt="Logotipo Universidad Autónoma Latinoamericana"
              width={250}
              height={100}
            />
          </Link>
        </Col>
        <Col xs={24} md={4} className={styles.width_370}>
          <Link href="/affiliation/institution/02xtwpk10/affiliations">
            <Image
              className={styles.logo}
              src={"/media/logo_uec.svg"}
              alt="Logotipo Universidad Externado de Colombia"
              width={250}
              height={100}
              priority
            />
          </Link>
        </Col>
        <Col xs={24} md={4} className={styles.width_370}>
          <Link href="/affiliation/institution/00jb9vg53/affiliations">
            <Image
              className={styles.logo}
              src={"/media/logo_univalle.svg"}
              alt="Logotipo Universidad Del Valle"
              width={250}
              height={100}
            />
          </Link>
        </Col>
      </Row>
      <Row gutter={[5, 5]}>
        <Divider style={{ marginTop: "20px" }} />
        <Col xs={24} md={8}>
          <div style={{ marginBottom: "15px" }}>
            <b>Producto desarrollado por:</b>
          </div>
          <Image
            src={"/media/logo_colav.svg"}
            alt="Logotipo Colav"
            width={150}
            height={40}
            priority
          />
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
          <Link href="/about">Acerca de ImpactU</Link>
          <br />
          <Link href="/manual">Manual de usuario</Link>
          <br />
          <Link href="/open-source">Código Abierto</Link>
          <br />
          <a
            href="http://apis.colav.co/apidoc/index.html"
            target="_blank"
            rel="noreferrer"
          >
            Datos Abiertos
          </a>
          <br />
          <a
            href="https://api.impactu.colav.co/static/index.html"
            target="_blank"
            rel="noreferrer"
          >
            Apidocs
          </a>
          <br />
          <a
            href="https://lookerstudio.google.com/s/oHqvfOLH_e0"
            target="_blank"
            rel="noreferrer"
          >
            Estadísticas de uso
          </a>
          <br />
          <Link href="/cooperation-dashboard">Indicadores de Cooperación</Link>
        </Col>
        <Col xs={24} md={8}>
          <div style={{ marginBottom: "10px" }}>
            <b>Información:</b>
          </div>
          ImpactU Versión 3.10.0
          <br />
          Última actualización:
          <br />
          Interfaz de Usuario: 26/06/2025
          <br />
          Base de Datos: 26/06/2025
          <br />
          Hecho en Colombia
        </Col>
      </Row>
    </Footer>
  );
}
