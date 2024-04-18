export const CHECKLIST = {
  AFFILIATIONENTITIES: ["department", "group", "faculty", "institution"],
  AFFILIATIONURL: ["department", "group", "faculty", "institution"],
};

export const TITLES = {
  person: "Autores",
  group: "Grupos",
  institution: "Instituciones",
  literature: "Producción",
  department: "Subunidades académicas",
  faculty: "Unidades académicas",
  projects: "Proyectos",
  agreements: "Convenios",
  entrepreneurship: "Emprendimientos",
  works: "Productos",
};

export const SINGULAR_TITLES = {
  person: "Autor",
  group: "Grupo",
  institution: "Institución",
  literature: "Producción",
  department: "Subunidad académica",
  faculty: "Unidad académica",
  projects: "Proyecto",
  agreements: "Convenio",
  entrepreneurship: "Emprendimiento",
  works: "Producto",
};

export const SINGULAR = {
  authors: "person",
  groups: "group",
  institutions: "institution",
  departments: "department",
  faculties: "faculty",
};

export const PALETTE = [
  "#8dd3c7",
  "#ffffb3",
  "#bebada",
  "#fb8072",
  "#80b1d3",
  "#fdb462",
  "#b3de69",
  "#fccde5",
  "#d9d9d9",
  "#bc80bd",
  "#ccebc5",
  "#ffed6f",
];

export const MAP_PALETTE = [
  "#f7fcf0",
  "#e0f3db",
  "#ccebc5",
  "#a8ddb5",
  "#7bccc4",
  "#4eb3d3",
  "#2b8cbe",
  "#0868ac",
  "#084081",
];

export const PLOTLIST_STACKED = {
  institution: [
    {
      label: "Producción de las facultades según tipo de producto",
      value: "type,faculty",
    },
    {
      label: "Producción de los departamentos según tipo de producto",
      value: "type,department",
    },
    {
      label: "Producción por grupos de investigación según tipo de producto",
      value: "type,group",
    },
    {
      label:
        "Evolución anual de la producción según la clasificación del Scienti",
      value: "year_type",
    },
    { label: "Cantidad de citas anuales", value: "year_citations" },
    { label: "Gastos anuales en APC", value: "year_apc" },
    {
      label: "Artículos anuales en acceso abierto y cerrado",
      value: "year_oa",
    },
    {
      label: "Articulos anuales publicados en las editoriales más usadas",
      value: "year_publisher",
    },
    {
      label: "Índice H anual según datos de citación de OpenAlex",
      value: "year_h",
    },
  ],
  group: [
    {
      label:
        "Evolución anual de la producción según la clasificación del Scienti",
      value: "year_type",
    },
    { label: "Cantidad de citas anuales", value: "year_citations" },
    { label: "Gastos anuales en APC", value: "year_apc" },
    {
      label: "Artículos anuales en acceso abierto y cerrado",
      value: "year_oa",
    },
    {
      label: "Articulos anuales publicados en las editoriales más usadas",
      value: "year_publisher",
    },
    {
      label: "Índice H anual según datos de citación de OpenAlex",
      value: "year_h",
    },
  ],
  department: [
    {
      label: "Producción por grupos de investigación según tipo de producto",
      value: "type,group",
    },
    {
      label:
        "Evolución anual de la producción según la clasificación del Scienti",
      value: "year_type",
    },
    { label: "Cantidad de citas anuales", value: "year_citations" },
    { label: "Gastos anuales en APC", value: "year_apc" },
    {
      label: "Artículos anuales en acceso abierto y cerrado",
      value: "year_oa",
    },
    {
      label: "Articulos anuales publicados en las editoriales más usadas",
      value: "year_publisher",
    },
    {
      label: "Índice H anual según datos de citación de OpenAlex",
      value: "year_h",
    },
  ],
  faculty: [
    {
      label: "Producción de los departamentos según tipo de producto",
      value: "type,department",
    },
    {
      label: "Producción por grupos de investigación según tipo de producto",
      value: "type,group",
    },
    {
      label:
        "Evolución anual de la producción según la clasificación del Scienti",
      value: "year_type",
    },
    { label: "Cantidad de citas anuales", value: "year_citations" },
    { label: "Gastos anuales en APC", value: "year_apc" },
    {
      label: "Artículos anuales en acceso abierto y cerrado",
      value: "year_oa",
    },
    {
      label: "Articulos anuales publicados en las editoriales más usadas",
      value: "year_publisher",
    },
    {
      label: "Índice H anual según datos de citación de Google Scholar",
      value: "year_h",
    },
  ],
  person: [
    {
      label:
        "Evolución anual de la producción según la clasificación del Scienti",
      value: "year_type",
    },
    { label: "Cantidad de citas anuales", value: "year_citations" },
    { label: "Gastos anuales en APC", value: "year_apc" },
    {
      label: "Artículos anuales en acceso abierto y cerrado",
      value: "year_oa",
    },
    {
      label: "Articulos anuales publicados en las editoriales más usadas",
      value: "year_publisher",
    },
    {
      label: "Índice H anual según datos de citación de OpenAlex",
      value: "year_h",
    },
  ],
};

export const PLOTLIST_PIE = {
  institution: [
    {
      label: "20 palabras más usuales en los títulos de la producción",
      value: "title_words",
    },
    { label: "Citas acumuladas de las facultades", value: "citations,faculty" },
    { label: "Artículos de las facultades", value: "products,faculty" },
    { label: "Gastos de APC proyectado según facultad", value: "apc,faculty" },
    { label: "Índice H de las facultades", value: "h,faculty" },
    {
      label: "Citas acumuladas de los departamentos",
      value: "citations,department",
    },
    { label: "Artículos de los departamentos", value: "products,department" },
    {
      label: "Gastos de APC proyectado según departamento",
      value: "apc,department",
    },
    { label: "Índice H de los departamentos", value: "h,department" },
    {
      label: "Citas acumuladas de los grupos de investigación",
      value: "citations,group",
    },
    {
      label: "Artículos de los grupos de investigación",
      value: "products,group",
    },
    {
      label: "Gastos de APC proyectado según grupo de investigación",
      value: "apc,group",
    },
    { label: "Índice H de los grupos de investigación", value: "h,group" },
    { label: "Artículos según editorial", value: "products_publisher" },
    { label: "Artículos según temas", value: "products_subject" },
    {
      label: "Productos según base de datos de origen",
      value: "products_database",
    },
    { label: "Artículos según tipo de acceso abierto", value: "products_oa" },
    { label: "Productos según sexo", value: "products_sex" },
    {
      label: "Productos según rango de edad de los autores",
      value: "products_age",
    },
    {
      label: "Artículos según categoría asignada en el Scienti",
      value: "scienti_rank",
    },
    {
      label: "Artículos en revistas rankeadas en cuartiles de Scimago",
      value: "scimago_rank",
    },
    {
      label: "Artículos en revistas de la misma institución del autor",
      value: "published_institution",
    },
  ],
  group: [
    {
      label: "20 palabras más usuales en los títulos de la producción",
      value: "title_words",
    },
    { label: "Artículos según editorial", value: "products_publisher" },
    { label: "Artículos según temas", value: "products_subject" },
    {
      label: "Productos según base de datos de origen",
      value: "products_database",
    },
    { label: "Artículos según tipo de acceso abierto", value: "products_oa" },
    { label: "Productos según sexo", value: "products_sex" },
    {
      label: "Productos según rango de edad de los autores",
      value: "products_age",
    },
    {
      label: "Artículos según categoría asignada en el Scienti",
      value: "scienti_rank",
    },
    {
      label: "Artículos en revistas rankeadas en cuartiles de Scimago",
      value: "scimago_rank",
    },
    {
      label: "Artículos en revistas de la misma institución del autor",
      value: "published_institution",
    },
  ],
  department: [
    {
      label: "20 palabras más usuales en los títulos de la producción",
      value: "title_words",
    },
    {
      label: "Citas acumuladas de los grupos de investigación",
      value: "citations,group",
    },
    {
      label: "Artículos de los grupos de investigación",
      value: "products,group",
    },
    {
      label: "Gastos de APC proyectado según grupo de investigación",
      value: "apc,group",
    },
    { label: "Índice H de los grupos de investigación", value: "h,group" },
    { label: "Artículos según editorial", value: "products_publisher" },
    { label: "Artículos según temas", value: "products_subject" },
    {
      label: "Productos según base de datos de origen",
      value: "products_database",
    },
    { label: "Artículos según tipo de acceso abierto", value: "products_oa" },
    { label: "Productos según sexo", value: "products_sex" },
    {
      label: "Productos según rango de edad de los autores",
      value: "products_age",
    },
    {
      label: "Artículos según categoría asignada en el Scienti",
      value: "scienti_rank",
    },
    {
      label: "Artículos en revistas rankeadas en cuartiles de Scimago",
      value: "scimago_rank",
    },
    {
      label: "Artículos en revistas de la misma institución del autor",
      value: "published_institution",
    },
  ],
  faculty: [
    {
      label: "20 palabras más usuales en los títulos de la producción",
      value: "title_words",
    },
    {
      label: "Citas acumuladas de los departamentos",
      value: "citations,department",
    },
    { label: "Artículos de los departamentos", value: "products,department" },
    {
      label: "Gastos de APC proyectado según departamento",
      value: "apc,department",
    },
    { label: "Índice H de los departamentos", value: "h,department" },
    {
      label: "Citas acumuladas de los grupos de investigación",
      value: "citations,group",
    },
    {
      label: "Artículos de los grupos de investigación",
      value: "products,group",
    },
    {
      label: "Gastos de APC proyectado según grupo de investigación",
      value: "apc,group",
    },
    { label: "Índice H de los grupos de investigación", value: "h,group" },
    { label: "Artículos según editorial", value: "products_publisher" },
    { label: "Artículos según temas", value: "products_subject" },
    {
      label: "Productos según base de datos de origen",
      value: "products_database",
    },
    { label: "Artículos según tipo de acceso abierto", value: "products_oa" },
    { label: "Productos según sexo", value: "products_sex" },
    {
      label: "Productos según rango de edad de los autores",
      value: "products_age",
    },
    {
      label: "Artículos según categoría asignada en el Scienti",
      value: "scienti_rank",
    },
    {
      label: "Artículos en revistas rankeadas en cuartiles de Scimago",
      value: "scimago_rank",
    },
    {
      label: "Artículos en revistas de la misma institución del autor",
      value: "published_institution",
    },
  ],
  person: [
    {
      label: "20 palabras más usuales en los títulos de la producción",
      value: "title_words",
    },
    { label: "Artículos según editorial", value: "products_publisher" },
    { label: "Artículos según temas", value: "products_subject" },
    {
      label: "Productos según base de datos de origen",
      value: "products_database",
    },
    { label: "Artículos según tipo de acceso abierto", value: "products_oa" },
    {
      label: "Artículos según categoría asignada en el Scienti",
      value: "scienti_rank",
    },
    {
      label: "Artículos en revistas rankeadas en cuartiles de Scimago",
      value: "scimago_rank",
    },
    {
      label: "Artículos en revistas de la misma institución del autor",
      value: "published_institution",
    },
  ],
};

export const PLOTLIST_MAP = [
  {
    label: "Coautorías según país de afiliación",
    value: "collaboration_worldmap",
  },
  {
    label: "Coautorías según afiliación territorial departamental",
    value: "collaboration_colombiamap",
  },
];

export const PLOTLIST_GRAPH = {
  institution: [
    { label: "Coautoría institucional", value: "collaboration_network" },
  ],
  person: [{ label: "Coautoría personal", value: "collaboration_network" }],
};
