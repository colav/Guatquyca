"use client";

/* Styles */
import styles from "../styles.module.css";

/* Constants & utils */
import { KEYWORD_PREVIEW_COUNT } from "../lib/constants";
import { splitKeywords } from "../lib/format";

/**
 * TopicKeywords is the secondary line shown under a topic's name in the
 * review table (Screen 2) and in the theme detail table (Screen 5): the
 * first KEYWORD_PREVIEW_COUNT OpenAlex keywords, with an ellipsis when there
 * are more. The native tooltip (title) lists all of them. It lets the curator
 * spot a misleading topic name without opening the detail modal.
 *
 * Renders nothing when the topic has no keywords.
 *
 * @param {Object} topic - A Candidate or a detail topic (02 §2, §9).
 * @returns {JSX.Element|null}
 */
export default function TopicKeywords({ topic }) {
  const keywords = splitKeywords(topic.keywords);
  if (keywords.length === 0) return null;

  const preview = keywords.slice(0, KEYWORD_PREVIEW_COUNT).join(", ");
  const hasMore = keywords.length > KEYWORD_PREVIEW_COUNT;

  return (
    <div
      className={styles.topicKeywords}
      title={keywords.join(", ")}
      data-testid="topic-keywords"
    >
      {preview}
      {hasMore ? "…" : ""}
    </div>
  );
}
