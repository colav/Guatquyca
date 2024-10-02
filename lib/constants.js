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

// Temporal until the the migration is done //
export const FOUNDERS = [
  "66b582ad7102ee7e0fcc02c7",
  "66b582c27102ee7e0fcc5f17",
  "66b582c17102ee7e0fcc5e4a",
  "66b582aa7102ee7e0fcbf630",
];

export const HIDE = [
  "type,faculty",
  "type,department",
  "year_type",
  "citations,faculty",
  "products,faculty",
  "apc,faculty",
  "h,faculty",
  "h,department",
  "citations,department",
  "products,department",
  "apc,department",
];
// Temporal until the the migration is done //

export const PLOTLIST_STACKED = {
  institution: [
    {
      label:
        "Producción de las Unidades Académicas según tipo de producto de acuerdo al ScienTI",
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
      label:
        "Producción de las Subunidades Académicas según tipo de producto de acuerdo al ScienTI",
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
      label:
        "Producción por grupos de investigación según tipo de producto de acuerdo al ScienTI",
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
      label: "Cantidad anual de articulos citantes según OpenAlex",
      value: "year_citations",
      text: "This plot shows the annual number of citations.",
    },
    {
      label: "Gastos anuales proyectados de APC según datos de DOAJ",
      value: "year_apc",
      text: "This plot shows the annual APC expenses.",
    },
    /*     {
      label:
        "Número de artículos publicados anualmente en acceso cerrado y abierto",
      value: "year_oa",
      text: "This plot shows the annual number of articles in open access and closed access.",
    }, */
    /* {
      label:
        "Número de artículos publicados anualmente en las editoriales más usadas",
      value: "year_publisher",
      text: "This plot shows the annual number of articles published in the most used publishers.",
    }, */
  ],
  group: [
    /* {
      label:
        "Evolución anual de la producción según la clasificación del Scienti",
      value: "year_type",
      text: "This plot shows the annual evolution of production based on the Scienti classification.",
    }, */
    {
      label: "Cantidad anual de articulos citantes según OpenAlex",
      value: "year_citations",
      text: "This plot shows the annual number of citations.",
    },
    {
      label: "Gastos anuales proyectados de APC según datos de DOAJ",
      value: "year_apc",
      text: "This plot shows the annual APC expenses.",
    },
    /*     {
      label:
        "Número de artículos publicados anualmente en acceso cerrado y abierto",
      value: "year_oa",
      text: "This plot shows the annual number of articles in open access and closed access.",
    }, */
    /* {
      label:
        "Número de artículos publicados anualmente en las editoriales más usadas",
      value: "year_publisher",
      text: "This plot shows the annual number of articles published in the most used publishers.",
    }, */
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
      label: "Cantidad anual de articulos citantes según OpenAlex",
      value: "year_citations",
      text: "This plot shows the annual number of citations.",
    },
    {
      label: "Gastos anuales proyectados de APC según datos de DOAJ",
      value: "year_apc",
      text: "This plot shows the annual APC expenses.",
    },
    /*     {
      label:
        "Número de artículos publicados anualmente en acceso cerrado y abierto",
      value: "year_oa",
      text: "This plot shows the annual number of articles in open access and closed access.",
    }, */
    /* {
      label:
        "Número de artículos publicados anualmente en las editoriales más usadas",
      value: "year_publisher",
      text: "This plot shows the annual number of articles published in the most used publishers.",
    }, */
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
      label: "Cantidad anual de articulos citantes según OpenAlex",
      value: "year_citations",
      text: "This plot shows the annual number of citations.",
    },
    {
      label: "Gastos anuales proyectados de APC según datos de DOAJ",
      value: "year_apc",
      text: "This plot shows the annual APC expenses.",
    },
    /*     {
      label:
        "Número de artículos publicados anualmente en acceso cerrado y abierto",
      value: "year_oa",
      text: "This plot shows the annual number of articles in open access and closed access.",
    }, */
    /* {
      label:
        "Número de artículos publicados anualmente en las editoriales más usadas",
      value: "year_publisher",
      text: "This plot shows the annual number of articles published in the most used publishers.",
    }, */
  ],
  person: [
    {
      label:
        "Evolución anual de la producción según la clasificación del Scienti",
      value: "year_type",
      text: "This plot shows the annual evolution of production based on the Scienti classification.",
    },
    {
      label: "Cantidad anual de articulos citantes según OpenAlex",
      value: "year_citations",
      text: "This plot shows the annual number of citations.",
    },
    {
      label: "Gastos anuales proyectados de APC según datos de DOAJ",
      value: "year_apc",
      text: "This plot shows the annual APC expenses.",
    },
    /*     {
      label:
        "Número de artículos publicados anualmente en acceso cerrado y abierto",
      value: "year_oa",
      text: "This plot shows the annual number of articles in open access and closed access.",
    }, */
    /* {
      label:
        "Número de artículos publicados anualmente en las editoriales más usadas",
      value: "year_publisher",
      text: "This plot shows the annual number of articles published in the most used publishers.",
    }, */
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
      label:
        "Número de citas acumuladas de las Unidades Académicas de acuerdo a Google Scholar",
      value: "citations,faculty",
      text: "Número de citas acumuladas de las Unidades Académicas de acuerdo a Google Scholar",
    },
    {
      label: "Número de artículos publicados por las Unidades Académicas",
      value: "products,faculty",
      text: "Número de artículos publicados por las Unidades Académicas",
    },
    {
      label: "Gastos de APC proyectados por Unidad Académica",
      value: "apc,faculty",
      text: "Gastos de APC proyectados por Unidad Académica",
    },
    {
      label: "Índice H de las Unidades Académicas",
      value: "h,faculty",
      text: "Índice H de las Unidades Académicas",
    },
    {
      label: "Número de citas acumuladas por Subunidad Académica",
      value: "citations,department",
      text: "Número de citas acumuladas por Subunidad Académica",
    },
    {
      label: "Número de artículos acumulados por Subunidad Académica",
      value: "products,department",
      text: "Número de artículos acumulados por Subunidad Académica",
    },
    {
      label: "Gastos de APC proyectados por Subunidad Académica",
      value: "apc,department",
      text: "Gastos de APC proyectados por Subunidad Académica",
    },
    {
      label: "Índice H de las Subunidades Académicas",
      value: "h,department",
      text: "Índice H de las Subunidades Académicas",
    },
    {
      label: "Número de citas acumuladas por los grupos de investigación",
      value: "citations,group",
      text: "Número de citas acumuladas por los grupos de investigación",
    },
    {
      label: "Número de artículos públicados por los grupos de investigación",
      value: "products,group",
      text: "Número de artículos públicados por los grupos de investigación",
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
      label: "Número de artículos publicados según editorial",
      value: "products_publisher",
      text: "Número de artículos publicados según editorial",
    },
    {
      label:
        "Número de artículos publicados de acuerdo a los temas clasificados por OpenAlex",
      value: "products_subject",
      text: "Número de artículos publicados de acuerdo a los temas clasificados por OpenAlex",
    },
    {
      label: "Número de productos realizados según base de datos de origen",
      value: "products_database",
      text: "Número de productos realizados según base de datos de origen",
    },
    /*     {
      label: "Número de artículos publicados de acuerdo con la ruta de acceso",
      value: "products_oa",
      text: "Número de artículos publicados de acuerdo con la ruta de acceso",
    }, */
    /*     {
      label: "Número de productos realizados según el sexo",
      value: "products_sex",
      text: "Número de productos realizados según el sexo",
    }, */
    /*     {
      label:
        "Número de productos realizados según el rango de edad de los autores",
      value: "products_age",
      text: "Número de productos realizados según el rango de edad de los autores",
    }, */
    /*     {
      label: "Número de artículos publicados según la categoría del ScienTI",
      value: "scienti_rank",
      text: "Número de artículos publicados según la categoría del ScienTI",
    }, */
    /*     {
      label:
        "Número de artículos publicados en revistas rankeadas según cuartiles de Scimago",
      value: "scimago_rank",
      text: "Número de artículos publicados en revistas rankeadas según cuartiles de Scimago",
    }, */
    /*     {
      label:
        "Número de artículos publicados en revistas de la misma institución (endogamia)",
      value: "published_institution",
      text: "Número de artículos publicados en revistas de la misma institución (endogamia)",
    }, */
  ],
  group: [
    {
      label: "20 palabras más usuales en los títulos de la producción",
      value: "title_words",
      text: "Palabras más usuales en los títulos",
    },
    {
      label: "Número de artículos publicados según editorial",
      value: "products_publisher",
      text: "Número de artículos publicados según editorial",
    },
    {
      label:
        "Número de artículos publicados de acuerdo a los temas clasificados por OpenAlex",
      value: "products_subject",
      text: "Número de artículos publicados de acuerdo a los temas clasificados por OpenAlex",
    },
    /* {
      label: "Número de productos realizados según base de datos de origen",
      value: "products_database",
      text: "Número de productos realizados según base de datos de origen",
    }, */
    /*     {
      label: "Número de artículos publicados de acuerdo con la ruta de acceso",
      value: "products_oa",
      text: "Número de artículos publicados de acuerdo con la ruta de acceso",
    }, */
    /* {
      label: "Número de productos realizados según el sexo",
      value: "products_sex",
      text: "Número de productos realizados según el sexo",
    }, */
    /* {
      label:
        "Número de productos realizados según el rango de edad de los autores",
      value: "products_age",
      text: "Número de productos realizados según el rango de edad de los autores",
    }, */
    /* {
      label: "Número de artículos publicados según la categoría del ScienTI",
      value: "scienti_rank",
      text: "Número de artículos publicados según la categoría del ScienTI",
    }, */
    /* {
      label:
        "Número de artículos publicados en revistas rankeadas según cuartiles de Scimago",
      value: "scimago_rank",
      text: "Número de artículos publicados en revistas rankeadas según cuartiles de Scimago",
    }, */
    /*     {
      label:
        "Número de artículos publicados en revistas de la misma institución (endogamia)",
      value: "published_institution",
      text: "Número de artículos publicados en revistas de la misma institución (endogamia)",
    }, */
  ],
  department: [
    {
      label: "20 palabras más usuales en los títulos de la producción",
      value: "title_words",
      text: "Palabras más usuales en los títulos",
    },
    {
      label: "Número de citas acumuladas por los grupos de investigación",
      value: "citations,group",
      text: "Número de citas acumuladas por los grupos de investigación",
    },
    {
      label: "Número de artículos públicados por los grupos de investigación",
      value: "products,group",
      text: "Número de artículos públicados por los grupos de investigación",
    },
    /* {
      label: "Gastos de APC proyectado según grupo de investigación",
      value: "apc,group",
      text: "Gastos de APC proyectado según grupo de investigación",
    }, */
    {
      label: "Índice H de los grupos de investigación",
      value: "h,group",
      text: "Índice H de los grupos de investigación",
    },
    {
      label: "Número de artículos publicados según editorial",
      value: "products_publisher",
      text: "Número de artículos publicados según editorial",
    },
    {
      label:
        "Número de artículos publicados de acuerdo a los temas clasificados por OpenAlex",
      value: "products_subject",
      text: "Número de artículos publicados de acuerdo a los temas clasificados por OpenAlex",
    },
    {
      label: "Número de productos realizados según base de datos de origen",
      value: "products_database",
      text: "Número de productos realizados según base de datos de origen",
    },
    /*     {
      label: "Número de artículos publicados de acuerdo con la ruta de acceso",
      value: "products_oa",
      text: "Número de artículos publicados de acuerdo con la ruta de acceso",
    }, */
    /*     {
      label: "Número de productos realizados según el sexo",
      value: "products_sex",
      text: "Número de productos realizados según el sexo",
    }, */
    /*     {
      label:
        "Número de productos realizados según el rango de edad de los autores",
      value: "products_age",
      text: "Número de productos realizados según el rango de edad de los autores",
    }, */
    /*     {
      label: "Número de artículos publicados según la categoría del ScienTI",
      value: "scienti_rank",
      text: "Número de artículos publicados según la categoría del ScienTI",
    }, */
    /*     {
      label:
        "Número de artículos publicados en revistas rankeadas según cuartiles de Scimago",
      value: "scimago_rank",
      text: "Número de artículos publicados en revistas rankeadas según cuartiles de Scimago",
    }, */
    /*     {
      label:
        "Número de artículos publicados en revistas de la misma institución (endogamia)",
      value: "published_institution",
      text: "Número de artículos publicados en revistas de la misma institución (endogamia)",
    }, */
  ],
  faculty: [
    {
      label: "20 palabras más usuales en los títulos de la producción",
      value: "title_words",
      text: "Palabras más usuales en los títulos",
    },
    {
      label: "Número de citas acumuladas por Subunidad Académica",
      value: "citations,department",
      text: "Número de citas acumuladas por Subunidad Académica",
    },
    {
      label: "Número de artículos acumulados por Subunidad Académica",
      value: "products,department",
      text: "Número de artículos acumulados por Subunidad Académica",
    },
    {
      label: "Gastos de APC proyectados por Subunidad Académica",
      value: "apc,department",
      text: "Gastos de APC proyectados por Subunidad Académica",
    },
    {
      label: "Índice H de las Subunidades Académicas",
      value: "h,department",
      text: "Índice H de las Subunidades Académicas",
    },
    {
      label: "Número de citas acumuladas por los grupos de investigación",
      value: "citations,group",
      text: "Número de citas acumuladas por los grupos de investigación",
    },
    {
      label: "Número de artículos públicados por los grupos de investigación",
      value: "products,group",
      text: "Número de artículos públicados por los grupos de investigación",
    },
    /* {
      label: "Gastos de APC proyectado según grupo de investigación",
      value: "apc,group",
      text: "Gastos de APC proyectado según grupo de investigación",
    }, */
    {
      label: "Índice H de los grupos de investigación",
      value: "h,group",
      text: "Índice H de los grupos de investigación",
    },
    {
      label: "Número de artículos publicados según editorial",
      value: "products_publisher",
      text: "Número de artículos publicados según editorial",
    },
    {
      label:
        "Número de artículos publicados de acuerdo a los temas clasificados por OpenAlex",
      value: "products_subject",
      text: "Número de artículos publicados de acuerdo a los temas clasificados por OpenAlex",
    },
    {
      label: "Número de productos realizados según base de datos de origen",
      value: "products_database",
      text: "Número de productos realizados según base de datos de origen",
    },
    /*     {
      label: "Número de artículos publicados de acuerdo con la ruta de acceso",
      value: "products_oa",
      text: "Número de artículos publicados de acuerdo con la ruta de acceso",
    }, */
    /*     {
      label: "Número de productos realizados según el sexo",
      value: "products_sex",
      text: "Número de productos realizados según el sexo",
    }, */
    /*     {
      label:
        "Número de productos realizados según el rango de edad de los autores",
      value: "products_age",
      text: "Número de productos realizados según el rango de edad de los autores",
    }, */
    /*     {
      label: "Número de artículos publicados según la categoría del ScienTI",
      value: "scienti_rank",
      text: "Número de artículos publicados según la categoría del ScienTI",
    }, */
    /*     {
      label:
        "Número de artículos publicados en revistas rankeadas según cuartiles de Scimago",
      value: "scimago_rank",
      text: "Número de artículos publicados en revistas rankeadas según cuartiles de Scimago",
    }, */
    /*     {
      label:
        "Número de artículos publicados en revistas de la misma institución (endogamia)",
      value: "published_institution",
      text: "Número de artículos publicados en revistas de la misma institución (endogamia)",
    }, */
  ],
  person: [
    {
      label: "20 palabras más usuales en los títulos de la producción",
      value: "title_words",
      text: "Palabras más usuales en los títulos",
    },
    {
      label: "Número de artículos publicados según editorial",
      value: "products_publisher",
      text: "Número de artículos publicados según editorial",
    },
    {
      label:
        "Número de artículos publicados de acuerdo a los temas clasificados por OpenAlex",
      value: "products_subject",
      text: "Número de artículos publicados de acuerdo a los temas clasificados por OpenAlex",
    },
    /* {
      label: "Número de productos realizados según base de datos de origen",
      value: "products_database",
      text: "Número de productos realizados según base de datos de origen",
    }, */
    /* {
      label: "Número de artículos publicados de acuerdo con la ruta de acceso",
      value: "products_oa",
      text: "Número de artículos publicados de acuerdo con la ruta de acceso",
    }, */
    /* {
      label: "Número de artículos publicados según la categoría del ScienTI",
      value: "scienti_rank",
      text: "Número de artículos publicados según la categoría del ScienTI",
    }, */
    /* {
      label:
        "Número de artículos publicados en revistas rankeadas según cuartiles de Scimago",
      value: "scimago_rank",
      text: "Número de artículos publicados en revistas rankeadas según cuartiles de Scimago",
    }, */
    /*     {
      label:
        "Número de artículos publicados en revistas de la misma institución (endogamia)",
      value: "published_institution",
      text: "Número de artículos publicados en revistas de la misma institución (endogamia)",
    }, */
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

export const PAPERBUZZ_SOURCES_MULTIPLIER = {
  newsfeed: 4,
  wordpressdotcom: 4,
  wikipedia: 2,
  reddit: 2,
  f1000: 2,
  datacite: 2,
  "reddit-links": 2,
  twitter: 1,
  web: 1,
  "cambia-lens": 1,
};

export const PRODUCT_TYPES = {
  article: "Artículo",
  book: "Libro",
  "book-chapter": "Capítulo de libro",
  dissertation: "Tesis",
  preprint: "Preprint",
  dataset: "Dataset",
  paratext: "Paratexto",
  other: "Otro",
  "reference-entry": "Entrada de referencia",
  review: "Revisión",
  report: "Reporte",
  "peer-review": "Revisión por pares",
  standard: "Estándar",
  editorial: "Editorial",
  erratum: "Erratum",
  grant: "Grant",
  letter: "Carta",
  "supplementary-materials": "Materiales suplementarios",
  phdthesis: "Tesis de doctorado",
  techreport: "Informe técnico",
  misc: "Misceláneo",
  marterthesis: "Tesis de maestría",
  proceedings: "Actas",
};
