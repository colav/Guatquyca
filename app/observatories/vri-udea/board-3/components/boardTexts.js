/**
 * Visible texts and fixed layouts of Board 3 (taken from the published artifact; D-102, D-106).
 * The state of the evidence of the Eje Temático is not named in any screen.
 */

import { INCOMPLETE_YEARS_NOTE } from "../../board-1/components/boardTexts";

export const BOARD_TITLE = "Capacidades de base del sistema: talento, producción e infraestructura";

export const BOARD_EYEBROW = "Universidad de Antioquia · Capacidades VRI 2026";

/** Subtitle of the header (F119, D-260): one line; the orientation is in «¿Cómo usar este tablero?». */
export const BOARD_LEAD = "Talento, producción e infraestructura abierta de la UdeA.";

/** Text of the collapsible «¿Cómo usar este tablero?» (F119, D-260: proposal (c) of F112, approved by Luis). */
export const HOW_TO_USE = [
  "Este tablero resume las capacidades de base que piden las agendas de política: talento, producción, infraestructura abierta e identificadores, organizados en cinco bases (investigadores, estudiantes en formación, transferencia y apropiación, artes y ciencia abierta). Empiece por el talento investigador (panel 1) y la producción por año; con los filtros de arriba acote el tablero (la ayuda «?» de cada filtro dice qué acota) y tenga en cuenta que algunos paneles no responden a todos los filtros y lo dicen en su tarjeta. El botón (i) de cada panel explica cómo leerlo; las fuentes, las fechas de corte y el universo de productos están en las notas metodológicas del pie.",
];

/** Help of the filters of entity (F119, D-260): the rule is direct (D-226); the subfield goes by the main topic of the product. */
export const UNIT_FILTER_HELP = "Cuenta solo los productos de la unidad elegida.";
export const SUBUNIT_FILTER_HELP = "Cuenta solo los productos de la subunidad elegida.";
export const CENTER_FILTER_HELP = "Cuenta solo los productos del centro elegido.";
export const SUBFIELD_FILTER_HELP = "Cuenta los productos cuyo tópico principal pertenece al subcampo elegido.";

/** Note of the foot (F119, D-260): the universe of products, which was in the header. */
export const UNIVERSE_NOTE = "Universo de productos. Artículos, libros, capítulos, apropiación social, investigación-creación, audiovisuales, conjuntos de datos, software, preprints, tesis y proyectos de la Universidad de Antioquia, 2010–2026.";

export const MOCK_TAG = "Datos de prueba";

/** Provisional label of the cards of "profesores" (D-106 Q11; phase B changes the population). */
export const STAFF_LABEL = "profesores según la tabla de personal anterior";

/** Provisional label of the panels whose indicator is replaced by a proxy (D-106). */
export const PROXY_LABEL = "categoría Minciencias de la planta";

export const FOOTER_TEXT =
  "Fuentes: obras, autores, tópicos, grupos e instituciones coautoras de ImpactU; registro de grupos de investigación y centros, con sus investigadores y la planta de personal; listado de proyectos de la VRI-UdeA con corte al 3 de julio de 2025 (SIIU); registro de productos de creación; catálogo de tópicos de OpenAlex y catálogo de Ejes Temáticos (términos Núcleo). SIIU: sistema donde la Universidad registra oficialmente sus proyectos. ScienTI: plataforma de Minciencias donde se registran grupos, investigadores y productos. Población de Antioquia: CNPV 2018 (DANE). La edad proviene de la fecha de nacimiento de la planta 2021-2 cruzada por nombre, por lo que los paneles 4 y 6 son parciales. Las tesis de ScienTI registran como autores a sus directores y, en parte, a los estudiantes.";

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
  "Departamental (subregión de Antioquia en el título, sin el Valle de Aburrá)",
  "Nacional (coautor colombiano externo)",
  "Internacional (coautor extranjero)",
];

export const SEX_SERIES = { 1: "Hombre", 2: "Mujer", 0: "Sin dato" };

export const ACCESS_LABELS = { open: "Acceso abierto", closed: "Cerrado", noData: "Sin dato (solo ScienTI)" };

/* Texts for the data of the API (provisional: Luis approves them). */
export const REAL_TAG = "Datos de ImpactU";

/** Label of the cards of "profesores" with the data of the API (the three labels of D-106 Q11). */
export const REAL_STAFF_LABEL = "con contrato vigente al 30 de mayo de 2026";

export const REAL_FOOTER_TEXT =
  "SIIU: sistema donde la Universidad registra oficialmente sus proyectos. ScienTI: plataforma de Minciencias donde se registran grupos, investigadores y productos. Población de Antioquia: CNPV 2018 (DANE). La edad proviene de la fecha de nacimiento de la planta cruzada con los autores, por lo que los paneles 4 y 6 son parciales. Las tesis de ScienTI registran como autores a sus directores y, en parte, a los estudiantes. Las menciones a subregión se estiman por reglas sobre el título.";

const fmt = (n) => Number(n).toLocaleString("es-CO");

/**
 * Sentence of the panel 2 about the "Investigadores" sheet (call 894). The breakdown by linkage only
 * covers the people who declare one; the rest is shown, so the figures are not read as a sum.
 * Provisional text: Luis approves it.
 */
export function linkageNote(sheet) {
  if (!(sheet.personas > 0)) return "";
  const byLinkage = sheet.por_vinculacion || {};
  const declared = Object.values(byLinkage).reduce((a, n) => a + n, 0);
  const rest = sheet.personas - declared;
  return ` El registro de grupos de la convocatoria 894 incluye ${fmt(sheet.personas)} personas; ${fmt(declared)} declaran vinculación (regular ${fmt(byLinkage.Regular || 0)}, cátedra ${fmt(byLinkage["Cátedra"] || 0)}, ocasional ${fmt(byLinkage.Ocasional || 0)}) y ${fmt(rest)} no la declaran.`;
}

/* Card «11b · Propiedad intelectual y patentes» (F58); provisional texts for Luis. */
export const PI_TITLE = "11b · Propiedad intelectual y patentes";
export const PI_FILTER_NOTE = "La propiedad intelectual solo se puede filtrar por años, centro o unidad; no tiene subcampo ni documento de política.";
export const PI_PATENTS_NOTE = "Las patentes registradas son el contador de otra fuente (patentes), sin años ni unidad: no responden a los filtros.";
export const piNotRespondingNote = (list) => `Filtros activos que no se aplican a esta tarjeta: ${list.join(", ")}.`;
export const piYearNote = (withoutYear, fullRange) =>
  fullRange
    ? `${withoutYear.toLocaleString("es-CO")} activos no tienen año de concesión: cuentan en las cifras, pero no entran a la serie por año.`
    : `${withoutYear.toLocaleString("es-CO")} activos no tienen año de concesión: con un rango de años elegido no se cuentan; solo cuentan con el rango completo.`;
export const PI_SERIES_LABEL = "Activos";
export const PI_VIEWS = [{ label: "Por unidad", value: "unit" }, { label: "Por grupo", value: "group" }];

/* Panel 01 (F71, C3-01): talent by level of education (talent.ext.por_nivel_academico) or by Minciencias category; provisional texts for Luis. */
export const TALENT_VIEWS = [{ label: "Por nivel de formación", value: "level" }, { label: "Por categoría Minciencias", value: "minciencias" }];
export const TALENT_LEVEL_TITLE = "1 · Talento investigador por nivel de formación";
export const TALENT_MINCIENCIAS_TITLE = "1 · Talento investigador por categoría Minciencias";
export const TALENT_LEVEL_LABELS = { doctorado: "Doctorado", maestria: "Maestría", especializacion: "Especialización", profesional: "Profesional", sinDato: "Sin dato" };
export const talentLevelNote = (staff, planta) =>
  `Nivel de formación de los ${staff} profesores con contrato vigente (planta de la Universidad) y su densidad por 100.000 habitantes de Antioquia, con la población ajustada y la censada. La especialización suma la médico-quirúrgica y la otra; el desglose está en el tooltip. ${planta}`;
export const talentMincienciasNote = (planta) =>
  `Categoría Minciencias de los profesores con contrato vigente y su densidad por 100.000 habitantes (población ajustada). ${planta}`;
/** F110 (D-245): the short live note of the panel 1 with a filter active; the long detail is in the button (i) (D-243). */
export const talentSelectionNote = () => "Con filtros activos solo se cuentan los profesores con al menos un producto en la selección.";

/* F72 (D-175): panels 2, 12, 17 and 18 with the new keys of B126/B126b; provisional texts for Luis. */
export const AREAS_NOTE = (active, from, linkage) =>
  `${active} investigadores activos, miembros de un grupo (con al menos un producto desde ${from}; área OCDE del grupo del que son miembros). ${linkage}`;
export const AREAS_NOTE_MOCK = (active, from, linkage) =>
  `${active} investigadores activos con grupo (con al menos un producto desde ${from}; área OCDE del grupo principal). ${linkage}`;
export const ARTS_TITLE_LEVEL = "12 · Profesores con productos artísticos, por número de productos y nivel de formación";
export const ARTS_TITLE_CONTRACT = "12 · Profesores con productos artísticos, por número de productos y tipo de contrato";
export const ARTS_LEVEL_NOTE = "Nivel de formación de la planta de la Universidad (doctorado, maestría, especialización —médico-quirúrgica incluida—, profesional o sin dato).";
export const PIE_CLASSES_TITLE = "Producto por clase (cada producto en una sola porción)";
export const ACCESS_PIE_TITLE = "Publicaciones por acceso";
export const PIE_CLASSES_LABELS = { publications: "Publicaciones", preprints: "Preprints", datasets: "Datos de investigación", software: "Software" };
export const pieNote = (preprintsFromPublications) =>
  `${preprintsFromPublications.toLocaleString("es-CO")} preprints que son artículos, libros o capítulos no cuentan como «publicaciones» en la torta de clases.`;
export const PID_NOTE =
  "«Todos»: producto = DOI o Handle; persona = ORCID o ID de OpenAlex (el ID de OpenAlex no es un identificador persistente registrado, solo un identificador de la fuente); organización = ROR, el único disponible. Las organizaciones sin ROR llevan ids de ScienTI o SNIES.";

/** Help of the filter Documento (F74, D-177): the board has no control of confidence. Provisional text. */
export const DOCUMENT_FILTER_HELP =
  "El documento delimita los productos que el panel de jueces asignó a alguno de sus ejes, con confianza alta o media (este tablero no tiene control de confianza). Un producto sin eje asignado no cuenta aunque su tópico esté vinculado.";

/* Q-06 (F90, D-202): source and cut of the projects, as the team understands it (the list of the VRI-UdeA, cut on 3 July 2025); provisional for Luis. */
export const PROJECTS_2025_WARNING = "Proyectos del listado de la VRI-UdeA (SIIU): el último inicio registrado es el 18 de junio de 2025 y los de mayo y junio pueden estar incompletos.";

/* F102 (D-226): the filters of entity are direct. Provisional texts for Luis. */
export const DIRECT_FILTERS_NOTE = "Los filtros de centro, unidad y subunidad cuentan solo los productos de la entidad elegida.";
export const fewProductsWarning = (n) => `Esta selección tiene ${Number(n).toLocaleString("es-CO")} productos; con pocos productos varios paneles pueden quedar vacíos.`;

/**
 * Notes of method at the foot of the board (Q-22, Q-24, F91): the sentences that were spread over the panels, now in one box.
 * No figure that the bundle does not carry. Provisional for Luis.
 *
 * @param {string} staffLabel - «con contrato vigente al 30 de mayo de 2026» (real data) or the label of the test data.
 * @returns {string[]}
 */
export const methodNotes = (staffLabel) => [
  `Los profesores son los autores UdeA ${staffLabel}; «autores UdeA» incluye estudiantes y otros vinculados.`,
  DIRECT_FILTERS_NOTE,
  INCOMPLETE_YEARS_NOTE,
  "El tipo de cada organización coautora (por ejemplo, las empresas) sale de la clasificación de ROR y OpenAlex, del catálogo revisado de organizaciones de la Universidad y, cuando esas fuentes no lo dicen, de reglas sobre el nombre; la proporción de cada procedencia está en el botón (i) del panel 11.",
  UNIVERSE_NOTE,
];
