"use client";

/* Context */
import { useToken } from "./context";

/* Icons */
import { ShareAltOutlined, DisconnectOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Progress, Tag, Typography } from "antd";

/* Utils */
import { fmt, pct, INTERSECTION_COLOR, EXCLUSIVE_COLOR } from "./utils";

/* UI Library Sub-components */
const { Text } = Typography;

/* ─── MetricCell ────────────────────────────────────────────── */
export function MetricCell({
  value,
  total,
  prevValue,
  isTotal,
  lowerIsBetter,
}) {
  const tok = useToken();
  const p =
    !isTotal && total != null && value != null ? pct(value, total) : null;

  let deltaText = null;
  let deltaColor = null;
  if (prevValue != null && value != null) {
    const diff = value - prevValue;
    if (diff !== 0) {
      const better = lowerIsBetter ? diff < 0 : diff > 0;
      deltaColor = better ? tok.colorSuccess : tok.colorError;
      deltaText = `${diff > 0 ? "▲" : "▼"} ${fmt(Math.abs(diff))}`;
    }
  }

  return (
    <div className={styles.metricCell}>
      <div
        className={`${styles.metricValue} ${isTotal ? styles.metricValueTotal : ""}`}
        style={{ color: tok.colorText }}
      >
        {fmt(value)}
      </div>
      {p != null && (
        <>
          <Progress
            percent={p}
            size="small"
            showInfo={false}
            strokeColor={tok.colorPrimary}
            className={styles.metricProgress}
          />
          <Text
            className={styles.metricPercent}
            style={{ color: tok.colorTextTertiary }}
          >
            {p}%
          </Text>
        </>
      )}
      {deltaText && (
        <div className={styles.metricDelta} style={{ color: deltaColor }}>
          {deltaText}
        </div>
      )}
    </div>
  );
}

/* ─── MetricDualCell ────────────────────────────────────────── */
function getDelta(curr, prev, lowerIsBetter = false, tok) {
  if (prev == null || curr == null) return null;
  const diff = curr - prev;
  if (diff === 0) return null;
  const good = lowerIsBetter ? diff < 0 : diff > 0;
  return {
    text: `${diff > 0 ? "▲" : "▼"} ${fmt(Math.abs(diff))}`,
    color: good ? tok.colorSuccess : tok.colorError,
  };
}

export function MetricDualCell({
  intersection,
  exclusive,
  total,
  prevIntersection,
  prevExclusive,
  sourceKey,
}) {
  const tok = useToken();
  const pctI = intersection != null && total ? pct(intersection, total) : null;
  const pctE =
    exclusive != null && intersection ? pct(exclusive, intersection) : null;
  const prevPctE =
    prevExclusive != null && prevIntersection
      ? pct(prevExclusive, prevIntersection)
      : null;

  const deltaI = getDelta(intersection, prevIntersection, false, tok);

  // Tag only for single-source rows where exclusive % improved (decreased)
  const isSingleSource = sourceKey != null && !sourceKey.includes("_");
  const showImprovedTag =
    isSingleSource && pctE != null && prevPctE != null && pctE < prevPctE;

  return (
    <div className={styles.dualCell}>
      {/* intersección */}
      <div className={styles.dualCellHalf}>
        <ShareAltOutlined
          className={styles.dualCellIcon}
          style={{ color: INTERSECTION_COLOR }}
        />
        <div>
          <Text
            strong
            style={{
              fontSize: 17,
              color: tok.colorText,
              display: "block",
              lineHeight: 1.2,
            }}
          >
            {fmt(intersection)}
          </Text>
          {pctI != null && (
            <Text
              style={{
                fontSize: 12,
                color: tok.colorTextTertiary,
                display: "block",
              }}
            >
              {pctI}%
            </Text>
          )}
          {deltaI && (
            <Text
              style={{ fontSize: 12, color: deltaI.color, display: "block" }}
            >
              {deltaI.text}
            </Text>
          )}
        </div>
      </div>

      <div
        className={styles.dualCellDivider}
        style={{ background: tok.colorSplit }}
      />

      {/* exclusiva */}
      <div className={styles.dualCellHalf}>
        <DisconnectOutlined
          className={styles.dualCellIcon}
          style={{ color: EXCLUSIVE_COLOR }}
        />
        <div>
          <Text
            style={{
              fontSize: 14,
              color: tok.colorTextSecondary,
              display: "block",
              lineHeight: 1.2,
            }}
          >
            {fmt(exclusive)}
          </Text>
          {pctE != null && (
            <Text
              style={{
                fontSize: 12,
                color: tok.colorTextTertiary,
                display: "block",
              }}
            >
              {pctE}%
            </Text>
          )}
          {showImprovedTag && (
            <Tag
              color="green"
              style={{ fontSize: 10, padding: "0 5px", marginTop: 2 }}
            >
              cruce mejorado
            </Tag>
          )}
        </div>
      </div>
    </div>
  );
}
