"use client";

/* lib */
import { PANEL_TILE } from "@/lib/observatories/layout";

/**
 * Tile of a panel (the numbers inside a panel: helices, IAP, talent, open access, intellectual property). It is not the KPI row of
 * the top of the board (`KpiCard`): no shadow, no border, one pastel background, and its height is the content's, so no text is cut;
 * the tiles of a row are equally tall because the column stretches and the tile takes its whole height.
 *
 * @param {string} label
 * @param {string|number} value
 * @param {string} [detail] - Small line under the value.
 * @param {number} [valueFontSize]
 */
export default function PanelTile({ label, value, detail = "", valueFontSize = PANEL_TILE.valueFontSize }) {
  return (
    <div
      className="obs-tile"
      style={{ height: "100%", boxSizing: "border-box", padding: PANEL_TILE.padding, background: PANEL_TILE.background, borderRadius: 6, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 4 }}
    >
      <div style={{ fontSize: PANEL_TILE.labelFontSize, lineHeight: `${PANEL_TILE.labelLineHeight}px`, color: PANEL_TILE.labelColor }}>{label}</div>
      <div>
        <div style={{ fontSize: valueFontSize, lineHeight: "28px", fontWeight: 600, color: PANEL_TILE.valueColor }}>{value}</div>
        {detail ? <div style={{ fontSize: PANEL_TILE.detailFontSize, lineHeight: `${PANEL_TILE.detailLineHeight}px`, color: PANEL_TILE.labelColor }}>{detail}</div> : null}
      </div>
    </div>
  );
}
