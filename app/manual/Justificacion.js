/* Icons */
import { DownloadOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/**
 * Justificacion is a server-side functional component that renders a section of text and a bibliography with download links.
 *
 * The text section describes the purpose and benefits of ImpactU. It includes two bold sections: "Impact" and "U".
 *
 * The bibliography section includes two references. Each reference is a downloadable PDF file. The download links open in a new tab.
 *
 * @returns {JSX.Element} A fragment containing a paragraph element and a div element. The paragraph contains the text section. The div contains the bibliography section.
 */
export default function Justificacion() {
  return (
    <>
      <p className={styles.normal_text}>
        Los sistemas métricos y de evaluación del desempeño de la investigación
        en las organizaciones dedicadas total o parcialmente a esta misión,
        están orientados por propuestas comerciales que focalizan su atención en
        la preponderancia internacional del desempeño investigativo, generando
        <i>ránkings</i> que si bien dan una idea parcial del desempeño respecto
        a los investigadores e investigadores de mayor producción, no logran
        entregar un panorama preciso de los avances importantes respecto a la
        relación entre capacidades y resultados, impacto académico, social y
        económico, entre otros asuntos relevantes a la gestión.{" "}
        <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b> está diseñado para poder responder de manera
        pertinente a estos retos en un ejercicio cooperativo entre instituciones
        para mejorar sus procesos de evaluación y medición incluyendo aspectos
        como el impacto académico internacional, pero también y de manera
        minuciosa, la observación del desempeño de la investigación en los
        aspectos relevantes a los objetivos institucionales y a las demandas del
        entorno.
      </p>
      <div className={styles.font_20}>
        <h4>
          Bibliografía de apoyo para comprender el entorno crítico de la
          evaluación y los aportes de <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b> a estos retos:
        </h4>
        <p className={styles.normal_text}>
          <DownloadOutlined /> PDF:{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="http://eprints.rclis.org/42824/1/Cap%C3%ADtulo.%20Libro%20vinculaci%C3%B3n%20CLACSO.%20CoLav%20UdeA.pdf"
          >
            Hacia una plataforma de métricas y evaluación para América Latina en
            conocimiento especializado: ciencias, tecnologías, innovación, artes
            y humanidades.
          </a>
        </p>
        <p className={styles.normal_text}>
          <DownloadOutlined /> PDF:{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="
            http://eprints.rclis.org/44889/1/Revista%2BCientifica%2B48%2BArticulo%2B8%2B20852%2BRV2.pdf"
          >
            Producción científica en Colombia relacionada con ciencia abierta,
            métricas de nueva generación y métricas responsables en el contexto
            de Publindex y ScienTI. Algunas características y perspectivas para
            apoyar una Política Nacional.
          </a>
        </p>
      </div>
    </>
  );
}
