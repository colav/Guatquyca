import React from "react";

/* Images */
import graf01 from "../../media/graf01.png";

/* UI Library Components */
import { Col, Divider, Image, Row, Typography } from "antd";

/* UI Library Sub-components*/
const { Title, Paragraph, Text } = Typography;

const Principles = () => {
  document.title = "Principios - ImpactU";

  return (
    <Row gutter={[20, 20]} justify="center">
      <Col xs={24} md={16} style={{ marginTop: "40px" }}>
        <Title level={3}>Ciencia Abierta</Title>
        <Divider style={{ marginBottom: "10px" }} />
        <Title level={5}>Datos Abiertos:</Title>
        <Paragraph>
          Los datos procesados por {<Text strong>ImpactU</Text>} son compartidos
          y pueden ser usados por cualquier usuario que acceda a la plataforma
          de manera abierta. Visita:{" "}
          <a href={"http://apis.colav.co/"} target="_blank" rel="noreferrer">
            http://apis.colav.co/
          </a>
        </Paragraph>
        <Title level={5}>Código abierto y Notebooks abiertos:</Title>
        <Paragraph>
          Todo el software necesario para el desarrollo de ImpactU es creado en
          colaboración y está abierto a todas las instituciones que deseen
          adaptarlo. Visita:{" "}
          <a href={"https://github.com/colav"} target="_blank" rel="noreferrer">
            https://github.com/colav
          </a>
        </Paragraph>
        <Title level={5}>Financiación compartida:</Title>
        <Paragraph>
          {<Text strong>ImpactU</Text>} es posible gracias a los recursos
          humanos y computacionales compartidos por la{" "}
          {<Text strong>Universidad de Antioquia</Text>}, la{" "}
          {<Text strong>Universidad Autónoma Latinoamericana</Text>}, la{" "}
          {<Text strong>Universidad Externado de Colombia</Text>} y la{" "}
          {<Text strong>Universidad del Valle.</Text>}
        </Paragraph>
        <Title level={3}>Vinculación con el entorno</Title>
        <Divider style={{ marginBottom: "10px" }} />
        <Row justify={"space-between"}>
          <Col xs={24} md={10}>
            <Image src={graf01} style={{ maxWidth: "600px" }} />
          </Col>
          <Col xs={24} md={13}>
            <Paragraph>
              {<Text strong>ImpactU</Text>} concibe a la Universidad como una
              organización vinculada internamente entre sus misiones
              universitarias y externamente con diferentes públicos como
              comunidades académicas, organizaciones sociales, sector público y
              privado y públicos y ciudadanos en general. Las métricas e
              indicadores relevan especialmente este papel de vinculación para
              generar herramientas que permitan visualizar alcances e impacto
              social en la producción de conocimiento desde las perspectivas
              misionales.
            </Paragraph>
            <Paragraph>
              Información adicional sobre su conceptualización puede ser
              consultada en:
            </Paragraph>
            <ul>
              <li>
                Hacia una plataforma de métricas y evaluación para América
                Latina en conocimiento especializado: ciencias, tecnologías,
                innovación, artes y humanidades.{" "}
                <a
                  href="https://biblioteca-repositorio.clacso.edu.ar/bitstream/CLACSO/16817/1/Hacia-una-plataforma.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://biblioteca-repositorio.clacso.edu.ar/bitstream/CLACSO/16817/1/Hacia-una-plataforma.pdf
                </a>
              </li>
              <br />
              <li>
                Métricas de vinculación universidad-entorno: Universidad de
                Antioquia. Apuntes sobre los instrumentos del Manual de
                Indicadores de Vinculación{" "}
                <a
                  href="https://bibliotecadigital.udea.edu.co/handle/10495/12357"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://bibliotecadigital.udea.edu.co/handle/10495/12357
                </a>
              </li>
              <br />
              <li>
                Hacia un modelo de medición de la ciencia desde el Sur Global:
                métricas responsables{" "}
                <a
                  href="https://www.palabraclave.fahce.unlp.edu.ar/article/view/PCe068"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://www.palabraclave.fahce.unlp.edu.ar/article/view/PCe068
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Principles;
