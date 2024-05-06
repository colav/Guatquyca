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

export const AFFILIATIONLIST = [
  "institution",
  "department",
  "faculty",
  "group",
];

export const OPTIONS = [
  {
    label: "Autor",
    value: "person",
    key: "person",
  },
  {
    label: "Institución",
    value: "institution",
    key: "institution",
  },
  {
    label: "Unidad Académica",
    value: "faculty",
    key: "faculty",
  },
  {
    label: "Subunidad Académica",
    value: "department",
    key: "department",
  },
  {
    label: "Grupo",
    value: "group",
    key: "group",
  },
  {
    label: "Productos",
    value: "works",
    key: "works",
  },
  {
    label: "Proyectos",
    value: "projects",
    key: "projects",
    disabled: true,
  },
  {
    label: "Convenios",
    value: "agreements",
    key: "agreements",
    disabled: true,
  },
  {
    label: "Emprendimientos",
    value: "entrepreneurship",
    key: "entrepreneurship",
    disabled: true,
  },
];

export const OPTIONS_INDEX = {
  person: 0,
  institution: 1,
  faculty: 2,
  department: 3,
  group: 4,
  products: 5,
  projects: 6,
  agreements: 7,
  entrepreneurship: 8,
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
      label: "Producción de las Unidades Académicas según tipo de producto",
      value: "type,faculty",
      text: (
        <div>
          <p>
            Este indicador muestra la cantidad de productos generados por cada
            Unidad Académica, representado en un gráfico de columnas. En el eje
            horizontal (X) se encuentran los nombres de las Unidades Académicas,
            mientras que en el eje vertical (Y) se muestra la cantidad de
            productos por cada una.
          </p>
          <p>
            Cada columna en el gráfico representa una Unidad Académica, y las
            diferentes secciones apiladas dentro de cada columna representan los
            tipos de productos.
          </p>
        </div>
      ),
    },
    {
      label: "Producción de las Subunidades Académicas según tipo de producto",
      value: "type,department",
      text: (
        <div>
          <p>
            Este indicador muestra la cantidad de productos generados por cada
            Subunidad Académica, representado en un gráfico de columnas. En el
            eje horizontal (X) se encuentran los nombres de las Subunidades
            Académicas, mientras que en el eje vertical (Y) se muestra la
            cantidad de productos por cada una.
          </p>
          <p>
            Cada columna en el gráfico representa una Subunidad Académica, y las
            diferentes secciones apiladas dentro de cada columna representan los
            tipos de productos.
          </p>
        </div>
      ),
    },
    {
      label: "Producción por grupos de investigación según tipo de producto",
      value: "type,group",
      text: (
        <div>
          <p>
            Este indicador muestra la cantidad de productos generados por cada
            Grupo de Investigación, representado en un gráfico de columnas. En
            el eje horizontal (X) se encuentran los nombres de los Grupos de
            Investigación, mientras que en el eje vertical (Y) se muestra la
            cantidad de productos por cada uno.
          </p>
          <p>
            Cada columna en el gráfico representa un Grupo de Investigación, y
            las diferentes secciones apiladas dentro de cada columna representan
            los tipos de productos.
          </p>
        </div>
      ),
    },
    {
      label:
        "Evolución anual de la producción según la clasificación del ScienTI",
      value: "year_type",
      text: (
        <div>
          <p>
            Este indicador muestra la evolución anual de la producción
            científica, clasificada según los criterios del ScienTI, a través de
            un gráfico de columnas apiladas. En el eje horizontal (X) se
            representan los años, mientras que en el eje vertical (Y) se muestra
            la cantidad total de productos científicos producidos.
          </p>
          <p>
            Cada columna en el gráfico representa un año, y las secciones
            apiladas dentro de cada columna representan las diferentes
            clasificaciones del ScienTI aplicadas a los productos científicos.
            La altura total de cada columna indica la cantidad total de
            productos científicos producidos en ese año, desglosados por sus
            clasificaciones.
          </p>
          <p>
            Este indicador te permite visualizar cómo ha evolucionado la
            producción científica a lo largo de los años según las diferentes
            categorías de clasificación del ScienTI, lo que puede ser útil para
            identificar tendencias y áreas de enfoque en la investigación.
          </p>
        </div>
      ),
    },
    {
      label: "Cantidad de citas anuales",
      value: "year_citations",
      text: "This plot shows the annual number of citations.",
    },
    {
      label: "Gastos anuales en APC",
      value: "year_apc",
      text: "This plot shows the annual APC expenses.",
    },
    {
      label: "Artículos anuales en acceso abierto y cerrado",
      value: "year_oa",
      text: "This plot shows the annual number of articles in open access and closed access.",
    },
    {
      label: "Articulos anuales publicados en las editoriales más usadas",
      value: "year_publisher",
      text: "This plot shows the annual number of articles published in the most used publishers.",
    },
  ],
  group: [
    {
      label:
        "Evolución anual de la producción según la clasificación del Scienti",
      value: "year_type",
      text: "This plot shows the annual evolution of production based on the Scienti classification.",
    },
    {
      label: "Cantidad de citas anuales",
      value: "year_citations",
      text: "This plot shows the annual number of citations.",
    },
    {
      label: "Gastos anuales en APC",
      value: "year_apc",
      text: "This plot shows the annual APC expenses.",
    },
    {
      label: "Artículos anuales en acceso abierto y cerrado",
      value: "year_oa",
      text: "This plot shows the annual number of articles in open access and closed access.",
    },
    {
      label: "Articulos anuales publicados en las editoriales más usadas",
      value: "year_publisher",
      text: "This plot shows the annual number of articles published in the most used publishers.",
    },
  ],
  department: [
    {
      label: "Producción por grupos de investigación según tipo de producto",
      value: "type,group",
      text: "This plot shows the production of research groups based on the type of product.",
    },
    {
      label:
        "Evolución anual de la producción según la clasificación del Scienti",
      value: "year_type",
      text: "This plot shows the annual evolution of production based on the Scienti classification.",
    },
    {
      label: "Cantidad de citas anuales",
      value: "year_citations",
      text: "This plot shows the annual number of citations.",
    },
    {
      label: "Gastos anuales en APC",
      value: "year_apc",
      text: "This plot shows the annual APC expenses.",
    },
    {
      label: "Artículos anuales en acceso abierto y cerrado",
      value: "year_oa",
      text: "This plot shows the annual number of articles in open access and closed access.",
    },
    {
      label: "Articulos anuales publicados en las editoriales más usadas",
      value: "year_publisher",
      text: "This plot shows the annual number of articles published in the most used publishers.",
    },
  ],
  faculty: [
    {
      label: "Producción de los departamentos según tipo de producto",
      value: "type,department",
      text: "This plot shows the production of departments based on the type of product.",
    },
    {
      label: "Producción por grupos de investigación según tipo de producto",
      value: "type,group",
      text: "This plot shows the production of research groups based on the type of product.",
    },
    {
      label:
        "Evolución anual de la producción según la clasificación del Scienti",
      value: "year_type",
      text: "This plot shows the annual evolution of production based on the Scienti classification.",
    },
    {
      label: "Cantidad de citas anuales",
      value: "year_citations",
      text: "This plot shows the annual number of citations.",
    },
    {
      label: "Gastos anuales en APC",
      value: "year_apc",
      text: "This plot shows the annual APC expenses.",
    },
    {
      label: "Artículos anuales en acceso abierto y cerrado",
      value: "year_oa",
      text: "This plot shows the annual number of articles in open access and closed access.",
    },
    {
      label: "Articulos anuales publicados en las editoriales más usadas",
      value: "year_publisher",
      text: "This plot shows the annual number of articles published in the most used publishers.",
    },
  ],
  person: [
    {
      label:
        "Evolución anual de la producción según la clasificación del Scienti",
      value: "year_type",
      text: "This plot shows the annual evolution of production based on the Scienti classification.",
    },
    {
      label: "Cantidad de citas anuales",
      value: "year_citations",
      text: "This plot shows the annual number of citations.",
    },
    {
      label: "Gastos anuales en APC",
      value: "year_apc",
      text: "This plot shows the annual APC expenses.",
    },
    {
      label: "Artículos anuales en acceso abierto y cerrado",
      value: "year_oa",
      text: "This plot shows the annual number of articles in open access and closed access.",
    },
    {
      label: "Articulos anuales publicados en las editoriales más usadas",
      value: "year_publisher",
      text: "This plot shows the annual number of articles published in the most used publishers.",
    },
  ],
};

export const PLOTLIST_PIE = {
  institution: [
    {
      label: "20 palabras más usuales en los títulos de la producción",
      value: "title_words",
      text: "Palabras más usuales en los títulos",
    },
    {
      label: "Citas acumuladas de las facultades",
      value: "citations,faculty",
      text: "Citas acumuladas de las facultades",
    },
    {
      label: "Artículos de las facultades",
      value: "products,faculty",
      text: "Artículos de las facultades",
    },
    {
      label: "Gastos de APC proyectado según facultad",
      value: "apc,faculty",
      text: "Gastos de APC proyectado según facultad",
    },
    {
      label: "Índice H de las facultades",
      value: "h,faculty",
      text: "Índice H de las facultades",
    },
    {
      label: "Citas acumuladas de los departamentos",
      value: "citations,department",
      text: "Citas acumuladas de los departamentos",
    },
    {
      label: "Artículos de los departamentos",
      value: "products,department",
      text: "Artículos de los departamentos",
    },
    {
      label: "Gastos de APC proyectado según departamento",
      value: "apc,department",
      text: "Gastos de APC proyectado según departamento",
    },
    {
      label: "Índice H de los departamentos",
      value: "h,department",
      text: "Índice H de los departamentos",
    },
    {
      label: "Citas acumuladas de los grupos de investigación",
      value: "citations,group",
      text: "Citas acumuladas de los grupos de investigación",
    },
    {
      label: "Artículos de los grupos de investigación",
      value: "products,group",
      text: "Artículos de los grupos de investigación",
    },
    {
      label: "Gastos de APC proyectado según grupo de investigación",
      value: "apc,group",
      text: "Gastos de APC proyectado según grupo de investigación",
    },
    {
      label: "Índice H de los grupos de investigación",
      value: "h,group",
      text: "Índice H de los grupos de investigación",
    },
    {
      label: "Artículos según editorial",
      value: "products_publisher",
      text: "Artículos según editorial",
    },
    {
      label: "Artículos según temas",
      value: "products_subject",
      text: "Artículos según temas",
    },
    {
      label: "Productos según base de datos de origen",
      value: "products_database",
      text: "Productos según base de datos de origen",
    },
    {
      label: "Artículos según tipo de acceso abierto",
      value: "products_oa",
      text: "Artículos según tipo de acceso abierto",
    },
    {
      label: "Productos según sexo",
      value: "products_sex",
      text: "Productos según sexo",
    },
    {
      label: "Productos según rango de edad de los autores",
      value: "products_age",
      text: "Productos según rango de edad de los autores",
    },
    {
      label: "Artículos según categoría asignada en el Scienti",
      value: "scienti_rank",
      text: "Artículos según categoría asignada en el Scienti",
    },
    {
      label: "Artículos en revistas rankeadas en cuartiles de Scimago",
      value: "scimago_rank",
      text: "Artículos en revistas rankeadas en cuartiles de Scimago",
    },
    {
      label: "Artículos en revistas de la misma institución del autor",
      value: "published_institution",
      text: "Artículos en revistas de la misma institución del autor",
    },
  ],
  group: [
    {
      label: "20 palabras más usuales en los títulos de la producción",
      value: "title_words",
      text: "Palabras más usuales en los títulos",
    },
    {
      label: "Artículos según editorial",
      value: "products_publisher",
      text: "Artículos según editorial",
    },
    {
      label: "Artículos según temas",
      value: "products_subject",
      text: "Artículos según temas",
    },
    {
      label: "Productos según base de datos de origen",
      value: "products_database",
      text: "Productos según base de datos de origen",
    },
    {
      label: "Artículos según tipo de acceso abierto",
      value: "products_oa",
      text: "Artículos según tipo de acceso abierto",
    },
    {
      label: "Productos según sexo",
      value: "products_sex",
      text: "Productos según sexo",
    },
    {
      label: "Productos según rango de edad de los autores",
      value: "products_age",
      text: "Productos según rango de edad de los autores",
    },
    {
      label: "Artículos según categoría asignada en el Scienti",
      value: "scienti_rank",
      text: "Artículos según categoría asignada en el Scienti",
    },
    {
      label: "Artículos en revistas rankeadas en cuartiles de Scimago",
      value: "scimago_rank",
      text: "Artículos en revistas rankeadas en cuartiles de Scimago",
    },
    {
      label: "Artículos en revistas de la misma institución del autor",
      value: "published_institution",
      text: "Artículos en revistas de la misma institución del autor",
    },
  ],
  department: [
    {
      label: "20 palabras más usuales en los títulos de la producción",
      value: "title_words",
      text: "Palabras más usuales en los títulos",
    },
    {
      label: "Citas acumuladas de los grupos de investigación",
      value: "citations,group",
      text: "Citas acumuladas de los grupos de investigación",
    },
    {
      label: "Artículos de los grupos de investigación",
      value: "products,group",
      text: "Artículos de los grupos de investigación",
    },
    {
      label: "Gastos de APC proyectado según grupo de investigación",
      value: "apc,group",
      text: "Gastos de APC proyectado según grupo de investigación",
    },
    {
      label: "Índice H de los grupos de investigación",
      value: "h,group",
      text: "Índice H de los grupos de investigación",
    },
    {
      label: "Artículos según editorial",
      value: "products_publisher",
      text: "Artículos según editorial",
    },
    {
      label: "Artículos según temas",
      value: "products_subject",
      text: "Artículos según temas",
    },
    {
      label: "Productos según base de datos de origen",
      value: "products_database",
      text: "Productos según base de datos de origen",
    },
    {
      label: "Artículos según tipo de acceso abierto",
      value: "products_oa",
      text: "Artículos según tipo de acceso abierto",
    },
    {
      label: "Productos según sexo",
      value: "products_sex",
      text: "Productos según sexo",
    },
    {
      label: "Productos según rango de edad de los autores",
      value: "products_age",
      text: "Productos según rango de edad de los autores",
    },
    {
      label: "Artículos según categoría asignada en el Scienti",
      value: "scienti_rank",
      text: "Artículos según categoría asignada en el Scienti",
    },
    {
      label: "Artículos en revistas rankeadas en cuartiles de Scimago",
      value: "scimago_rank",
      text: "Artículos en revistas rankeadas en cuartiles de Scimago",
    },
    {
      label: "Artículos en revistas de la misma institución del autor",
      value: "published_institution",
      text: "Artículos en revistas de la misma institución del autor",
    },
  ],
  faculty: [
    {
      label: "20 palabras más usuales en los títulos de la producción",
      value: "title_words",
      text: "Palabras más usuales en los títulos",
    },
    {
      label: "Citas acumuladas de los departamentos",
      value: "citations,department",
      text: "Citas acumuladas de los departamentos",
    },
    {
      label: "Artículos de los departamentos",
      value: "products,department",
      text: "Artículos de los departamentos",
    },
    {
      label: "Gastos de APC proyectado según departamento",
      value: "apc,department",
      text: "Gastos de APC proyectado según departamento",
    },
    {
      label: "Índice H de los departamentos",
      value: "h,department",
      text: "Índice H de los departamentos",
    },
    {
      label: "Citas acumuladas de los grupos de investigación",
      value: "citations,group",
      text: "Citas acumuladas de los grupos de investigación",
    },
    {
      label: "Artículos de los grupos de investigación",
      value: "products,group",
      text: "Artículos de los grupos de investigación",
    },
    {
      label: "Gastos de APC proyectado según grupo de investigación",
      value: "apc,group",
      text: "Gastos de APC proyectado según grupo de investigación",
    },
    {
      label: "Índice H de los grupos de investigación",
      value: "h,group",
      text: "Índice H de los grupos de investigación",
    },
    {
      label: "Artículos según editorial",
      value: "products_publisher",
      text: "Artículos según editorial",
    },
    {
      label: "Artículos según temas",
      value: "products_subject",
      text: "Artículos según temas",
    },
    {
      label: "Productos según base de datos de origen",
      value: "products_database",
      text: "Productos según base de datos de origen",
    },
    {
      label: "Artículos según tipo de acceso abierto",
      value: "products_oa",
      text: "Artículos según tipo de acceso abierto",
    },
    {
      label: "Productos según sexo",
      value: "products_sex",
      text: "Productos según sexo",
    },
    {
      label: "Productos según rango de edad de los autores",
      value: "products_age",
      text: "Productos según rango de edad de los autores",
    },
    {
      label: "Artículos según categoría asignada en el Scienti",
      value: "scienti_rank",
      text: "Artículos según categoría asignada en el Scienti",
    },
    {
      label: "Artículos en revistas rankeadas en cuartiles de Scimago",
      value: "scimago_rank",
      text: "Artículos en revistas rankeadas en cuartiles de Scimago",
    },
    {
      label: "Artículos en revistas de la misma institución del autor",
      value: "published_institution",
      text: "Artículos en revistas de la misma institución del autor",
    },
  ],
  person: [
    {
      label: "20 palabras más usuales en los títulos de la producción",
      value: "title_words",
      text: "Palabras más usuales en los títulos",
    },
    {
      label: "Artículos según editorial",
      value: "products_publisher",
      text: "Artículos según editorial",
    },
    {
      label: "Artículos según temas",
      value: "products_subject",
      text: "Artículos según temas",
    },
    {
      label: "Productos según base de datos de origen",
      value: "products_database",
      text: "Productos según base de datos de origen",
    },
    {
      label: "Artículos según tipo de acceso abierto",
      value: "products_oa",
      text: "Artículos según tipo de acceso abierto",
    },
    {
      label: "Artículos según categoría asignada en el Scienti",
      value: "scienti_rank",
      text: "Artículos según categoría asignada en el Scienti",
    },
    {
      label: "Artículos en revistas rankeadas en cuartiles de Scimago",
      value: "scimago_rank",
      text: "Artículos en revistas rankeadas en cuartiles de Scimago",
    },
    {
      label: "Artículos en revistas de la misma institución del autor",
      value: "published_institution",
      text: "Artículos en revistas de la misma institución del autor",
    },
  ],
};

export const PLOTLIST_MAP = [
  {
    label: "Coautorías según país de afiliación",
    value: "collaboration_worldmap",
    text: "This plot shows co-authorships based on country affiliation.",
  },
  {
    label: "Coautorías según afiliación territorial departamental",
    value: "collaboration_colombiamap",
    text: "This plot shows co-authorships based on territorial department affiliation in Colombia.",
  },
];

export const PLOTLIST_GRAPH = {
  institution: [
    {
      label: "Coautoría institucional",
      value: "collaboration_network",
      text: "This plot shows co-authorships based on institutional affiliation.",
    },
  ],
  person: [
    {
      label: "Coautoría personal",
      value: "collaboration_network",
      text: "This plot shows co-authorships based on personal affiliation.",
    },
  ],
};
