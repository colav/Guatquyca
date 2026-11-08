/**
 * Visible texts and fixed layouts of Board 3 (taken from the published artifact; D-102, D-106).
 * The state of the evidence of the Eje Temático is not named in any screen.
 */

export const BOARD_TITLE = "Capacidades de base del sistema: talento, producción e infraestructura";

export const BOARD_EYEBROW = "Universidad de Antioquia · Capacidades VRI 2026 · Ensayo 1";

export const BOARD_LEAD =
  "Los indicadores sintetizan preocupaciones comunes de las agendas sobre las capacidades base del sistema (talento, producción, infraestructura abierta, identificadores) y las formas de relación deseables. Se calculan sobre artículos, libros, capítulos, apropiación social, investigación-creación, audiovisuales, conjuntos de datos, software, preprints, tesis y proyectos de la Universidad de Antioquia, 2010–2026, organizados en cinco bases: investigadores, estudiantes en formación, transferencia y apropiación, artes y ciencia abierta. El filtro de documento delimita los productos que el panel de jueces asignó a alguno de sus ejes; los filtros de centro, unidad, subunidad y subcampo delimitan la producción asociada a los tópicos en los que participa cada entidad.";

export const MOCK_TAG = "Datos de prueba · ensayo con limitaciones de datos";

/** Provisional label of the cards of "profesores" (D-106 Q11; phase B changes the population). */
export const STAFF_LABEL = "profesores según la tabla de personal anterior";

/** Provisional label of the panels whose indicator is replaced by a proxy (D-106). */
export const PROXY_LABEL = "provisional: se reemplazará por el nivel de formación de la planta";

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
  "Departamental (subregión de Antioquia en el título, sin el Valle de Aburrá)",
  "Nacional (coautor colombiano externo)",
  "Internacional (coautor extranjero)",
];

export const SEX_SERIES = { 1: "Hombre", 2: "Mujer", 0: "Sin dato" };

export const ACCESS_LABELS = { open: "Acceso abierto", closed: "Cerrado", noData: "Sin dato (solo SCIENTI)" };

/* Texts for the data of the API (provisional: Luis approves them). */
export const REAL_TAG = "Datos de ImpactU · ensayo con limitaciones de datos";

/** Label of the cards of "profesores" with the data of the API (the three labels of D-106 Q11). */
export const REAL_STAFF_LABEL = "con contrato vigente al 30 de mayo";

export const REAL_FOOTER_TEXT =
  "Fuentes: tablas del observatorio cargadas en ClickHouse a partir de ImpactU (obras, autoras y autores, grupos, instituciones coautoras, proyectos y tesis), campos de OpenAlex (acceso abierto y texto completo en repositorio), identificadores de las personas y la planta de la Universidad, tópicos de OpenAlex o del modelo v2 y el thesaurus de los documentos de política. Población de Antioquia: CNPV 2018 (DANE). Los «profesores» son los autores con contrato vigente al 30 de mayo de 2026; «autores UdeA» incluye estudiantes y otros vinculados. La edad proviene de la fecha de nacimiento de la planta cruzada con los autores, por lo que los paneles 4 y 6 son parciales. Las tesis de SCIENTI registran como autores a sus directores y, en parte, a los estudiantes. Las menciones a subregión se estiman por reglas sobre el título y el sector de cada institución por reglas sobre el nombre.";

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
  return ` La hoja «Investigadores» de BD_Grupos (convocatoria 894) registra ${fmt(sheet.personas)} personas; ${fmt(declared)} declaran vinculación (regular ${fmt(byLinkage.Regular || 0)}, cátedra ${fmt(byLinkage["Cátedra"] || 0)}, ocasional ${fmt(byLinkage.Ocasional || 0)}) y ${fmt(rest)} no la declaran.`;
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
  `Nivel de formación de los ${staff} profesores con contrato vigente (planta de la Universidad) y su densidad por 100.000 habitantes de Antioquia, con la población ajustada y la censada. La especialización suma la médico-quirúrgica y la otra; el desglose está en el tooltip. ${planta} Este panel no responde a los filtros.`;
export const talentMincienciasNote = (planta) =>
  `Categoría Minciencias de los profesores con contrato vigente y su densidad por 100.000 habitantes (población ajustada). ${planta} Este panel no responde a los filtros.`;

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
  `En la torta de clases cada producto entra en una sola porción, con esta precedencia: preprint, publicación, dato de investigación, software; por eso ${preprintsFromPublications.toLocaleString("es-CO")} preprints que son artículos, libros o capítulos salen de «publicaciones». La dona de acceso cuenta todas las publicaciones. La composición final se confirma con Gabriel.`;
export const PID_NOTE =
  "«Todos»: producto = DOI o Handle; persona = ORCID o ID de OpenAlex (el ID de OpenAlex no es un identificador persistente registrado, solo un identificador de la fuente); organización = ROR, el único disponible. Las organizaciones sin ROR llevan ids de SCIENTI o SNIES.";

/** Help of the filter Documento (F74, D-177): the board has no control of confidence. Provisional text. */
export const DOCUMENT_FILTER_HELP =
  "El documento delimita los productos que el panel de jueces asignó a alguno de sus ejes, con confianza alta o media (este tablero no tiene control de confianza). Un producto sin eje asignado no cuenta aunque su tópico esté vinculado.";

/* Q-06 (F90, D-202): source and cut of the projects, as the team understands it (the list of the VRI-UdeA, cut on 3 July 2025); provisional for Luis. */
export const PROJECTS_2025_WARNING = "Proyectos registrados en el SIIU, listado de la VRI-UdeA con corte al 3 de julio de 2025; el último inicio registrado es el 18 de junio de 2025 y los de mayo y junio pueden estar incompletos.";
