// Shared fixtures and helpers of the Theme Curation tests. Not a test file.

// Theme Curation: Screen 5 (theme detail), the long-seed alert (`truncated`)
// and the listing links. Every API response is simulated with page.route, so
// these tests need no backend; see theme-curation-live.spec.js for the
// read-only checks against a real service.

// Over SEED_CHAR_LIMIT characters (Screen 1 only).
export const LONG_SEED_ALERT =
  "La semilla es más larga de lo recomendado. Una semilla más larga no da mejores resultados; prioriza los términos que definen el eje.";

// /candidates answered `truncated: true` (Screens 1-2).
export const TRUNCATED_SEED_ALERT =
  "La semilla superó el límite del modelo y se cortó: lo que quedó al final no se usó.";

export const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "*",
  "access-control-allow-methods": "*",
};

export const NOT_FOUND_THEME =
  "Este Eje Temático no existe o el enlace es incorrecto.";
export const NETWORK =
  "No se pudo conectar con el servicio. Revisa tu conexión e inténtalo de nuevo.";
export const RATE_SEARCH =
  "Demasiadas búsquedas seguidas. Espera un momento e inténtalo de nuevo.";
export const RATE_GENERAL =
  "Demasiadas solicitudes seguidas. Espera un momento e inténtalo de nuevo.";
export const BAD_CANDIDATES =
  "No se pudieron obtener los tópicos candidatos. Revisa la semilla e inténtalo de nuevo; si sigue fallando, avisa al equipo.";
export const BAD_SEARCH =
  "No se pudo completar la búsqueda. Inténtalo de nuevo; si sigue fallando, avisa al equipo.";
export const BAD_CREATE =
  "No se pudo guardar el Eje Temático. Revisa el nombre, el curador y la semilla; si sigue fallando, avisa al equipo.";
export const BAD_OTHER =
  "No se pudo completar la acción. Inténtalo de nuevo; si sigue fallando, avisa al equipo.";
export const SERVER_PROBLEM =
  "El servicio tuvo un problema. Inténtalo de nuevo.";
export const html429 = (route) =>
  route.fulfill({
    status: 429,
    contentType: "text/html",
    headers: CORS,
    body: "10 per 1 second",
  });

// Midday UTC keeps the displayed day stable in any local time zone.
export const HTTP_DATE = "Tue, 22 Sep 2026 15:00:00 GMT";

export const catalogFields = (name) => ({
  domain_id: "1",
  domain_name: "Physical Sciences",
  field_id: "2",
  field_name: "Energy",
  subfield_id: "3",
  subfield_name: "Renewable Energy",
  summary: `Summary of ${name}`,
  keywords: "a; b; c",
  wikipedia_url: "https://en.wikipedia.org/wiki/X",
});

export const orphanFields = {
  summary: null,
  keywords: null,
  subfield_id: null,
  subfield_name: null,
  field_id: null,
  field_name: null,
  domain_id: null,
  domain_name: null,
  wikipedia_url: null,
};

export const topic = (id, name, status, method, justification) => ({
  theme_id: "t1",
  topic_id: id,
  status,
  method,
  similarity_score: method === "manual" ? null : 0.5987271070480347,
  justification,
  classified_at: HTTP_DATE,
  name,
  ...(name ? catalogFields(name) : orphanFields),
});

export const THEME = {
  theme_id: "t1",
  name: "Movilidad sostenible",
  description: "",
  seed_text: "palabra ".repeat(80),
  curator: "Luis",
  created_at: HTTP_DATE,
  updated_at: HTTP_DATE,
  summary: { included: 2, excluded: 1, borderline: 1, manual: 1 },
  topics: [
    topic("10", "Zeta topic", "excluded", "automatic", ""),
    topic("11", "Beta topic", "included", "manual", ""),
    topic("12", "Alpha topic", "included", "automatic", ""),
    topic(
      "13",
      "Gamma topic",
      "borderline",
      "automatic",
      "Solo relevante en parte del eje por su aplicación industrial",
    ),
    topic("99", null, "included", "automatic", ""),
  ],
};

// Topic shape of a backend without D-009: no catalog fields at all.
export const THEME_WITHOUT_CATALOG = {
  ...THEME,
  topics: THEME.topics.map(
    ({
      theme_id,
      topic_id,
      status,
      method,
      similarity_score,
      justification,
      classified_at,
    }) => ({
      theme_id,
      topic_id,
      status,
      method,
      similarity_score,
      justification,
      classified_at,
    }),
  ),
};

export const json = (route, status, body) =>
  route.fulfill({
    status,
    contentType: "application/json",
    headers: CORS,
    body: JSON.stringify(body),
  });

/**
 * Answers every /app/theme* request with the first handler whose `match`
 * accepts it, and with a 500 when none does, so an unexpected call fails the
 * test instead of reaching a real backend.
 */
export async function mockThemeApi(page, handlers) {
  await page.route(
    (url) => url.pathname.startsWith("/app/theme"),
    async (route) => {
      const request = route.request();
      if (request.method() === "OPTIONS") {
        return route.fulfill({ status: 204, headers: CORS });
      }
      const url = new URL(request.url());
      const handler = handlers.find((h) => h.match(url, request));
      if (handler) return handler.reply(route, request);
      return json(route, 500, { error: `unmocked ${url.pathname}` });
    },
  );
}

export const detailHandler = (theme) => ({
  match: (url) => url.pathname === "/app/theme/t1",
  reply: (route) => json(route, 200, { data: theme }),
});

export const tableRows = (page) =>
  page
    .locator("tbody tr.ant-table-row")
    .evaluateAll((rows) =>
      rows.map((row) => row.innerText.replace(/\s+/g, " ")),
    );
