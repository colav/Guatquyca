/**
 * Shared layout constants of the observatory boards (F38, aesthetics only). Every block of the
 * same kind (KPI cards, tiles, table rows, panels of a row) takes its size from here, so the
 * boards stay aligned and no panel patches its own numbers.
 *
 * @module lib/observatories/layout
 */

/* Colours of the tiles of the panels: in palette.js, like every colour of the observatories. */
import { TILE_COLORS } from "./palette";

/**
 * One shadow for panels, KPI cards and tiles, always visible (no hover needed). It is the one that
 * Ant Design 5.29.3 applies to a `Card` with `hoverable` on hover: token `boxShadowCard`, read in
 * node_modules/antd/es/theme/util/alias.js (the card style uses it as `cardShadow`), with the opacity
 * of its three layers lowered by 20 % (x 0.8) at the request of Luis. Borders and
 * colours are not touched.
 */
export const CARD_SHADOW = "0 1px 2px -2px rgba(0, 0, 0, 0.128), 0 3px 6px 0 rgba(0, 0, 0, 0.096), 0 5px 12px 4px rgba(0, 0, 0, 0.072)";

/** KPI card: label on top (up to 3 lines, then "…"), value anchored at the bottom. */
export const KPI = Object.freeze({
  height: 116,
  heightWithDetail: 134,
  tallHeight: 152, // Q-21: a row whose label is long (the staff of Board 3 with its date) takes 5 lines
  tallLabelLines: 5,
  padding: 12,
  labelFontSize: 13,
  labelLineHeight: 18,
  labelLines: 3,
  detailFontSize: 11,
  detailLineHeight: 16,
  valueFontSize: 22,
});

/**
 * Tile of a panel (F91, Q-17): not the KPI row. No shadow, one soft pastel, text that never gets cut (the height is the content's;
 * the tiles of one row are equally tall because the columns stretch).
 */
export const PANEL_TILE = Object.freeze({
  background: TILE_COLORS.background,
  labelColor: TILE_COLORS.label,
  valueColor: TILE_COLORS.value,
  padding: 10,
  labelFontSize: 14,
  labelFontWeight: 500,
  labelLineHeight: 20,
  detailFontSize: 11,
  detailLineHeight: 16,
  valueFontSize: 20,
});

/** Fixed height of every row of a table (px) and its vertical padding. */
export const TABLE_ROW = Object.freeze({ height: 32, paddingY: 4, paddingX: 8 });

/** Fixed height of the tiles of a mosaic (the same for the whole mosaic, not row by row). */
export const TILE = Object.freeze({
  odsHeight: 92,
  padding: 8,
});

/** Style that cuts a text at `lines` lines with "…" (the full text goes in the `title`). */
export const clampLines = (lines) => ({
  display: "-webkit-box",
  WebkitLineClamp: lines,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  overflowWrap: "anywhere",
});
