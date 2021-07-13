import React from "react";

/* Utilities */
import URLBuilder from "../helpers/URLBuilder";

/* Components */
import SearchBar from "../components/SearchBar";
import SingleStatistic from "../components/SingleStatistic";

/* Logos */
import logo_impactU_azul from "../logos/logo_impactU_azul.svg";

/* Utilities */
import { APIRequest } from "../apis/clustercien";

/* UI Library Components */
const Button = require("antd/lib/button").default;
const Col = require("antd/lib/col").default;
const Row = require("antd/lib/row").default;
const Space = require("antd/lib/space").default;
const Typography = require("antd/lib/typography").default;

/* UI Library Sub-components*/
const { Title } = Typography;

const Home = ({ core, setHome }) => {
  const [state] = APIRequest("/app/ourdata?apikey=colavudea");

  console.log(state);
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
          <br />
          <img
            src={logo_impactU_azul}
            alt="Logotipo Colav"
            style={{ maxWidth: "400px" }}
          />
        </Title>
        <Title level={2} className="tAc" style={{ margin: "50px 0" }}>
          Métricas sobre la producción universitaria y su relación con el
          entorno en Colombia.
        </Title>
        <SearchBar setCurrentURL={core.setCurrentURL} setHome={setHome} />
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
      <Space style={{ margin: "40px" }} size="large" wrap>
        <Button size="large" className="btn_home" href="/app/about">
          Acerca de ImpactU
        </Button>
        <Button size="large" className="btn_home" href="/app/participants">
          Instituciones Participantes
        </Button>
        <Button size="large" className="btn_home" href="/app/help">
          Ayuda
        </Button>
        <Button size="large" className="btn_home" href="/app/api">
          API
        </Button>
      </Space>
    </Row>
  );
};

export default Home;
