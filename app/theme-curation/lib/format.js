/**
 * Formatting helpers shared by the Theme Curation screens.
 */

const DATE_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

/**
 * Formats a date string (HTTP-date or ISO 8601, both parsed by
 * `new Date()`) as "12 ago 2026". Falls back to "-" for a missing or
 * unparseable value rather than showing "Invalid Date".
 *
 * @param {string} value
 * @returns {string}
 */
export function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return DATE_FORMATTER.format(date);
}

/**
 * Lowercases a text and strips its diacritics (NFD normalization), so a
 * filter treats "Bioeconomía", "bioeconomia" and "BIOECONOMÍA" alike
 * (01 D-046). Used by the client-side filters only; the manual topic search
 * runs on the server.
 *
 * @param {string} [text]
 * @returns {string}
 */
export function normalizeSearchText(text) {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/**
 * Splits the `keywords` string of a topic ("a; b; c", as OpenAlex and 02 §2
 * send it) into trimmed, non-empty keywords.
 *
 * @param {string|null} [keywords]
 * @returns {string[]}
 */
export function splitKeywords(keywords) {
  return (keywords ?? "")
    .split(";")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

/**
 * Joins the hierarchy levels a topic carries, broadest first
 * ("Domain › Field › Subfield"); levels the topic lacks are omitted.
 *
 * @param {Object} topic
 * @returns {string}
 */
export function hierarchyPath(topic) {
  return [topic.domain_name, topic.field_name, topic.subfield_name]
    .filter(Boolean)
    .join(" › ");
}
