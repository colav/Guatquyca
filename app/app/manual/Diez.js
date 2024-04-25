/* Next */
import Image from "next/image";

/* Styles */
import styles from "./styles.module.css";

/**
 * Diez is a server-side functional component that renders a section of text, two images, and a list describing the features of the ImpactU platform.
 *
 * The text sections include:
 * - A description of the search capabilities of ImpactU, including the ability to search for metrics of researchers, research groups, faculties, and institutions, as well as by document type. It also mentions the future ability to consult startups, agreements, or research projects.
 * - A description of the result of the search, which displays a control panel with four types of graphs or data visualization (bars, pies or treemaps, graphs, choropleth maps).
 *
 * The images show the home page of ImpactU and the control panel.
 *
 * The list includes descriptions of the four types of graphs or data visualization: bar graphs, pie charts and treemaps, choropleth maps, and graphs.
 *
 * @returns {JSX.Element} A fragment containing multiple paragraph elements, two images, and an unordered list. Each paragraph, image, and list item represents a part of the text sections, images, or list.
 */
export default function Diez() {
  return (
    <>
      <p className={styles.normal_text}>
        Al entrar a <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b>{" "}
        <a target="_blank" rel="noreferrer" href="https://impactu.colav.co">
          (https://impactu.colav.co)
        </a>{" "}
        se pueden realizar búsqueda de métricas de investigadores, grupos de
        investigación, facultades e instituciones. También ofrece búsqueda por
        tipo documental, es decir: por producto resultado de investigación. En
        un futuro se podrán consultar emprendimientos, convenios o proyectos de
        investigación.
      </p>
      <Image
        src="/media/10_1.png"
        alt="ImpactU Home"
        width={1330}
        height={584}
        className={styles.img}
        quality={100}
      />
      <p className={styles.normal_text}>
        El resultado de la búsqueda despliega un tablero de control con cuatro
        tipos de gráficas o visualización de datos (barras, tortas o treemap,
        grafos, mapas coropléticos)
      </p>
      <Image
        src="/media/10_2.png"
        alt="ImpactU Tablero"
        width={1330}
        height={742}
        className={styles.img}
        quality={100}
      />
      <ul className={styles.normal_text}>
        <li>
          Las gráficas de barras: presentan indicadores de evolución temporal de
          productividad, citación, acceso y costos de APC.
        </li>
        <li>
          Las gráficas de tortas y treemaps: presentan indicadores de
          distribución temática, preferencia editorial, procedencia de la
          información, categorías de revistas e investigadores, rango de edad.
        </li>
        <li>
          Los mapas coropléticos presentan la distribución de la producción de
          acuerdo con la colaboración entre países y departamentos.
        </li>
        <li>
          El grafo muestra las relaciones de coautoría, cocreación y
          colaboración personal e institucional.
        </li>
      </ul>
      <h3 className={styles.subTitle}>10.1. Resultados de métricas</h3>
      <p className={styles.normal_text}>
        Se presenta un ejemplo con la entidad autor, pero los procedimientos
        pueden ser replicados en las otras entidades: institución, grupo, unidad
        o subunidad académica.
      </p>
      <p className={styles.normal_text}>
        En el motor de búsqueda, elegimos “autor” para encontrar métricas de
        investigadores.
      </p>
      <p className={styles.normal_text}>
        Para asegurar resultados más precisos se sugiere buscar con comillas
      </p>
      <Image
        src="/media/10_3.png"
        alt="ImpactU Búsqueda"
        width={974}
        height={250}
        className={styles.img}
        quality={100}
      />
      <p className={styles.normal_text}>
        Dada la gran cantidad de bases de datos utilizadas, la normalización de
        nombres de los investigadores es compleja, por tanto, se debe
        seleccionar el nombre que cuente con los identificadores únicos por
        autor: ORCID, CvLac, Id Scopus, entre otros.
      </p>
      <p className={styles.normal_text}>
        Las afiliaciones como: institución, instituto o departamento y grupos de
        investigación a los que pertenece el investigador no son estáticas,
        redireccionan al perfil y métricas disponibles para cada una. Así mismo
        los identificadores externos también pueden ser seleccionados.
      </p>
      <Image
        src="/media/10_4.png"
        alt="ImpactU Resultado de Búsqueda"
        width={1500}
        height={420}
        className={styles.img}
        quality={100}
      />
      <p className={styles.normal_text}>
        Al abrir el perfil del investigador, encontramos las métricas asociadas
        a: Investigación/Productos. En un futuro, podrá también acceder a
        Extensión, Cooperación, Proyectos y Noticias. De éstas, en la versión
        3.1.0-beta solo hay métricas asociadas a Investigación y Productos.
      </p>
      <Image
        src="/media/10_5.png"
        alt="ImpactU Perfil de Investigador"
        width={1500}
        height={390}
        className={styles.img}
        quality={100}
      />
      <p className={styles.normal_text}>
        A continuación, se mostrará el pánel de indicadores y métricas con
        cuatro tipo de gráficos disponibles para consulta de los investigadores
        y entidades, (1) Gráficas de columnas y columnas apiladas, (2) Gráficos
        de tortas y treemaps, (3) Mapas coropléticos y (4) Grafos de coautoría.
      </p>
      <Image
        src="/media/10_6.png"
        alt="Gráfico de barras"
        width={900}
        height={518}
        className={styles.img}
        quality={100}
      />
      <p className={styles.normal_text}>
        Las métricas representadas en las gráficas de barras disponibles son:
      </p>
      <ul className={styles.normal_text}>
        <li>
          Evolución anual de la producción según la clasificación anual de
          ScienTI
        </li>
        <li>Cantidad de citas anuales</li>
        <li>Gastos anuales en APC</li>
        <li>Artículos anuales en acceso abierto y cerrado</li>
        <li>Artículos anuales publicados en las editoriales más usadas</li>
        <li>Indice h según los datos de citación de OpenAlex</li>
      </ul>
      <p className={styles.normal_text}>
        Estas métricas pueden depurarse por temporalidad.
      </p>
      <Image
        src="/media/10_7.png"
        alt="Gráfico de TreeMap"
        width={900}
        height={518}
        className={styles.img}
        quality={100}
      />
      <p className={styles.normal_text}>
        Las métricas representadas en las gráficas de tortas y treemaps
        disponibles son:
      </p>
      <ul className={styles.normal_text}>
        <li>20 palabras más usuales en los títulos de la producción</li>
        <li>Artículos según editorial</li>
        <li>Artículos según tema</li>
        <li>Productos según base de datos de origen</li>
        <li>Artículos según tipo de acceso abierto</li>
        <li>Artículos según categoría asignada en el ScienTI</li>
        <li>Artículos en revistas rankeadas en cuartiles de Scimago</li>
        <li>Artículos en revistas de la misma institución del autor</li>
      </ul>
      <Image
        src="/media/10_8.png"
        alt="Mapa Coroplético"
        width={900}
        height={480}
        className={styles.img}
        quality={100}
      />
      <p className={styles.normal_text}>
        Las métricas representadas en las gráficas de mapas coropléticos
        disponibles son:
      </p>
      <ul className={styles.normal_text}>
        <li>Coautorías según país de afiliación</li>
        <li>Coautorías según afiliación territorial departamental</li>
      </ul>
      <Image
        src="/media/10_9.png"
        alt="Grafo de Coautoría"
        width={900}
        height={480}
        className={styles.img}
        quality={100}
      />
      <p className={styles.normal_text}>
        Los grafos de coautoría representan las redes de colaboración científica
        por grado de coautorías que comparte el investigador.
      </p>
      <p className={styles.normal_text}>
        Por último, se muestra el listado de artículos del investigador con los
        metadatos de indexación y sus coautores: título, autores, temas, fecha,
        tipo de acceso (abierto o cerrado) y cantidad de citaciones.
      </p>
      <Image
        src="/media/10_11.png"
        alt="Metadatos de Artículo"
        width={1000}
        height={660}
        className={styles.img}
        quality={100}
      />
    </>
  );
}
