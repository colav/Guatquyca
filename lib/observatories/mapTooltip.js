/*
 * Tooltip of the maps (F84). The tooltip of AreaMap (L7plot) is a marker anchored to the cursor, one line per row and with no
 * width limit, so a long value (the topics of a subregion) went out of the box of the map and was cut. These are the pieces that
 * `MapChart` uses to fix it with the options the library has (`domStyles`, `customValue`) plus a small placement step, because
 * the anchor of the marker is fixed when the map is built and cannot flip near the edges.
 */

/** Widest tooltip (px); a narrower map gets the width of the map minus `EDGE` on each side. */
export const TOOLTIP_MAX_WIDTH = 300;
/** Free space (px) between the tooltip and the edge of the map. */
export const TOOLTIP_EDGE = 8;
/** The marker sits 15 px to the right of the cursor (`offsets` of L7plot); flipping to the left leaves the same gap. */
const CURSOR_GAP = 15;

/** Cuts a text to `max` characters with «…» at the end (the last character is the «…», so the result has `max` at most). */
export function truncateText(text, max = 45) {
  const s = String(text ?? "");
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
}

/** Text of a value for the tooltip (it goes in as HTML): escaped, and a line break for every «\n». Numbers go as they come. */
export function tooltipValue(value) {
  if (typeof value !== "string") return value;
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
}

/** `domStyles` of the tooltip: a width limit and rows that wrap (the default theme has `white-space: nowrap`). Short ones do not change. */
export const TOOLTIP_DOM_STYLES = {
  /* F86: `width: max-content` so the width is the one of the content (up to the limit), not the space that is left to the right edge. */
  "l7plot-tooltip": { width: "max-content", maxWidth: `${TOOLTIP_MAX_WIDTH}px`, boxSizing: "border-box" },
  "l7plot-tooltip__list-item": { whiteSpace: "normal", flexWrap: "wrap", columnGap: "12px" },
  "l7plot-tooltip__name": { flexShrink: 0 },
  "l7plot-tooltip__value": { marginLeft: "auto", minWidth: 0, maxWidth: "100%", overflowWrap: "anywhere" },
};

/**
 * Where to put the tooltip so that it stays inside the box: the offset (px) to add to its natural place.
 * The natural place is right of and below the cursor; near the right edge it opens to the left, near the bottom edge upwards.
 *
 * @param {{ left: number, top: number, width: number, height: number }} tip - Natural box of the tooltip.
 * @param {{ left: number, top: number, right: number, bottom: number }} box - Box of the map.
 */
export function tooltipShift(tip, box) {
  const fit = (start, size, min, max, flip) => {
    let d = 0;
    if (start + size > max - TOOLTIP_EDGE) d = flip;
    if (start + d + size > max - TOOLTIP_EDGE) d = max - TOOLTIP_EDGE - size - start;
    if (start + d < min + TOOLTIP_EDGE) d = min + TOOLTIP_EDGE - start;
    return d;
  };
  return {
    dx: fit(tip.left, tip.width, box.left, box.right, -(tip.width + 2 * CURSOR_GAP)),
    dy: fit(tip.top, tip.height, box.top, box.bottom, -tip.height),
  };
}

/** Widest tooltip for a map of `mapWidth` px: `TOOLTIP_MAX_WIDTH`, or the map minus the margin on both sides if it is narrower (120 px at least). */
export function tooltipMaxWidth(mapWidth) {
  return Math.max(120, Math.min(TOOLTIP_MAX_WIDTH, mapWidth - 2 * TOOLTIP_EDGE));
}

/** Puts the tooltip of `wrapper` (if open) inside the box of the wrapper: width limit and flip. Idempotent. */
export function fitTooltip(wrapper) {
  const tip = wrapper.querySelector(".l7plot-tooltip");
  if (!tip) return;
  const maxWidth = `${tooltipMaxWidth(wrapper.clientWidth)}px`;
  if (tip.style.maxWidth !== maxWidth) tip.style.maxWidth = maxWidth;
  /* The width is that of the content in any position of the cursor (F86); the position is corrected below, never the width. */
  if (tip.style.width !== "max-content") tip.style.width = "max-content";
  const r = tip.getBoundingClientRect();
  const w = wrapper.getBoundingClientRect();
  const dx0 = Number(tip.dataset.dx || 0);
  const dy0 = Number(tip.dataset.dy || 0);
  const { dx, dy } = tooltipShift({ left: r.left - dx0, top: r.top - dy0, width: r.width, height: r.height }, w);
  if (dx !== dx0 || dy !== dy0) {
    tip.dataset.dx = String(dx);
    tip.dataset.dy = String(dy);
    tip.style.translate = `${dx}px ${dy}px`;
  }
}
