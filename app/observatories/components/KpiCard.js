"use client";

/* lib */
import { CARD_SHADOW, KPI, clampLines } from "@/lib/observatories/layout";

/* UI Library Components */
import { Card } from "antd";

/**
 * KPI card of fixed height: the label at the top (3 lines at most, then "…" and the full text in
 * the `title`), the value anchored at the bottom and, when there is one, the note under the value,
 * always on the same baseline.
 *
 * @param {string} label
 * @param {string|number} value - Already formatted.
 * @param {string} [detail] - Short note under the value (one line).
 * @param {number} [valueFontSize]
 * @param {boolean} [withDetail] - Reserve the line of the note (a block where some cards have one).
 */
export default function KpiCard({ label, value, detail = "", valueFontSize = KPI.valueFontSize, withDetail = false }) {
  const reserve = withDetail || !!detail;
  return (
    <Card
      size="small"
      className="obs-kpi"
      style={{ height: reserve ? KPI.heightWithDetail : KPI.height, boxShadow: CARD_SHADOW }}
      styles={{ body: { height: "100%", padding: KPI.padding, display: "flex", flexDirection: "column", justifyContent: "space-between" } }}
    >
      <div
        title={label}
        style={{ ...clampLines(KPI.labelLines), fontSize: KPI.labelFontSize, lineHeight: `${KPI.labelLineHeight}px`, maxHeight: KPI.labelLines * KPI.labelLineHeight, color: "rgba(0,0,0,.45)" }}
      >
        {label}
      </div>
      <div>
        <div style={{ fontSize: valueFontSize, lineHeight: "30px", fontWeight: 600 }}>{value}</div>
        {reserve ? (
          <div title={detail} style={{ ...clampLines(1), fontSize: KPI.detailFontSize, lineHeight: `${KPI.detailLineHeight}px`, height: KPI.detailLineHeight, color: "rgba(0,0,0,.45)" }}>{detail}</div>
        ) : null}
      </div>
    </Card>
  );
}
