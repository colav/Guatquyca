import { MIN_TREND_VOLUME } from "@/lib/observatories/capacity/constants";
import { POLICY_DOCUMENTS, policyRank } from "@/lib/observatories/policyDocuments";

/**
 * Visible texts and fixed lists of Board 1 (taken from the published artifact; D-102).
 * The state of the evidence of the Eje Temático is not named in any screen.
 */

export const BOARD_TITLE = "Masa crítica temática: campos de conocimiento demandados";

export const BOARD_EYEBROW = "Universidad de Antioquia · Capacidades VRI 2026 · Ensayo";

export const BOARD_LEAD =
  "Capacidad de la UdeA para generar impacto con su propia producción en cada tópico de OpenAlex, medida en seis categorías (líder, consolidado, en consolidación, emergente, riesgo de desaparecer, sin producción) y asociada a los Ejes Temáticos de las agendas públicas.";

/** Lead of the board with the data of the API: eight categories (D-136, D-138), not the six of the artifact. Provisional text. */
export const BOARD_LEAD_REAL =
  "Capacidad de la UdeA para generar impacto con su propia producción en cada tópico de OpenAlex, medida en ocho categorías (líder, consolidado, en consolidación, emergente, riesgo de desaparecer, capacidad relativa baja, presencia puntual y sin producción) y asociada a los Ejes Temáticos de las agendas públicas.";

export const MOCK_TAG = "Datos de prueba · métrica de liderazgo provisional";

export const HELP_TEXT = [
  "Este tablero presenta las capacidades de la Universidad de Antioquia de generar impacto en diferentes investigaciones en el mundo con su propia producción. Se mide la capacidad de la Universidad en términos de seis categorías: líder, consolidado, en consolidación, riesgo de desaparecer, emergente y sin producción. El liderazgo se mide considerando el volumen de citas respecto a los más citados en el tema a nivel nacional y global y las tendencias crecientes y decrecientes de la producción en los últimos 5 años. La categoría más alta, el liderazgo, lo determina si la institución tiene el número de citas más alto y la producción creciente en los últimos 5 años, en un gradiente hasta obtener los temas en los que no hay producción.",
  "En esta versión el cociente «citas UdeA / institución más citada» no puede calcularse con las bases entregadas; se usa como proxy provisional el FWCI (citas por producto de la UdeA ÷ promedio mundial del tópico, acotado a 1). Los colores del gráfico: naranja = consolidado o líder (benchmark global); azul = en consolidación (provisional; en la versión final: consolidado/líder frente al benchmark nacional); blanco = resto.",
];

/* The twelve documents, in the order of Gabriel: single list in lib/observatories/policyDocuments.js (F69). */
export { POLICY_DOCUMENTS };

/** Filter ODS (F71): labels. Provisional texts for Luis. */
/** Help of the filters Ámbito and Documento (F74, D-177): the document delimits the products by the pairs product–axis. Provisional texts. */
export const DOCUMENT_FILTER_HELP = "El documento delimita los productos que el panel de jueces asignó a alguno de sus ejes, con la confianza del filtro «Confianza de la asignación a ejes». Un producto sin eje asignado no cuenta aunque su tópico esté vinculado.";
export const SCOPE_FILTER_HELP = "El ámbito es el nivel del documento de política y usa la misma regla con los ejes de los documentos de ese nivel.";
export const ODS_FILTER_LABEL = "Objetivo de Desarrollo Sostenible (ODS)";
export const ODS_FILTER_HELP = "Acota la dispersión, la calculadora y las tablas a los productos con ese ODS (puntaje de 0,40 o más). También se elige con un clic en el ránking o en el treemap de ODS.";
export const ODS_SELECTED_NOTE = (label, noRecord = 0) =>
  `ODS elegido: ${label}. Un clic en el mismo objetivo, o «Todos» en el filtro, lo quita.${noRecord > 0 ? ` Con un ODS elegido quedan fuera los ${noRecord.toLocaleString("es-CO")} productos sin registro en OpenAlex, que no tienen ODS.` : ""}`;

export const ALL_SCOPES = ["Local", "Departamental", "Nacional", "Internacional"];

/** Labels of the filter Ámbito of Board 1 (F69, X-01): here the scope is the level of the policy document of the axes. */
export const SCOPE_LABELS = {
  Local: "Local (documentos de política de Medellín)",
  Departamental: "Departamental (documentos de política de Antioquia)",
  Nacional: "Nacional (documentos de política del país)",
  Internacional: "Internacional (documentos de organismos internacionales)",
};

/** Order of the documents of policy in the filters of the three boards (F69, X-02): the one of `POLICY_DOCUMENTS`; the unknown ones go last. */
export const byPolicyOrder = (a, b) => policyRank(a) - policyRank(b);

export const DONUT_LABELS = {
  type: ["Artículo", "Libro", "Capítulo"],
  quartile: ["Sin cuartil", "Q1", "Q2", "Q3", "Q4"],
  access: ["Sin dato OA", "Diamante", "Dorada", "Híbrida", "Verde", "Bronce", "Cerrado"],
};

export const DIMENSION_OPTIONS = [
  { label: "Tópicos", value: "topic" },
  { label: "Subcampos", value: "subfield" },
  { label: "Campos", value: "field" },
];

export const DIMENSION_NOUN = { topic: "Tópicos", subfield: "Subcampos", field: "Campos" };

/** Reference of the capacity ratio (D-122): Colombia by default, or the world. */
export const RATIO_BASIS_OPTIONS = [
  { label: "Colombia", value: "national" },
  { label: "Mundo", value: "global" },
];
export const REFERENCE_NAME = { national: "Colombia", global: "Mundo" };

export const TREND_LABELS = { increasing: "creciente", stable: "estable", decreasing: "decreciente", none: "sin producción" };

/** Rules of the old model (artifact data, `?source=mock`). */
export const RULES_TABLE_LEGACY = [
  { key: "leader", category: "Líder", ratio: "= 1", trend: "creciente" },
  { key: "consolidated", category: "Consolidado", ratio: "> 0,75", trend: "creciente" },
  { key: "consolidating", category: "En consolidación", ratio: "> 0,50", trend: "creciente" },
  { key: "emerging", category: "Emergente", ratio: "< 0,25", trend: "creciente" },
  { key: "atRisk", category: "Riesgo de desaparecer", ratio: "> 0,50", trend: "decreciente" },
  { key: "uncategorized", category: "Sin categoría", ratio: "huecos de las reglas anteriores", trend: "—" },
  { key: "none", category: "Sin producción", ratio: "—", trend: "ninguna" },
];

/** Rules of the seven categories (D-122), also shown in the tooltip of the calculator. */
export const RULES_TABLE = [
  { key: "leader", category: "Líder", ratio: "= 1", trend: "creciente o estable" },
  { key: "consolidated", category: "Consolidado", ratio: "> 0,75", trend: "creciente o estable" },
  { key: "consolidating", category: "En consolidación", ratio: "> 0,50", trend: "creciente o estable" },
  { key: "emerging", category: "Emergente", ratio: "≤ 0,50", trend: "creciente" },
  { key: "atRisk", category: "Riesgo de desaparecer", ratio: "> 0,50", trend: "decreciente" },
  { key: "lowCapacity", category: "Capacidad relativa baja", ratio: "≤ 0,50", trend: "estable o decreciente" },
  { key: "punctual", category: "Presencia puntual", ratio: "—", trend: `menos de ${MIN_PRODUCTS_CLASSIFY} productos` },
  { key: "none", category: "Sin producción", ratio: "—", trend: "sin productos en 2021–2025" },
];

/**
 * Definition of the category «capacidad relativa baja» (D-136), for the tooltip of the legend and of the row
 * of the table of rules. With the world as referent it says «del mundo». Provisional text: Luis approves it.
 *
 * @param {string} [ratioBasis] - "national" (default) or "global".
 */
export function lowCapacityDefinition(ratioBasis = "national") {
  return `Citas de la UdeA en 2021–2025 iguales o menores al 50 % de las del referente (la institución con más citas ${ratioBasis === "global" ? "del mundo" : "del país"} en ese tópico) y producción sin crecimiento, con ${MIN_PRODUCTS_CLASSIFY} o más productos.`;
}

/** Tooltip of the category «presencia puntual» (F45): in the legend and in the row of the table of rules. */
export const PUNCTUAL_DEFINITION = `Menos de ${MIN_PRODUCTS_CLASSIFY} productos en 2021–2025: no se clasifica por razón ni por tendencia.`;

/** Ratio of a field or subfield (F57, D-153, rule b): only the topics with ${MIN_PRODUCTS_CLASSIFY} or more products add up. Provisional texts. */
export const FIELD_RATIO_RULE = `En campos y subcampos la razón suma solo los tópicos en los que la UdeA tiene ${MIN_PRODUCTS_CLASSIFY} o más productos en 2021–2025 con los filtros activos: citas de la UdeA en esos tópicos ÷ citas del referente en los mismos tópicos (máximo 1). Los tópicos con menos productos no entran en la razón.`;
export const NO_RATIO_TEXT = `Sin tópicos con ${MIN_PRODUCTS_CLASSIFY} o más productos: no se calcula la razón`;
export const NO_RATIO_DEFINITION = `${PUNCTUAL_DEFINITION} En campos y subcampos también: sin ningún tópico con ${MIN_PRODUCTS_CLASSIFY} o más productos no hay razón y no se clasifica.`;
/** Sentence of the tooltip of a point with ratio: «0,49 (citas de la UdeA … frente a … de …, en N tópicos con 5 o más productos)». */
export const ratioTopicsText = (n) => `en ${n.toLocaleString("es-CO")} ${n === 1 ? "tópico" : "tópicos"} con ${MIN_PRODUCTS_CLASSIFY} o más productos`;
/**
 * The referent of the ratio is the Universidad de Antioquia itself (F73, D-176): OpenAlex id I35961687, which the bundle
 * names `Universidad de Antioquia` in `inst_lider`. The tooltip then does not put two figures as if they were of two
 * institutions (the citations of our products and the aggregate of OpenAlex for the same university).
 */
export const OWN_REFERENT_ID = "I35961687";
export const OWN_REFERENT_NAME = "Universidad de Antioquia";
export const isOwnReferent = (name) => String(name || "").trim() === OWN_REFERENT_NAME;
const OWN_UNIT = { topic: "tópico", subfield: "subcampo", field: "campo" };
export const ownReferentText = (ratioBasis, dimension) =>
  `La UdeA es la institución con más citas ${ratioBasis === "global" ? "del mundo" : "del país"} en este ${OWN_UNIT[dimension] || "tópico"}`;

/**
 * Text of the line «Razón de capacidad (…)» of the tooltip of a point with ratio. With another institution as referent:
 * «0,49 (citas de la UdeA 120 frente a 300 de X, en N tópicos…)»; with the UdeA itself as referent: «1,00 · La UdeA es la
 * institución con más citas del país en este tópico», and the ratio keeps its value (it can be under 1).
 *
 * @param {{ ratio: number, ratioCitations: number, leaderCitations: number, referent: string, ratioTopics: number|null }} u
 * @param {{ ratioBasis: string, dimension: string, fmtRatio: Function, fmt: Function }} options
 */
export function ratioSentence(u, { ratioBasis, dimension, fmtRatio, fmt }) {
  if (isOwnReferent(u.referent)) return `${fmtRatio(u.ratio)} · ${ownReferentText(ratioBasis, dimension)}`;
  return `${fmtRatio(u.ratio)} (citas de la UdeA ${fmt(u.ratioCitations)} frente a ${fmt(u.leaderCitations)} de ${u.referent || "los referentes de sus tópicos"}${u.ratioTopics !== null ? `, ${ratioTopicsText(u.ratioTopics)}` : ""})`;
}

/** Note under the scatter when some fields or subfields have no ratio. */
export const withoutRatioNote = (count, noun) => `${count.toLocaleString("es-CO")} ${noun} sin ningún tópico con ${MIN_PRODUCTS_CLASSIFY} o más productos: no tienen razón y se muestran como «presencia puntual».`;

/** Text of the line «Categoría» of the tooltip of a point (F45). */
export function categoryLine(category, label) {
  return category === "punctual" ? `${label} (menos de ${MIN_PRODUCTS_CLASSIFY} productos: no se clasifica)` : label;
}

/** Line «Categoría» of a field or subfield without ratio (F57): the reason is the lack of topics, not of products. */
export function categoryLineNoRatio(label) {
  return `${label} (${NO_RATIO_TEXT.charAt(0).toLowerCase()}${NO_RATIO_TEXT.slice(1)})`;
}

/** One-line rule of each category for the tooltip of the calculator. */
export const RULE_LINE = Object.fromEntries(
  RULES_TABLE.map((r) => [r.key, r.ratio === "—" ? `${r.category}: ${r.trend}` : `${r.category}: razón ${r.ratio} y tendencia ${r.trend}`]),
);

/** Methodological note of the calculator (provisional text: Luis approves it, D-121). */
export const METHOD_NOTE =
  "Cada tópico se clasifica por su capacidad relativa (citas de la UdeA frente a la institución más citada en Colombia o en el mundo) y por la tendencia de su producción en 2021–2025 (pendiente de la recta ajustada a los conteos anuales). Con pocos productos la tendencia es indicativa (*).";

/** Help text of the board with the data of the API (provisional: Luis approves it). */
export const HELP_TEXT_REAL = [
  "Este tablero presenta las capacidades de la Universidad de Antioquia de generar impacto en diferentes investigaciones en el mundo con su propia producción. Se mide la capacidad de la Universidad en términos de ocho categorías: líder, consolidado, en consolidación, emergente, riesgo de desaparecer, capacidad relativa baja, presencia puntual y sin producción. Los tópicos con menos de " + MIN_PRODUCTS_CLASSIFY + " productos en 2021–2025 se muestran como «presencia puntual» y no se clasifican por razón ni por tendencia. La capacidad se mide comparando las citas de la UdeA en cada tópico con las de la institución con más citas del ámbito elegido (Colombia o el mundo) en 2021–2025, y se cruza con la tendencia de la producción en 2021–2025: la categoría más alta, el liderazgo, la tiene el tópico en el que la UdeA iguala a la institución más citada y su producción no decrece, en un gradiente hasta los temas en los que no hay producción.",
  "Cada categoría tiene su forma y su color (véase la leyenda). El tamaño del punto es el FWCI, calculado solo sobre los productos con registro en OpenAlex. Los paneles 1 y 2 muestran la situación 2021–2025 y no responden al filtro de años.",
  "«Sin producción» significa sin productos con ese tópico principal en 2021–2025.",
];

export const DATA_WARNINGS = [
  "Benchmark institucional ausente. Las bases no incluyen citas por institución y tópico (institución más citada global / Colombia). El cociente de liderazgo se sustituye provisionalmente por el FWCI acotado a 1; «líder» aquí significa «cita por encima del promedio mundial con producción creciente», no «institución más citada».",
  "Regla de tendencia estricta. Con la definición literal (ningún año puede caer) la mayoría de los tópicos con producción queda en «riesgo de desaparecer». Compare con el interruptor «Pendiente».",
  "FWCI sensible a valores extremos: un solo producto hipercitado eleva el FWCI de campos enteros. Conviene usar mediana o truncar al percentil 99.",
  "Cobertura: no todos los productos de los tipos solicitados tienen tópico. Hay DOI y títulos repetidos entre fuentes SCIENTI/OpenAlex y años atípicos.",
  "Sin ODS, sin ubicación geográfica de la investigación y sin agendas internacionales: los paneles de ODS, el mapa y el ámbito «Internacional» requieren campos adicionales.",
];

/** Tag of the board when the data come from the API (provisional text, Luis approves it). */
export const REAL_TAG = "Datos de ImpactU · capacidad frente a la institución más citada";


/**
 * Warnings of the board with the data of the bundle: the coverage comes from `meta` and the ODS
 * and geography lines describe what the bundle has now (the first three are the same as before).
 *
 * @param {{ n_sel: number, n_topic: number }} meta
 * @returns {string[]}
 */
export function realDataWarnings(meta) {
  const fmt = (n) => n.toLocaleString("es-CO");
  const share = Math.round((100 * meta.n_topic) / meta.n_sel);
  return [
    `Capacidad relativa. La razón de capacidad compara las citas de la UdeA con las de la institución con más citas del ámbito elegido (Colombia o el mundo) en cada tópico, en 2021–2025 (referente único); no se compara año a año. Los tópicos sin referencia nacional usan la mundial. En campos y subcampos la razón suma solo los tópicos con ${MIN_PRODUCTS_CLASSIFY} o más productos en 2021–2025 con los filtros activos (citas de la UdeA ÷ citas del referente en esos tópicos, máximo 1); un campo o subcampo sin ninguno no tiene razón. Es una medida provisional hasta que Luis apruebe los textos y los umbrales.`,
    `Tendencia indicativa (*). Con menos de ${MIN_TREND_VOLUME} productos en 2021–2025 la pendiente de la recta es poco fiable; esos tópicos se marcan y se cuentan en el panel.`,
    "FWCI solo sobre productos con registro en OpenAlex. Los productos que vienen solo de SCIENTI o de Minciencias no tienen datos de citas (no son «cero citas») y no entran en el FWCI. El FWCI es sensible a valores extremos: un solo producto hipercitado eleva el de campos enteros.",
    `Cobertura: ${fmt(meta.n_sel)} productos de los tipos solicitados; ${fmt(meta.n_topic)} (${share} %) tienen tópico. Hay DOI y títulos repetidos entre fuentes y años atípicos; 2025 y 2026 pueden estar incompletos.`,
    "ODS con cobertura parcial: una obra sin ODS está sin clasificar, no «sin relación». La subregión se deduce solo de menciones en el título; las bases no traen ubicación geográfica de la investigación.",
  ];
}

/* Confidence of the axis–work pairs (D-092, Q8). Provisional texts: Luis approves them. */
export const PAIR_LEVEL_OPTIONS = [
  { value: "core", label: "Alta y media" },
  { value: "all", label: "Incluir baja" },
];
export const PAIR_LEVEL_TOOLTIP =
  "Cada producto se asigna a un Eje Temático con una confianza (alta, media o baja) calculada por nuestra metodología, sin validación humana. Por defecto se cuentan solo las asignaciones de confianza alta y media.";
export const AXES_PANEL_NOTE = {
  core: "productos con asignación de confianza alta o media",
  all: "productos con asignación de cualquier confianza (incluye baja)",
  topics: "n.º de tópicos con producción UdeA",
};

/** Notice of the panels 1 and 2 (D-133, F43). Provisional text: Luis approves it. */
import { MIN_PRODUCTS_CLASSIFY } from "../../../../../lib/observatories/capacity/constants";
import { PUNTUAL_SIZE_FACTOR } from "../../../../../lib/observatories/scatterSize";

/** Definition in OpenAlex of the primary topic of a work (D-139): the link of the texts about «sin producción». */
export const PRIMARY_TOPIC_URL = "https://help.openalex.org/data/works/attributes/#primary_topic";
export const PRIMARY_TOPIC_LINK_TEXT = "tópico principal";

export const SNAPSHOT_NOTE = "Fotografía 2021–2025; no responde al filtro de años";

const fmtCount = (n) => n.toLocaleString("es-CO");

/**
 * Tooltip of the informative entry «sin producción» of the legend (F43b, D-134): the units that have
 * no production in 2021–2025, how many had some in other years and how many none at all. Figures
 * come from the data.
 */
export function noProductionTooltip({ otherYears, never, noun }) {
  return `${noun[0].toUpperCase()}${noun.slice(1)} sin productos con ese tópico principal en 2021–2025 (${fmtCount(otherYears)} con producción anterior y ${fmtCount(never)} sin ninguna): no se dibujan en la gráfica`;
}

/** Foot of the panel 1 (F43b): the units without production in 2021–2025 are not drawn. */
export function undrawnNote({ count, noun }) {
  return `Los ${noun} sin productos con ese tópico principal en 2021–2025 no se dibujan (${fmtCount(count)})`;
}

/* Types of product (F47, D-141). Provisional texts: Luis approves them. */
export const TYPES_HELP =
  "Se comparan artículos, libros y capítulos. En la UdeA el tipo es el normalizado de ImpactU, que cruza varias fuentes y asigna el de la fuente en la que más confía; el referente usa el tipo de OpenAlex (article, book, book-chapter). Pueden diferir en algunos productos, por ejemplo las reseñas.";
export const TYPES_FOOT = "Tipos según cada fuente; ver ayuda.";

/* Table «Tópicos del Eje Temático» (F49, D-142, D-143). Provisional texts: Luis approves them. */
export const AXIS_TOPICS_TITLE = "Tópicos del Eje Temático";
export const AXIS_TOPICS_OTHER_LABEL = "Otros productos asignados al eje (su tópico principal no es uno de los tópicos del eje)";
export const AXIS_TOPICS_RECONCILE_NOTE = "El eje reúne los productos que nuestra metodología le asignó (confianza alta y media); algunos tienen como tópico principal uno que no es de los que definen el eje.";
export const AXIS_LINK_TITLE = "Vínculo con el eje";
export const AXIS_LINK_HELP = "Incluido: el tópico pertenece al eje según nuestra metodología. Frontera: es cercano al eje, pero no se da por incluido.";
export const AXIS_LINK_STATES = { 0: { label: "Incluido", color: "green" }, 1: { label: "Frontera", color: "orange" } };
export const AXIS_LINK_BY_PRODUCTS = "Por productos";
export const AXIS_LINK_BY_PRODUCTS_HELP = "Estos productos no tienen como tópico principal ninguno de los tópicos del eje, pero alguno de sus tópicos secundarios sí pertenece al eje. Nuestra metodología, leyendo su título y resumen, los asignó al eje. Solo se cuentan los de confianza alta y media (los de confianza baja no se muestran por defecto). Por eso aparecen en las tarjetas del eje y no en los tópicos de arriba, y su suma con la tabla coincide con las tarjetas. Siguen los filtros activos, incluido el de años.";
export const AXIS_FILTER_LABEL = "Eje Temático (uno o más)";
export const AXIS_FILTER_TOOLTIP = "Recorta todo el tablero a los productos enlazados a los ejes elegidos, con la confianza de asignación del filtro correspondiente. El documento solo limita los ejes disponibles.";

/** Line above the table: the table follows the years filter, unlike the panels 1 and 2 (D-143 1). */
export const axisTopicsYears = (yearFrom, yearTo) => `Años aplicados: ${yearFrom}–${yearTo}`;

/** Short name of an axis for the column «Ejes»: the first words, cut with «…». */
export const shortAxisName = (name, size = 38) => (name.length > size ? `${name.slice(0, size - 1).trimEnd()}…` : name);

/* Panel 6 (F48b, D-143). Provisional texts: Luis approves them. */
export const NO_PARENT_GOAL_LABEL = "Sin meta superior definida";
export const NO_PARENT_GOAL_TOOLTIP = "Los ejes de la Misión de sabios 2019 son en sí mismos metas y retos; no tienen una meta superior";

/**
 * Rows of the panel 6 from rankGoals: the bar is labelled with the end of the route of the goal (cut at the
 * start with «…» when it is long, by the chart); the full route and the agenda go in the tooltip. The axes that
 * have no goal above them (the 8 of the Misión de sabios 2019) are «Sin meta superior definida» with the
 * agenda below.
 *
 * @param {{ id: string, label: string, end: string, noParent: boolean, detail: string, value: number }[]} goals
 */
export function goalRows(goals) {
  return goals.map((g) =>
    g.noParent
      ? { id: g.id, label: `${NO_PARENT_GOAL_LABEL}\n${g.detail}`, fullLabel: NO_PARENT_GOAL_TOOLTIP, detail: g.detail, value: g.value }
      : { id: g.id, label: g.end, fullLabel: g.label, detail: g.detail, value: g.value },
  );
}

/* Legend of the scatter (F39). Provisional texts: Luis approves them. */
export const SIZE_NOTE = `Tamaño = FWCI, solo productos con registro en OpenAlex; presencia puntual se dibuja ${Math.round((1 - PUNTUAL_SIZE_FACTOR) * 100)} % más pequeña`;
export const SIZE_NOTE_LEGACY = "Tamaño = FWCI";
export const RULES_HEADERS = {
  category: "Categoría",
  ratio: { short: "Razón", full: "Razón de capacidad" },
  trend: { short: "Tendencia", full: "Tendencia 2021–2025" },
};

/* Centre of research filter (D-124). Provisional texts: Luis approves them. */
export const CENTER_TOOLTIP = "Centro de investigación al que se adscriben los grupos que firman el producto";

/**
 * Coverage note of the centre filter: how many works belong to a research centre. Both figures come
 * from the data of the board; nothing is fixed in the text.
 *
 * @param {{ withCenter: number, total: number }} coverage
 * @returns {string}
 */
export function centerCoverageNote({ withCenter, total }) {
  if (!total) return "";
  const share = ((100 * withCenter) / total).toFixed(1).replace(".", ",");
  const fmt = (n) => n.toLocaleString("es-CO");
  return `${fmt(withCenter)} de ${fmt(total)} productos (${share} %) están en algún centro de investigación; el resto no tiene grupo asignado a un centro.`;
}
