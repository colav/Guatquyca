import React from "react";

/* Logos */
import doaj from "../../media/doaj.svg";
import google from "../../media/google.svg";
import unpayw from "../../media/unpaywall.svg";
import openalex from "../../media/openalex.png";
import scimago from "../../media/scimago.svg";
import dspace from "../../media/dspace.png";

/* UI Library Components */
import { Col, Divider, Image, Row, Typography } from "antd";

/* UI Library Sub-components*/
const { Title, Paragraph, Link, Text } = Typography;

const About = () => {
  document.title = "Acerca de ImpactU";
  const logos = [openalex, doaj, scimago, unpayw, dspace, google];

  const renderedLogos = () => {
    return logos.map((logo) => (
      <Col style={{ textAlign: "center" }} xs={24} md={8} key={logo}>
        <Image preview={false} src={logo} />
      </Col>
    ));
  };

  return (
    <Row gutter={[20, 20]} justify="center">
      <Col xs={24} md={16}>
        <Title level={2}>Acerca de ImpactU</Title>
        <Divider />
      </Col>
      <Col xs={24} md={16}>
        <Paragraph>
          {<Text strong>ImpactU</Text>} es una plataforma colaborativa regional
          para la creación de modelos que evidencien la vinculación de la
          investigación, la docencia y la extensión con el entorno a través de
          la producción de diferentes tipos de documentos resultados de las tres
          misiones universitarias.
        </Paragraph>
        <Title level={5}>El sistema utiliza datos de:</Title>
        <Row
          gutter={[20, 20]}
          justify="space-around"
          align="middle"
          style={{ marginTop: "30px" }}
        >
          {renderedLogos()}
        </Row>
        <br />
        <Paragraph>
          Así como también los Datos Abiertos de Minciencias y las bases de
          datos internas de las Universidades que colaboran.
        </Paragraph>
        <Divider style={{ marginBottom: "10px" }} />
      </Col>
      <Col xs={24} md={16} style={{ marginTop: "0px" }}>
        <Paragraph>
          {<Text strong>ImpactU</Text>} es una plataforma creada y desarrollada
          por el{" "}
          {
            <Link strong href="http://colav.udea.edu.co" target="_blank">
              Colav
            </Link>
          }{" "}
          de la {<Text strong>Universidad de Antioquia</Text>} en colaboración
          con la {<Text strong>Universidad Autónoma Latinoamericana</Text>}, la{" "}
          {<Text strong>Universidad Externado de Colombia</Text>} y la{" "}
          {<Text strong>Universidad del Valle.</Text>} Su propósito es
          desarrollar herramientas para implementar modelos de métricas
          responsables con el principio de multidimensionalidad y robustez de la
          información para:
        </Paragraph>
        <ul>
          <li>
            Identificar la producción diversa de diferentes niveles
            organizacionales (autores, dependencias académicas y grupos)
          </li>
          <li>
            Desfragmentar la información institucional respecto a los resultados
            de investigación en relación con otras misiones universitarias y el
            entorno a partir de múltiples bases de datos internas y externas que
            muestren en conjunto todas las formas diversas de producir
            conocimiento.
          </li>
          <li>
            Generar diálogos instrumentos de evaluación y métricas y tomadores
            de decisiones que den cuenta de los resultados institucionales
            generados en el tiempo y respondan a los objetivos institucionales y
            las demandas externas.
          </li>
          <li>
            Apertura de datos e infraestructuras computacionales para promover
            una comunidad analítica alrededor de las universidades y sus aportes
            a la sociedad.
          </li>
        </ul>
        <Paragraph>
          Esta propuesta se plantea tres tipos de estrategias metodológicas:
        </Paragraph>
        <ul>
          <li>
            La planeación de modelos de infraestructura de hardware para el
            procesamiento de datos y visualización de la información que
            permitan desarrollar una gobernanza institucional sobre su
            información.
          </li>
          <li>
            La ampliación de una comunidad de desarrollo para proveer la
            infraestructura en software necesaria (
            <a
              href={"http://www.github.com/colav"}
              target="_blank"
              rel="noreferrer"
            >
              GitHub @Colav
            </a>
            ) para el procesamiento de datos masivos institucionales y en
            relación con el mundo.
          </li>
          <li>
            Identificar los aspectos relevantes a la gestión institucional de la
            investigación en relación con las otras misiones universitarias y el
            entorno para mejorar los procesos de evaluación y mejoramiento
            continuo con datos adecuados e indicadores pertinentes.
          </li>
        </ul>
        <Title level={5}>
          El espíritu del proyecto es colaborativo y está abierto a que los
          usuarios de la plataforma no solo consulten su información, sino
          también, para que puedan usar y ayudar en la creación de softwares que
          la alimenten y enriquezcan. Al ser un proyecto experimental, hay
          espacio para alianzas temporales o estratégicas con distintas
          instituciones para resolver problemas asociados con modelos métricos
          que puedan adecuarse a las necesidades de los tomadores de decisiones.
        </Title>
        <br />
        <Paragraph>
          Inicialmente la plataforma está adaptada para la consulta en detalle
          de la {<Text strong>Universidad de Antioquia</Text>},{" "}
          {<Text strong>Universidad Autónoma Latinoamericana</Text>}, la{" "}
          {<Text strong>Universidad Externado de Colombia</Text>} y la{" "}
          {<Text strong>Universidad del Valle</Text>}, pero contiene todos los
          datos disponibles de la producción Colombiana disponibles en las bases
          utilizadas. El instrumento es de fácil escalabilidad a otras
          instituciones nacionales con algunos datos mínimos de los docentes
          vinculados a cada entidad.
        </Paragraph>
      </Col>
    </Row>
  );
};

export default About;
