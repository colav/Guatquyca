import React, { useEffect } from "react";

/* Components */
import HomeTable from "../HomeTable";
import SearchBar from "../SearchBar";
import { ReactComponent as Banner } from "../../media/banner.svg";

/* UI Library Components */
import { Card, Col, Row, Typography } from "antd";

/* Icons */
import { LinkOutlined } from "@ant-design/icons";

/* Utils */
import { Link } from "react-router-dom";
/* import { APIRequest } from '../../apis/clustercien'; */

/* UI Library Sub-components*/
const { Title } = Typography;

const Home = ({ setHome }) => {
  /* const [state] = APIRequest('/app/ourdata?'); */
  useEffect(() => {
    document.title = "ImpactU";
    setHome(true);
    return () => {
      setHome(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Banner id="home__banner" />
      <Row justify="space-around">
        <Col flex sm={24} xl={10} xxl={8}>
          <div id="home__head--title">
            <Title style={{ marginBottom: "15px" }}>Bienvenido a ImpactU</Title>
            <Title level={2} className="marginTop_0">
              Laboratorio de I+D para la evaluación responsable de la
              investigación en Colombia.
            </Title>
          </div>
        </Col>
        <Col
          sm={24}
          xl={12}
          xxl={12}
          style={{ margin: "20px 5px 0 5px", textAlign: "center" }}
        >
          <Card size="small" style={{ borderRadius: "10px" }} hoverable>
            <Title level={4} className="marginTop_0">
              La información puede ser consultada por autores, instituciones,
              facultades, departamentos, grupos de investigación, productos,
              proyectos, convenios y emprendimientos.
            </Title>
            <div className="searchbar--container">
              <SearchBar />
            </div>
            <div id="home__table--container">
              <HomeTable />
            </div>
            <p
              style={{ textAlign: "left", padding: "0 16px", marginBottom: 0 }}
            >
              * Los indicadores aquí presentados buscan cumplir con los
              principios de métricas responsables, para más información sigue
              este{" "}
              <Link to="/app/metrics">
                enlace.
                <LinkOutlined />
              </Link>
            </p>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Home;
