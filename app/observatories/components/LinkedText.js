"use client";

/* Texts */
import { PRIMARY_TOPIC_LINK_TEXT, PRIMARY_TOPIC_URL } from "../vri-udea/board-1/components/boardTexts";

/**
 * Text in which the words of the primary topic are a link to the OpenAlex definition (F46, D-139). It
 * opens in a new tab. A tooltip cannot carry the link (it disappears when the cursor moves), so the
 * links are in the foot of the panels and in the help text.
 *
 * @param {string} text
 */
export default function LinkedText({ text }) {
  const parts = text.split(PRIMARY_TOPIC_LINK_TEXT);
  return parts.map((part, i) => (
    <span key={i}>
      {part}
      {i < parts.length - 1 ? (
        <a href={PRIMARY_TOPIC_URL} target="_blank" rel="noopener noreferrer" data-testid="primary-topic-link">
          {PRIMARY_TOPIC_LINK_TEXT}
        </a>
      ) : null}
    </span>
  ));
}
