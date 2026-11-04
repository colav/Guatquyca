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

export const TREND_RULE_OPTIONS = [
  { label: "Estricta", value: "strict" },
  { label: "Pendiente", value: "slope" },
];

export const RATIO_BASIS_OPTIONS = [
  { label: "Global", value: "global" },
  { label: "Nacional", value: "national" },
];

export const RULES_TABLE = [
  { key: "leader", category: "Líder", ratio: "= 1", trend: "creciente" },
  { key: "consolidated", category: "Consolidado", ratio: "> 0,75", trend: "creciente" },
  { key: "consolidating", category: "En consolidación", ratio: "> 0,50", trend: "creciente" },
  { key: "emerging", category: "Emergente", ratio: "< 0,25", trend: "creciente" },
  { key: "atRisk", category: "Riesgo de desaparecer", ratio: "> 0,50", trend: "decreciente" },
  { key: "uncategorized", category: "Sin categoría", ratio: "huecos de las reglas anteriores", trend: "—" },
  { key: "none", category: "Sin producción", ratio: "—", trend: "ninguna" },
];

export const DATA_WARNINGS = [
  "Benchmark institucional ausente. Las bases no incluyen citas por institución y tópico (institución más citada global / Colombia). El cociente de liderazgo se sustituye provisionalmente por el FWCI acotado a 1; «líder» aquí significa «cita por encima del promedio mundial con producción creciente», no «institución más citada».",
  "Regla de tendencia estricta. Con la definición literal (ningún año puede caer) la mayoría de los tópicos con producción queda en «riesgo de desaparecer». Compare con el interruptor «Pendiente».",
  "FWCI sensible a valores extremos: un solo producto hipercitado eleva el FWCI de campos enteros. Conviene usar mediana o truncar al percentil 99.",
  "Cobertura: 50.341 productos de los tipos solicitados; 41.653 (83 %) tienen tópico. Hay DOI y títulos repetidos entre fuentes SCIENTI/OpenAlex y años atípicos.",
  "Sin ODS, sin ubicación geográfica de la investigación y sin agendas internacionales: los paneles de ODS, el mapa y el ámbito «Internacional» requieren campos adicionales.",
];
