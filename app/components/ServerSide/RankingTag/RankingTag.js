/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Tag, Tooltip } from "antd";

export default function RankingTag({ ranking }) {
  if (!ranking || ranking.length === 0) {
    return null;
  }

  // Filter the ranking list based on the hierarchy of sources.
  // source === "scienti" is the highest priority, followed by "minciencias" without a level.
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
