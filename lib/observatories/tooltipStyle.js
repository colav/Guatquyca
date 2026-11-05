/**
 * Style of the tooltips of the charts (F39b). G2 draws the tooltip in HTML with a narrow maximum
 * width and one line per item, so long values ended up cut with "…". Here the tooltip is wider
 * and a value that does not fit goes on a second line, aligned to the right, without "…".
 *
 * @module lib/observatories/tooltipStyle
 */

const ITEM = { "white-space": "normal", "flex-wrap": "wrap", "justify-content": "space-between", "line-height": "1.6em" };
const NAME_LABEL = { overflow: "visible", "text-overflow": "clip", "white-space": "nowrap" };
const VALUE = { "white-space": "normal", "text-align": "right", overflow: "visible", "text-overflow": "clip", "flex": "1 1 auto", "word-break": "normal", "overflow-wrap": "anywhere" };

/** Width of the tooltip of the scatter (px): the minimum fits the longest line of a point. */
export const WIDE_TOOLTIP = Object.freeze({ min: 460, max: 560 });

/**
 * `interaction` option of a chart with a tooltip.
 *
 * @param {{ min?: number, max?: number }} [width] - Width limits in px (default 560 at most).
 */
export function tooltipInteraction({ min = 120, max = WIDE_TOOLTIP.max } = {}) {
  return {
    tooltip: {
      css: {
        ".g2-tooltip": { "min-width": `${min}px`, "max-width": `${max}px` },
        ".g2-tooltip-list-item": ITEM,
        ".g2-tooltip-list-item-name": { "max-width": "none", flex: "0 0 auto" },
        ".g2-tooltip-list-item-name-label": NAME_LABEL,
        ".g2-tooltip-list-item-value": VALUE,
      },
    },
  };
}
