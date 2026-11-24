"use client";

/* lib */
import { CARD_SHADOW, KPI, clampLines } from "@/lib/observatories/layout";
import { TILE_COLORS } from "@/lib/observatories/palette";

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
 * @param {boolean} [tall] - A row whose label needs 4 lines (Q-21): the height `KPI.tallHeight`, label up to `KPI.tallLabelLines` lines.
 */
/** Q-34: the first letter in capital when it is drawn; the texts of the bundles and of boardTexts.js stay as they are. */
const upperFirst = (text) => { const s = String(text); return s.charAt(0).toLocaleUpperCase("es-CO") + s.slice(1); };

export default function KpiCard({ label, value, detail = "", valueFontSize = KPI.valueFontSize, withDetail = false, tall = false }) {
  const reserve = withDetail || !!detail;
  const labelLines = tall ? KPI.tallLabelLines : KPI.labelLines;
  return (
    <Card
      size="small"
      className="obs-kpi"
      style={{ height: tall ? KPI.tallHeight : reserve ? KPI.heightWithDetail : KPI.height, boxShadow: CARD_SHADOW }}
      styles={{ body: { height: "100%", padding: KPI.padding, display: "flex", flexDirection: "column", justifyContent: "space-between" } }}
    >
      <div
        title={label}
        style={{ ...clampLines(labelLines), fontSize: KPI.labelFontSize, fontWeight: KPI.labelFontWeight, lineHeight: `${KPI.labelLineHeight}px`, maxHeight: labelLines * KPI.labelLineHeight, color: TILE_COLORS.label }}
      >
        {upperFirst(label)}
      </div>
      <div>
        <div style={{ fontSize: valueFontSize, lineHeight: "30px", fontWeight: 600 }}>{value}</div>
        {reserve ? (
          <div title={detail} style={{ ...clampLines(1), fontSize: KPI.detailFontSize, lineHeight: `${KPI.detailLineHeight}px`, height: KPI.detailLineHeight, color: TILE_COLORS.label }}>{detail}</div>
        ) : null}
      </div>
    </Card>
  );
}
