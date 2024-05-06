/* Styles */
import styles from "./styles.module.css";

/**
 * Nueve is a server-side functional component that renders a section of text describing the two types of data contemplated by ImpactU: raw data and processed data.
 *
 * The text section includes:
 * - A description of raw data as specific information from each database converted to standard formats for inclusion in analyses within institutions. It also provides a link to consult this data.
 * - A description of processed data as the resulting database from the mixture of different sources that feed ImpactU. This database presents possible relationships between university missions and the environment, allowing valuable cross-referencing of information regarding author affiliations, performance in different parts of the research process, relation with activities such as teaching or extension, and identification of different types of actors outside academia with whom universities develop alliances and consulting, training, and applied research projects. This information can be downloaded in JSON and CSV formats according to the filters applied to the platform.
 *
 * @returns {JSX.Element} A fragment containing two paragraph elements. Each paragraph represents a part of the text section.
 */
export default function Nueve() {
  return (
    <>
      <p className={styles.normal_text}>
        <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b> contempla dos tipos de datos: crudos y
        procesados. De un lado, los datos crudos se refieren a la información
        específica de cada base de datos convertida a formatos estándar para
        incluirla en los análisis al interior de las instituciones. Esta puede
        ser consultada en:{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://apis.colav.co/apidoc/index.html"
        >
          https://apis.colav.co/apidoc/index.html
        </a>
      </p>
      <p className={styles.normal_text}>
        Los datos procesados se refieren a la base de datos resultante de la
        mezcla de diferentes fuentes que alimentan a{" "}
        <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b>. Esta base de datos presenta las posibles
        relaciones entre misiones universitarias y con el entorno, por tanto
        permiten el cruce de información valiosa respecto a las afiliaciones de
        los autores, su desempeño en diferentes partes del proceso de
        investigación, su relación con actividades como la docencia o la
        extensión y la identificación de diferentes tipos de actores diferentes
        a la academia con las que las Universidades desarrollan alianzas y
        proyectos de consultoría, formación e investigación aplicada. Esta
        información puede ser descargada en formatos <b>JSON</b> y <b>CSV</b> de
        acuerdo con los filtros aplicados a la plataforma
      </p>
    </>
  );
}
