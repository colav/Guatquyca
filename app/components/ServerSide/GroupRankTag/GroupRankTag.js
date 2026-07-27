/* Utils */
import { GROUP_RANK_COLORS } from "@/lib/constants";
import dateBuilder from "@/lib/utils/dateBuilder";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Tag, Tooltip } from "antd";

/**
 * GroupRankTag Component
 *
 * Displays the ScienTI category for a group and shows its validity range in a tooltip.
 *
 * @param {Object[]} ranking - List of ranking objects returned by the API.
 * @returns {JSX.Element|null} A tooltip-wrapped tag with the ScienTI rank, or null if none exists.
 */
export default function GroupRankTag({ ranking }) {
  if (!ranking || ranking.length === 0) {
    return null;
  }

  const scientiRank =
    ranking.find((item) => item?.source === "scienti") || ranking[0];

  if (!scientiRank) {
    return null;
  }

  const rankValue =
    typeof scientiRank.rank === "string" ? scientiRank.rank.trim() : "";
  const normalizedRank = rankValue.toUpperCase();

  const tagColor = GROUP_RANK_COLORS[normalizedRank] || "red";
  const tagLabel = rankValue || "No reconocido";
  const fromDate = dateBuilder(scientiRank.from_date);
  const toDate = dateBuilder(scientiRank.to_date);

  return (
    <Tooltip title={`Categoría ScienTI desde: ${fromDate} hasta: ${toDate}`}>
      <Tag color={tagColor} id={styles.tag}>
        {tagLabel}
      </Tag>
    </Tooltip>
  );
}
