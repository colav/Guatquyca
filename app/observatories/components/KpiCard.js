"use client";

/* lib */
import { KPI, clampLines } from "@/lib/observatories/layout";

/* UI Library Components */
import { Card, theme } from "antd";

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
  /* Q-12 (D-202): no shadow and one light grey background (a token of the theme); the secondary text uses colorTextSecondary, measured at >= 4.5:1 on it. */
  const { token } = theme.useToken();
  return (
    <Card
      size="small"
      className="obs-kpi"
      variant="borderless"
      style={{ height: reserve ? KPI.heightWithDetail : KPI.height, boxShadow: "none", background: token.colorFillQuaternary }}
      styles={{ body: { height: "100%", padding: KPI.padding, display: "flex", flexDirection: "column", justifyContent: "space-between" } }}
    >
      <div
        title={label}
        style={{ ...clampLines(KPI.labelLines), fontSize: KPI.labelFontSize, lineHeight: `${KPI.labelLineHeight}px`, maxHeight: KPI.labelLines * KPI.labelLineHeight, color: token.colorTextSecondary }}
      >
        {label}
      </div>
      <div>
        <div style={{ fontSize: valueFontSize, lineHeight: "30px", fontWeight: 600 }}>{value}</div>
        {reserve ? (
          <div title={detail} style={{ ...clampLines(KPI.detailLines), fontSize: KPI.detailFontSize, lineHeight: `${KPI.detailLineHeight}px`, height: KPI.detailLines * KPI.detailLineHeight, color: token.colorTextSecondary }}>{detail}</div>
        ) : null}
      </div>
    </Card>
  );
}
