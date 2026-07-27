/* Next.js */
import dynamic from "next/dynamic";

/* Components */
import QualityMetrics from "./QualityMetrics";
import Loading from "../loading";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Divider } from "antd";

const MindMapChart = dynamic(
  () => import("@/app/components/ClientSide/Charts/MindMapChart/MindMapChart"),
  {
    ssr: false,
    loading: () => <Loading />,
  },
);

/* Charts */

export default function TabDatos() {
  return (
    <>
      <h3 className={styles.margin0}>
        Estructura de Datos de ImpactU: Explorando las Conexiones del
        Conocimiento
      </h3>
      <p>
        La plataforma <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b> está construida sobre <b>MongoDB</b>, una base de
        datos no relacional orientada a documentos que ofrece flexibilidad y
        escalabilidad para almacenar información compleja y heterogénea. A pesar
        de no utilizar un modelo relacional tradicional, el diseño de nuestros
        datos permite representar relaciones semánticas de forma explícita y
        navegable, facilitando análisis estructurados de alto valor.
      </p>
      <p>
        A través del grafo interactivo que aquí se presenta, los usuarios pueden
        explorar visualmente cómo se conectan personas, productos académicos,
        grupos de investigación, eventos, medios, fuentes y muchas otras
        entidades clave dentro del ecosistema de investigación institucional.
      </p>
      <p>
        Este grafo no solo expone la estructura interna de la base de datos,
        sino que <b>revela la riqueza y granularidad del dato:</b> cada nodo
        representa una entidad o un campo y cada conexión expresa una relación
        significativa que puede ser utilizada para responder preguntas basadas
        en evidencia, tales como:
      </p>
      <ul>
        <li>¿Qué tipos de productos están asociados a cada investigador?</li>
        <li>
          ¿Qué vínculos se pueden establecer entre grupos, publicaciones,
          fuentes o eventos?
        </li>
        <li>
          ¿Qué áreas de conocimiento se desarrollan y cómo se relacionan con los
          actores institucionales?
        </li>
      </ul>
      <p>
        Aunque MongoDB no es relacional por naturaleza, el modelo de datos de{" "}
        <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b> permite construir una visión relacional y
        semántica de la información. Esto se traduce en un entorno ideal para la
        construcción de indicadores, la toma de decisiones informadas y la
        trazabilidad completa del conocimiento institucional.
      </p>
      <p>
        Además, cada perfil consultado en la plataforma ofrece la posibilidad de
        descargar los listados completos de productos asociados, lo que facilita
        la reutilización, análisis o verificación externa de los datos
        presentados.
      </p>
      <p>
        Como parte de nuestro compromiso con el software libre y los datos
        abiertos, ponemos a disposición pública los releases de nuestro lago de
        datos a través del siguiente enlace:{" "}
        <a href="https://data.colav.co" target="_blank" rel="noreferrer">
          https://data.colav.co
        </a>
      </p>
      <p>
        Allí encontrará los dumps más recientes de nuestras bases, disponibles
        para descarga y uso libre bajo licencia abierta.{" "}
        <b>
          Es importante tener en cuenta que estos archivos no contienen ciertos
          campos sensibles, los cuales son utilizados únicamente en procesos
          internos de ETL y no se publican con el fin de respetar la
          normatividad vigente sobre protección de datos personales y los
          acuerdos interinstitucionales suscritos.
        </b>
      </p>
      <Divider />
      <h3 className={styles.margin0}>Calidad y completitud de los datos</h3>
      <p>
        Para garantizar la trazabilidad y mejora continua de la información,
        ImpactU publica un reporte de calidad de datos que se genera
        automáticamente al finalizar cada corrida del proceso ETL. Este reporte
        refleja el estado de completitud de cada colección —productos, autores,
        afiliaciones (Grupos de investigación, Unidades y Subunidades
        Académicas, Instituciones) y fuentes— midiendo qué proporción de los
        registros cuenta con campos clave como DOI, resumen, tipo normalizado,
        identificadores externos o clasificaciones de procedencia.
      </p>
      <p>
        El seguimiento histórico permite detectar regresiones, validar el
        impacto de nuevas fuentes de datos y evidenciar el crecimiento de la
        cobertura a lo largo del tiempo. Este reporte se inició con la ejecución
        del proceso ETL del primer semestre de 2026; los datos anteriores a esa
        fecha no están incluidos en el histórico.
      </p>
      <QualityMetrics />
      <Divider />
      <h3 className={styles.margin0}>Explorando el grafo de conocimiento</h3>
      <p>
        En <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b> creemos que la inteligencia institucional se
        construye desde datos bien estructurados, abiertos y conectados. Este
        grafo es una muestra de esa visión: una representación navegable del
        conocimiento, diseñada para ser explorada, comprendida y reutilizada.
      </p>
      <MindMapChart />
    </>
  );
}
