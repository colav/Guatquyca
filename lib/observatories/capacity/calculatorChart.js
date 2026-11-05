/** Width reserved at the left for the complete labels of the categories (px). */
export const CALCULATOR_LABEL_WIDTH = 150;

/** Font size of the labels and of the figures (px). */
export const CALCULATOR_FONT_SIZE = 13;

import { tooltipInteraction } from "../tooltipStyle";

const fmt = (n) => Number(n).toLocaleString("es-CO");

/**
 * Configuration of the horizontal bars of the capacity calculator (Ant Design Charts, G2): one bar
 * per category from top to bottom in the order of `items`, all from zero to the right; the label of
 * every category complete (no rotation, no truncation, no hiding); the figure after the end of the
 * bar, always visible (also for 0 and for short bars); linear scale from zero with room on the
 * right for the longest figure.
 *
 * @param {{ label: string, value: number, color: string, pctText: string, rule: string }[]} items
 * @param {string} noun - What is counted ("tópicos", "subcampos" or "campos").
 * @param {string[]} [active] - Categories shown in the scatter: the other bars are dimmed (F39).
 */
export function calculatorBarsConfig(items, noun, active = []) {
  const max = Math.max(1, ...items.map((i) => i.value));
  const labels = items.map((i) => i.label);
  return {
    data: items.map((i) => ({ category: i.category, label: i.label, value: i.value, text: fmt(i.value), pct: i.pctText, rule: i.rule })),
    xField: "label",
    yField: "value",
    colorField: "label",
    animate: false,
    legend: false,
    interaction: tooltipInteraction(),
    height: items.length * 44 + 56,
    paddingLeft: CALCULATOR_LABEL_WIDTH,
    paddingRight: 16,
    scale: {
      x: { domain: labels, padding: 0.3 },
      y: { domain: [0, Math.ceil(max * 1.18)], nice: false },
      color: { domain: labels, range: items.map((i) => i.color) },
    },
    axis: {
      x: { title: false, labelAutoRotate: false, labelAutoEllipsis: false, labelAutoHide: false, labelFontSize: CALCULATOR_FONT_SIZE },
      y: { title: false, labelFormatter: (v) => fmt(v) },
    },
    style: { fillOpacity: (d) => (!active.length || active.includes(d.category) ? 1 : 0.45) },
    label: { text: "text", position: "right", textAlign: "start", dx: 6, style: { fontSize: CALCULATOR_FONT_SIZE, fontWeight: 600 } },
    tooltip: {
      title: (d) => d.label,
      items: [
        { field: "text", name: noun[0].toUpperCase() + noun.slice(1) },
        { field: "pct", name: `% de los ${noun} con producción` },
        { field: "rule", name: "Regla" },
      ],
    },
  };
}
