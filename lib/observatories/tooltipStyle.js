/**
 * Style of the tooltips of the charts (F39b). G2 draws the tooltip in HTML with a narrow maximum
 * width and one line per item, so long values ended up cut with "…". Here the tooltip is wider
 * and a value that does not fit goes on a second line, aligned to the right, without "…".
 *
 * @module lib/observatories/tooltipStyle
 */

const ITEM = { "white-space": "normal", "flex-wrap": "wrap", "justify-content": "space-between", "line-height": "1.6em" };
const TITLE = { "white-space": "normal", overflow: "visible", "text-overflow": "clip", "overflow-wrap": "anywhere" };
const NAME_LABEL = { overflow: "visible", "text-overflow": "clip", "white-space": "nowrap" };
const VALUE = { "white-space": "normal", "text-align": "right", overflow: "visible", "text-overflow": "clip", "flex": "1 1 auto", "word-break": "normal", "overflow-wrap": "anywhere" };

/**
 * Width of the tooltips (F48, D-142). The minimum (px) fits a normal point; the maximum fits the longest line
 * of the tooltip of a point with the real data («Razón de capacidad … frente a … de <institución>»: 1.000 px
 * with the longest name of an institution), without going out of the window: at 1.280 px it does not break and
 * in a narrow window it is the width of the window and the value goes on a second line, aligned to the right.
 * The maximum is of the content (the padding of 12 px on each side comes on top).
 */
export const WIDE_TOOLTIP = Object.freeze({ min: 460, max: "min(1000px, calc(100vw - 56px))" });

/**
 * `interaction` option of a chart with a tooltip.
 *
 * @param {{ min?: number, max?: number | string }} [width] - Width limits: px (number) or a CSS length (default WIDE_TOOLTIP.max).
 */
export function tooltipInteraction({ min = 120, max = WIDE_TOOLTIP.max } = {}) {
  return {
    tooltip: {
      css: {
        ".g2-tooltip": { "min-width": `${min}px`, "max-width": typeof max === "number" ? `${max}px` : max, width: "max-content" },
        ".g2-tooltip-list-item": ITEM,
        ".g2-tooltip-title": TITLE,
        ".g2-tooltip-list-item-name": { "max-width": "none", flex: "0 0 auto" },
        ".g2-tooltip-list-item-name-label": NAME_LABEL,
        ".g2-tooltip-list-item-value": VALUE,
      },
    },
  };
}
