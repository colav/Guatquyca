import React from "react";

/* UI Library Components*/
import { Col, Divider, Image, Row, Table, Typography } from "antd";

/* UI Library Sub-components*/
const { Title, Paragraph, Link, Text } = Typography;

const OpenSource = () => {
  document.title = "Código Abierto - ImpactU";

  const dataSource = [
    {
      key: "1",
      name: "Moai",
      description: "Google Scholar",
      repo: (
        <a
          href={"https://github.com/colav/moai"}
          target="_blank"
          rel="noreferrer"
        >
          https://github.com/colav/moai
        </a>
      ),
    },
    {
      key: "2",
      name: "Guatquyca",
      description: "Frontend ImpactU",
      repo: (
        <a
          href={"https://github.com/colav/guatquyca"}
          target="_blank"
          rel="noreferrer"
        >
          https://github.com/colav/guatquyca
        </a>
      ),
    },
    {
      key: "3",
      name: "Chibchas",
      description: "Scraping Institulac",
      repo: (
        <a
          href={"https://github.com/colav/Chibchas"}
          target="_blank"
          rel="noreferrer"
        >
          https://github.com/colav/Chibchas
        </a>
      ),
    },
    {
      key: "4",
      name: "UkuPacha",
      description: "SQL to JSON",
      repo: (
        <a
          href={"https://github.com/colav/UkuPacha"}
          target="_blank"
          rel="noreferrer"
        >
          https://github.com/colav/UkuPacha
        </a>
      ),
    },
    {
      key: "5",
      name: "KayPacha",
      description: "Extracción de modelos relacionales  Scienti / SIIU",
      repo: (
        <a
          href={"https://github.com/colav/KayPacha"}
          target="_blank"
          rel="noreferrer"
        >
          https://github.com/colav/KayPacha
        </a>
      ),
    },
    {
      key: "6",
      name: "WOSPlus",
      description: "Combinación de bases de datos bibliográficas",
      repo: (
        <a
          href={"https://github.com/colav/WOSplus"}
          target="_blank"
          rel="noreferrer"
        >
          https://github.com/colav/WOSplus
        </a>
      ),
    },
    {
      key: "7",
      name: "Hunahpu",
      description: "Paquete de similaridad, Usado en Moai",
      repo: (
        <a
          href={"https://github.com/colav/Hunahpu"}
          target="_blank"
          rel="noreferrer"
        >
          https://github.com/colav/Hunahpu
        </a>
      ),
    },
    {
      key: "8",
      name: "Oxomo",
      description: "OAI-PMH (D-Space)",
      repo: (
        <a
          href={"https://github.com/colav/Oxomo"}
          target="_blank"
          rel="noreferrer"
        >
          https://github.com/colav/Oxomo
        </a>
      ),
    },
    {
      key: "9",
      name: "OracleDocker",
      description: "Docker con oracle para la base de datos de Scienti y SIIU",
      repo: (
        <a
          href={"https://github.com/colav/oracle-docker"}
          target="_blank"
          rel="noreferrer"
        >
          https://github.com/colav/oracle-docker
        </a>
      ),
    },
    {
      key: "10",
      name: "Hunabku",
      description: "Modular APIs creation using plugins system",
      repo: (
        <a
          href={"https://github.com/colav/HunabKu"}
          target="_blank"
          rel="noreferrer"
        >
          https://github.com/colav/HunabKu
        </a>
      ),
    },
    {
      key: "11",
      name: "HunabKu_plugins",
      description: "Plugins para la creación de endpoints",
      repo: (
        <a
          href={"https://github.com/colav/HunabKu_plugins"}
          target="_blank"
          rel="noreferrer"
        >
          https://github.com/colav/HunabKu_plugins
        </a>
      ),
    },
    {
      key: "12",
      name: "Yuku",
      description: "Scienti Open Data using socrata (and  cvlac Scrapper)",
      repo: (
        <a
          href={"https://github.com/colav/Yuku"}
          target="_blank"
          rel="noreferrer"
        >
          https://github.com/colav/Yuku
        </a>
      ),
    },
    {
      key: "13",
      name: "Kerana",
      description: "Elastic Search and MongoDB tools",
      repo: (
        <a
          href={"https://github.com/colav/Kerana"}
          target="_blank"
          rel="noreferrer"
        >
          https://github.com/colav/Kerana
        </a>
      ),
    },
  ];

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Repositorio",
      dataIndex: "repo",
      key: "repo",
    },
  ];

  return (
    <Row gutter={[20, 20]} justify="center">
      <Col xs={24} md={16}>
        <Title level={2}>Código Abierto</Title>
        <Divider />
        <Title level={4}>
          Softwares desarrollados en código abierto que soportan la operación de
          ImpactU:
        </Title>
        <br />
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          scroll={{ x: 400 }}
        />
        <br />
        <Title level={5}>
          Además, ¡todos nuestros datos son abiertos! en{" "}
          <a href={"http://apis.colav.co/"} target="_blank" rel="noreferrer">
            http://apis.colav.co/
          </a>{" "}
          Encontrarás las APIs de los datos crudos utilizados por ImpactU para
          consultas con conocimiento experto.
        </Title>
        <br />
      </Col>
    </Row>
  );
};

export default OpenSource;
