/**
 * [mock] Simulated reranker for the two-phase review (01 D-089, D-090, D-097).
 *
 * The real endpoint (`POST /app/theme/candidates/rerank`, contract 02
 * version 8, written by the backend) does not exist yet. This module stands in
 * for it so Screen 2 can be built and seen: it reorders the list it receives
 * with a deterministic shuffle and returns the fields the contract announces
 * (`rank`, `cosine_rank`, `similarity_score`). It never reads or returns a
 * reranker score (D-090) and calls no network.
 *
 * Delete this file when the real endpoint is deployed.
 *
 * Test hooks, mock only: `window.__THEME_RERANK_MOCK_DELAY_MS` replaces the
 * simulated delay and `window.__THEME_RERANK_MOCK_FAIL = true` makes the call
 * fail, to see the fallback.
 */

/* Constants & utils */
import { RERANK_MOCK_DELAY_MS } from "./constants";

/** Small deterministic hash of a topic id, so the shuffle is the same on every run. */
function hashId(id) {
  let hash = 0;
  for (const char of String(id)) {
    hash = (hash * 31 + char.charCodeAt(0)) % 100003;
  }
  return hash;
}

/**
 * @param {Object[]} candidates - Phase 1 list (cosine), each with `similarity_score`.
 * @returns {Promise<{data: Object[], total_results: number}>} The same topics
 *   reordered, each with `rank` (new position, from 1) and `cosine_rank` (the
 *   position it had by cosine).
 * @throws {Error} When the test hook `__THEME_RERANK_MOCK_FAIL` is set.
 */
export async function mockRerankCandidates(candidates) {
  const delay =
    typeof window !== "undefined" &&
    typeof window.__THEME_RERANK_MOCK_DELAY_MS === "number"
      ? window.__THEME_RERANK_MOCK_DELAY_MS
      : RERANK_MOCK_DELAY_MS;
  await new Promise((resolve) => setTimeout(resolve, delay));

  if (typeof window !== "undefined" && window.__THEME_RERANK_MOCK_FAIL) {
    throw new Error("Simulated reranker failure.");
  }

  const byCosine = [...candidates].sort(
    (a, b) =>
      (b.similarity_score ?? -Infinity) - (a.similarity_score ?? -Infinity),
  );

  const reordered = byCosine
    .map((topic, i) => ({
      topic,
      cosineRank: i + 1,
      // Moves each topic up to 15 places either way.
      key: i + 1 + (hashId(topic.topic_id) % 31) - 15,
    }))
    .sort((a, b) => a.key - b.key || a.cosineRank - b.cosineRank);

  return {
    data: reordered.map(({ topic, cosineRank }, i) => ({
      ...topic,
      rank: i + 1,
      cosine_rank: cosineRank,
    })),
    total_results: reordered.length,
  };
}
