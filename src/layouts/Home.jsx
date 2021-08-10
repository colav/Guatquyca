import React from "react";

/* Utilities */
import URLBuilder from "../helpers/URLBuilder";

/* Components */
import SearchBar from "../components/SearchBar";
import SingleStatistic from "../components/SingleStatistic";

/* Logos */
import logo_impactU_A from "../logos/logo_impactU_A.svg";

/* Utilities */
import { APIRequest } from "../apis/clustercien";

/* UI Library Components */
const Button = require("antd/lib/button").default;
const Col = require("antd/lib/col").default;
const Row = require("antd/lib/row").default;
const Table = require("antd/lib/table").default;
const Typography = require("antd/lib/typography").default;

/* UI Library Sub-components*/
const { Title } = Typography;

const Home = ({ core, setHome }) => {
  const [state] = APIRequest("/app/ourdata?apikey=colavudea");

  const searchExamples = [
    {
      key: "1",
      search: "Autor",
      example: '"Francisco Javier Lopera Restrepo"',
    },
    {
      key: "2",
      search: "Institución",
      example: '"Universidad de Antioquia"',
    },
    {
      key: "3",
      search: "Facultad",
      example: '"Facultad de Medicina"',
    },
    {
      key: "4",
      search: "Departamento",
      example: '"Instituto de Física"',
    },
    {
      key: "5",
      search: "Grupo",
      example: "inmunología",
    },
    {
      key: "6",
      search: "Literatura",
      example: "dark matter",
    },
  ];

  window.addEventListener("popstate", () => {
    core.setCurrentURL(URLBuilder);
  });

  setTimeout(() => {
    setHome(true);
  }, 1);
  return (
    <Row
      style={{ padding: "40px 5px" }}
      gutter={[10, 10]}
      justify="center"
      align="middle"
    >
      <Col flex sm={24} lg={12}>
        <Title className="tAc" style={{ margin: "30px 0" }}>
          Bienvenido a
          <div style={{ marginTop: "40px" }}>
            <img
              src={logo_impactU_A}
              alt="Logotipo Colav"
              style={{ maxWidth: "400px" }}
            />
          </div>
        </Title>
        <Title level={2} className="tAc" style={{ margin: "50px 0" }}>
          Métricas sobre la producción universitaria y su relación con el
          entorno en Colombia.
        </Title>
        <SearchBar setCurrentURL={core.setCurrentURL} setHome={setHome} />
        <div style={{ padding: "0px 5px", marginTop: "50px" }}>
          <Table
            dataSource={searchExamples}
            pagination={false}
            bordered
            size="small"
          >
            <Table.Column title="Buscar por" dataIndex="search" />
            <Table.Column title="Ejemplo" dataIndex="example" />
          </Table>
        </div>
      </Col>
      <Col
        style={{
          backgroundColor: "#dce1e6",
          margin: "40px",
          minHeight: "350px",
        }}
        span={24}
      >
        <Title level={3} className="tAc" style={{ margin: "55px 0" }}>
          Nuestros datos:
        </Title>
        <Row
          gutter={[10, 10]}
          justify="space-around"
          style={{ textAlign: "initial", margin: "20px 0 40px" }}
        >
          <Col xs={24} md={5}>
            <SingleStatistic
              loading={state.isLoading}
              title="Autores:"
              icon="user"
              data={state.data.authors}
            />
          </Col>
          <Col xs={24} md={5}>
            <SingleStatistic
              loading={state.isLoading}
              title="Instituciones:"
              icon="institution"
              data={state.data.institutions}
            />
          </Col>
          <Col xs={24} md={5}>
            <SingleStatistic
              loading={state.isLoading}
              title="Documentos:"
              icon="file"
              data={state.data.documents}
            />
          </Col>
          <Col xs={24} md={5}>
            <SingleStatistic
              loading={state.isLoading}
              title="Revistas:"
              icon="source"
              data={state.data.sources}
            />
          </Col>
        </Row>
      </Col>
      <Row gutter={[20, 20]} justify="center" align="middle">
        <Col xs={24} md={8} xl={6}>
          <Button size="large" className="btn_home" href="/app/about">
            Acerca de ImpactU
          </Button>
        </Col>
        <Col xs={24} md={8} xl={6}>
          <Button size="large" className="btn_home" href="/app/participants">
            Instituciones Participantes
          </Button>
        </Col>
        <Col xs={24} md={8} xl={6}>
          <Button size="large" className="btn_home" href="/app/help">
            Ayuda
          </Button>
        </Col>
        <Col xs={24} md={8} xl={6}>
          <Button
            size="large"
            className="btn_home"
            href="http://impactu.colav.co:8888/apidoc/index.html"
            target="_blank"
          >
            API
          </Button>
        </Col>
      </Row>
    </Row>
  );
};

export default Home;
