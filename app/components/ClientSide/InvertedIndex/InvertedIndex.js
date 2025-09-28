"use client";

/* Hooks */
import { useState } from "react";

/* UI Library Components */
import { Typography } from "antd";

/* UI Library Sub-Components */
const { Paragraph } = Typography;

/**
 * InvertedIndex is a client-side functional component that reconstructs and displays text from an inverted index object.
 * It provides an expandable paragraph to show the full text or a truncated version.
 *
 * @param {Object} abstract - The inverted index object containing words and their positions.
 * @returns {JSX.Element} The InvertedIndex component.
 */
export default function InvertedIndex({ abstract, full = false }) {
  if (!abstract) {
    return "No disponible";
  }

  const [expanded, setExpanded] = useState(false);
  const textArray = [];

  // Reconstruct the text from the inverted index object.
  for (const [word, positions] of Object.entries(abstract)) {
    positions.forEach((position) => {
      textArray[position] = word;
    });
  }

  const finalText = textArray.join(" ");

  return (
    <Paragraph
      ellipsis={
        full
          ? false
          : {
              rows: 2,
              expandable: "collapsible",
              expanded,
              symbol: () => (expanded ? "Ver menos." : "Ver más."),
              onExpand: (_, info) => setExpanded(info.expanded),
            }
      }
    >
      {finalText}
    </Paragraph>
  );
}
