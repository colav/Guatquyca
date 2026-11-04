/**
 * Visible texts and fixed layouts of Board 3 (taken from the published artifact; D-102, D-106).
 * The state of the evidence of the Eje Temático is not named in any screen.
 */

export const BOARD_TITLE = "Capacidades de base del sistema: talento, producción e infraestructura";

export const BOARD_EYEBROW = "Universidad de Antioquia · Capacidades VRI 2026 · Ensayo 1";

export const BOARD_LEAD =
  "Los indicadores sintetizan preocupaciones comunes de las agendas sobre las capacidades base del sistema (talento, producción, infraestructura abierta, identificadores) y las formas de relación deseables. Se calculan sobre artículos, libros, capítulos, apropiación social, investigación-creación, audiovisuales, conjuntos de datos, software, preprints, tesis y proyectos de la Universidad de Antioquia, 2010–2026, organizados en cinco bases: investigadores, estudiantes en formación, transferencia y apropiación, artes y ciencia abierta. Los filtros de documento, centro, unidad y subcampo delimitan la producción asociada a los tópicos en los que participa cada entidad.";

export const MOCK_TAG = "Datos de prueba · ensayo con limitaciones de datos";

/** Provisional label of the cards of "profesores" (D-106 Q11; phase B changes the population). */
export const STAFF_LABEL = "profesores según la tabla de personal anterior";

/** Provisional label of the panels whose indicator is replaced by a proxy (D-106). */
export const PROXY_LABEL = "provisional: se reemplazará por el nivel de formación de la planta";

/** Provisional footer with the cut-off date (to be confirmed by Luis; it changes in this one place). */
export const CUTOFF_FOOTER = "Datos de ImpactU extraídos del 4 al 16 oct 2026; tópicos v2 consultados el 31 oct; 2025 y 2026 pueden estar incompletos.";

export const FOOTER_TEXT =
  "Fuentes: bases UdeA en CSV (works, work_authors, authors, work_topics, work_groups, instituciones_coautoras), BD_Grupos de investigación y Centros (hojas Grupos, Investigadores, consultasoljulio), ListadoProyectos03_07_2025, Productos de creación.xlsx, topicos_openalex.xlsx y Tableros_thesaurus_5.xlsx (términos Núcleo). Población de Antioquia: CNPV 2018 (DANE). Los conteos de «profesores» usan los autores con tipo de contrato en la base; «autores UdeA» incluye estudiantes y otros vinculados. La edad proviene de la fecha de nacimiento de la planta 2021-2 cruzada por nombre, por lo que los paneles 4 y 6 son parciales. Las tesis de SCIENTI registran como autores a sus directores y, en parte, a los estudiantes.";

export const SECTIONS = {
  researchers: "Base de investigadores",
  students: "Base de estudiantes en formación",
  appropriation: "Base de investigadores por transferencia y apropiación",
  arts: "Artes",
  openScience: "Base para la ciencia abierta",
};

export const TILE_LABELS = [
  ["products", "productos en el universo"],
  ["publications", "artículos, libros y capítulos"],
  ["theses", "tesis"],
  ["authors", "autores UdeA únicos"],
  ["staff", `profesores (${STAFF_LABEL})`],
  ["groups", "grupos UdeA con producción"],
  ["datasets", "conjuntos de datos"],
  ["withCompany", "productos con empresa"],
];

export const SCOPE_LABELS = [
  "Local (sin coautor externo)",
  "Departamental (subregión en título)",
  "Nacional (coautor colombiano externo)",
  "Internacional (coautor extranjero)",
];

export const SEX_SERIES = { 1: "Hombre", 2: "Mujer", 0: "Sin dato" };

export const ACCESS_LABELS = { open: "Acceso abierto", closed: "Cerrado", noData: "Sin dato (solo SCIENTI)" };
