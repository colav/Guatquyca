export const CHECKLIST = {
  AFFILIATIONENTITIES: ["department", "group", "faculty", "institution"],
  AFFILIATIONURL: ["department", "group", "faculty", "institution"],
};

export const DB = {
  scholar: "Google Scholar",
  openalex: "OpenAlex",
  crossref: "Crossref",
  minciencias: "Minciencias",
  scienti: "ScienTI",
  impactu: "ImpactU",
  siiu: "SIIU",
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
  product_types: "tipos de productos",
  countries: "países",
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
    label: "Convenios",
    value: "agreements",
    key: "agreements",
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
  agreements: 8,
};

export const FILTERS_ORDER = [
  "product_types",
  "years",
  "status",
  "subjects",
  "countries",
  "groups_ranking",
  "authors_ranking",
];

export const NO_AUTOCOMPLETE_TYPES = ["works", "patents", "projects"];

export const LANGUAGES = {
  af: "Afrikáans",
  sq: "Albanés",
  am: "Amárico",
  ar: "Árabe",
  hy: "Armenio",
  az: "Azerí",
  eu: "Euskera",
  be: "Bielorruso",
  bn: "Bengalí",
  bs: "Bosnio",
  bg: "Búlgaro",
  ca: "Catalán",
  ceb: "Cebuano",
  zh: "Chino",
  co: "Corso",
  hr: "Croata",
  cs: "Checo",
  da: "Danés",
  nl: "Neerlandés",
  en: "Inglés",
  eo: "Esperanto",
  et: "Estonio",
  fi: "Finés",
  fr: "Francés",
  fy: "Frisón",
  gl: "Gallego",
  ka: "Georgiano",
  de: "Alemán",
  el: "Griego",
  gu: "Gujarati",
  ht: "Haitiano",
  ha: "Hausa",
  haw: "Hawaiano",
  he: "Hebreo",
  hi: "Hindi",
  hmn: "Hmong",
  hu: "Húngaro",
  is: "Islandés",
  ig: "Igbo",
  id: "Indonesio",
  ga: "Irlandés",
  it: "Italiano",
  ja: "Japonés",
  jw: "Javanés",
  kn: "Canarés",
  kk: "Kazajo",
  km: "Jemer",
  rw: "Kinyarwanda",
  ko: "Coreano",
  ku: "Kurdo",
  ky: "Kirguís",
  lo: "Lao",
  la: "Latín",
  lv: "Letón",
  lt: "Lituano",
  lb: "Luxemburgués",
  mk: "Macedonio",
  mg: "Malgache",
  ms: "Malayo",
  ml: "Malayalam",
  mt: "Maltés",
  mi: "Maorí",
  mr: "Maratí",
  mn: "Mongol",
  my: "Birmano",
  ne: "Nepalí",
  no: "Noruego",
  ny: "Nyanja",
  or: "Oriya",
  ps: "Pastún",
  fa: "Persa",
  pl: "Polaco",
  pt: "Portugués",
  pa: "Punyabí",
  ro: "Rumano",
  ru: "Ruso",
  sm: "Samoano",
  gd: "Gaélico escocés",
  sr: "Serbio",
  st: "Sesotho",
  sn: "Shona",
  sd: "Sindhi",
  si: "Cingalés",
  sk: "Eslovaco",
  sl: "Esloveno",
  so: "Somalí",
  es: "Español",
  su: "Sundanés",
  sw: "Suajili",
  sv: "Sueco",
  tl: "Tagalo",
  tg: "Tayiko",
  ta: "Tamil",
  tt: "Tártaro",
  te: "Telugu",
  th: "Tailandés",
  tr: "Turco",
  tk: "Turcomano",
  uk: "Ucraniano",
  ur: "Urdu",
  ug: "Uigur",
  uz: "Uzbeko",
  vi: "Vietnamita",
  cy: "Galés",
  xh: "Xhosa",
  yi: "Yidis",
  yo: "Yoruba",
  zu: "Zulú",
};

export const PALETTE = [
  "#86d5e5",
  "#bc80bd",
  "#ffc790",
  "#fb8072",
  "#80b1d3",
  "#fdb462",
  "#b3de69",
  "#fccde5",
  "#d9d9d9",
  "#ffffb3",
  "#ccebc5",
  "#ffed6f",
  "#b3dea0",
  "#8dd3c7",
  "#d7dcac",
  "#bca6bd",
  "#98ebc5",
  "#bebada",
  "#e6ff9d",
  "#fb7ea7",
  "#a2e1d4",
  "#74c0ad",
  "#92e1c7",
  "#a9f6de",
  "#d8fffa",
  "#fff7db",
  "#fffbc8",
  "#fffcd1",
  "#fefdf3",
  "#d2bfd7",
  "#cdc3df",
  "#e7e3f2",
  "#9c87a7",
  "#e3bfb6",
  "#f4a29d",
  "#ef786b",
  "#eb5d46",
  "#ffdfd5",
  "#a5cae4",
  "#94bad6",
  "#86a6c7",
  "#99c9d6",
  "#77acd7",
  "#5f91b0",
  "#4c7590",
  "#d0ecf9",
  "#c6e0ff",
  "#ffc67f",
  "#ffe1b3",
  "#ffe4a4",
  "#ffd282",
  "#ffb678",
  "#ff8e4f",
  "#ffaa6a",
  "#eab362",
  "#ffe9bf",
  "#c7e695",
  "#a6de82",
  "#93d765",
  "#a0d27c",
  "#8ccc7f",
  "#b9e29e",
  "#9ace7f",
  "#84b86b",
  "#c9efb3",
  "#f7c3de",
  "#f8e6f5",
  "#eab8dc",
  "#e3a3cc",
  "#dea9d1",
  "#d69fcd",
  "#e7b7d4",
  "#d590b7",
  "#ffaec8",
  "#f2f2f2",
  "#d7d7d7",
  "#c9c9c9",
  "#bababa",
  "#ededed",
  "#b8b8b8",
  "#9a9a9a",
  "#797979",
  "#6d6d6d",
  "#c4b0d8",
  "#e0dbef",
  "#d9c7ed",
  "#ceafd8",
  "#be93c7",
  "#dbb1e1",
  "#c99bd3",
  "#dbb5ed",
  "#d3b2d9",
  "#d7f3da",
  "#edf9ed",
  "#d4f0c7",
  "#d1ebc7",
  "#c8e6bc",
  "#d4f0d1",
  "#d5f2e1",
  "#e9ffe7",
  "#bfe2b5",
  "#ffef7b",
  "#fef6a3",
  "#fff6b4",
  "#f1e5a8",
  "#d6d598",
  "#eee596",
  "#ffeb91",
  "#fff4b3",
  "#f5ec92",
  "#9bddc5",
  "#b5e7db",
  "#e6fffa",
  "#7ac2b0",
  "#d6f1ef",
  "#bce9de",
  "#dff2e5",
  "#b5dfd5",
  "#d2efe8",
  "#ffe1ab",
  "#ffdd95",
  "#ffd399",
  "#ffecb4",
  "#ffefc5",
  "#ffd89f",
  "#ffc794",
  "#ffe6c2",
  "#ffebc7",
  "#d8c8db",
  "#c0aec3",
  "#b7a3b7",
  "#d7c3d7",
  "#f5e2f2",
  "#dcafcc",
  "#d0a6c3",
  "#e1bdd5",
  "#c5a9c2",
  "#a0f7c5",
  "#bdfadd",
  "#94e7b4",
  "#85d5a4",
  "#9defb6",
  "#b5ffd3",
  "#d6f1c1",
  "#c9f8dd",
  "#a7f5b3",
  "#fbb8ca",
  "#fdc2e5",
  "#f5a8d2",
  "#ff9eb8",
  "#ffb4e5",
  "#ffbfc7",
  "#f89db1",
  "#fca8cc",
  "#f897c0",
  "#98aad5",
  "#85a8c2",
  "#7899b4",
  "#88b3d2",
  "#76a3c2",
  "#8cb5d3",
  "#a2c4e7",
  "#b7dbf9",
  "#9eb6db",
  "#ffd5a1",
  "#f6ba84",
  "#ffdeba",
  "#f9cea4",
  "#ffe0bf",
  "#f8c499",
  "#e4b584",
  "#ffebd7",
  "#f7c79c",
  "#cfe0b7",
  "#d9e7c7",
  "#b5d295",
  "#cfe4aa",
  "#b6c786",
  "#e4f1b9",
  "#c5e094",
  "#d6e89f",
  "#b3d48e",
  "#ffe7ef",
  "#f7a6b5",
  "#fbbfd1",
  "#feadca",
  "#f7bbc6",
  "#f7d4de",
  "#f5a8d1",
  "#e3acc4",
  "#ffccde",
  "#d0d0d0",
  "#efefef",
  "#dedede",
  "#f1f1f1",
  "#cacaca",
  "#cdcdcd",
  "#dfdfdf",
  "#b4b4b4",
  "#adadad",
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

export const OPEN_ACCESS_PALETTE = {
  Híbrido: "#eaff8f",
  Verde: "#b7eb8f",
  Dorado: "#ffe58f",
  Cerrado: "#d74858",
  Bronce: "#fc9362",
  Diamante: "#87e8de",
  "Sin información": "#3c8ec1",
};

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
            Conteo del número de veces que un país aparece como procedencia en
            la afiliación de los autores de los artículos considerados. Se
            cuenta cada país de acuerdo con la afiliación de todos los autores
            involucrados en un artículo, sumando una vez por autor. Los datos
            provienen de OpenAlex y se enriquecen con las bases de datos
            disponibles en ImpactU. Este mapa coroplético visualiza la
            distribución de las coautorías a nivel mundial.
          </p>
        ),
        type: "map",
      },
      {
        title: "Coautorías según afiliación territorial departamental",
        value: "coauthorship_by_colombian_department_map",
        text: (
          <p>
            Conteo del número de veces que un departamento aparece como
            procedencia en la afiliación de los autores de los artículos
            considerados. Se cuenta cada departamento de acuerdo con la
            afiliación de todos los autores involucrados en un artículo, sumando
            una vez por autor. Los datos provienen de OpenAlex y se enriquecen
            con las bases de datos disponibles en ImpactU. Este mapa coroplético
            visualiza la distribución de las coautorías a nivel mundial.
          </p>
        ),
        type: "map",
      },
      {
        title: "Coautoría personal",
        value: "author_coauthorship_network",
        text: (
          <p>
            Conteo del número de veces que un autor es mencionado en la
            afiliación de los artículos considerados, contabilizando un autor
            por artículo. Los datos provienen de OpenAlex y se complementan con
            la información de las bases de datos disponibles en ImpactU. En este
            grafo, cada nodo representa a un autor, con su grado correspondiente
            y cada arista indica la cantidad de coautorías entre autores.
          </p>
        ),
        type: "graph",
      },
      {
        title: "Coautoría institucional",
        value: "institutional_coauthorship_network",
        text: (
          <p>
            Conteo del número de veces que una institución es mencionada como
            procedencia en la afiliación de los artículos considerados,
            contabilizando una institución por artículo. Los datos provienen de
            OpenAlex y se complementan con la información de las bases de datos
            disponibles en ImpactU. En este grafo, cada nodo representa una
            institución, con su grado correspondiente y cada arista indica la
            cantidad de coautorías entre instituciones.
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
        title: "Gastos de APC proyectados por Unidad Académica (Top 20)",
        value: "apc_expenses_by_faculty",
        text: (
          <p>
            Sumatoria proyectada en dólares estadounidenses (USD) de los costos
            de APC (Article Processing Charges) por artículo, considerando las
            20 Unidades Académicas con los mayores montos destinados a APC,
            según los datos disponibles en DOAJ.
          </p>
        ),
        type: "percentage",
      },
      {
        title: "Gastos de APC proyectados por Subunidad Académica (Top 20)",
        value: "apc_expenses_by_department",
        text: (
          <p>
            Sumatoria proyectada en dólares estadounidenses (USD) de los costos
            de APC (Article Processing Charges) por artículo, considerando las
            20 Subunidades Académicas con los mayores montos destinados a APC,
            según los datos disponibles en DOAJ.
          </p>
        ),
        type: "percentage",
      },
      {
        title: "Gastos de APC proyectados por Grupo de Investigación (Top 20)",
        value: "apc_expenses_by_group",
        text: (
          <p>
            Sumatoria proyectada en dólares estadounidenses (USD) de los costos
            de APC (Article Processing Charges) por artículo, considerando los
            20 grupos de investigación con los mayores montos destinados a APC,
            según los datos disponibles en DOAJ.
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
            Este gráfico muestra la sumatoria de artículos clasificados por su
            ruta de acceso, de acuerdo a la información disponible en OpenAlex.
            Se consideran las siguientes categorías:
            <ul>
              <li>
                <b>Sin información</b>
              </li>
              <li>
                <b>Cerrado:</b> Artículos disponibles solo por suscripción.
              </li>
              <li>
                <b>Diamante:</b> Se refiere a las revistas que publican en
                acceso abierto, y que no cobran a los autores por publicar ni a
                los lectores por leer. Estas revistas generalmente están
                financiadas por instituciones académicas o gubernamentales, o
                por sociedades científicas.
              </li>
              <li>
                <b>Dorado:</b> Consiste en la publicación en revistas de acceso
                abierto, revistas científicas con revisión por pares
                (peer-review) cuyos contenidos están accesibles sin necesidad de
                compra o suscripción y bajo licencias en la que el autor
                mantiene el copyright. Habitualmente las revistas requieren un
                pago por costes de publicación.
              </li>
              <li>
                <b>Verde:</b> Consiste en depositar los documentos de
                investigación en repositorios de acceso abierto promovidos por
                la comunidad científica o académica.
              </li>
              <li>
                <b>Híbrido:</b> En la que los autores o financiadores de la
                investigación pagan por publicar en acceso abierto en revistas
                de pago. Las editoriales de estas revistas ofrecen la
                posibilidad de pagar los gastos de procesamiento de artículos
                (APC) a cambio de que su artículo esté en acceso abierto. Esta
                opción es conocida como open choice.
              </li>
              <li>
                <b>Bronce:</b> Hace referencia a artículos que son de libre
                lectura en las páginas de los editores, pero sin una licencia
                abierta explícita que permita su distribución y reutilización.
              </li>
            </ul>
            Universidad Complutense de Madrid. (n.d.).{" "}
            <i>Vías de acceso abierto.</i> Guías temáticas de la Biblioteca UCM.{" "}
            <a
              href="https://biblioguias.ucm.es/acceso-abierto/vias-acceso-abierto"
              target="_blank"
              rel="noreferrer"
            >
              https://biblioguias.ucm.es/acceso-abierto/vias-acceso-abierto
            </a>
          </p>
        ),
        type: "percentage",
      },
      {
        title: "Gastos anuales proyectados de APC",
        value: "annual_apc_expenses",
        text: (
          <p>
            Este gráfico de columnas muestra la sumatoria anual proyectada de
            los costos de APC (Article Processing Charges) por artículo, basada
            en los datos disponibles en DOAJ. En el eje X se representan los
            años y en el eje Y los costos en dólares (USD). Este indicador
            permite visualizar la evolución de los gastos proyectados para la
            publicación en acceso abierto.
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
            Este gráfico de columnas apiladas muestra la sumatoria anual de
            artículos publicados en acceso abierto y cerrado, basada en la
            información de OpenAlex. En el eje Y se representa la cantidad de
            artículos, mientras que el eje X indica los años. Cada segmento de
            la columna corresponde a las categorías "Abierto", "Cerrado" y "Sin
            información" proporcionando una visión clara de la distribución del
            acceso a la producción académica a lo largo del tiempo.
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
        title: "Número de citas por Unidad Académica (Top 20)",
        value: "citations_by_faculty",
        text: (
          <p>
            Este treemap muestra el conteo de citas obtenidas de Google Scholar,
            organizadas por Unidad Académica. Se incluyen todas las citas
            registradas en la base de datos destacando las 20 Unidades
            Académicas con el mayor número.
          </p>
        ),
        type: "percentage",
      },
      {
        title: "Número de citas por Subunidad Académica (Top 20)",
        value: "citations_by_department",
        text: (
          <p>
            Este treemap muestra el conteo de citas obtenidas de Google Scholar,
            organizadas por Subunidad Académica. Se incluyen todas las citas
            registradas en la base de datos destacando las 20 Subunidades
            Académicas con el mayor número.
          </p>
        ),
        type: "percentage",
      },
      {
        title: "Número de citas por los grupos de investigación (Top 20)",
        value: "citations_by_research_group",
        text: (
          <p>
            Este treemap muestra el conteo de citas obtenidas de Google Scholar,
            organizadas por grupo de investigación. Se incluyen todas las citas
            registradas en la base de datos destacando los 20 grupos con el
            mayor número.
          </p>
        ),
        type: "percentage",
      },
      {
        title: "Índice H de las Unidades Académicas (Top 20)",
        value: "h_index_by_faculty",
        text: (
          <p>
            Este treemap presenta el cálculo del índice H para las Unidades
            Académicas, basado en la información disponible en Google Scholar.
            Muestra las 20 Unidades Académicas con el índice H más alto,
            proporcionando una visión clara de su impacto y productividad
            académica.
          </p>
        ),
        type: "percentage",
      },
      {
        title: "Índice H de las Subunidades Académicas (Top 20)",
        value: "h_index_by_department",
        text: (
          <p>
            Este treemap presenta el cálculo del índice H para las Subunidades
            Académicas, basado en la información disponible en Google Scholar.
            Muestra las 20 Subunidades Académicas con el índice H más alto,
            proporcionando una visión clara de su impacto y productividad
            académica.
          </p>
        ),
        type: "percentage",
      },
      {
        title: "Índice H de los grupos de investigación (Top 20)",
        value: "h_index_by_research_group",
        text: (
          <p>
            Este treemap presenta el cálculo del índice H para los grupos de
            investigación, basado en la información disponible en Google
            Scholar. Muestra los 20 grupos de investigación con el índice H más
            alto, proporcionando una visión clara de su impacto y productividad
            académica.
          </p>
        ),
        type: "percentage",
      },
      {
        title: "Cantidad de citas",
        value: "annual_citation_count",
        text: (
          <p>
            Este gráfico de columnas muestra el conteo anual de todas las citas
            obtenidas de OpenAlex. En el eje Y se representa la cantidad de
            citas, mientras que en el eje X se muestran los años
            correspondientes. Este gráfico permite evaluar la tendencia en la
            citación de la producción académica a lo largo del tiempo.
          </p>
        ),
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
        title: "Número de artículos publicados según editorial (Top 20)",
        value: "articles_by_publisher",
        text: (
          <p>
            Este treemap muestra el conteo de artículos únicos publicados por
            editorial, en relación con el total de artículos disponibles en las
            bases de datos de OpenAlex, ScienTI, Google Scholar y Datos Abiertos
            de Minciencias. El gráfico resalta las 20 editoriales más
            representativas en la producción académica.
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
            Este gráfico muestra el conteo de artículos únicos publicados en
            editoriales de la misma institución, en relación con el total de
            artículos disponibles en las bases de datos de OpenAlex, ScienTI,
            Google Scholar y Datos Abiertos Minciencias. El gráfico se divide en
            tres categorías: "Misma", "Diferente" y "Sin información". Este
            indicador permite evaluar el nivel de endogamia en la producción
            académica institucional.
          </p>
        ),
        type: "percentage",
      },
      {
        title: "Número de productos realizados según base de datos de origen",
        value: "products_by_database",
        text: (
          <p>
            Este diagrama de Venn muestra el conteo de productos bibliográficos
            disponibles en las bases de datos procesadas por ImpactU. Se
            consideran todas las categorías de productos bibliográficos
            ofrecidas por OpenAlex, la producción bibliográfica registrada en
            ScienTI, los productos disponibles en Google Scholar y los datos de
            la base de Datos Abiertos de Minciencias. Las áreas de intersección
            representan los productos compartidos entre estas bases de datos.
            Para este indicador se consideran únicamente las cuatro bases de
            datos mencionada. No obstante, ImpactU cuenta con algunas bases de
            datos institucionales integradas y tiene la capacidad de incorporar
            más, lo que permite una mayor personalización y enriquecimiento de
            la información.
          </p>
        ),
        type: "set",
      },
      {
        title:
          "Número de artículos publicados anualmente en las editoriales más usadas (Top 20)",
        value: "annual_articles_by_top_publishers",
        text: (
          <p>
            Este gráfico de columnas apiladas muestra el conteo anual de
            artículos publicados en las editoriales más utilizadas por los
            autores para difundir sus trabajos. Se consideran un máximo de 20
            editoriales por columna, seleccionadas del top anual. En el eje X se
            representan los años, en el eje Y el conteo total de artículos por
            año y cada segmento de la columna apilada corresponde a una
            editorial del top de ese año.
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
        title: "Evolución anual según la clasificación del ScienTI (Top 20)",
        value: "annual_evolution_by_scienti_classification",
        text: (
          <p>
            Este gráfico de columnas apiladas muestra la evolución anual del
            número de productos bibliográficos de tipo 'artículo' disponibles en
            la base de datos ScienTI, enriquecidos con información de ImpactU.
            Se consideran los 20 tipos de productos más frecuentes cada año,
            según la clasificación de ScienTI.
          </p>
        ),
        type: "distribution",
      },
      {
        title: "Unidades académicas según tipo de producto (Top 20)",
        value: "faculties_by_product_type",
        text: (
          <p>
            Este gráfico de columnas apiladas muestra el conteo del número de
            productos bibliográficos disponibles por Unidad Académica,
            utilizando información de la base de datos ScienTI y enriquecidos
            con información de ImpactU. Se consideran un máximo de 20 tipos de
            productos por columna. En el eje X se encuentran los nombres de las
            Unidades Académicas, mientras que el eje Y representa la cantidad
            total de productos. Cada sección de la columna apilada corresponde a
            un tipo de producto específico según la clasificación de ScienTI.
          </p>
        ),
        type: "distribution",
      },
      {
        title: "Subunidades académicas según tipo de producto (Top 20)",
        value: "departments_by_product_type",
        text: (
          <p>
            Este gráfico de columnas apiladas muestra el conteo del número de
            productos bibliográficos disponibles por Subunidad Académica,
            utilizando información de la base de datos ScienTI y enriquecidos
            con información de ImpactU. Se consideran un máximo de 20 tipos de
            productos por columna. En el eje X se encuentran los nombres de las
            Subunidades Académicas, mientras que el eje Y representa la cantidad
            total de productos. Cada sección de la columna apilada corresponde a
            un tipo de producto específico según la clasificación de ScienTI.
          </p>
        ),
        type: "distribution",
      },
      {
        title: "Grupos de investigación según tipo de producto (Top 20)",
        value: "research_groups_by_product_type",
        text: (
          <p>
            Este gráfico de columnas apiladas muestra el conteo del número de
            productos bibliográficos disponibles por grupo de investigación,
            utilizando información de la base de datos ScienTI y enriquecidos
            con información de ImpactU. Se consideran un máximo de 20 tipos de
            productos por columna. En el eje X se encuentran los nombres de los
            grupos de investigación, mientras que el eje Y representa la
            cantidad total de productos. Cada sección de la columna apilada
            corresponde a un tipo de producto específico según la clasificación
            de ScienTI.
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
        title: "Número de autores activos según su sexo",
        value: "active_authors_by_sex",
        text: (
          <p>
            Este gráfico muestra la distribución de los autores activos,
            clasificados según su sexo, basado en la información disponible en
            la base de datos ScienTI y complementada con datos de ImpactU. Las
            categorías consideradas son: Hombre, Mujer, Intersexual y Sin
            Información. Cada segmento del gráfico representa la cantidad de
            autores en una categoría específica.
          </p>
        ),
        type: "percentage",
      },
      {
        title: "Número de autores activos según el rango de edad",
        value: "active_authors_by_age_range",
        text: (
          <p>
            Este gráfico muestra la distribución de los autores activos,
            clasificados según su rango de edad, basado en la información
            disponible en la base de datos ScienTI y complementada con datos de
            ImpactU. Los rangos de edad considerados son: 14-26 años, 27-59
            años, 60 años y más, y Sin Información. Cada segmento del gráfico
            representa la cantidad de autores en un rango de edad específico.
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
            Este gráfico muestra la distribución de los artículos registrados en
            la base de datos ScienTI, clasificados según la categoría asignada a
            cada uno. Solo se consideran productos de tipo 'artículo' de entre
            los diversos tipos de productos bibliográficos disponibles en
            nuestro sistema. Cada segmento del gráfico representa la cantidad de
            artículos en una categoría específica.
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
            Este gráfico muestra la distribución de los artículos publicados en
            revistas, clasificados según el cuartil que ocupaban en el ranking
            de Scimago en el año de su publicación. Solo se consideran productos
            de tipo 'artículo' de entre los diversos tipos de productos
            bibliográficos disponibles en nuestro sistema. Cada segmento del
            gráfico representa la cantidad de artículos publicados en revistas
            de un cuartil específico.
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
            Este gráfico muestra las 20 palabras más frecuentes en los títulos
            de los productos bibliográficos de nuestra base de datos. Se
            excluyen palabras comunes como preposiciones, conjunciones y
            artículos. Cada palabra se acompaña de su frecuencia de aparición en
            los títulos.
          </p>
        ),
        type: "percentage",
      },
      {
        title:
          "Número de productos bibliográficos disponibles por temas (Top 20)",
        value: "products_by_subject",
        text: (
          <p>
            Este gráfico muestra los 20 temas con más productos bibliográficos
            disponibles en nuestra base de datos. Cada categoría corresponde a
            un tema específico, clasificado según la taxonomía de OpenAlex e
            incluye el número total de productos catalogados bajo ese tema. Cabe
            destacar que un producto puede estar asociado a múltiples temas.
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
    "active_authors_by_sex",
    "active_authors_by_age_range",
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
    "active_authors_by_sex",
    "active_authors_by_age_range",
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
    "active_authors_by_sex",
    "active_authors_by_age_range",
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
    "active_authors_by_sex",
    "active_authors_by_age_range",
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
  masterthesis: "Tesis de maestría",
  proceedings: "Actas",
};
