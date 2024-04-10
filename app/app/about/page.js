/* Next */
import Image from "next/image";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Col, Divider, Row } from "antd";

export const metadata = {
  title: "Acerca de ImpactU",
};

const logos = [
  "/media/openalex.png",
  "/media/doaj.svg",
  "/media/scimago.svg",
  "/media/unpaywall.svg",
  "/media/dspace.png",
  "/media/google.svg",
];

/**
 * renderedLogos is a function that maps over the logos array and returns a list of Image components for each logo.
 *
 * @returns {Array} - The list of Image components for each logo.
 */
const renderedLogos = () => {
  return logos.map((logo, i) => (
    <Col className={styles.logo_padding} xs={20} md={8} key={i}>
      <Image
        src={logo}
        alt={logo}
        width={250}
        height={60}
        style={{ height: "auto", width: "100%" }}
      />
    </Col>
  ));
};

/**
 * About is a "server-side" function component that displays the "About" page.
 *
 * @returns {JSX.Element} A static page with components from Ant Design library that contains
 * information about ImpactU and a list of logos.
 */
export default function About() {
  return (
    <Row justify="center">
      <Col xs={23} md={16}>
        <h1>Acerca de ImpactU</h1>
        <Divider />
      </Col>
      <Col xs={23} md={16}>
        <p>
          {<b>ImpactU</b>} es una plataforma colaborativa regional para la
          creación de modelos que evidencien la vinculación de la investigación,
          la docencia y la extensión con el entorno a través de la producción de
          diferentes tipos de documentos resultados de las tres misiones
          universitarias.
        </p>
        <h3>El sistema utiliza datos de:</h3>
        <Row
          gutter={[20, 20]}
          justify="space-around"
          align="middle"
          className={styles.margin_30}
        >
          {renderedLogos()}
        </Row>
        <br />
        <p>
          Así como también los Datos Abiertos de Minciencias y las bases de
          datos internas de las Universidades que colaboran.
        </p>
        <Divider style={{ marginBottom: "10px" }} />
      </Col>
      <Col xs={23} md={16} style={{ marginTop: "0px" }}>
        <p>
          {<b>ImpactU</b>} es una plataforma creada y desarrollada por el{" "}
          {
            <a href="http://colav.udea.edu.co" target="_blank" rel="noreferrer">
              CoLaV
            </a>
          }{" "}
          de la {<b>Universidad de Antioquia</b>} en colaboración con la{" "}
          {<b>Universidad Autónoma Latinoamericana</b>}, la{" "}
          {<b>Universidad Externado de Colombia</b>} y la{" "}
          {<b>Universidad del Valle.</b>} Su propósito es desarrollar
          herramientas para implementar modelos de métricas responsables con el
          principio de multidimensionalidad y robustez de la información para:
        </p>
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
        <p>
          Esta propuesta se plantea tres tipos de estrategias metodológicas:
        </p>
        <ul>
          <li>
            La planeación de modelos de infraestructura de hardware para el
            procesamiento de datos y visualización de la información que
            permitan desarrollar una gobernanza institucional sobre su
            información.
          </li>
          <li>
            La ampliación de una comunidad de desarrollo para proveer la
            infraestructura en <i>software</i> necesaria (
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
        <h3>
          El espíritu del proyecto es colaborativo y está abierto a que los
          usuarios de la plataforma no solo consulten su información, sino
          también, para que puedan usar y ayudar en la creación de{" "}
          <i>softwares</i> que la alimenten y enriquezcan. Al ser un proyecto
          experimental, hay espacio para alianzas temporales o estratégicas con
          distintas instituciones para resolver problemas asociados con modelos
          métricos que puedan adecuarse a las necesidades de los tomadores de
          decisiones.
        </h3>
        <br />
        <p>
          Inicialmente la plataforma está adaptada para la consulta en detalle
          de la {<b>Universidad de Antioquia</b>},{" "}
          {<b>Universidad Autónoma Latinoamericana</b>}, la{" "}
          {<b>Universidad Externado de Colombia</b>} y la{" "}
          {<b>Universidad del Valle</b>}, pero contiene todos los datos
          disponibles de la producción Colombiana disponibles en las bases
          utilizadas. El instrumento es de fácil escalabilidad a otras
          instituciones nacionales con algunos datos mínimos de los docentes
          vinculados a cada entidad.
        </p>
      </Col>
    </Row>
  );
}
