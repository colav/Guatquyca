/**
 * Constants of the base-capacities model (Board 3 of the VRI-UdeA observatory, F26).
 * Rules taken from the handoff report of Board 3 (sections 3, 4 and 7) and from the artifact code.
 */

/** Years that the filters accept. */
export const YEAR_RANGE = Object.freeze({ min: 2010, max: 2026 });

/** Index of each position of a product `P[i]` (report section 3). */
export const PRODUCT = Object.freeze({
  YEAR: 0,
  TYPE: 1,
  TOPIC: 2,
  AGENDA_MASK: 3,
  SCOPE: 4,
  OPEN_ACCESS: 5,
  REPOSITORY: 6,
  DOI: 7,
  SECTOR_MASK: 8,
  EXTERNAL: 9,
  FACULTIES: 10,
  DEPARTMENTS: 11,
  GROUPS: 12,
  AUTHORS: 13,
  INSTITUTIONS: 14,
  THESIS_SUBTYPE: 15,
  /* B126b: 1 when the product has a URL of handle; 1 when the OpenAlex type is preprint (a mark, not a type). */
  HANDLE: 16,
  PREPRINT: 17,
});

/**
 * Index of each position of an author `A[i]`. Phase B can change the population of the
 * "profesores" cards by changing only `isStaff` (D-106 Q11): today it is the contract flag of the
 * previous staff table; the three labels of the decision are "con contrato vigente al 30 de mayo de 2026",
 * "con producción" and "autores UdeA".
 */
export const AUTHOR = Object.freeze({
  isStaff: 0,
  sex: 1,
  birthYear: 2,
  orcid: 3,
  openAlexId: 4,
  scholar: 5,
  mainFaculty: 6,
  mainDepartment: 7,
  mainGroup: 8,
  contract: 9,
  minciencias: 10,
  jobCategory: 11,
});

/** Index of each product type (`D.tipos`). */
export const TYPE = Object.freeze({
  ARTICLE: 0,
  BOOK: 1,
  CHAPTER: 2,
  APPROPRIATION: 3,
  DATASET: 7,
  SOFTWARE: 8,
  PREPRINT: 9,
  THESIS_POSTGRAD: 10,
  THESIS_UNDERGRAD: 11,
});

/** Publications are articles, books and chapters. */
export const LAST_PUBLICATION_TYPE = TYPE.CHAPTER;

/** Scopes (`D.ambitos`) in the order of the select. */
export const SCOPE_OPTIONS = Object.freeze(["Local", "Departamental", "Nacional", "Internacional"]);

/** Only the first six policy documents have terms in the thesaurus (report section 1). */
export const ACTIVE_POLICY_DOCUMENTS = 6;

/** Age groups (`D.age_bins`) and sex labels. */
export const AGE_GROUPS = Object.freeze(["<35", "35-44", "45-54", "55-64", "65+"]);
export const SEX_LABELS = Object.freeze(["Sin dato", "Hombre", "Mujer", "Intersexual"]);

/** Contract groups of the panel "c" (and the order of its series). */
export const CONTRACTS = Object.freeze(["vinculado", "ocasional", "cátedra", "término fijo", "término indefinido", "otros/desconocido"]);

/** Levels of the students panel (7), in the order of the artifact. */
export const STUDENT_LEVELS = Object.freeze(["Pregrado", "Maestría", "Doctorado", "Especialización", "Joven investigador", "Posdoctoral"]);

/** OECD areas of the groups (treemap and group grid) and Minciencias categories. */
export const OECD_AREAS = Object.freeze(["Ciencias Médicas y de la Salud", "Ciencias Naturales", "Ciencias Sociales", "Ingeniería y Tecnología", "Humanidades", "Ciencias Agrícolas"]);
export const GROUP_CATEGORIES = Object.freeze(["A1", "A", "B", "C", "Reconocido", "No reconocido", "No aplica"]);

/** Labels of the product types (artifact). */
export const TYPE_LABELS = Object.freeze({
  articulo: "Artículo",
  libro: "Libro",
  capitulo: "Capítulo",
  apropiacion: "Apropiación social",
  inv_creacion: "Investigación-creación",
  audiovisual: "Audiovisual",
  prod_artistica: "Producción artística",
  dataset: "Conjunto de datos",
  software: "Software",
  preprint: "Preprint",
  tesis_posgrado: "Tesis de posgrado",
  tesis_pregrado: "Tesis de pregrado",
  ondas: "Tutoría programa Ondas",
  /* Types that only the bundle of quyca carries (provisional labels: Luis approves them). */
  publicacion_no_especializada: "Publicación no especializada",
  otro: "Otro tipo de producto",
  sin_tipo: "Sin tipo",
  documento_trabajo: "Documento de trabajo",
  conferencia: "Conferencia",
  informe: "Informe",
  recurso_electronico: "Recurso electrónico",
  norma: "Norma",
  modelo: "Modelo",
  programa_curso: "Programa o curso",
});

/** Subtypes of thesis (`D.tesis_sub`) grouped in the series of the panel 8. */
export const THESIS_SERIES = Object.freeze([
  { name: "Doctorado", keys: ["doctorado"] },
  { name: "Maestría o especialidad clínica", keys: ["maestria", "maestria_esp_clinica"] },
  { name: "Especialización (monografía)", keys: ["especializacion"] },
  { name: "Posgrado sin subtipo", keys: ["otra"] },
  { name: "Pregrado", keys: ["pregrado"] },
]);

/** Limits of the rankings (as in the artifact). */
export const LIMITS = Object.freeze({ datasets: 15, ageTopics: 15, maxArtProducts: 20 });
