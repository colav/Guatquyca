/**
 * Visible texts and fixed layouts of Board 2 (taken from the published artifact; D-102).
 * The state of the evidence of the Eje Temático is not named in any screen.
 */

/* Numbers of the notes come from the constants of the calculation, not from the text. */
import { GRAPH_MIN_EDGE, LIMITS } from "../../../../../lib/observatories/collaboration/constants";

export const BOARD_TITLE = "Colaboración, redes y hélices";

export const BOARD_EYEBROW = "Universidad de Antioquia · Vicerrectoría de Investigación · Capacidades 2026 · Ensayo 1";

export const BOARD_LEAD =
  "Los indicadores de este tablero sintetizan las demandas, metas y programas que, en doce documentos de política, mencionan la cooperación, el capital social y las formas de relación deseables: triple y cuádruple hélice, cooperación entre territorios e investigación colaborativa. No responde a cada indicador de cada meta; caracteriza cómo colabora la Universidad y con quién.";

export const MOCK_TAG = "Datos de prueba · ensayo con limitaciones de datos";

export const NOTICE =
  "El filtro por documento de política y el ránking por Eje Temático (14) usan los términos Núcleo del thesaurus (6 de los 12 documentos tienen términos; los otros 6 solo aportan metas de colaboración) enlazados a tópicos OpenAlex por coincidencia de términos en títulos. La base no contiene patentes ni resúmenes; la apropiación social no tiene año; el sector de cada organización y el departamento de cada institución colombiana se asignaron por reglas sobre el nombre y deben revisarse. «Alcaldía de Medellín» (562 productos) parece un error de afiliación de OpenAlex y se marca para verificación.";

export const FOOTER_TEXT =
  "Fuentes: works, work_authors, work_groups, work_topics (ImpactU/OpenAlex/SCIENTI), instituciones_coautoras, ListadoProyectos03_de_julio.xlsx, BD_Grupos y Centros UdeA, Tableros_thesaurus_5.xlsx (términos Núcleo y metas de colaboración). Universo: artículos, libros y capítulos 2010–2026 y productos de innovación y apropiación (todos los años). Problemas detectados en las bases: 636 registros con DOI repetido y 4.697 con título repetido; 3.899 productos elegibles sin año (excluidos salvo apropiación social); una misma institución con hasta cuatro identificadores (ROR, scienti_, snies_); nombres de instituciones en galés, vasco o finés; NIT de aportantes con dígitos de más y razones sociales genéricas en el listado de proyectos.";

/* Filter of Eje Temático (F59, D-159); provisional texts. */
export const AXIS_FILTER_NOTE =
  "El filtro de eje solo se aplica a artículos, libros y capítulos con eje asignado por nuestra metodología (confianza alta o media). La apropiación social y los proyectos no tienen eje: no se cuentan en la apropiación y no cambian en los proyectos. El documento solo limita los ejes disponibles.";
export const NO_AXIS_RESPONSE = "no responde al eje";
export const smallSampleNote = (n) => `Muestra pequeña: ${n} productos con el eje elegido en este panel. Las cifras pueden cambiar mucho con pocos productos.`;
export const AXIS_14_NOTE = "Con un eje elegido solo se muestra ese eje, contado con la misma definición del filtro (productos con eje asignado de confianza alta o media), no por tópico principal; sin eje elegido se cuenta por los tópicos del eje.";

export const SCOPE_OPTIONS = [
  { value: "local", label: "Local" },
  { value: "dep", label: "Departamental" },
  { value: "nal", label: "Nacional" },
  { value: "int", label: "Internacional" },
];

/* Notes of each panel (as in the artifact). */
export const NOTES = {
  v1: "Subcampos OpenAlex con al menos un artículo del grupo (tópico primario). Grupos UdeA con 2 o más subcampos. Ránking descendente hasta 2 subcampos. La etiqueta indica también los campos distintos: participación en tópicos de campos diferentes es señal de transdisciplina.",
  v2: `Nodos: grupos UdeA; tamaño según centralidad de grado; grosor de la línea según productos compartidos (artículos, libros y capítulos). Se muestran los ${LIMITS.graphNodes} grupos con mayor grado ponderado y aristas con ${GRAPH_MIN_EDGE} o más productos.`,
  v3: "Productos por tipo (barras apiladas), 15 primeras. Sector asignado por reglas sobre el nombre; requiere revisión manual.",
  v4: "Un producto cuenta en cada sector presente entre sus coautores. «Salud (hospitales y clínicas)» se muestra como sector propio: no está en la tipología original pero es el principal socio no académico de la Universidad.",
  v5: "Artículos de revista por año de publicación.",
  v5b: "Haga clic en la leyenda para comparar series. Proyectos: año de inicio (SIIU, 2014–2025). Apropiación social: 735 de 752 registros no tienen año.",
  v6: "Bibliográfica: artículos con coautores de empresa y gobierno además de la UdeA. Proyectos: con aportante empresarial y aportante público. Producción de tecnología: la base no contiene patentes (0 registros con tipo patente).",
  v7: "Bibliográfica: artículos con empresa, sin ánimo de lucro y gobierno. Proyectos: empresa, sin ánimo de lucro y fondos públicos. Apropiación social: productos con empresa u organización sin ánimo de lucro.",
  v8: "Mención de «investigación-acción (participativa)» o «action research» en títulos de productos y en nombre, objetivos o palabras clave de proyectos. La base no incluye resúmenes.",
  v9: "Productos con coautores de instituciones colombianas, por departamento de la institución (sin la UdeA). Escala logarítmica de color.",
  v15: "Proyectos con lugar de ejecución en la subregión (SIIU) y productos cuyo título menciona la subregión o sus municipios.",
  v10: "Productos en coautoría con instituciones de otros países. Burbujas sobre centroides (mapa esquemático del ensayo).",
  v11: "Productos con coautoría del Norte global (Norteamérica, Europa, Asia y Oceanía del Norte) y del Sur global (América Latina y el Caribe, MENA, África Subsahariana, resto de Asia y Oceanía).",
  v13: "Libros, capítulos de libro y apropiación social (sin artículos) realizados con coautores de empresa, gobierno, sin ánimo de lucro o salud. Dominio = dominio OpenAlex dominante en la producción del grupo. Como referencia se añade la columna con cualquier coautor externo.",
  v14: "Colaboraciones por sector en los tópicos asociados a cada Eje Temático público del thesaurus (artículos, libros y capítulos; un producto cuenta en cada sector presente). Los ocho focos de la Misión de sabios abarcan cientos de tópicos cada uno, por lo que se muestran aparte.",
  v16: "Aportantes externos de proyectos SIIU 2014–2025, por número de proyectos. La clasificación sectorial es heurística. Este ránking no responde a los filtros (se calcula sobre todos los proyectos 2014–2025).",
};

/* Cartogram of Colombia (columns x rows, approximate positions) and of the subregions of Antioquia. */
export const COLOMBIA_TILES = {
  "San Andrés": [0, 0], "La Guajira": [5, 0], Atlántico: [3, 1], Magdalena: [4, 1], Cesar: [5, 1], Sucre: [2, 2], Bolívar: [3, 2],
  "Norte de Santander": [5, 2], Córdoba: [2, 3], Antioquia: [3, 3], Santander: [4, 3], Arauca: [6, 3], Chocó: [1, 4], Caldas: [2, 4],
  Boyacá: [4, 4], Casanare: [5, 4], Vichada: [7, 4], Risaralda: [1, 5], Quindío: [2, 5], Cundinamarca: [3, 5], "Bogotá D.C.": [4, 5],
  Tolima: [3, 6], "Valle del Cauca": [1, 6], Meta: [4, 6], Guainía: [7, 6], Cauca: [1, 7], Huila: [3, 7], Guaviare: [5, 7], Nariño: [1, 8],
  Putumayo: [2, 8], Caquetá: [4, 8], Vaupés: [6, 8], Amazonas: [5, 9],
};
export const COLOMBIA_GRID = { columns: 8, rows: 10 };

export const SUBREGION_TILES = {
  Urabá: [0, 0], "Bajo Cauca": [2, 0], Norte: [2, 1], Nordeste: [3, 1], Occidente: [1, 2], "Valle de Aburrá": [2, 2],
  "Magdalena Medio": [4, 2], Suroeste: [1, 3], Oriente: [3, 3],
};
export const SUBREGION_GRID = { columns: 5, rows: 4 };

const ABBREVIATIONS = {
  "Bogotá D.C.": "Bogotá", "Norte de Santander": "N. Sant.", "Valle del Cauca": "Valle", Cundinamarca: "Cund.", "San Andrés": "S. Andrés",
  "La Guajira": "Guajira", Santander: "Santand.", Magdalena: "Magd.", Risaralda: "Risar.", Putumayo: "Putum.", Casanare: "Casan.",
  Amazonas: "Amaz.", Atlántico: "Atlánt.", Antioquia: "Antioq.",
};
export const abbreviate = (name) => ABBREVIATIONS[name] || name;

export const SIDE_LABELS = { north: "Norte global", south: "Sur global" };

/** Tag of the board when the data come from the API (provisional text, Luis approves it). */
export const REAL_TAG = "Datos de ImpactU · ensayo con limitaciones de datos";

/** Footer with the sources of the data of the API (provisional text, Luis approves it). */
export const REAL_FOOTER_TEXT =
  "Fuentes: tablas del observatorio cargadas en ClickHouse a partir de ImpactU (obras, autoras y autores, grupos, instituciones coautoras y proyectos), tópicos de OpenAlex o del modelo v2 y el thesaurus de los documentos de política. Universo: artículos, libros y capítulos 2010–2026 y productos de apropiación social (todos los años; los que no tienen año cuentan en los totales y no entran en las series por año). Las menciones a IAP y a subregión se estiman por reglas sobre el título, el sector de cada organización se asigna por reglas sobre el nombre y los países sin coordenadas no aparecen en el mapa.";

export const NO_COORDINATES_NOTE = (count) => `${count} ${count === 1 ? "país con productos no aparece" : "países con productos no aparecen"} en el mapa porque no tienen coordenadas; sí cuentan en la tabla.`;

/**
 * Provisional version (for Luis, Q57) of the notice «Ensayo con limitaciones de datos» for the data
 * of the API: every figure is calculated from the bundle. It drops the sentence on «Alcaldía de
 * Medellín» (562 products): the bundle has no institution with that name, so it cannot be confirmed.
 *
 * @param {{ documentsWithTerms: number, documents: number, appropriationWithoutYear: number, appropriation: number }} figures
 * @returns {string}
 */
export function realNotice({ documentsWithTerms, documents, appropriationWithoutYear, appropriation }) {
  const fmt = (n) => n.toLocaleString("es-CO");
  return `El filtro por documento de política y el ránking por Eje Temático (14) usan los términos Núcleo del thesaurus (${documentsWithTerms} de los ${documents} documentos tienen términos; los otros ${documents - documentsWithTerms} solo aportan metas de colaboración) enlazados a tópicos OpenAlex por coincidencia de términos en títulos. La base no contiene patentes; ${fmt(appropriationWithoutYear)} de ${fmt(appropriation)} productos de apropiación social no tienen año (cuentan en los totales y no en las series por año); el sector de cada organización y el departamento de cada institución colombiana se asignaron por reglas sobre el nombre y deben revisarse.`;
}
