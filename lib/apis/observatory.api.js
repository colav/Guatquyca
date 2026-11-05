/**
 * API helpers for the observatories (VRI-UdeA boards).
 *
 * The endpoints live in quyca under /observatories (02 §3.11 and §3.12). They are public, so the
 * requests send no credentials. The bundle is served with `Cache-Control: no-cache` and an ETag:
 * the browser revalidates it by itself (If-None-Match) and a 304 is transparent for this code.
 *
 * @module lib/apis/observatory.api
 */

const API = process.env.NEXT_PUBLIC_CLIENT_API;

const ENDPOINTS = {
  bundle: (slug, board) => `/observatories/${slug}/boards/${board}/bundle`,
  cut: (slug) => `/observatories/${slug}/cut`,
};

/**
 * Reads the error of a failed response and builds an Error with `status` and, when the body has
 * one, the stable `code` (observatory_not_loaded, observatory_not_configured).
 *
 * @param {Response} response
 * @returns {Promise<Error>}
 */
async function apiError(response) {
  let body = {};
  try {
    body = await response.json();
  } catch {
    /* The body is not JSON: only the status is known. */
  }
  const error = new Error(body.error || `Observatory request failed with ${response.status}`);
  error.status = response.status;
  if (body.code) error.code = body.code;
  return error;
}

/**
 * Runs fetch and marks the failures that never got a response (offline, DNS, CORS, backend down).
 *
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<Response>}
 */
async function request(url, options) {
  try {
    return await fetch(url, options);
  } catch (cause) {
    if (cause && cause.name === "AbortError") throw cause;
    const error = new Error("The observatory service did not answer.");
    error.isNetwork = true;
    throw error;
  }
}

/**
 * Data package of a board (02 §3.11): one JSON without envelope, in the shape of the artifacts.
 *
 * @param {string} slug - Observatory, today only "vri-udea".
 * @param {number} board - 1, 2 or 3.
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<Object>} bundle
 * @throws {Error} With `status` (404, 503, 500…) and `code` when the server sends one.
 */
export async function getBoardBundle(slug, board, { signal } = {}) {
  const response = await request(`${API}${ENDPOINTS.bundle(slug, board)}`, { signal });
  if (!response.ok) throw await apiError(response);
  return response.json();
}

/**
 * Cut-off of the loaded data (02 §3.12); `texto` is the footer of the three boards.
 *
 * @param {string} slug
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<Object>} the `data` object ({ load_id, texto, … }).
 * @throws {Error} With `status` and `code`.
 */
export async function getCutoff(slug, { signal } = {}) {
  const response = await request(`${API}${ENDPOINTS.cut(slug)}`, { signal });
  if (!response.ok) throw await apiError(response);
  const body = await response.json();
  return body.data;
}
