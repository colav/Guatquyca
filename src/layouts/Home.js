import React from "react";

/* Components */
import SearchBar from "../components/SearchBar";

/* UI Library Components */
const Card = require("antd/lib/card").default;
const Col = require("antd/lib/col").default;
const Row = require("antd/lib/row").default;
const Typography = require("antd/lib/typography").default;

/* UI Library Sub-components*/
const { Title } = Typography;

const Home = ({ core, setHome }) => {
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
          ¡Bienvenido a la plataforma Colav!
        </Title>
        <Title level={5} className="tAc" style={{ margin: "30px 0" }}>
          Officia nostrud cupidatat commodo occaecat est ullamco qui
          exercitation nostrud consectetur amet minim.
        </Title>
        <SearchBar setCurrentURL={core.setCurrentURL} setHome={setHome} />
        <Title level={5} className="tAc" style={{ margin: "30px 0" }}>
          Consequat ex laboris deserunt eu in ut consectetur cupidatat duis do.
          Deserunt ipsum irure eu non ex nostrud esse veniam adipisicing. Culpa
          aute laboris esse adipisicing veniam esse do velit consequat.
        </Title>
      </Col>
      <Col style={{ backgroundColor: "#dce1e6" }} span={24}>
        <Title level={3} className="tAc" style={{ margin: "30px 0" }}>
          Filtra los resultados
        </Title>
        <Title level={5} className="tAc" style={{ margin: "30px 0" }}>
          A medida que navegues dentro de la plataforma podrás filtrar los
          resultados de tus búsquedas y la información con un set de filtros que
          encontrarás en el menú desplegable, solo debes hacer click en el ícono
          ubicado en la esquina inferior izquierda de tu navegador. Estos
          filtros se activarán o desactivarán adaptándose a la información
          requerida según los criterios de búsqueda.
        </Title>
        <Title level={5} className="tAc" style={{ margin: "30px 0" }}>
          Tipos de filtros:
        </Title>
        <Row
          style={{ padding: "0px 5px 40px" }}
          gutter={[10, 10]}
          justify="center"
          align="middle"
        >
          <Col xs={24} md={12} lg={6}>
            <Card title="Países">
              <p>Explicación - disponible en:</p>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card title="Rango de años">
              <p>Explicación - disponible en:</p>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card title="Tema">
              <p>Explicación - disponible en:</p>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card title="Afiliación">
              <p>Explicación - disponible en:</p>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Home;
