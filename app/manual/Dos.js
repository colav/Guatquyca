/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Table } from "antd";

const tableDataSource = [
  {
    key: "1",
    principio: "Robustez",
    fuente: "Metric Tide",
    descripcion:
      "Las métricas deben estar basadas en los mejores datos posibles en términos de precisión y cobertura.",
  },
  {
    key: "2",
    principio: "Humildad",
    fuente: "Metric Tide Manifiesto de Leiden",
    descripcion:
      "La evaluación cuantitativa debe apoyar, pero no reemplazar el análisis cualitativo y experto.",
  },
  {
    key: "3",
    principio: "Transparencia",
    fuente: "Metric Tide DORA Manifiesto de Leiden",
    descripcion:
      "La recolección de datos y los procesos analíticos deben estar abiertos y transparentes, para que aquellos que son evaluados puedan verificar sus resultados. La transparencia también asiste a revisar la evaluación en el futuro en caso de que se cambien los indicadores.",
  },
  {
    key: "4",
    principio: "Diversidad",
    fuente: "Metric Tide DORA Manifiesto de Leiden",
    descripcion:
      "Las métricas deben dar cuenta de variedad por área, y usar una amplia cantidad de indicadores para dar cuenta de la pluralidad de la investigación y diversidad en las carreras de investigación a lo largo del sistema.",
  },
  {
    key: "5",
    principio: "Reflexividad",
    fuente: "Metric Tide Manifiesto de Leiden",
    descripcion:
      "Las métricas deben reconocer y anticipar los efectos potenciales y sistémicos de los indicadores, y actualizarlos de manera acorde.",
  },
  {
    key: "6",
    principio: "Selección colectiva",
    fuente: "Scope",
    descripcion:
      "La definición de las métricas debe ser un proceso construido de manera colaborativa entre usuarios, quienes son medidos, evaluadores y tomadores de decisión.",
  },
  {
    key: "7",
    principio: "Buenas prácticas",
    fuente: "Proyecto Métricas Responsables",
    descripcion:
      "La comunidad interactúa permanentemente para discutir, debatir y mejorar las métricas y su uso.",
  },
  {
    key: "8",
    principio: "Adaptación al contexto",
    fuente: "Manifiesto de Leiden",
    descripcion:
      "Las métricas contemplan el contexto y se ajustan para incorporar las características del sistema y las instituciones. Responsables al ambiente externo y deben ser actualizados para evitar el sesgo y abuso del indicador. Incluir información sobre las limitaciones, grado de incertidumbre, datos necesarios para la normalización y sobre las distribuciones de los datos.",
  },
  {
    key: "9",
    principio: "Mejora del sistema",
    fuente: "Proyecto Métricas Responsables",
    descripcion:
      "Las métricas proveen información para mejorar el funcionamiento del sistema para cumplir objetivos, apoyar la selección de personal y autoevaluar con fines de acreditar.",
  },
  {
    key: "10",
    principio: "Apertura",
    fuente: "DORA Manifiesto de Leiden",
    descripcion:
      "Proveer una licencia que permite el uso abierto de los datos y diseño de herramientas en código abierto. Es necesario que en la metodología de uso se vislumbren los aspectos de privacidad, confidencialidad y secreto industrial.",
  },
  {
    key: "11",
    principio: "Excelencia para la investigación de interés local",
    fuente: "Manifiesto de Leiden",
    descripcion:
      "Las métricas deben hacer visibles las investigaciones de interés local.",
  },
  {
    key: "12",
    principio: "Reproducible",
    fuente: "Sugimoto et al (2017)",
    descripcion:
      "Los indicadores deben ser reproducibles por quien emplea el indicador. Por ejemplo, se debe proveer información sobre cómo se identifican y como son acoplados los elementos citantes y citados.",
  },
  {
    key: "13",
    principio: "Entendibles",
    fuente: "",
    descripcion:
      "Deben ser comprensibles para las partes interesadas y evitar complejidad innecesaria. Se debe proveer explicaciones claras para interpretar indicadores complejos.",
  },
  {
    key: "14",
    principio: "Validez",
    fuente: "",
    descripcion:
      "Los indicadores deberían ser claramente conceptualizados y operacionalizados para reflejar de forma clara el concepto que es medido.",
  },
  {
    key: "15",
    principio: "Precisión",
    fuente: "Sugimoto et al (2017)",
    descripcion:
      "Construcción sobre datos con estándares de integridad de datos.",
  },
];

const columns = [
  {
    title: "Principio",
    dataIndex: "principio",
    key: "principio",
  },
  {
    title: "Fuente",
    dataIndex: "fuente",
    key: "fuente",
  },
  {
    title: "Descripción",
    dataIndex: "descripcion",
    key: "descripcion",
  },
];

/**
 * Dos is a server-side functional component that renders a section of text and a table of principles.
 *
 * The text section includes:
 * - A description of the decisions involved in planning the monitoring and evaluation of research activity.
 * - Information about the concept of metrics and responsible evaluation.
 * - Details about the responsibility of defining what should be evaluated and what should be excluded.
 * - A discussion about the conflicts resulting from measurements.
 *
 * The table of principles includes three columns: "Principle", "Source", and "Description". Each row represents a principle.
 *
 * @returns {JSX.Element} A fragment containing multiple paragraph elements and a table. Each paragraph represents a part of the text section. The table represents the principles.
 */
export default function Dos() {
  return (
    <>
      <p className={styles.normal_text}>
        Un conjunto de decisiones sobre la planeación del seguimiento y
        evaluación de la actividad investigativa. Las estrategias son
        responsables en tanto las herramientas de medición apoyen la toma de
        decisiones informada de acuerdo con los objetivos estratégicos y las
        funciones sustantivas institucionales en equilibrio con las demandas del
        entorno.
      </p>
      <p className={styles.normal_text}>
        El concepto de métricas y evaluación responsable a menudo se relaciona
        también con la rendición transparente de cuentas, la orientación
        institucional hacia misiones en la sociedad o la justicia epistémica
        entre disciplinas. Este modelo supone que la responsabilidad de definir
        lo que debe ser evaluado y lo que se debe excluir es un problema de las
        decisiones organizacionales sobre su orientación y debe considerar los
        intereses internos o externos particulares de grupos o individuos de
        acuerdo con su relevancia para el cumplimiento de la misión de la
        investigación. Los conflictos resultantes de las mediciones hacen parte
        de la dinámica de acuerdos sobre los propósitos y los fines últimos de
        la misión de investigación.
      </p>
      <p className={styles.normal_text}>
        En general, <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b> recoge parte importante de las recomendaciones
        internacionales y las sugiere como principios en el diseño de
        estrategias evaluativas como se observa en la siguiente tabla:
      </p>
      <Table
        dataSource={tableDataSource}
        columns={columns}
        pagination={false}
        bordered
      />
      <p className={styles.normal_text}>
        Tabla 1. Presentación de principios responsables recomendados por{" "}
        <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b>. Elaborado a partir de una primera versión de
        César Pallares y Alida Acosta.
      </p>
      <h3 className={styles.subTitle}>
        2.1. ¿Cuáles son los requerimientos para un programa de métricas y
        evaluación responsables de las instituciones?
      </h3>
      <p className={styles.normal_text}>
        Un programa de métricas y evaluación responsable al interior de las
        instituciones debería contar con:
      </p>
      <ul className={styles.normal_text}>
        <li>
          Un equipo de apoyo a la gestión que diseñe programas o protocolos de
          evaluación y seguimiento de acuerdo con los intereses de la
          organización.
        </li>
        <p>
          El diseño de instrumentos de seguimiento y evaluación requiere de
          personal dedicado a establecer las relaciones entre los propósitos
          organizacionales y los indicadores.
        </p>
        <li>
          Sistemas de información suficientes que permitan construir indicadores
          y procurar procesos eficientes de obtención y transformación de los
          datos.
        </li>
        <p>
          El equipo de apoyo de gestión deberá consolidar las múltiples bases de
          datos internas y externas que usualmente se encuentran dispersas y
          fragmentadas.
        </p>
        <p>
          La información de las bases de datos debe seguir principios{" "}
          <b>FAIR</b>, hacer intercomunicables los datos existentes que sirvan a
          la medición y disponer de sistemas de consulta que posibiliten hacer
          los cruces necesarios entre variables que permitan la consolidación de
          métricas.
        </p>
        <p>
          <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b> enriquece las bases de datos internas de las
          instituciones integrándolas con datos disponibles en sistemas de
          información externos de acceso abierto. Esta estrategia evalúa las
          mejores bases de datos disponibles, las contrasta con bases de datos
          comerciales y las mezcla con algunas bases de datos institucionales
          básicas, usándolas como por ejemplo, parala identificación de autores
          y dependencias académicas y administrativas, entre otros usos.
        </p>
        <li>
          Infraestructura informática y recursos humanos para el procesamiento
          de información.
        </li>
        <p>
          Para garantizar que los volúmenes de información y la necesidad de
          recuperar información de múltiples bases de datos sean
          intercomunicables requiere de tecnologías de procesamiento de la
          información y de personal especializado.
        </p>
      </ul>
    </>
  );
}
