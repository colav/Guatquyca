/**
 * Shared constants for the Theme Curation flow.
 */

/**
 * Character budget for the seed text, counted on the text exactly as it is
 * sent in `seed_text` (line breaks included). This is a frontend heuristic,
 * not the model's cut and not an exact token count. It comes from the
 * backend's measurement with Nomic, whose 512-token limit fell at 1,677-2,308
 * characters with six invented seeds
 * (informes/2026-10-22_backend_b11_cortes-semilla.md); Luis set the warning at
 * 1,800 (01 D-037, 22 Oct) and kept it after the move to Qwen (01 D-061),
 * because a longer seed does not give better results. With Qwen the service
 * cuts the seed at 4,095 tokens, about 15,100 characters of synthetic text and
 * about 17,000 of real technical text (informes/2026-10-26_backend_b24-truncated.md).
 * Change the number only here.
 * `truncated: true` from /candidates is the authority on a real cut; this is
 * a guide about length.
 * Exact tokenization in the frontend is out of scope (D-012, still a
 * proposal).
 */
export const SEED_CHAR_LIMIT = 1800;

/**
 * Warning shown on Screen 1 when the character count passes SEED_CHAR_LIMIT:
 * the seed is longer than recommended, not necessarily cut. Text fixed by
 * Luis (26 Oct).
 */
export const SEED_LONG_MESSAGE =
  "La semilla es más larga de lo recomendado. Una semilla más larga no da mejores resultados; prioriza los términos que definen el eje.";

/**
 * Warning shown on Screens 1-2 when /app/theme/candidates answers
 * `truncated: true` (01 D-008, 11 B7): the model really cut the seed. It
 * takes precedence over SEED_LONG_MESSAGE when both apply. Text fixed by
 * Luis (26 Oct).
 */
export const SEED_TRUNCATED_MESSAGE =
  "La semilla superó el límite del modelo y se cortó: lo que quedó al final no se usó.";

/** Tips for writing a good seed, shown on Screen 1. */
export const SEED_TIPS = [
  "Prefiere vocabulario técnico específico sobre narrativa de contexto local.",
  "Cuidado con palabras polisémicas sin contexto que las desambigüe.",
  "Una semilla más larga no da mejores resultados: en nuestras pruebas, entre unos 250 y 1.800 caracteres el rendimiento fue similar. Prioriza los términos que de verdad definen el eje.",
];

/**
 * Bounds for the candidate topic count control on Screen 1.
 *
 * TOPIC_COUNT_DEFAULT (150) is a curatorial recommendation, not a backend
 * limit: /app/theme/candidates itself defaults top_n to 300 when the field
 * is omitted, but 300 is more than most curators need to review and makes
 * Screen 2 noticeably longer. We default the UI lower and always send an
 * explicit top_n so the curator's choice (not the backend default) is what
 * takes effect.
 *
 * TOPIC_COUNT_MAX (300) mirrors today's backend default as a ceiling for
 * the UI. It is a UI choice, not a backend limit: the backend validates
 * top_n between 1 and 4,516 (D-004, D-008), deployed in quyca-dev.
 */
export const TOPIC_COUNT_MIN = 50;
export const TOPIC_COUNT_MAX = 300;
export const TOPIC_COUNT_DEFAULT = 150;
export const TOPIC_COUNT_STEP = 25;

/**
 * How many OpenAlex keywords show under a topic's name in the tables of
 * Screens 2 and 5 (TopicKeywords); the rest go in the native tooltip.
 */
export const KEYWORD_PREVIEW_COUNT = 5;

export const STEP_LABELS = [
  "Ingresar semilla",
  "Revisar tópicos",
  "Guardar eje",
];

/** Page-level H1 shown above the Steps indicator, one per step (see FlowHeader). */
export const STEP_TITLES = [
  "Curar un nuevo eje temático",
  "Revisar tópicos candidatos",
  "Guardar eje temático",
];

/** First two Breadcrumb segments, shared by every step; the third segment is the current step's label. */
export const BREADCRUMB_ROOT = "Ejes Temáticos";
export const BREADCRUMB_NEW_ITEM = "Nuevo eje";

/**
 * Display config for each classification status. Colors are antd Tag's
 * named "status" colors (success/warning/error), not arbitrary hex, so
 * they automatically match antd's semantic palette.
 */
export const CLASSIFICATION_STATUSES = {
  included: { label: "Incluido", color: "success" },
  borderline: { label: "Frontera", color: "warning" },
  excluded: { label: "Excluido", color: "error" },
};

export const UNCLASSIFIED_LABEL = "Sin clasificar";

/** Order in which Screen 5 lists topics by status, before sorting by name. */
export const CLASSIFICATION_ORDER = ["included", "borderline", "excluded"];

/** Display labels for how a topic got into a theme (ThemeTopic.method). */
export const METHOD_LABELS = {
  automatic: "Automático",
  manual: "Manual",
};

/** Visible lines of the seed in the Screen 5 card before "Ver más" (01 D-047). */
export const SEED_PREVIEW_LINES = 5;

/** Texts shown for backend errors by status and context (01 D-031 A, D-049). */
export const RATE_LIMIT_MESSAGE =
  "Demasiadas búsquedas seguidas. Espera un momento e inténtalo de nuevo.";
export const RATE_LIMIT_GENERAL_MESSAGE =
  "Demasiadas solicitudes seguidas. Espera un momento e inténtalo de nuevo.";
export const NOT_FOUND_THEME_MESSAGE =
  "Este Eje Temático no existe o el enlace es incorrecto.";
export const BAD_REQUEST_MESSAGES = {
  candidates:
    "No se pudieron obtener los tópicos candidatos. Revisa la semilla e inténtalo de nuevo; si sigue fallando, avisa al equipo.",
  search:
    "No se pudo completar la búsqueda. Inténtalo de nuevo; si sigue fallando, avisa al equipo.",
  createTheme:
    "No se pudo guardar el Eje Temático. Revisa el nombre, el curador y la semilla; si sigue fallando, avisa al equipo.",
  other:
    "No se pudo completar la acción. Inténtalo de nuevo; si sigue fallando, avisa al equipo.",
};
export const SERVER_ERROR_MESSAGE =
  "El servicio tuvo un problema. Inténtalo de nuevo.";

/** Manual topic search texts (01 D-033 a). */
export const MANUAL_SEARCH_PLACEHOLDER = "Buscar tópico en inglés...";
export const MANUAL_SEARCH_EMPTY_MESSAGE =
  "Sin resultados. Recuerda que el catálogo de tópicos está en inglés.";

/** Seconds the "topics added" notice stays on screen (01 D-052). */
export const MANUAL_ADD_NOTICE_SECONDS = 6;

/** Notice shown after adding the manual selection to the review table. */
export const manualAddNotice = (count) =>
  count === 1
    ? "Se agregó 1 tópico correctamente. Lo encontrarás al final de la lista, en la última página."
    : `Se agregaron ${count} tópicos correctamente. Los encontrarás al final de la lista, en la última página.`;

/**
 * Maximum height, in px, of the strip with the chosen topics (inside the
 * dropdown and under the search box) before it scrolls on its own (01 D-052).
 * The small value applies on screens of 576 px or less.
 */
export const SELECTION_MAX_HEIGHT = 120;
export const SELECTION_MAX_HEIGHT_SMALL = 88;

/** Height, in px, of the list of results inside the dropdown. */
export const MANUAL_RESULTS_LIST_HEIGHT = 200;
