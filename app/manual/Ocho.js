/* Styles */
import styles from "./styles.module.css";

/**
 * Ocho is a server-side functional component that renders a section of text and a list of points for institutions to consider when participating in a CRIS-type system.
 *
 * The text section includes:
 * - A description of how ImpactU recovers information from different internal and external databases and strengthens an information system composed of databases that can communicate with each other by being translated to a common protocol.
 * - Information about how the data is stored on the servers of the University of Antioquia with the possibility of making exact copies of the information on institutional servers of the institutions that request it.
 * - A discussion about the importance of updating data treatment policies according to what is sensitive data and what is not. It also mentions that ImpactU does not violate sensitive data and only publishes academic information from open databases and non-sensitive institutional data.
 * - A statement that ImpactU follows FAIR policies in data treatment, which obliges it to offer standardized information that can be consulted by any institution and guarantees temporal continuity in data collection.
 *
 * The list includes points for institutions to consider when participating in a CRIS-type system, such as the need for data to be related to clear identifiers and provenances and descents, the need for fields used to organize proprietary information to be translated to the ImpactU standard to be processed, and the ideal format for data delivery.
 *
 * @returns {JSX.Element} A fragment containing multiple paragraph elements and an unordered list. Each paragraph and list item represents a part of the text section or list.
 */
export default function Ocho() {
  return (
    <>
      <p className={styles.normal_text}>
        <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b> recupera información de diferentes bases de datos
        internas y externas y robustece un sistema de información compuesto por
        bases de datos que pueden intercomunicarse al ser traducidas a un
        protocolo común. Esta información queda a disposición institucional para
        su uso.
      </p>
      <p className={styles.normal_text}>
        La información queda almacenada en servidores de la Universidad de
        Antioquia con posibilidad de hacer copias exactas de la información en
        servidores institucionales de las instituciones que lo soliciten. Esto
        permite un mayor control sobre la información disponible en bases de
        datos dispersas. Toda la información confidencial es protegida de
        acuerdo con las leyes colombianas y las reservas de las instituciones
        participantes.
      </p>
      <p className={styles.normal_text}>
        Por ello es importantes que las políticas de tratamiento de datos se
        actualicen de acuerdo a qué es un dato sensible y qué no lo es.{" "}
        <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b> no vulnera datos sensibles. Se publica
        información académica proveniente de bases de datos abiertas y datos
        institucionales no sensibles.
      </p>
      <p className={styles.normal_text}>
        <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b> sigue políticas <b>FAIR</b> en el tratamiento de
        datos. Esto nos obliga a ofrecer información estandarizada que pueda ser
        consultada por cualquier institución y se pueda garantizar continuidad
        temporal en la recolección de datos.
      </p>
      <p className={styles.normal_text}>
        Finalmente, las instituciones participantes en la alianza deben
        considerar los siguientes puntos para participar un sistema tipo{" "}
        <b>CRIS</b>:
      </p>
      <ul className={styles.normal_text}>
        <li>
          Los datos deben procurar estar relacionados con identificadores y
          procedencias y decendencias claras.
        </li>
        <li>
          Los campos utilizados para organizar la información propios deben ser
          traducidos al estándar <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b> para poder ser procesados.
        </li>
        <li>
          El formato ideal para la entrega de datos sería <b>JSON</b> con
          algunas especificaciones en el formato de nombres, fechas, entre otras
          categorías. Sin embargo, es posible entregar los datos en otros
          formatos como archivos con extensión <b>CSV</b> o bases de datos los
          cuales deben ser discutidos por el equipo de desarrollo.
        </li>
      </ul>
    </>
  );
}
