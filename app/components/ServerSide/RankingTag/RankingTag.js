/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Tag, Tooltip } from "antd";

/**
 * RankingTag Component
 *
 * Displays a ranking tag based on a provided ranking list.
 * Priority: "scienti" > "minciencias" (without "level") > "ciarp".
 *
 * @param {Object[]} ranking - The list of ranking objects.
 * @returns {JSX.Element|null} A tooltip-wrapped tag displaying the rank, or null if no valid rank is found.
 */
export default function RankingTag({ ranking }) {
  if (!ranking || ranking.length === 0) {
    return null;
  }

  let rank =
    ranking.find((item) => item.source === "scienti") ||
    ranking.find(
      (item) => item.source === "minciencias" && !item.hasOwnProperty("level")
    ) ||
    ranking.find((item) => item.source === "ciarp");

  if (!rank) return null;

  const sourceMap = {
    scienti: "ScienTI",
    minciencias: "Minciencias",
    ciarp: "CIARP",
  };

  return (
    <Tooltip title={`Fuente: ${sourceMap[rank.source] || rank.source}`}>
      <Tag id={styles.tag}>Ranking: {rank.rank}</Tag>
    </Tooltip>
  );
}
