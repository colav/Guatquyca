/* Styles */
import styles from "./styles.module.css";

/**
 * Siete is a server-side functional component that renders a section of text and two lists describing the dominant practices in institutions regarding research evaluation and monitoring, and the proposed solution to the challenges these practices present.
 *
 * The text sections include:
 * - A description of the dominant practices in institutions regarding research evaluation and monitoring.
 * - A proposal to integrate decision-making processes, possible indicators derived from program performance evaluation, and indicator demands from the environment through the construction of data storytelling.
 * - An explanation of what data storytelling is and what it requires.
 * - A description of what data storytelling collects.
 *
 * The first list includes the dominant practices in institutions regarding research evaluation and monitoring.
 *
 * The second list includes the requirements for constructing data storytelling.
 *
 * @returns {JSX.Element} A fragment containing multiple paragraph elements and two unordered lists. Each paragraph and list item represents a part of the text sections or lists.
 */
export default function Siete() {
  return (
    <>
      <p className={styles.normal_text}>
        Las prácticas dominantes en las instituciones respecto a la evaluación y
        seguimiento a la investigación pueden describirse en la siguiente
        manera:
      </p>
      <ul className={styles.normal_text}>
        <li>
          Las prácticas evaluativas internas están determinadas por los{" "}
          <i>ránkings</i>y las rúbricas externas.
        </li>
        <li>
          Los sistemas de información para la construcción de indicadores son
          precarios y poco intercomunicables.
        </li>
        <li>
          La información generada no responde a un sistema evaluativo único
          integrando requerimientos internos y externos para poder generar
          informes periódicos utilizables por los tomadores de decisiones.
        </li>
        <li>Evaluar requiere enormes costos para su implementación.</li>
      </ul>
      <p className={styles.normal_text}>
        Como solución a estos retos se propone integrar los procesos
        decisionales, a los posibles indicadores que se desprenden de la
        evaluación de desempeño de los programas, y a las demandas de
        indicadores del entorno a través de la construcción de{" "}
        <i>datastorytelling</i>.
      </p>
      <p className={styles.normal_text}>
        Los <i>datastorytelling</i> son narraciones que permiten orientar la
        construcción de indicadores que resuelven la falta de información sobre
        la evolución del cumplimiento de objetivos o de alcance de metas. Para
        su construcción se requiere de los siguientes elementos:
      </p>
      <ul className={styles.normal_text}>
        <li>
          Una persona designada por la entidad encargada de administrar la
          investigación en la institución.
        </li>
        <li>
          Un inventario de los objetivos y metas institucionales en materia de
          investigación.
        </li>
        <li>
          Un inventario de los indicadores para responder a procesos de
          evaluación y <i>ránkings</i> y rúbricas de acreditación.
        </li>
        <li>
          Compromiso institucional en el diseño de una estrategia de evaluación
          y seguimiento compuesta de diferentes <i>datastorytelling</i>.
        </li>
      </ul>
      <p className={styles.normal_text}>
        Los <i>datastorytelling</i> recogen un conjunto de indicadores
        disponibles en fichas que describan su uso, cálculo y actualización de
        la información. Estas fichas elegidas en el conjunto se transforman en
        historias de usuario que serán utilizadas por los desarrolladores para
        implementar la automatización del indicador. Si el indicador no se
        automatiza queda siempre la opción de descargar la información y
        construir un tablero de control propio en aplicaciones comerciales y de
        libre acceso disponibles en la web.
      </p>
      <p className={styles.normal_text}>
        Si quiere conocer más sobre <i>datastorytelling</i> puede consultar los
        siguientes enlace:
      </p>
      <ul className={styles.normal_text}>
        <li>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://youtu.be/JvWjgIJE77M"
          >
            <i>Data Storytelling</i>: Aprende a contar historias con datos.
          </a>
        </li>
        <li>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://youtu.be/l-CeHOM1xvY"
          >
            <i>Storytelling</i>: qué es y cómo usarlo para triunfar.
          </a>
        </li>
        <li>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://youtu.be/5SMn2-mrGa8"
          >
            ¿Qué tengo que hacer para contar historias con datos a mi
            audiencia?.
          </a>
        </li>
        <li>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://youtu.be/pO6FL6aAJ9s"
          >
            <i>Webinar</i> en visualización gráfica de datos.
          </a>
        </li>
      </ul>
      <p className={styles.normal_text}>
        Una vez construidos los <i>datastorytelling</i> se pueden elaborar
        informes periódicos y establecer series de tiempo para hacer seguimiento
        a la evolución de la investigación que permitan alimentar ciclos en toma
        de decisiones o presentación de resultados y balances de gestión.
      </p>
    </>
  );
}
