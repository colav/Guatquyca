/* Next */
import Image from "next/image";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Col, Divider, Row } from "antd";

export default function TabPrincipios() {
  return (
    <>
      <h3 className={styles.margin0}>Principios operativos</h3>
      <ul>
        <li>
          <b>Código abierto:</b> <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b> es una plataforma de código abierto, lo que
          permite a cualquier persona replicar, adaptar y mejorar el sistema
          según sus necesidades.
        </li>
        <br />
        <li>
          <b>Datos abiertos:</b> Respetando las leyes de privacidad,{" "}
          <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b> promueve la visibilidad de las instituciones
          participantes, fomenta la transparencia ante la sociedad y facilita la
          rendición de cuentas.
        </li>
        <br />
        <li>
          <b>Datos disponibles:</b> Cumpliendo con los marcos legales de
          protección de datos, <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b> pone a disposición información actualizada y
          accesible para los diferentes actores del ecosistema de investigación.
        </li>
        <br />
        <li>
          <b>Sin reclamo de patentes:</b> <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b> es considerado un bien común por la red de
          instituciones que lo conforman, sin intención de apropiación exclusiva
          ni restricciones comerciales.
        </li>
        <br />
        <li>
          <b>Financiación e infraestructuras compartidas:</b> La evolución de{" "}
          <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b> se basa en decisiones colectivas, guiadas por
          las necesidades de sus socios y usuarios, y orientadas al beneficio de
          las organizaciones colombianas.
        </li>
        <br />
        <li>
          <b>Soberanía sobre la información:</b>{" "}
          <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b> fortalece la autonomía institucional al
          permitir que cada organización mantenga el control sobre sus sistemas
          de información.
        </li>
        <br />
        <li>
          <b>Aprendizaje colaborativo:</b> Las instituciones participantes
          comparten conocimientos y buenas prácticas sobre manejo de datos,
          evaluación responsable y gestión del conocimiento, en un entorno de
          mejora continua.
        </li>
        <br />
        <li>
          <b>Documentación y estandarización:</b>{" "}
          <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b> cuenta con procesos documentados y
          estandarizados que facilitan su replicación y adaptación en otros
          contextos institucionales y países.
        </li>
      </ul>
      <Divider />
      <h3 className={styles.margin0}>Definiciones básicas</h3>
      <p>
        <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b> concibe a la Universidad como una organización
        vinculada internamente entre sus misiones universitarias y externamente
        con diferentes públicos como comunidades académicas, organizaciones
        sociales, sector público y privado y públicos y ciudadanos en general.
        Las métricas e indicadores relevan especialmente este papel de
        vinculación para generar herramientas que permitan visualizar alcances e
        impacto social en la producción de conocimiento desde las perspectivas
        misionales.
      </p>
      <p>
        Información adicional sobre su conceptualización puede ser consultada
        en:
      </p>
      <ul>
        <li>
          <b>
            Hacia una plataforma de métricas y evaluación para América Latina en
            conocimiento especializado:
          </b>{" "}
          ciencias, tecnologías, innovación, artes y humanidades.{" "}
          <a
            href="https://biblioteca-repositorio.clacso.edu.ar/bitstream/CLACSO/16817/1/Hacia-una-plataforma.pdf"
            target="_blank"
            rel="noreferrer"
            className={styles.wrapText}
          >
            https://biblioteca-repositorio.clacso.edu.ar/bitstream/CLACSO/16817/1/Hacia-una-plataforma.pdf
          </a>
        </li>
        <br />
        <li>
          <b>Métricas de vinculación universidad-entorno:</b> Universidad de
          Antioquia. Apuntes sobre los instrumentos del Manual de Indicadores de
          Vinculación.{" "}
          <a
            href="https://bibliotecadigital.udea.edu.co/handle/10495/12357"
            target="_blank"
            rel="noreferrer"
            className={styles.wrapText}
          >
            https://bibliotecadigital.udea.edu.co/handle/10495/12357
          </a>
        </li>
        <br />
        <li>
          <b>Hacia un modelo de medición de la ciencia desde el Sur Global:</b>{" "}
          métricas responsables.{" "}
          <a
            href="https://www.palabraclave.fahce.unlp.edu.ar/article/view/PCe068"
            target="_blank"
            rel="noreferrer"
            className={styles.wrapText}
          >
            https://www.palabraclave.fahce.unlp.edu.ar/article/view/PCe068
          </a>
        </li>
      </ul>
      <Row justify={"center"}>
        <Col xs={24} md={12}>
          <Image
            src={"/media/graf01.png"}
            width={500}
            height={300}
            style={{ width: "100%", height: "auto" }}
            alt="Gráfico organizacional"
          />
        </Col>
      </Row>
    </>
  );
}
