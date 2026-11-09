/**
 * Visible texts and fixed layouts of Board 2 (taken from the published artifact; D-102).
 * The state of the evidence of the Eje Temático is not named in any screen.
 */

/* Numbers of the notes come from the constants of the calculation, not from the text. */
import { GRAPH_MIN_EDGE, LIMITS } from "../../../../../lib/observatories/collaboration/constants";
import { INCOMPLETE_YEARS_NOTE, POLICY_DOCUMENTS } from "../../board-1/components/boardTexts";

export const BOARD_TITLE = "Colaboración, redes y hélices";

export const BOARD_EYEBROW = "Universidad de Antioquia · Vicerrectoría de Investigación · Capacidades 2026";

export const BOARD_LEAD =
  `Los indicadores de este tablero sintetizan las demandas, metas y programas que, en doce documentos de política (${POLICY_DOCUMENTS.join("; ")}), mencionan la cooperación, el capital social y las formas de relación deseables: triple y cuádruple hélice, cooperación entre territorios e investigación colaborativa. No responde a cada indicador de cada meta; caracteriza cómo colabora la Universidad y con quién.`;

export const MOCK_TAG = "Datos de prueba";

/** Notes of method of the board with test data (Q-22, Q-24: written as method, not as warnings). */
export const NOTICE_NOTES = [
  "El filtro por documento de política delimita los productos que el panel de jueces asignó a alguno de sus ejes (confianza alta o media).",
  "El panel 14 (ránking por Eje Temático) se basa en los ejes curados del catálogo de Ejes Temáticos y en los tópicos de OpenAlex v2 (8 de los 12 documentos tienen ejes; los otros 4 solo aportan metas de colaboración).",
  "La base no contiene patentes; la mayoría de los productos tiene resumen, pero las menciones a IAP y a subregión se buscan solo en el título; la apropiación social no tiene año.",
  "El tipo de cada organización sale de la clasificación de ROR y OpenAlex, del catálogo revisado de organizaciones de la Universidad y, cuando esas fuentes no lo dicen, de reglas sobre el nombre; puede haber errores. El departamento de cada institución colombiana se asigna igualmente por el nombre.",
  INCOMPLETE_YEARS_NOTE,
  "«Alcaldía de Medellín» puede ser un error de afiliación de OpenAlex.",
];
export const NOTICE = NOTICE_NOTES.join(" ");

export const FOOTER_TEXT =
  "Fuentes: obras, autores, grupos, tópicos e instituciones coautoras de ImpactU, OpenAlex y ScienTI; listado de proyectos de la VRI-UdeA con corte al 3 de julio de 2025 (SIIU); registro de grupos de investigación y centros de la UdeA; ejes curados y metas de colaboración del catálogo de Ejes Temáticos. SIIU: sistema donde la Universidad registra oficialmente sus proyectos. ScienTI: plataforma de Minciencias donde se registran grupos, investigadores y productos. Universo: artículos, libros y capítulos 2010–2026 y productos de innovación y apropiación (todos los años). Problemas detectados en las bases: registros con DOI o título repetido; productos elegibles sin año (excluidos salvo apropiación social); una misma institución con hasta cuatro identificadores (ROR, scienti_, snies_); nombres de instituciones en galés, vasco o finés; NIT de aportantes con dígitos de más y razones sociales genéricas en el listado de proyectos.";

/* Filter of Eje Temático (F59, D-159); provisional texts. */
export const AXIS_FILTER_NOTE =
  "El filtro de eje se aplica a artículos, libros y capítulos, y a proyectos, con eje asignado por nuestra metodología (confianza alta o media). La apropiación social no tiene eje: no se cuenta. El documento solo limita los ejes disponibles.";
/* Same note for a bundle without pairs of projects (before B121). */
export const AXIS_FILTER_NOTE_NO_PROJECTS =
  "El filtro de eje solo se aplica a artículos, libros y capítulos con eje asignado por nuestra metodología (confianza alta o media). La apropiación social y los proyectos no tienen eje: no se cuentan en la apropiación y no cambian en los proyectos. El documento solo limita los ejes disponibles.";
/** Indicator 7, appropriation with company or non-profit (F72, D-175 (4)(g)): the source only registers co-authors of the education sector. */
/** Help of the filter Documento (F74, D-177). Provisional text. */
export const DOCUMENT_FILTER_HELP = "El documento delimita los productos que el panel de jueces asignó a alguno de sus ejes (confianza alta o media). Un producto sin eje asignado no cuenta aunque su tópico principal sea del documento. Los proyectos siguen el mismo criterio por sus propios pares.";
export const NO_AXIS_RESPONSE = "no responde al eje";
/** Years of social appropriation (F69): the figures come from the bundle, not from the text. */
export const appropriationYearNote = (without, total) => `Apropiación social: ${without.toLocaleString("es-CO")} de ${total.toLocaleString("es-CO")} registros no tienen año.`;
/** Foci of the Misión de sabios (F69): the number comes from the bundle. */
export const missionFociNote = (n) => `Los ${n} focos de la Misión de sabios abarcan cientos de tópicos cada uno, por lo que se muestran aparte.`;
export const smallProjectsNote = (n) => `Muestra pequeña: ${n} proyectos con el eje elegido en este panel. Las cifras pueden cambiar mucho con pocos proyectos.`;
export const smallSampleNote = (n) => `Muestra pequeña: ${n} productos con el eje elegido en este panel. Las cifras pueden cambiar mucho con pocos productos.`;
export const AXIS_14_NOTE = "Con un eje elegido solo se muestra ese eje, contado con la misma definición del filtro (productos con eje asignado de confianza alta o media), no por tópico principal; sin eje elegido se cuenta por los tópicos del eje.";

export const SCOPE_OPTIONS = [
  { value: "local", label: "Local (coautor en Antioquia)" },
  { value: "dep", label: "Departamental (subregión de Antioquia en el título, sin el Valle de Aburrá)" },
  { value: "nal", label: "Nacional (coautor de otros departamentos)" },
  { value: "int", label: "Internacional (coautor extranjero)" },
];

/* Notes of each panel (as in the artifact). */
export const NOTES = {
  v2: `Se muestran los ${LIMITS.graphNodes} grupos con mayor grado ponderado y aristas con ${GRAPH_MIN_EDGE} o más productos.`,
  v5b: "Proyectos: SIIU, 2014–2025.",
  v6Patents: "Producción de tecnología: patentes distintas del portafolio de propiedad intelectual con al menos una empresa titular (cotitularidad registrada en el portafolio; no indica quién co-inventó). Responden a años, centro y unidad.",
  /* The last year comes from the bundle (F85, M-06): `result.patentsLastYear`. */
  v5bPatents: (lastYear) => `Patentes: patentes distintas del portafolio de propiedad intelectual, por año de la primera concesión${lastYear ? `; la última concesión es de ${lastYear}, por eso no hay datos después de ese año` : ""}.`,
  v6: "Bibliográfica: artículos con coautores de empresa y gobierno además de la UdeA. Proyectos: con aportante empresarial y aportante público. Producción de tecnología: la base no contiene patentes (0 registros con tipo patente).",
  v7: "Bibliográfica: artículos con empresa, sin ánimo de lucro y gobierno. Proyectos: empresa, sin ánimo de lucro y fondos públicos.",
  v8: "Mención de «investigación-acción (participativa)» o «action research» en títulos de productos y en nombre, objetivos o palabras clave de proyectos. En los productos se busca solo en el título; los resúmenes no se usan.",
  v16: "Aportantes externos de proyectos SIIU 2014–2025, por número de proyectos. La clasificación sectorial es heurística. Este ránking no responde a los filtros (se calcula sobre todos los proyectos 2014–2025).",
  v16Filtered: "Aportantes externos de proyectos SIIU 2014–2025, por número de proyectos que pasan los filtros de proyectos (años, centro, ámbito departamental, eje y documento). La clasificación sectorial es heurística.",
};
export const patentsIgnoredNote = (list) => `Las patentes no responden a: ${list.join(", ")}.`;

export const SIDE_LABELS = { north: "Norte global", south: "Sur global" };

/** Tag of the board when the data come from the API (provisional text, Luis approves it). */
export const REAL_TAG = "Datos de ImpactU";

/** Footer with the sources of the data of the API (provisional text, Luis approves it). */
export const REAL_FOOTER_TEXT =
  "SIIU: sistema donde la Universidad registra oficialmente sus proyectos. Universo: artículos, libros y capítulos 2010–2026 y productos de apropiación social (todos los años). Las menciones a IAP y a subregión se estiman por reglas sobre el título y los países sin contorno en el mapa se listan en la ayuda «?» de su panel.";


/** Note of the amounts of the ranking of funders (Q-28 iv, D-207; F94). Provisional for Luis. */
export const MONEY_NOTE = "Montos en pesos colombianos (COP) según el registro de proyectos de la Universidad.";

/**
 * Notes of method of the board with the data of the API (Q-22, Q-24; before, the notice «Ensayo con limitaciones de datos»): every
 * figure is calculated from the bundle. It drops the sentence on «Alcaldía de Medellín» (562 products): the bundle has no
 * institution with that name, so it cannot be confirmed.
 *
 * @param {{ documentsWithTerms: number, documents: number, appropriationWithoutYear: number, appropriation: number }} figures
 * @returns {string[]}
 */
export function realNotes({ documentsWithTerms, documents, appropriationWithoutYear, appropriation }) {
  const fmt = (n) => n.toLocaleString("es-CO");
  return [
    "El filtro por documento de política delimita los productos que el panel de jueces asignó a alguno de sus ejes (confianza alta o media).",
    `El panel 14 (ránking por Eje Temático) se basa en los ejes curados del catálogo de Ejes Temáticos y en los tópicos de OpenAlex v2 (${documentsWithTerms} de los ${documents} documentos tienen ejes; los otros ${documents - documentsWithTerms} solo aportan metas de colaboración).`,
    "Las patentes salen del portafolio de propiedad intelectual (patentes distintas, no el contador de Minciencias).",
    `${fmt(appropriationWithoutYear)} de ${fmt(appropriation)} productos de apropiación social no tienen año (cuentan en los totales y no en las series por año).`,
    "El tipo de cada organización sale de la clasificación de ROR y OpenAlex, del catálogo revisado de organizaciones de la Universidad y, cuando esas fuentes no lo dicen, de reglas sobre el nombre; puede haber errores. El departamento de cada institución colombiana se asigna igualmente por el nombre.",
    INCOMPLETE_YEARS_NOTE,
    MONEY_NOTE,
  ];
}

/** The same notes as one text (the tests read it). */
export const realNotice = (figures) => realNotes(figures).join(" ");
