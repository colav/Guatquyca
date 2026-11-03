/**
 * Persists Screen 2's client-side classification state against a theme
 * that already exists in the backend (see lib/classification.js and
 * new/page.js for why this can't happen any earlier than Screen 3).
 *
 * Sends every classified topic in ONE request via bulkPersistTopics,
 * instead of one PATCH/POST per topic. A theme can easily have 100+
 * classified topics, so N sequential round trips are slow. The N-parallel
 * version also failed in practice (~9 topics sent in parallel mostly
 * failed), but not because of rate limiting: quyca shared one ClickHouse
 * client across requests and rejected overlapping queries with a 400
 * (fixed in quyca, 01 D-027). Bulk is kept for latency (one round trip)
 * and because the backend reports success or failure per topic. The
 * endpoint is live and its response shape is confirmed (02 §3.8).
 */

import { bulkPersistTopics } from "@/lib/apis/theme.api";

/**
 * Builds the flat list of {topicId, method, status, similarityScore,
 * justification} items bulkPersistTopics expects, from the two groups of
 * topics Screen 2 tracks separately. Topics with no entry in
 * `classifications` are left out: there's no "unclassified" status in the
 * API, and the curator already had the chance to classify them on
 * Screen 2.
 *
 * @param {Object[]} candidates
 * @param {Object[]} manualTopics
 * @param {Object.<string, {status: string, justification?: string}>} classifications
 * @returns {Object[]}
 */
function buildTargets(candidates, manualTopics, classifications) {
  const classified = (topic) => classifications[topic.topic_id]?.status;

  return [
    ...candidates.filter(classified).map((topic) => ({
      topicId: topic.topic_id,
      method: "automatic",
      similarityScore: topic.similarity_score,
      ...classifications[topic.topic_id],
    })),
    ...manualTopics.filter(classified).map((topic) => ({
      topicId: topic.topic_id,
      method: "manual",
      ...classifications[topic.topic_id],
    })),
  ];
}

/**
 * Persists every classified topic (candidates + manual) against `themeId`
 * in a single bulk request. Used both for the initial save and to retry
 * only the topics that failed the first time (pass a filtered
 * `candidates`/`manualTopics` for that — still one request, just a
 * smaller batch).
 *
 * @param {Object} params
 * @param {string} params.themeId
 * @param {Object[]} params.candidates
 * @param {Object[]} params.manualTopics
 * @param {Object.<string, {status: string, justification?: string}>} params.classifications
 * @returns {Promise<{topicId: string, ok: boolean, error?: string}[]>}
 */
export async function persistAllTopics({
  themeId,
  candidates,
  manualTopics,
  classifications,
}) {
  const targets = buildTargets(candidates, manualTopics, classifications);
  if (targets.length === 0) return [];

  const response = await bulkPersistTopics(themeId, { topics: targets });

  const succeededIds = new Set(
    (response.data?.succeeded ?? []).map((t) => t.topic_id),
  );
  const failedErrorById = new Map(
    (response.data?.failed ?? []).map((f) => [f.topic_id, f.error]),
  );

  return targets.map(({ topicId }) => {
    if (succeededIds.has(topicId)) return { topicId, ok: true };
    return {
      topicId,
      ok: false,
      error: failedErrorById.get(topicId) || "No se pudo guardar este tópico.",
    };
  });
}
