/**
 * API helpers for the Theme Curation tool (theme curation).
 *
 * All endpoints live under /theme in quyca. This is an open-access tool
 * (no login), so unlike admin.api.js / submit.api.js these requests do NOT
 * send CSRF tokens or credentials.
 *
 * @module lib/apis/theme.api
 */

const API = process.env.NEXT_PUBLIC_CLIENT_API;

const ENDPOINTS = {
  candidates: "/theme/candidates",
  rerank: "/theme/candidates/rerank",
  search: "/theme/search",
  themes: "/theme",
  theme: (themeId) => `/theme/${themeId}`,
  topic: (themeId, topicId) => `/theme/${themeId}/topics/${topicId}`,
  topics: (themeId) => `/theme/${themeId}/topics`,
  topicsBulk: (themeId) => `/theme/${themeId}/topics/bulk`,
  export: (themeId) => `/theme/${themeId}/export`,
};

/** Milliseconds the client waits for the reranker; the backend gives up at 60 s (02 §3.10.3). */
const RERANK_CLIENT_TIMEOUT_MS = 75000;

/** Friendly message shown when the request never reaches the server (offline, DNS, CORS, backend down). */
const NETWORK_ERROR_MESSAGE =
  "No se pudo conectar con el servicio. Revisa tu conexión e inténtalo de nuevo.";

/**
 * Runs fetch(url, options) and normalizes low-level failures (offline, DNS,
 * CORS, connection refused — the backend not being reachable at all) into a
 * friendly Spanish Error, instead of letting the raw browser TypeError
 * ("Failed to fetch") reach the UI.
 *
 * HTTP-level errors (4xx/5xx, a real response from the server) are NOT
 * handled here — the caller still checks `response.ok` and uses
 * throwApiError for those, since the server's own `{ "error": "..." }`
 * message is more useful than a generic one.
 *
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<Response>}
 * @throws {Error} With message NETWORK_ERROR_MESSAGE if the request never got a response.
 */
async function request(url, options) {
  try {
    return await fetch(url, options);
  } catch {
    // No HTTP status: lib/errors.js tells this apart by `isNetwork`.
    const err = new Error(NETWORK_ERROR_MESSAGE);
    err.isNetwork = true;
    throw err;
  }
}

/**
 * Parses a JSON error response from the theme API, which always has the
 * shape { "error": "message" } (plus a stable `code` on some errors, such as
 * `reranker_unavailable`, 02 §3.10), and throws an Error with that message.
 *
 * @param {Response} response - The fetch Response object.
 * @param {string} fallbackMessage - Message to use if the body has no `error` field.
 * @throws {Error} With `status` and, when the body had one, `code`.
 */
async function throwApiError(response, fallbackMessage) {
  let message = fallbackMessage;
  let code;
  try {
    const data = await response.json();
    if (data?.error) message = data.error;
    if (data?.code) code = data.code;
  } catch {
    // response body wasn't JSON; keep the fallback message
  }
  const err = new Error(message);
  err.status = response.status;
  if (code) err.code = code;
  throw err;
}

/**
 * Computes embedding-based candidate topics for a seed text.
 *
 * @param {Object} params
 * @param {string} params.seedText - Free-text seed describing the theme.
 * @param {number} [params.topN] - Max number of candidates to return; the interface always sends 120 (D-097; the backend default is 120 since 02 version 8).
 * @returns {Promise<{data: Object[], total_results: number, truncated?: boolean, reranking_available?: boolean}>} `truncated` is true when the backend cut the seed at the model's context limit (01 D-008; 4,095 tokens with Qwen, B24); the field is absent on a backend without D-008. `reranking_available` (02 version 8) is false when the reranker did not answer a health check; absent on an older backend.
 * @throws {Error} If seed_text is missing/invalid or the request fails.
 */
export async function getCandidates({ seedText, topN }) {
  const response = await request(`${API}${ENDPOINTS.candidates}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      seed_text: seedText,
      ...(topN ? { top_n: topN } : {}),
    }),
  });

  if (!response.ok) {
    await throwApiError(
      response,
      "No se pudieron calcular los tópicos candidatos.",
    );
  }

  return response.json();
}

/**
 * Phase 2 of the candidate list (02 §3.10, D-097): sends the phase 1 list back
 * to the reranker and gets the same topics reordered, all at once. The
 * reranker's own score is never returned (D-090), only the new position.
 *
 * Takes about 11 seconds with a GPU (02 §3.10.5, [real, B72]); the backend
 * answers 503 `reranker_unavailable` after at most 60 s, so the client gives
 * up a little later (a request that never answers is treated as a network
 * failure by `request`).
 *
 * @param {Object} params
 * @param {string} params.seedText - The same seed used for phase 1.
 * @param {string[]} params.topicIds - 1 to 120 distinct ids, in the order phase 1 returned them.
 * @returns {Promise<{data: Object[], total_results: number}>} Each topic with `rank` (new position), `cosine_rank` (position in phase 1) and `similarity_score` (cosine).
 * @throws {Error} 400 on invalid input; 503 with `code: "reranker_unavailable"` when the service is down or too slow.
 */
export async function rerankCandidates({ seedText, topicIds }) {
  const response = await request(`${API}${ENDPOINTS.rerank}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seed_text: seedText, topic_ids: topicIds }),
    signal: AbortSignal.timeout(RERANK_CLIENT_TIMEOUT_MS),
  });

  if (!response.ok) {
    await throwApiError(
      response,
      "No se pudieron reordenar los tópicos candidatos.",
    );
  }

  return response.json();
}

/**
 * Lexical search across the full topic catalog (manual add-on flow).
 * Results have the same shape as candidates but `similarity_score` is null.
 *
 * @param {Object} params
 * @param {string} params.q - Search query.
 * @param {number} [params.limit=50]
 * @returns {Promise<{data: Object[], total_results: number}>}
 */
export async function searchTopics({ q, limit = 50 }) {
  const params = new URLSearchParams({ q, limit: String(limit) });
  const response = await request(`${API}${ENDPOINTS.search}?${params}`);

  if (!response.ok) {
    await throwApiError(response, "La búsqueda de tópicos falló.");
  }

  return response.json();
}

/**
 * Creates a new theme (Eje Temático).
 *
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.seedText
 * @param {string} params.curator
 * @param {string} [params.description]
 * @returns {Promise<{data: Object}>}
 */
export async function createTheme({ name, seedText, curator, description }) {
  const response = await request(`${API}${ENDPOINTS.themes}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      seed_text: seedText,
      curator,
      ...(description ? { description } : {}),
    }),
  });

  if (!response.ok) {
    await throwApiError(response, "No se pudo guardar el eje temático.");
  }

  return response.json();
}

/**
 * Lists all curated themes.
 *
 * @returns {Promise<{data: Object[], total_results: number}>}
 */
export async function listThemes() {
  const response = await request(`${API}${ENDPOINTS.themes}`);

  if (!response.ok) {
    await throwApiError(
      response,
      "No se pudo cargar el listado de ejes temáticos.",
    );
  }

  return response.json();
}

/**
 * Fetches the full detail of one theme, including its classified topics
 * and summary counts.
 *
 * @param {string} themeId
 * @returns {Promise<{data: Object}>}
 */
export async function getTheme(themeId) {
  const response = await request(`${API}${ENDPOINTS.theme(themeId)}`);

  if (!response.ok) {
    await throwApiError(response, "No se pudo cargar el eje temático.");
  }

  return response.json();
}

/**
 * Classifies or reclassifies a candidate topic within a theme.
 *
 * @param {string} themeId
 * @param {string} topicId
 * @param {Object} params
 * @param {"included"|"excluded"|"borderline"} params.status
 * @param {"automatic"} [params.method="automatic"]
 * @param {number|null} [params.similarityScore]
 * @param {string} [params.justification] - Required by the API when status is "borderline".
 * @returns {Promise<{data: Object}>}
 */
export async function classifyTopic(
  themeId,
  topicId,
  { status, method = "automatic", similarityScore, justification },
) {
  const response = await request(`${API}${ENDPOINTS.topic(themeId, topicId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status,
      method,
      ...(similarityScore !== undefined
        ? { similarity_score: similarityScore }
        : {}),
      ...(justification !== undefined ? { justification } : {}),
    }),
  });

  if (!response.ok) {
    await throwApiError(response, "No se pudo clasificar el tópico.");
  }

  return response.json();
}

/**
 * Adds a manually found topic (from searchTopics) to a theme.
 * The API forces method="manual" and similarity_score=null server-side.
 *
 * @param {string} themeId
 * @param {Object} params
 * @param {string} params.topicId
 * @param {"included"|"excluded"|"borderline"} params.status
 * @param {string} [params.justification]
 * @returns {Promise<{data: Object}>}
 */
export async function addManualTopic(
  themeId,
  { topicId, status, justification },
) {
  const response = await request(`${API}${ENDPOINTS.topics(themeId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topic_id: topicId,
      status,
      ...(justification ? { justification } : {}),
    }),
  });

  if (!response.ok) {
    await throwApiError(response, "No se pudo agregar el tópico.");
  }

  return response.json();
}

/**
 * Persists a whole batch of topic classifications in a single request —
 * the bulk counterpart to classifyTopic/addManualTopic. Needed because a
 * theme's review can easily involve 100+ classified topics, and one HTTP
 * round trip per topic is slow end-to-end. Run in parallel, the per-topic
 * version failed (a batch of ~9 topics mostly failed), but the cause was
 * not rate limiting: quyca shared one ClickHouse client across requests
 * and answered overlapping queries with a 400 (fixed in quyca, 01 D-027).
 * The endpoint is live and its response shape is confirmed (02 §3.8).
 *
 * Each item folds together what classifyTopic and addManualTopic each did
 * for one topic: `method` says which of the two behaviors applies
 * ("automatic" for a topic that came from /candidates, "manual" for one
 * added via /search), and the backend forces
 * similarity_score=null for "manual" items regardless of what's sent,
 * mirroring addManualTopic's behavior. The batch can partially succeed —
 * one item failing (e.g. a missing justification on a "borderline" item)
 * does not fail the rest — and is reported back per topic_id.
 *
 * @param {string} themeId
 * @param {Object} params
 * @param {Object[]} params.topics
 * @param {string} params.topics[].topicId
 * @param {"automatic"|"manual"} params.topics[].method
 * @param {"included"|"excluded"|"borderline"} params.topics[].status
 * @param {number} [params.topics[].similarityScore]
 * @param {string} [params.topics[].justification] - Required by the backend when status is "borderline"; missing it fails only that item.
 * @returns {Promise<{data: {succeeded: Object[], failed: {topic_id: string, error: string}[]}}>}
 */
export async function bulkPersistTopics(themeId, { topics }) {
  const response = await request(`${API}${ENDPOINTS.topicsBulk(themeId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topics: topics.map((t) => ({
        topic_id: t.topicId,
        method: t.method,
        status: t.status,
        ...(t.similarityScore !== undefined
          ? { similarity_score: t.similarityScore }
          : {}),
        ...(t.justification !== undefined
          ? { justification: t.justification }
          : {}),
      })),
    }),
  });

  if (!response.ok) {
    await throwApiError(
      response,
      "No se pudieron guardar los tópicos clasificados.",
    );
  }

  return response.json();
}

/**
 * Builds the export URL for a theme (JSON or CSV). Meant to be used
 * directly as a link/download href, mirroring how APIButton.js builds
 * URLs elsewhere in the app.
 *
 * @param {string} themeId
 * @param {"json"|"csv"} [format="json"]
 * @returns {string}
 */
export function getExportUrl(themeId, format = "json") {
  return `${API}${ENDPOINTS.export(themeId)}?format=${format}`;
}
