/* Styles */
import styles from "./styles.module.css";

/**
 * Uno is a server-side functional component that renders a section of text describing the ImpactU strategy.
 *
 * The text section includes:
 * - A description of the ImpactU strategy and its aspects.
 * - Information about who develops ImpactU.
 * - Details about the initiative's coordination and its two central instances: the development team and the responsible metrics team.
 * - An invitation for other universities and research centers to use ImpactU's services or participate in the cooperative development strategy.
 * - Contact information for more details about the strategy.
 * - A question about what solutions ImpactU offers, to be followed by a list of solutions.
 *
 * @returns {JSX.Element} A fragment containing multiple paragraph elements and heading elements. Each paragraph and heading represents a part of the text section.
 */
export default function Uno() {
  return (
    <>
      <p className={styles.normal_text}>
        Es una estrategia para mejorar los procesos evaluativos, de seguimiento
        y toma de decisiones en las instituciones que tengan como misión
        sustantiva la investigación. <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b> contempla los siguientes aspectos: procesos
        basados en principios de métricas, evaluación responsable, gobernanza
        sobre los datos institucionales orientado a la ciencia abierta y la
        disposición de plataformas tipo <b>CRIS</b>.
      </p>
      <h3 className={styles.subTitle}>
        1.1. ¿Quiénes desarrollan <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b>?
      </h3>
      <p className={styles.normal_text}>
        Es una estrategia liderada por las vicerrectorías y direcciones de
        investigación, en conjunto con grupos de investigación dedicados al
        desarrollo computacional y los estudios sociales de la ciencia. Las
        Universidades que participan son: la Universidad de Antioquia, la
        Universidad Externado de Colombia, la Universidad del Valle y la
        Universidad Autónoma Latinoamericana.
      </p>
      <p className={styles.normal_text}>
        La iniciativa es coordinada por el Colaboratorio de Ciencias Sociales
        Computacionales y Humanidades Digitales (CoLaV) de la Universidad de
        Antioquia y está compuesto de dos instancias centrales: el equipo de
        desarrollo y el equipo de métricas responsables. La primera genera los
        desarrollos de <i>software</i>, procesamientos de datos y estrategias de
        almacenamiento y procesamiento necesarias. En este participan
        investigadores, personal técnico y desarrolladores de las 4
        instituciones. La segunda discute las estrategias de seguimiento y
        evaluación que adoptan las instituciones y la forma de democratizar cada
        vez más el uso de <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b>.
      </p>
      <p className={styles.normal_text}>
        <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b> es una propuesta abierta a las universidades y
        centros de investigación que requieren evaluar y dar seguimiento a sus
        decisiones sobre el desarrollo de la investigación. Esto implica que
        cualquier institución puede hacer uso de uno o varios de los servicios
        puestos en abierto por <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b> o hacer parte de la estrategia cooperativa de
        desarrollo y sostenimiento de la estrategia. Para más información sobre
        la estrategia puede comunicarse con alguna de las vicerrectorías o
        direcciones de investigación de las instituciones participantes o
        escribir a{" "}
        <a href="mailto:grupocolav@udea.edu.co">grupocolav@udea.edu.co</a>
      </p>
      <h3 className={styles.subTitle}>
        1.2. ¿Qué soluciones ofrece <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b>?
      </h3>
      <p className={styles.normal_text}>
        Las soluciones que ofrece <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b> a la evaluación y seguimiento de la investigación
        son las siguientes:
      </p>
      <p className={styles.subText}>
        Diseño de protocolos y estándares para hacer evaluación y seguimiento de
        acuerdo con requerimientos internos (desempeño de la investigación de
        acuerdo con objetivos) y externos (rúbricas y <i>ránkings</i>).
      </p>
      <p className={styles.normal_text}>
        El diseño de la plataforma implica la inclusión de indicadores y fuentes
        de datos que se acomodan a las necesidades de evidencia para la
        evaluación. En este sentido, el equipo de interinstitucional de
        vicerrectorías, direcciones y equipos de investigación, definen rutas y
        protocolos requeridos para generar estadísticas que sean fuente de
        información y den continuidad a los procesos de seguimiento y gestión.
      </p>
      <p className={styles.normal_text}>
        El equipo interinstitucional opera de manera cooperativa y se alimenta
        de las experiencias de cada uno de los miembros administrativos y de
        grupos de investigación.
      </p>
      <p className={styles.subText}>
        Toma de decisiones basadas en evidencias.
      </p>
      <p className={styles.normal_text}>
        Acompañamiento a los organismos decisores y consultivos en el diseño de
        estrategias para evaluar y hacer seguimiento a las decisiones tomadas y
        apoyar con información confiable las nuevas decisiones.
      </p>
      <p className={styles.subText}>
        Disminución de costos operacionales para cumplir requerimientos
        evaluativos y de seguimiento.
      </p>
      <p className={styles.normal_text}>
        <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b> tiene un modelo organizacional que considera
        reducir sustancialmente los gastos en obtención de información,
        procesamiento y visualización, a la par, propone un ejercicio
        cooperativo entre instituciones para compartir los costos de diseño y
        sostenibilidad de la estrategia. Esto permite generar una economía de
        escala, en la que las instituciones participantes hacen una inversión
        que cubre gastos operacionales y cuyo valor disminuye de acuerdo con el
        número de participantes.
      </p>
      <p className={styles.subText}>
        Aprendizaje colectivo de instituciones participantes en el diseño,
        manejo de información, generación de estrategias evaluativas y de
        seguimiento.
      </p>
      <p className={styles.normal_text}>
        La estrategia <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b> es dirigida y coordinada por instituciones
        académicas. En su formulación y desarrollo participan personas de
        equipos administrativos e investigativos de las instituciones
        participantes. Parte importante de los esfuerzos de cooperación están
        centrados en compartir experiencias que permitan solucionar problemas de
        desarrollo y de estrategias para la evaluación. Todo esto, articulándolo
        con el direccionamiento estratégico de las instituciones, sus modelos de
        gestión para el logro de sus propósitos en materia de investigación.
      </p>
      <p className={styles.subText}>
        Diseño de estrategias colectivas para suplir necesidades de
        procesamiento computacional.
      </p>
      <p className={styles.normal_text}>
        Las instituciones participantes ponen a disposición de la plataforma su
        experiencia e infraestructuras para construir una estrategia de
        almacenamiento y procesamiento de la información de acuerdo con las
        capacidades existentes y las necesidades de procesamiento. En la fase
        actual, la Universidad de Antioquia pone un servidor propio para el
        almacenamiento y procesamiento de la información, se apoya en equipos de
        la Universidad Externado de Colombia para el desarrollo de algunos
        procesamientos, la plataforma se publica en un servicio en la nube y se
        utilizan plataformas públicas para la publicación de <i>software</i> y
        APIs.
      </p>
      <h3 className={styles.subTitle}>1.3. ¿Qué principios nos rigen?</h3>
      <p className={styles.subText}>
        <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b> es una estrategia de ciencia abierta que
        considera los siguientes principios:
      </p>
      <ul className={styles.normal_text}>
        <li>
          Priorizar el trabajo con la obtención y divulgación de datos abiertos,
          proteger los datos sensibles institucionales y personales, y mejorar
          la cantidad y calidad de los registros disponibles para caracterizar
          el desempeño de la investigación. Los datos libres se pueden consultar
          en la plataforma de APIs Colav{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://apis.colav.co/apidoc/index.html"
          >
            https://apis.colav.co/apidoc/index.html
          </a>
        </li>
        <li>
          Desarrollar <i>software</i> propio y de código abierto para que las
          instituciones puedan implementar sus propios procesos o hacer uso
          libre de los productos diseñados para Colombia, como la plataforma{" "}
          <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b>, o el <i>software</i> diseñado en el
          repositorio de GitHub del Colav{" "}
          <a target="_blank" rel="noreferrer" href="https://github.com/colav/">
            https://github.com/colav/
          </a>
          .
        </li>
        <li>
          Proponer estrategias colaborativas para el almacenamiento y
          procesamiento de la información utilizando hardware propio de las
          instituciones participantes y servicios en la nube que optimicen y
          reduzcan costos operacionales.
        </li>
        <li>
          Desarrollar <i>software</i> a la medida que puede ser utilizado de
          manera libre por cualquier usuario. <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b> hace todos sus desarrollos in house. Estos
          están disponibles en código abierto en la plataforma de GitHub{" "}
          <a target="_blank" rel="noreferrer" href="https://github.com/colav/">
            https://github.com/colav/
          </a>{" "}
          Estos <i>softwares</i> dan servicio a la plataforma tipo <b>CRIS</b>{" "}
          de <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b> y pueden ser usados por cualquier institución
          para resolver sus necesidades a demanda. Así mismo, la plataforma
          puede ser usada no sólo por las instituciones cooperantes en{" "}
          <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b>, sino por cualquier institución a la que puedan
          servir los datos dispuestos.
        </li>
      </ul>
      <p className={styles.normal_text}>
        Su visión es generar estrategias cooperativas nacionales entre todos los
        actores que tienen entre sus misiones la investigación para hacer
        seguimiento y evaluación orientada al desarrollo de sus organizaciones y
        del país, así como apoyar y colaborar con organizaciones de otros países
        en la región y sus sistemas tipo <b>CRIS</b> en sus procesos evaluativos
        y de generación de métricas de la ciencia de manera responsable.
      </p>
    </>
  );
}
