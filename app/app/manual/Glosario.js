/* Styles */
import styles from "./styles.module.css";

/**
 * Glosario is a server-side functional component that renders a list of terms and their definitions.
 *
 * Each list item contains a term in bold, followed by its definition. Some definitions include additional terms in bold.
 *
 * @returns {JSX.Element} An unordered list element with the class "normal_text". Each list item represents a term and its definition.
 */
export default function Glosario() {
  return (
    <ul className={styles.normal_text}>
      <li>
        <b>API:</b> Por sus siglas en inglés, “Application Programming
        Interface” Interfaz de Programación de Aplicaciones, útiles para hacer
        intercomunicable la información entre diferentes plataformas y poderla
        consultar.
      </li>
      <li>
        <b>
          <b>CRIS</b>:
        </b>{" "}
        Por sus siglas en inglés, “Current Research Information System”, Sistema
        de Información de Investigación y Gestión de la Investigación que sirve
        para almacenar, administrar, intercambiar y visualizar datos relativos a
        la producción investigativa.
      </li>
      <li>
        <b>
          Data <i>storytelling</i>:
        </b>{" "}
        Es el proceso de convertir los datos en narraciones que puedan ser
        entendidos fácilmente para un proceso de toma de decisiones.
      </li>
      <li>
        <b>Datos abiertos:</b> Datos que provienen de los procesos de
        investigación abiertos al público en general a través de la web.
      </li>
      <li>
        <b>Estándares de evaluación:</b> Métricas utilizadas de manera
        generalizada por las instituciones para hacer evaluación de sus
        actividades.
      </li>
      <li>
        <b>Formato CSV:</b> Por sus siglas en inglés, "Comma-Separated Values",
        es un formato de archivo para almacenar datos tabulares en texto plano.
        Cada línea representa una fila y los valores de cada columna están
        separados por comas. Es simple y ampliamente compatible con distintos
        softwares.
      </li>
      <li>
        <b>Formato JSON:</b> Por sus siglas en inglés, “Java Script Object
        Notation”. Es un formato de lenguaje computacional para construir bases
        de datos no lineales orientadas a objetos.
      </li>
      <li>
        <b>FrontEnd:</b> Es la interfaz de usuario de una aplicación, donde los
        usuarios interactúan. Incluye diseño, navegación y elementos visuales
        que permiten una experiencia intuitiva y atractiva.
      </li>
      <li>
        <b>Gobernanza institucional sobre la información:</b> Son todas las
        políticas, estrategias y procedimientos orientados a conservar los datos
        institucionales como un patrimonio propio y que puedan ser operados de
        manera estratégica para la toma de decisiones institucionales.
      </li>
      <li>
        <b>Infraestructuras computacionales:</b> Conjunto de componentes físicos
        (Hardware) utilizados para el procesamiento de información en sistemas
        informáticos.
      </li>
      <li>
        <b>MongoDB:</b> Es un sistema de base de datos NoSQL (por sus siglas en
        inglés, "Not Only SQL" o "No Solo SQL": que no utilizan el modelo
        relacional de tablas), de código abierto y orientado a documentos.
      </li>
      <li>
        <b>Principios FAIR:</b> Por sus siglas en inglés, son principios de
        tratamiento de datos “Findable” (Encontrables), “Accesible”
        (Accesibles), “Intercommunicable” (Intercomunicables), “Reusable”
        (Reusables).
      </li>
      <li>
        <b>Protocolos de evaluación:</b> Procedimientos documentados sobre los
        procesos de evaluación de la investigación en relación con el entorno y
        otras misiones institucionales que permiten generar procedimientos
        periódicos para observar los avances institucionales en su desempeño
        investigativo.
      </li>
      <li>
        <b>Publindex:</b> índice colombiano de revistas científicas administrado
        por el Ministerio de Ciencia, Tecnología e Innovación en Colombia.
      </li>
      <li>
        <b>ScienTI:</b> Plataforma de información sobre la investigación en
        Colombia que sirve al modelo de medición de grupos e investigadores-as.
        Es administrado por el Ministerio de Ciencia, Tecnología e Innovación.
      </li>
      <li>
        <b>
          <i>Software</i> abierto:
        </b>{" "}
        Código abierto, utilizable por cualquier usuario que acceda a los
        repositorios de <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b>.
      </li>
      <li>
        <b>Toma de decisiones basadas en evidencia:</b> Decisiones
        institucionales que son respaldadas por la evidencia de instrumentos
        métricos y procesos de evaluación.
      </li>
    </ul>
  );
}
