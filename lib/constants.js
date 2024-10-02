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
  patents: "Patentes",
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
  patents: "Patente",
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
    label: "Patentes",
    value: "patents",
    key: "patents",
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
  },
  {
    label: "Otros Productos",
    value: "other_works",
    key: "other_works",
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
  patents: 5,
  works: 6,
  projects: 7,
  other_works: 8,
  agreements: 9,
  entrepreneurship: 10,
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

export const PLOTLIST = [
  {
    value: "collaboration",
    title: "Colaboración",
    selectable: false,
    children: [
      {
        title: "Coautorías según país de afiliación",
        value: "coauthorship_by_country_map",
        text: (
          <p>
            Conteo del número de veces que aparece un país como procedencia en
            la afiliación de los artículos considerados. Se cuenta un país por
            artículo. Los datos provienen de OpenAlex y están enriquecidos con
            las bases de datos disponibles en ImpactU.
          </p>
        ),
        type: "map",
      },
      {
        title: "Coautorías según afiliación territorial departamental",
        value: "coauthorship_by_colombian_department_map",
        text: (
          <p>
            Conteo del número de veces que aparece un departamento como
            procedencia en la afiliación de los artículos considerados. Se
            cuenta un departamento por artículo. Los datos provienen de OpenAlex
            y están enriquecidos con las bases de datos disponibles en ImpactU.
          </p>
        ),
        type: "map",
      },
      {
        title: "Coautoría personal",
        value: "author_coauthorship_network",
        text: (
          <p>
            Conteo del número de veces que aparece un autor en el total de
            artículos. Las relaciones son de coautoría y se registra el número
            de enlaces total con el coautor. El grado, es el número de coautores
            con los que se tiene relación sin considerar su peso. Los datos
            provienen de OpenAlex, enriquecidos con las bases de datos
            disponibles en ImpactU.
          </p>
        ),
        type: "graph",
      },
      {
        title: "Coautoría institucional",
        value: "institutional_coauthorship_network",
        text: (
          <p>
            Conteo del número de veces que aparece una institución como
            procedencia en la afiliación de los artículos considerados. Se
            cuenta una institución por artículo. Los datos provienen de OpenAlex
            y están enriquecidos con las bases de datos disponibles en ImpactU.
          </p>
        ),
        type: "graph",
      },
    ],
  },
  {
    value: "apc",
    title: "Acceso y APC",
    selectable: false,
    children: [
      {
        title: "Gastos de APC proyectados por Unidad Académica",
        value: "apc_expenses_by_faculty",
        text: (
          <p>
            Cálculo de la sumatoria en USD de los precios de APC por artículo de
            todas las unidades académicas según los datos disponibles en DOAJ.
          </p>
        ),
        type: "percentage",
      },
      {
        title: "Gastos de APC proyectados por Subunidad Académica",
        value: "apc_expenses_by_department",
        text: (
          <p>
            Cálculo de la sumatoria en USD de los precios de APC por artículo de
            todas las subunidades académicas según los datos disponibles en
            DOAJ.
          </p>
        ),
        type: "percentage",
      },
      {
        title: "Gastos de APC proyectados por Grupo de Investigación",
        value: "apc_expenses_by_group",
        text: (
          <p>
            Cálculo de la sumatoria en USD de los precios de APC por artículo de
            todos los grupos de investigación según los datos disponibles en
            DOAJ.
          </p>
        ),
        type: "percentage",
      },
      {
        title:
          "Número de artículos publicados de acuerdo con la ruta de acceso",
        value: "articles_by_access_route",
        text: (
          <p>
            Cálculo de la sumatoria de artículos por ruta de acceso de acuerdo a
            la información disponible en OpenAlex.
          </p>
        ),
        type: "percentage",
      },
      {
        title: "Gastos anuales proyectados de APC",
        value: "annual_apc_expenses",
        text: (
          <p>
            Cálculo de la sumatoria anual de los precios del APC por artículo
            según los datos disponibles en DOAJ.
          </p>
        ),
        type: "distribution",
      },
      {
        title:
          "Número de artículos publicados anualmente en acceso cerrado y abierto",
        value: "annual_articles_open_access",
        text: (
          <p>
            Cálculo de la sumatoria anual de artículos publicados en acceso
            abierto y cerrado de acuerdo con información de OpenAlex.
          </p>
        ),
        type: "distribution",
      },
    ],
  },
  {
    value: "citations",
    title: "Citas e Impacto",
    selectable: false,
    children: [
      {
        title: "Número de citas por Unidad Académica",
        value: "citations_by_faculty",
        text: (
          <p>
            Conteo de citas descargadas de OpenAlex por unidad académica de
            todos los años disponibles en la base.
          </p>
        ),
        type: "percentage",
      },
      {
        title: "Número de citas por Subunidad Académica",
        value: "citations_by_department",
        text: (
          <p>
            Conteo de citas descargadas de OpenAlex por subunidad académica de
            todos los años disponibles en la base.
          </p>
        ),
        type: "percentage",
      },
      {
        title: "Número de citas por los grupos de investigación",
        value: "citations_by_research_group",
        text: (
          <p>
            Conteo de citas descargadas de OpenAlex por grupo de investigación
            de todos los años disponibles en la base.
          </p>
        ),
        type: "percentage",
      },
      {
        title: "Índice H de las Unidades Académicas",
        value: "h_index_by_faculty",
        text: (
          <p>
            Cálculo del índice H de acuerdo con la información disponible en
            OpenAlex para todas las unidades académicas.
          </p>
        ),
        type: "percentage",
      },
      {
        title: "Índice H de las Subunidades Académicas",
        value: "h_index_by_department",
        text: (
          <p>
            Cálculo del índice H de acuerdo con la información disponible en
            OpenAlex para todas las subunidades académicas.
          </p>
        ),
        type: "percentage",
      },
      {
        title: "Índice H de los grupos de investigación",
        value: "h_index_by_research_group",
        text: (
          <p>
            Cálculo del índice H de acuerdo con la información disponible en
            OpenAlex para todos los grupos de investigación.
          </p>
        ),
        type: "percentage",
      },
      {
        title: "Cantidad de citas",
        value: "annual_citation_count",
        text: <p>Conteo anual de todas las citas descargadas de OpenAlex.</p>,
        type: "distribution",
      },
    ],
  },
  {
    value: "sources",
    title: "Fuentes",
    selectable: false,
    children: [
      {
        title: "Número de artículos publicados según editorial",
        value: "articles_by_publisher",
        text: (
          <p>
            Conteo del número de artículos únicos publicados por editorial de la
            totalidad disponible en las bases de OpenAlex, Scienti y Google
            Scholar.
          </p>
        ),
        type: "percentage",
      },
      {
        title:
          "Número de artículos publicados en revistas de la misma institución (endogamia)",
        value: "articles_by_publishing_institution",
        text: (
          <p>
            Conteo del número de artículos publicados por editorial de la misma
            institución de la totalidad disponible en la base de OpenAlex,
            Scienti y Google Scholar. Es un cálculo de la endogamia
            institucional.
          </p>
        ),
        type: "percentage",
      },
      {
        title: "Número de productos realizados según base de datos de origen",
        value: "products_by_database",
        text: (
          <p>
            Conteo del número de productos bibliográficos disponibles en las
            bases de datos procesadas por ImpactU. Se consideran productos
            bibliográficos todas las categorías ofrecidas por OpenAlex en su
            base de datos, Scienti en la categoría de producción bibliográfica y
            Google Scholar.
          </p>
        ),
        type: "set",
      },
      {
        title:
          "Número de artículos publicados anualmente en las editoriales más usadas",
        value: "annual_articles_by_top_publishers",
        text: (
          <p>
            Conteo anual del número de artículos publicados en las editoriales
            más utilizadas por los autores para publicar sus trabajos. Se
            presenta un umbral de dos artículos como mínimo para hacer este
            conteo.
          </p>
        ),
        type: "distribution",
      },
    ],
  },
  {
    value: "production",
    title: "Producción",
    selectable: false,
    children: [
      {
        title: "Evolución anual según la clasificación del ScienTI",
        value: "annual_evolution_by_scienti_classification",
        text: (
          <p>
            Conteo anual del número de productos bibliográficos - artículos
            disponibles en la base del Scienti con datos enriquecidos de las
            bases de datos de ImpactU.
          </p>
        ),
        type: "distribution",
      },
      {
        title: "Unidades académicas según tipo de producto",
        value: "faculties_by_product_type",
        text: (
          <p>
            Conteo del número de productos bibliográficos por unidad académica
            disponibles en la base de datos Scienti enriquecidos con datos de
            las bases consideradas por ImpactU. Los productos bibliográficos no
            registrados por el Scienti se toman de las bases de datos de
            OpenAlex y Google Scholar y aparecen como "productos bibliográficos
            en otras bases de datos".
          </p>
        ),
        type: "distribution",
      },
      {
        title: "Subunidades académicas según tipo de producto",
        value: "departments_by_product_type",
        text: (
          <p>
            Conteo del número de productos bibliográficos por subunidad
            académica disponibles en la base de datos Scienti enriquecidos con
            datos de las bases consideradas por ImpactU. Los productos
            bibliográficos no registrados por el Scienti se toman de las bases
            de datos de OpenAlex y Google Scholar y aparecen como "productos
            bibliográficos en otras bases de datos".
          </p>
        ),
        type: "distribution",
      },
      {
        title: "Grupos de investigación según tipo de producto",
        value: "research_groups_by_product_type",
        text: (
          <p>
            Conteo del número de productos bibliográficos por grupo de
            investigación disponibles en la base de datos Scienti enriquecidos
            con datos de las bases consideradas por ImpactU. Los productos
            bibliográficos no registrados por el Scienti se toman de las bases
            de datos de OpenAlex y Google Scholar y aparecen como "productos
            bibliográficos en otras bases de datos".
          </p>
        ),
        type: "distribution",
      },
    ],
  },
  {
    value: "demography",
    title: "Demografía",
    selectable: false,
    children: [
      {
        title: "Cantidad de autores activos según su sexo",
        value: "active_authors_by_sex",
        text: (
          <p>
            Conteo de autores activos clasificados por el atributo sexo, basado
            en la información disponible en la base de datos ScienTI,
            complementada con las bases de datos de ImpactU. Las categorías
            consideradas son: hombre, mujer, intersexual y Sin información
            registrada.
          </p>
        ),
        type: "percentage",
      },
      {
        title:
          "Número de productos realizados según el rango de edad de los autores",
        value: "active_authors_by_age_range",
        text: (
          <p>
            Conteo de autores activos clasificados por rango de edad, basado en
            la información disponible en la base de datos Scienti, complementada
            con las bases de datos de ImpactU. Los rangos de edad considerados
            son: 14-26 años, 27-59 años, 60+ años, y Sin Información.
          </p>
        ),
        type: "percentage",
      },
    ],
  },
  {
    value: "ranking",
    title: "Ranking",
    selectable: false,
    children: [
      {
        title: "Número de artículos publicados según la categoría del Scienti",
        value: "articles_by_scienti_category",
        text: (
          <p>
            Conteo de los productos bibliográficos-artículos registrados en la
            base de datos ScienTI por categoría asignada.
          </p>
        ),
        type: "percentage",
      },
      {
        title:
          "Número de artículos publicados en revistas rankeadas según cuartiles de Scimago",
        value: "articles_by_scimago_quartile",
        text: (
          <p>
            Conteo de los artículos según el cuartil de la revista en que fueron
            publicados de acuerdo con el ránking de Scimago.
          </p>
        ),
        type: "percentage",
      },
    ],
  },
  {
    value: "subjects",
    title: "Temas",
    selectable: false,
    children: [
      {
        title: "20 palabras más usuales en los títulos de la producción",
        value: "most_used_title_words",
        text: (
          <p>
            Conteo de las frecuencias de las 20 palabras más utilizadas en los
            títulos de los productos bibliográficos.
          </p>
        ),
        type: "percentage",
      },
      {
        title: "Número de productos bibliográficos disponibles por temas",
        value: "products_by_subject",
        text: (
          <p>
            Conteo de los productos bibliográficos disponibles por temas
            clasificados por OpenAlex.
          </p>
        ),
        type: "percentage",
      },
    ],
  },
];

export const PLOTS_BY_ENTITY = {
  institution: [
    "faculties_by_product_type",
    "departments_by_product_type",
    "research_groups_by_product_type",
    "annual_evolution_by_scienti_classification",
    "annual_citation_count",
    "annual_apc_expenses",
    "annual_articles_open_access",
    "annual_articles_by_top_publishers",
    "most_used_title_words",
    "citations_by_faculty",
    "apc_expenses_by_faculty",
    "h_index_by_faculty",
    "citations_by_department",
    "apc_expenses_by_department",
    "h_index_by_department",
    "citations_by_research_group",
    "apc_expenses_by_group",
    "h_index_by_research_group",
    "articles_by_publisher",
    "products_by_subject",
    "products_by_database",
    "articles_by_access_route",
    "products_by_author_sex",
    "products_by_author_age_range",
    "articles_by_scienti_category",
    "articles_by_scimago_quartile",
    "articles_by_publishing_institution",
    "coauthorship_by_country_map",
    "coauthorship_by_colombian_department_map",
    "institutional_coauthorship_network",
  ],
  department: [
    "research_groups_by_product_type",
    "annual_evolution_by_scienti_classification",
    "annual_citation_count",
    "annual_apc_expenses",
    "annual_articles_open_access",
    "annual_articles_by_top_publishers",
    "most_used_title_words",
    "citations_by_research_group",
    "apc_expenses_by_group",
    "h_index_by_research_group",
    "articles_by_publisher",
    "products_by_subject",
    "products_by_database",
    "articles_by_access_route",
    "products_by_author_sex",
    "products_by_author_age_range",
    "articles_by_scienti_category",
    "articles_by_scimago_quartile",
    "articles_by_publishing_institution",
    "coauthorship_by_country_map",
    "coauthorship_by_colombian_department_map",
  ],
  faculty: [
    "departments_by_product_type",
    "research_groups_by_product_type",
    "annual_evolution_by_scienti_classification",
    "annual_citation_count",
    "annual_apc_expenses",
    "annual_articles_open_access",
    "annual_articles_by_top_publishers",
    "most_used_title_words",
    "citations_by_department",
    "apc_expenses_by_department",
    "h_index_by_department",
    "citations_by_research_group",
    "apc_expenses_by_group",
    "h_index_by_research_group",
    "articles_by_publisher",
    "products_by_subject",
    "products_by_database",
    "articles_by_access_route",
    "products_by_author_sex",
    "products_by_author_age_range",
    "articles_by_scienti_category",
    "articles_by_scimago_quartile",
    "articles_by_publishing_institution",
    "coauthorship_by_country_map",
    "coauthorship_by_colombian_department_map",
  ],
  group: [
    "annual_evolution_by_scienti_classification",
    "annual_citation_count",
    "annual_apc_expenses",
    "annual_articles_open_access",
    "annual_articles_by_top_publishers",
    "most_used_title_words",
    "articles_by_publisher",
    "products_by_subject",
    "products_by_database",
    "articles_by_access_route",
    "products_by_author_sex",
    "products_by_author_age_range",
    "articles_by_scienti_category",
    "articles_by_scimago_quartile",
    "articles_by_publishing_institution",
    "coauthorship_by_country_map",
    "coauthorship_by_colombian_department_map",
  ],
  person: [
    "annual_evolution_by_scienti_classification",
    "annual_citation_count",
    "annual_apc_expenses",
    "annual_articles_open_access",
    "annual_articles_by_top_publishers",
    "most_used_title_words",
    "articles_by_publisher",
    "products_by_subject",
    "products_by_database",
    "articles_by_access_route",
    "articles_by_scienti_category",
    "articles_by_scimago_quartile",
    "articles_by_publishing_institution",
    "author_coauthorship_network",
    "coauthorship_by_country_map",
    "coauthorship_by_colombian_department_map",
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
  facultyopinions: 1,
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
