/* Styles */
import styles from "./styles.module.css";

/**
 * Seis is a server-side functional component that renders a section of text and a list of database types that feed ImpactU.
 *
 * The text section describes the four types of databases that feed ImpactU.
 *
 * The list includes two types of databases: internal databases and academic product databases. Each type of database has a description and some have sublists with additional information.
 *
 * @returns {JSX.Element} A fragment containing a paragraph element and an unordered list. The paragraph contains the text section. The list contains the database types and their descriptions.
 */
export default function Seis() {
  return (
    <>
      <p className={styles.normal_text}>
        Hay 4 tipos de bases de datos de las que se nutren{" "}
        <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b>:
      </p>
      <ul className={styles.normal_text}>
        <li>
          <b>Bases de datos internas:</b>
        </li>
        <p>
          <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b> utiliza como base fundamental de descripción de
          todas las instancias institucionales, la base de datos de talento
          humano en donde figuren datos sobre las fechas de vinculación, la
          adscripción a dependencias, identificadores personales como el número
          de identificación y otros datos asociados a su contratación y
          resultados. Esta base de datos se debe entregar en un formato
          específico que permita compatibilidad con los sistemas de{" "}
          <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b>.
        </p>
        <p>
          Es posible adicionar otras bases de datos que permitan la captura de
          información sobre la gestión de proyectos y sus fuentes de
          financiación, docencia y programación de cursos, trabajos de grado y
          tesis, proyectos de consultoría asociados y no asociados a la
          investigación, convenios y movilidad, entre otras. Cada base de datos
          adicional requiere un estudio de la estructura de organización de la
          información y su traducción a una base de datos no lineal.
        </p>
        <p>
          Es importante insistir en la importancia de adoptar identificadores
          persistentes que puedan ayudar a la identificación de autores,
          productos e instituciones. De esa manera se debe generar una cultura
          asociada al uso de los DOI, número de Orcid y otros identificadores
          persistentes en el diligenciamiento de información institucional
          relativa a la investigación.
        </p>
        <li>
          <b>Bases de datos de productos académicos:</b>
          <ul className={styles.normal_text}>
            <br />
            <li>
              <b>Dump Institucional del ScienTI:</b> El ScienTI es un conjunto
              de tres bases de datos que componen el sistema de información
              gubernamental sobre el desarrollo de la investigación en Colombia:
              CvLac, GrupLac e InstituLac. Cada institución tiene derecho a
              obtener sus datos completos en una descarga, la cual es solicitada
              al Ministerio. Estos datos permiten obtener información completa
              sobre el currículo de los investigadores, datos detallados de las
              instituciones y los relacionados con la generación de productos de
              nuevo conocimiento, transferencia, apropiación social y formación.
            </li>
            <li>
              <b>Datos abiertos de Minciencias:</b> El ScienTI tiene una versión
              de datos abiertos. Esta es utilizada por{" "}
              <b id={styles.impact}>Impact</b>
              <b id={styles.u}>U</b> para disponer de la información de GrupLacs
              y CvLacs de todas las instituciones e investigadores en Colombia.
            </li>
            <li>
              <b>OpenAlex:</b> Es la base de datos más comprensiva de la
              producción bibliográfica en investigación en el mundo después de
              Google Scholar y por encima de Web of Science y Scopus. Se
              obtienen datos para analizar la colaboración, la distribución
              temática, la evolución de la productividad, los colegios
              invisibles y el impacto citacional. La información se descarga en
              formato <b>JSON</b>.
            </li>
            <li>
              <b>DSpace:</b> El DSpace es una plataforma de libre uso para las
              bibliotecas en el mundo y es la más usada para la constitución de
              repositorios institucionales. Contiene toda la información de la
              producción de tesis, trabajos de grado y parte importante de la
              producción de sus investigadores. <b id={styles.impact}>Impact</b>
              <b id={styles.u}>U</b> desarrolló un <i>software</i> (Oxomoc{" "}
              <a
                target="_blank"
                rel="noreferrer"
                href="https://github.com/colav/oxomoc"
              >
                https://github.com/colav/oxomoc
              </a>
              ) particular para descargar información de sitios web que utilicen
              el protocolo OAI-PMH, así que es posible obtener información de
              todos los repositorios institucionales y sitios agregadores de
              información académica.
            </li>
          </ul>
          <p>
            La plataforma de <b id={styles.impact}>Impact</b>
            <b id={styles.u}>U</b> es abierta a la inclusión de nuevas bases de
            datos, lo que depende de la proyección realizada con las
            instituciones de la alianza.
          </p>
        </li>
        <li>
          <b>Bases para el enriquecimiento de datos:</b>
          <ul className={styles.normal_text}>
            <br />
            <li>
              <b>ROR:</b> permite la obtención de identificadores
              institucionales para el mejoramiento de la normalización de la
              información.
            </li>
            <li>
              <b>Wikidata y Wikipedia:</b> Permite la captura de metadatos
              adicionales de las instituciones para mejorar los procesos de
              normalización y robustecimiento de la información disponible.
            </li>
            <li>
              <b>DOAJ:</b> permite la captura de información relativa a las
              fuentes de publicación como por ejemplo los costos de APC
              declarados, características de la revista, entre otros.
            </li>
            <li>
              <b>Scimago Journal Rank:</b> permite la captura de información
              relacionada con la clasificación de las revistas por su impacto.
            </li>
            <li>
              <b>Google Scholar:</b> Ofrece la información sobre número de citas
              obtenidas de acuerdo con los registros de Google Scholar. Es
              posible hacer procesamiento de los metadatos de las citas, con el
              <i>software</i> desarrollado por <b id={styles.impact}>Impact</b>
              <b id={styles.u}>U</b>, sin embargo, los altos costos de
              procesamiento impiden obtener esta información. Se descarga a
              través de un sistema de web scraping.
            </li>
          </ul>
          <p>
            Se proyecta la integración de Orcid en posteriores etapas del
            proyecto, lo que permitiría obtener datos precisos de los
            investigadores nacionales y alimentar la base de datos de Orcid de
            manera semiautomática.
          </p>
          <p>
            La mezcla de datos se hace a través de los <i>softwares</i> Kahi y
            HunabKu{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/colav/kahi"
            >
              https://github.com/colav/kahi
            </a>{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/colav/hunabKu"
            >
              https://github.com/colav/hunabKu
            </a>{" "}
            disponibles en los respositorios de GitHub del CoLaV.
          </p>
        </li>
        <li>
          <b>Bases de datos de noticias:</b>
          <ul className={styles.normal_text}>
            <br />
            <li>
              <b>Google News:</b> Ofrece información sobre la mención de
              investigadores y docentes en medios de comunicación disponibles en
              Google News.
            </li>
            <li>
              <b>El Colombiano:</b> Ofrece información sobre la mención de
              investigadores y docentes en el periódico el Colombiano.
            </li>
            <li>
              <b>El tiempo:</b> Ofrece información sobre la mención de
              investigadores y docentes en el periódico el Tiempo.
            </li>
          </ul>
        </li>
      </ul>
    </>
  );
}
