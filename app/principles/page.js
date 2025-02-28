/* Next */
import Image from "next/image";

/* UI Library Components */
import { Col, Divider, Row } from "antd";

export const metadata = {
  title: "Principios de ImpactU",
  description:
    "Conoce los principios de ImpactU: datos abiertos, software colaborativo, financiación compartida y vinculación con el entorno. Impulsamos la transparencia y el impacto social en la investigación académica.",
};

/**
 * Principles is a "server-side" function component that displays the principles of ImpactU.
 *
 * @returns {JSX.Element} A static page component with the principles of ImpactU.
 */
export default function Principles() {
  return (
    <Row justify="center">
      <Col xs={23} md={16} style={{ marginTop: "40px" }}>
        <h1>Ciencia Abierta</h1>
        <Divider style={{ marginBottom: "10px" }} />
        <h3>Datos Abiertos:</h3>
        <p>
          Los datos procesados por {<b>ImpactU</b>} son compartidos y pueden ser
          usados por cualquier usuario que acceda a la plataforma de manera
          abierta. Visita:{" "}
          <a href={"http://apis.colav.co/"} target="_blank" rel="noreferrer">
            http://apis.colav.co/
          </a>
        </p>
        <h3>Código abierto y Notebooks abiertos:</h3>
        <p>
          Todo el <i>software</i> necesario para el desarrollo de ImpactU es
          creado en colaboración y está abierto a todas las instituciones que
          deseen adaptarlo. Visita:{" "}
          <a href={"https://github.com/colav"} target="_blank" rel="noreferrer">
            https://github.com/colav
          </a>
        </p>
        <h3>Financiación compartida:</h3>
        <p>
          {<b>ImpactU</b>} es posible gracias a los recursos humanos y
          computacionales compartidos por la {<b>Universidad de Antioquia</b>},
          la {<b>Universidad Autónoma Latinoamericana</b>}, la{" "}
          {<b>Universidad Externado de Colombia</b>} y la{" "}
          {<b>Universidad del Valle.</b>}
        </p>
        <h2>Vinculación con el entorno</h2>
        <Divider style={{ marginBottom: "10px" }} />
        <Row justify={"space-between"}>
          <Col xs={23} md={11}>
            <Image
              src={"/media/graf01.png"}
              width={500}
              height={300}
              style={{ width: "100%", height: "auto" }}
              alt="Gráfico organizacional"
            />
          </Col>
          <Col xs={23} md={12}>
            <p>
              {<b>ImpactU</b>} concibe a la Universidad como una organización
              vinculada internamente entre sus misiones universitarias y
              externamente con diferentes públicos como comunidades académicas,
              organizaciones sociales, sector público y privado y públicos y
              ciudadanos en general. Las métricas e indicadores relevan
              especialmente este papel de vinculación para generar herramientas
              que permitan visualizar alcances e impacto social en la producción
              de conocimiento desde las perspectivas misionales.
            </p>
            <p>
              Información adicional sobre su conceptualización puede ser
              consultada en:
            </p>
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
}
