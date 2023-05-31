export const CHECKLIST = {
  AFFILIATIONENTITIES: ["department", "group", "faculty", "institution"],
  AFFILIATIONURL: ["department", "group", "faculty", "institution"],
};

export const TITLES = {
  person: "Autores",
  group: "Grupos",
  institution: "Instituciones",
  literature: "Producción",
  department: "Departamentos",
  faculty: "Facultades",
  projects: "Proyectos",
  agreements: "Convenios",
  entrepreneurship: "Emprendimientos",
};

export const PLOTLIST_STACKED = {
  institution: [
    {
      label: "Producción de las facultades según tipo de producto",
      value: "faculty_type",
    },
    {
      label: "Producción de los departamentos según tipo de producto",
      value: "department_type",
    },
    {
      label: "Producción por grupos de investigación según tipo de producto",
      value: "group_type",
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
    { label: "Productos anuales por investigadores", value: "year_researcher" },
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
    { label: "Productos anuales por investigadores", value: "year_researcher" },
  ],
  department: [
    {
      label: "Producción por grupos de investigación según tipo de producto",
      value: "group_type",
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
    { label: "Productos anuales por investigadores", value: "year_researcher" },
  ],
  faculty: [
    { label: "Índice H de las facultades", value: "h_faculty" },
    {
      label: "Producción por grupos de investigación según tipo de producto",
      value: "group_type",
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
    { label: "Productos anuales por investigadores", value: "year_researcher" },
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
    { label: "Productos anuales por investigadores", value: "year_researcher" },
  ],
};

export const PLOTLIST_PIE = {
  institution: [
    {
      label: "20 palabras más usuales en los títulos de la producción",
      value: "title_words",
    },
    { label: "Citas acumuladas de las facultades", value: "citations_faculty" },
    { label: "Artículos de las facultades", value: "products_faculty" },
    { label: "Gastos de APC proyectado según facultad", value: "apc_faculty" },
    { label: "Índice H de las facultades", value: "h_faculty" },
    {
      label: "Citas acumuladas de los departamentos",
      value: "citations_department",
    },
    { label: "Artículos de los departamentos", value: "products_department" },
    {
      label: "Gastos de APC proyectado según departamento",
      value: "apc_department",
    },
    { label: "Índice H de los departamentos", value: "h_department" },
    {
      label: "Citas acumuladas de los grupos de investigación",
      value: "citations_group",
    },
    {
      label: "Artículos de los grupos de investigación",
      value: "products_group",
    },
    {
      label: "Gastos de APC proyectado según grupo de investigación",
      value: "apc_group",
    },
    { label: "Índice H de los grupos de investigación", value: "h_group" },
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
      value: "citations_group",
    },
    {
      label: "Artículos de los grupos de investigación",
      value: "products_group",
    },
    {
      label: "Gastos de APC proyectado según grupo de investigación",
      value: "apc_group",
    },
    { label: "Índice H de los grupos de investigación", value: "h_group" },
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
    { label: "Índice H de las facultades", value: "h_faculty" },
    {
      label: "Citas acumuladas de los departamentos",
      value: "citations_department",
    },
    { label: "Artículos de los departamentos", value: "products_department" },
    {
      label: "Gastos de APC proyectado según departamento",
      value: "apc_department",
    },
    { label: "Índice H de los departamentos", value: "h_department" },
    {
      label: "Citas acumuladas de los grupos de investigación",
      value: "citations_group",
    },
    {
      label: "Artículos de los grupos de investigación",
      value: "products_group",
    },
    {
      label: "Gastos de APC proyectado según grupo de investigación",
      value: "apc_group",
    },
    { label: "Índice H de los grupos de investigación", value: "h_group" },
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
