/**
 * Texts the interface shows for backend errors, chosen by what failed and by
 * context (01 D-031 A, D-049) instead of showing the server's `error` as it
 * comes.
 */

/* Constants & utils */
import {
  BAD_REQUEST_MESSAGES,
  NOT_FOUND_THEME_MESSAGE,
  RATE_LIMIT_GENERAL_MESSAGE,
  RATE_LIMIT_MESSAGE,
  SERVER_ERROR_MESSAGE,
} from "./constants";

/**
 * Contexts that change the text of a 429, a 400 or a 404:
 * - "candidates": asking for candidate topics (Screen 1).
 * - "search": the manual topic search (Screen 2).
 * - "createTheme": creating the theme when saving (Screen 3).
 * - "themeDetail": opening a saved theme (Screen 5).
 * - "other" (default): anything else (listing, saving topics, retrying).
 */

/**
 * Message to show for a failed request, in this order:
 * - no response at all (the request never reached the service): the
 *   connection text, already carried by the error (`isNetwork`);
 * - 429: the "búsquedas" text for the search and the candidates, the general
 *   one elsewhere;
 * - 5xx: the service-problem text;
 * - 400: one text per context;
 * - 404 opening a theme (Screen 5): its own text;
 * - anything else (other 404s, ...): what the error carried (the server's
 *   message) or `fallback`.
 *
 * @param {Error & {status?: number, isNetwork?: boolean}} err
 * @param {string} fallback
 * @param {"candidates"|"search"|"createTheme"|"themeDetail"|"other"} [context="other"]
 * @returns {string}
 */
export function errorMessage(err, fallback, context = "other") {
  if (err?.isNetwork) return err.message;
  const status = err?.status;
  if (status === 429) {
    return context === "search" || context === "candidates"
      ? RATE_LIMIT_MESSAGE
      : RATE_LIMIT_GENERAL_MESSAGE;
  }
  if (status >= 500 && status <= 599) return SERVER_ERROR_MESSAGE;
  if (status === 400) {
    return BAD_REQUEST_MESSAGES[context] ?? BAD_REQUEST_MESSAGES.other;
  }
  if (status === 404 && context === "themeDetail") {
    return NOT_FOUND_THEME_MESSAGE;
  }
  return err?.message || fallback;
}
