import React from "react";

/* UI Library Components */
const Divider = require("antd/lib/divider").default;
const Col = require("antd/lib/col").default;
const Row = require("antd/lib/row").default;
const Typography = require("antd/lib/typography").default;

/* UI Library Sub-components*/
const { Title, Paragraph, Text } = Typography;

const Participants = () => {
  return (
    <Row gutter={[20, 20]} justify="center">
      <Col xs={24} md={16} style={{ marginTop: "40px" }}>
        <Title level={3}>Instituciones participantes</Title>
        <Divider style={{ marginBottom: "10px" }} />
        <Paragraph>
          {<Text strong>ImpactU</Text>} es producto de una alianza entre la
          {<Text strong>Universidad de Antioquia</Text>},{" "}
          {<Text strong>Universidad Autónoma Latinoamericana</Text>} y la{" "}
          {<Text strong>Universidad Externado de Colombia</Text>}. En este
          proyecto participan diversos grupos de investigación y dependencias
          administrativas de estas universidades en la consolidación de un
          colaboratorio para el desarrollo de un programa de métricas
          responsables.
        </Paragraph>
        <Title level={5}>
          {<Text strong>ImpactU</Text>} es un proyecto de ciencia abierta y por
          ello desarrolla diferentes mecanismos para fomentar la colaboración.
          Las siguientes son nuestras estrategias:
        </Title>
        <Paragraph>
          <ul>
            <li>
              Comunidad de desarrolladores:{" "}
              <a href="https://github.com/colav">https://github.com/colav</a> La
              comunidad de desarrollo crea softwares abiertos para captura,
              análisis y visualización de información.
            </li>
            <br />
            <li>
              Alianzas estratégicas cooperativas: Se desarrollan convenios
              bilaterales y multilaterales para el desarrollo de proyectos
              específicos en el marco de la plataforma{" "}
              {<Text strong>ImpactU</Text>}.
            </li>
            <br />
            <li>
              Espacios de diálogo: los participantes en proyectos del
              colaboratorio organizan y participan en eventos académicos y de
              debate público sobre instrumentos métricos y orientación de la
              evaluación de la producción de conocimiento universitaria.
              <ul>
                <li>
                  <a href="https://latmetricas.wordpress.com/">
                    Latmétricas 2021
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/watch?v=bbMw0evYD94">
                    Transformative Metrics 2020
                  </a>
                </li>
                <li>
                  <a href="https://www.clacso.org/conversatorio-metricas-de-vinculacion-universidad-entorno/">
                    FOLEC-CLACSO
                  </a>
                </li>
                <li>Entre otros...</li>
              </ul>
            </li>
          </ul>
        </Paragraph>
      </Col>
    </Row>
  );
};

export default Participants;
