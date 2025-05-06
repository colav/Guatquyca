/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Tag, Tooltip } from "antd";

/**
 * RankingTag Component
 *
 * This component displays a ranking tag based on a provided ranking list.
 * It prioritizes rankings from the source "scienti" first, and if not found,
 * it selects rankings from the source "minciencias" only if the item does not
 * contain the "level" key.
 *
 * @component
 * @param {Object[]} ranking - The list of ranking objects.
 * @returns {JSX.Element|null} A tooltip-wrapped tag displaying the rank, or null if no valid rank is found.
 */
export default function RankingTag({ ranking }) {
  if (!ranking || ranking.length === 0) {
    return null;
  }

  const rank = ranking.find(
    (item) =>
      item.source === "scienti" ||
      (item.source === "minciencias" && !item.hasOwnProperty("level"))
  );

  return (
    <Tooltip
      title={`Fuente: ${rank.source === "scienti" ? "ScienTI" : "Minciencias"}`}
    >
      <Tag id={styles.tag}>{rank.rank}</Tag>
    </Tooltip>
  );
}
