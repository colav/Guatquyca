/**
 * Visible texts and fixed lists of Board 1 (taken from the published artifact; D-102).
 * The state of the evidence of the Eje Temático is not named in any screen.
 */

export const BOARD_TITLE = "Masa crítica temática: campos de conocimiento demandados";

export const BOARD_EYEBROW = "Universidad de Antioquia · Capacidades VRI 2026 · Ensayo";

export const BOARD_LEAD =
  "Capacidad de la UdeA para generar impacto con su propia producción en cada tópico de OpenAlex, medida en seis categorías (líder, consolidado, en consolidación, emergente, riesgo de desaparecer, sin producción) y asociada a los Ejes Temáticos de las agendas públicas.";

export const MOCK_TAG = "Datos de prueba · métrica de liderazgo provisional";

export const HELP_TEXT = [
  "Este tablero presenta las capacidades de la Universidad de Antioquia de generar impacto en diferentes investigaciones en el mundo con su propia producción. Se mide la capacidad de la Universidad en términos de seis categorías: líder, consolidado, en consolidación, riesgo de desaparecer, emergente y sin producción. El liderazgo se mide considerando el volumen de citas respecto a los más citados en el tema a nivel nacional y global y las tendencias crecientes y decrecientes de la producción en los últimos 5 años. La categoría más alta, el liderazgo, lo determina si la institución tiene el número de citas más alto y la producción creciente en los últimos 5 años, en un gradiente hasta obtener los temas en los que no hay producción.",
  "En esta versión el cociente «citas UdeA / institución más citada» no puede calcularse con las bases entregadas; se usa como proxy provisional el FWCI (citas por producto de la UdeA ÷ promedio mundial del tópico, acotado a 1). Los colores del gráfico: naranja = consolidado o líder (benchmark global); azul = en consolidación (provisional; en la versión final: consolidado/líder frente al benchmark nacional); blanco = resto.",
];

export const POLICY_DOCUMENTS = [
  "PDD mpal Medellín",
  "PDD dptal Antioquia",
  "CONPES 4069",
  "Misión de sabios 2019",
  "CONPES 4144",
  "Plan Decenal CTI Medellín 2024-2033",
  "Política Nacional de Ciencia Abierta 2022-2031",
  "Recomendación UNESCO sobre la Ciencia Abierta 2021",
  "Plan Nacional de Cultura 2024-2038",
  "OECD STI Outlook 2025",
  "Marco UNESCO de Educación Cultural y Artística 2025",
  "Global Sustainable Development Report 2023 (ONU)",
];

export const ALL_SCOPES = ["Local", "Departamental", "Nacional", "Internacional"];

export const DONUT_LABELS = {
  type: ["Artículo", "Libro", "Capítulo"],
  quartile: ["Sin cuartil", "Q1", "Q2", "Q3", "Q4"],
  access: ["Sin dato OA", "Diamante", "Dorada", "Híbrida", "Verde", "Bronce", "Cerrado"],
};

export const DIMENSION_OPTIONS = [
  { label: "Tópicos", value: "topic" },
  { label: "Subcampos", value: "subfield" },
  { label: "Campos", value: "field" },
];

export const DIMENSION_NOUN = { topic: "Tópicos", subfield: "Subcampos", field: "Campos" };

/** Reference of the capacity ratio (D-122): Colombia by default, or the world. */
export const RATIO_BASIS_OPTIONS = [
  { label: "Colombia", value: "national" },
  { label: "Mundo", value: "global" },
];
export const REFERENCE_NAME = { national: "Colombia", global: "Mundo" };

export const TREND_LABELS = { increasing: "creciente", stable: "estable", decreasing: "decreciente", none: "sin producción" };

/** Rules of the old model (artifact data, `?source=mock`). */
export const RULES_TABLE_LEGACY = [
  { key: "leader", category: "Líder", ratio: "= 1", trend: "creciente" },
  { key: "consolidated", category: "Consolidado", ratio: "> 0,75", trend: "creciente" },
  { key: "consolidating", category: "En consolidación", ratio: "> 0,50", trend: "creciente" },
  { key: "emerging", category: "Emergente", ratio: "< 0,25", trend: "creciente" },
  { key: "atRisk", category: "Riesgo de desaparecer", ratio: "> 0,50", trend: "decreciente" },
  { key: "uncategorized", category: "Sin categoría", ratio: "huecos de las reglas anteriores", trend: "—" },
  { key: "none", category: "Sin producción", ratio: "—", trend: "ninguna" },
];

/** Rules of the seven categories (D-122), also shown in the tooltip of the calculator. */
export const RULES_TABLE = [
  { key: "leader", category: "Líder", ratio: "= 1", trend: "creciente o estable" },
  { key: "consolidated", category: "Consolidado", ratio: "> 0,75", trend: "creciente o estable" },
  { key: "consolidating", category: "En consolidación", ratio: "> 0,50", trend: "creciente o estable" },
  { key: "emerging", category: "Emergente", ratio: "≤ 0,50", trend: "creciente" },
  { key: "atRisk", category: "Riesgo de desaparecer", ratio: "> 0,50", trend: "decreciente" },
  { key: "lowCapacity", category: "Capacidad baja", ratio: "≤ 0,50", trend: "estable o decreciente" },
  { key: "none", category: "Sin producción", ratio: "—", trend: "sin productos en 2021–2025" },
];

/** One-line rule of each category for the tooltip of the calculator. */
export const RULE_LINE = Object.fromEntries(
  RULES_TABLE.map((r) => [r.key, r.ratio === "—" ? `${r.category}: ${r.trend}` : `${r.category}: razón ${r.ratio} y tendencia ${r.trend}`]),
);

/** Methodological note of the calculator (provisional text: Luis approves it, D-121). */
export const METHOD_NOTE =
  "Cada tópico se clasifica por su capacidad relativa (citas de la UdeA frente a la institución más citada en Colombia o en el mundo) y por la tendencia de su producción en 2021–2025 (pendiente de la recta ajustada a los conteos anuales). Con pocos productos la tendencia es indicativa (*).";

/** Help text of the board with the data of the API (provisional: Luis approves it). */
export const HELP_TEXT_REAL = [
  HELP_TEXT[0],
  "Los colores del gráfico: naranja = consolidado o líder; azul = en consolidación; blanco = el resto. El tamaño del punto es el FWCI, calculado solo sobre los productos con registro en OpenAlex.",
];

export const DATA_WARNINGS = [
  "Benchmark institucional ausente. Las bases no incluyen citas por institución y tópico (institución más citada global / Colombia). El cociente de liderazgo se sustituye provisionalmente por el FWCI acotado a 1; «líder» aquí significa «cita por encima del promedio mundial con producción creciente», no «institución más citada».",
  "Regla de tendencia estricta. Con la definición literal (ningún año puede caer) la mayoría de los tópicos con producción queda en «riesgo de desaparecer». Compare con el interruptor «Pendiente».",
  "FWCI sensible a valores extremos: un solo producto hipercitado eleva el FWCI de campos enteros. Conviene usar mediana o truncar al percentil 99.",
  "Cobertura: 50.341 productos de los tipos solicitados; 41.653 (83 %) tienen tópico. Hay DOI y títulos repetidos entre fuentes SCIENTI/OpenAlex y años atípicos.",
  "Sin ODS, sin ubicación geográfica de la investigación y sin agendas internacionales: los paneles de ODS, el mapa y el ámbito «Internacional» requieren campos adicionales.",
];

/** Tag of the board when the data come from the API (provisional text, Luis approves it). */
export const REAL_TAG = "Datos de ImpactU · capacidad frente a la institución más citada";


/**
 * Warnings of the board with the data of the bundle: the coverage comes from `meta` and the ODS
 * and geography lines describe what the bundle has now (the first three are the same as before).
 *
 * @param {{ n_sel: number, n_topic: number }} meta
 * @returns {string[]}
 */
export function realDataWarnings(meta) {
  const fmt = (n) => n.toLocaleString("es-CO");
  const share = Math.round((100 * meta.n_topic) / meta.n_sel);
  return [
    "Capacidad relativa. La razón compara las citas de la UdeA en cada tópico con las de la institución más citada de Colombia o del mundo en cada año; los tópicos sin referencia nacional usan la mundial. Es una medida provisional hasta que Luis apruebe los textos y los umbrales.",
    "Tendencia indicativa (*). Con menos de 10 productos en 2021–2025 la pendiente de la recta es poco fiable; esos tópicos se marcan y se cuentan en el panel.",
    "FWCI solo sobre productos con registro en OpenAlex. Los productos que vienen solo de SCIENTI o de Minciencias no tienen datos de citas (no son «cero citas») y no entran en el FWCI. El FWCI es sensible a valores extremos: un solo producto hipercitado eleva el de campos enteros.",
    `Cobertura: ${fmt(meta.n_sel)} productos de los tipos solicitados; ${fmt(meta.n_topic)} (${share} %) tienen tópico. Hay DOI y títulos repetidos entre fuentes y años atípicos; 2025 y 2026 pueden estar incompletos.`,
    "ODS con cobertura parcial: una obra sin ODS está sin clasificar, no «sin relación». La subregión se deduce solo de menciones en el título; las bases no traen ubicación geográfica de la investigación.",
  ];
}

/* Confidence of the axis–work pairs (D-092, Q8). Provisional texts: Luis approves them. */
export const PAIR_LEVEL_OPTIONS = [
  { value: "core", label: "Alta y media" },
  { value: "all", label: "Incluir baja" },
];
export const PAIR_LEVEL_TOOLTIP =
  "Cada producto se asigna a un Eje Temático con una confianza (alta, media o baja) calculada por inteligencia artificial, sin validación humana. Por defecto se cuentan solo las asignaciones de confianza alta y media.";
export const AXES_PANEL_NOTE = {
  core: "productos con asignación de confianza alta o media",
  all: "productos con asignación de cualquier confianza (incluye baja)",
  topics: "n.º de tópicos con producción UdeA",
};
