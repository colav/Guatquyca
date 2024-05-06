/* Styles */
import styles from "./styles.module.css";

/**
 * Tres is a server-side functional component that renders a section of text describing the cooperation of institutions with ImpactU.
 *
 * The text section includes:
 * - A subtitle "3.1 Instituciones cooperantes."
 * - A description of how any Colombian institution can participate in the inter-institutional alliance for the development and maintenance of ImpactU.
 * - A list of requirements for an institution to participate in the alliance.
 * - Details about the resources that make up the alliance and the participation in development or strategic direction instances.
 * - Information about the special service that cooperating institutions have access to, including APIs with mostly open data, support in downloading information in text format, and information display on the screen through control panels with multiple filtering possibilities.
 * - A list of benefits for cooperating institutions, including a repository of APIs with information about research production in Colombian institutions and specific information about their institutions.
 *
 * @returns {JSX.Element} A fragment containing multiple paragraph elements, a list, and a link. Each paragraph and list item represents a part of the text section. The link leads to the API repository.
 */
export default function Tres() {
  return (
    <>
      <h3 className={styles.subTitle}>3.1 Instituciones cooperantes.</h3>
      <p className={styles.normal_text}>
        Cualquier institución colombiana puede participar en la alianza
        interinstitucional para el desarrollo y sostenimiento de{" "}
        <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b>, para ello debe:
      </p>
      <ol className={styles.normal_text}>
        <li>
          Establecer una relación formal de cooperación, a través de convenio
          específicos de cooperación o acuerdos de cooperación investigativa.
        </li>
        <li>
          Definir los recursos que componen la alianza y se entra a participar
          en las instancias de desarrollo o direccionamiento estratégico.
          <p className={styles.point_list}>
            2.1. En la instancia de desarrollo hay un equipo de desarrolladores
            e investigadores que generan el <i>software</i>, las estrategias del
            manejo de la información de la plataforma y la estrategia de
            almacenamiento y procesamiento de la información.
          </p>
          <p className={styles.point_list}>
            2.2. En el equipo de direccionamiento estratégico hay un grupo de
            investigadores y personal administrativo que definen estrategias
            para la adopción de la herramienta y la generación de
            recomendaciones para la evaluación y seguimiento de la actividad
            investigativa.
          </p>
          <p className={styles.point_list}>
            2.3. Para ambas instancias cada universidad deberá delegar unos
            responsables, quienes serán los encargados de ser el puente de
            comunicación con el equipo de <b id={styles.impact}>Impact</b>
            <b id={styles.u}>U</b> y las necesidades de su institución.
          </p>
        </li>
      </ol>
      <p className={styles.normal_text}>
        Las instituciones cooperantes acceden a un servicio especializado de
        APIs con datos abiertos en su mayoría, acompañamiento en la descarga de
        información en formato de texto y la visualización de información en la
        pantalla a través de cuadros de control con múltiples posibilidades de
        filtrado. Los indicadores por visualizar se construyen de acuerdo con
        las necesidades de los equipos administrativos de la investigación.
      </p>
      <ul className={styles.normal_text}>
        <li>
          Un repositorio de APIs con información sobre la producción
          investigativa en las instituciones colombianas e información
          específica sobre sus instituciones.
          <br />
          <a
            target="_blank"
            rel="noreferrer"
            href="https://apis.colav.co/apidoc/index.html"
          >
            https://apis.colav.co/apidoc/index.html
          </a>
        </li>
        <li>
          Un repositorio de <i>softwares</i> para el apoyo a la constitución de
          sistemas tipo <b>CRIS</b>:{" "}
          <a target="_blank" rel="noreferrer" href="https://github.com/colav/">
            https://github.com/colav/
          </a>
        </li>
        <li>
          Espacios de cooperación en la definición de estrategias de evaluación
          y seguimiento de equipos institucionales.
        </li>
        <li>
          Procesos de formación en la utilización de sistemas tipo <b>CRIS</b> y
          la implementación de estrategias evaluativas y de seguimiento haciendo
          uso de <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b>.
        </li>
        <li>
          Información detallada sobre el comportamiento de múltiples niveles del
          sistema de investigación organizacional: considera los datos de los
          individuos y de las diferentes jerarquías organizacionales entre
          dependencias: grupos, departamentos, facultades, etc. Las otras
          organizaciones colombianas, aparecerán sin el detalle organizacional,
          pero con toda la información disponible en bases de datos abiertas
          sobre su desempeño. Así mismo, permite la participación en los
          procesos de formación y acompañamiento cooperativo del grupo
          interinstitucional.
        </li>
      </ul>
      <h3 className={styles.subTitle}>
        3.2 ¿Puede una institución no cooperante implementar procedimientos
        basados en los desarrollos de <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b>?
      </h3>
      <p className={styles.normal_text}>
        <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b> pone a disposición de las Universidades en
        Colombia y fuera de ella, un conjunto de <i>softwares</i> modulares en
        código abierto que permite generar desarrollos propios adaptados para la
        implementación de sistemas de información sobre la investigación.{" "}
        <a target="_blank" rel="noreferrer" href="https://github.com/colav/">
          https://github.com/colav/
        </a>
      </p>
      <p className={styles.normal_text}>
        Así mismo, ofrece procesos de formación en el uso de estos{" "}
        <i>softwares</i> o herramientas relacionadas con el procesamiento de
        información relevante a la investigación.
      </p>
    </>
  );
}
