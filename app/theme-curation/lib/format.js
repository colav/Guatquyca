/**
 * Formatting helpers shared by the Theme Curation screens.
 */

/** Prefix of an OpenAlex id (the works search needs the full id; see topicProductionPath). */
const OPENALEX_ID_PREFIX = "https://openalex.org/";

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

/**
 * Path, relative to the same site, of ImpactU's works search filtered by a
 * topic (01 D-101): `/search/works?topics=<OpenAlex id>`. It has no host, so
 * it works the same on every site that serves the tool.
 *
 * The works search filters by the FULL OpenAlex id (`https://openalex.org/T…`);
 * the short forms ("T10661", "10661") are accepted but match nothing, with no
 * error [real, 3 Nov 2026, quyca-dev: T10001 gives 299 works, the short ones
 * 0]. The `topic_id` of the theme API is the number alone, so the prefix is
 * added here. ImpactU's filter looks at the work's PRIMARY topic (01 D-075).
 *
 * @param {string|number} topicId - `topic_id` as the theme API sends it ("10661"), or already the full OpenAlex id.
 * @returns {string|null} The path with its query, or null without an id.
 */
export function topicProductionPath(topicId) {
  if (topicId === null || topicId === undefined || topicId === "") return null;
  const id = String(topicId);
  const fullId = id.startsWith(OPENALEX_ID_PREFIX)
    ? id
    : `${OPENALEX_ID_PREFIX}T${id.replace(/^T/, "")}`;
  return `/search/works?${new URLSearchParams({ topics: fullId })}`;
}
