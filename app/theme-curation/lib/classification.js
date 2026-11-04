/**
 * Shared helpers for working with the client-side classification state of
 * the Theme Curation flow. Classifications live only in frontend state
 * until the theme is created on Screen 3 (Guardar eje) — see the module
 * doc in lib/apis/theme.api.js for why: PATCH/POST topic endpoints need a
 * theme_id, which doesn't exist until POST /app/theme succeeds, and that
 * call needs `curator`, which is only collected on Screen 3.
 */

/**
 * Counts topics by classification status, defaulting anything without an
 * explicit entry in `classifications` to "unclassified".
 *
 * @param {Object[]} topics - Topics to count (candidates + manual topics).
 * @param {Object.<string, {status: string, justification?: string}>} classifications - Keyed by topic_id.
 * @returns {{included: number, excluded: number, borderline: number, unclassified: number}}
 */
export function computeCounts(topics, classifications) {
  const counts = { included: 0, excluded: 0, borderline: 0, unclassified: 0 };

  topics.forEach((topic) => {
    const status = classifications[topic.topic_id]?.status;
    if (status && counts[status] !== undefined) {
      counts[status] += 1;
    } else {
      counts.unclassified += 1;
    }
  });

  return counts;
}
