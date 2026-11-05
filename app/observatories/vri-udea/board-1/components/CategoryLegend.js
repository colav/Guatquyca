"use client";

/* Hooks */
import { memo } from "react";

/* lib */
import { LEGEND_COLORS as C } from "@/lib/observatories/palette";
import { sizeFor } from "@/lib/observatories/scatterSize";

/* Components */
import CategoryMark from "@/app/observatories/components/CategoryMark";

/* UI Library Components */
import { Typography } from "antd";

/* Constants */
const LINE = 28;
const GAP = 6;
const SIZE_SAMPLES = [0.5, 2, 8];

const entryStyle = (active, dimmed) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  height: LINE,
  padding: "0 8px",
  border: `1px solid ${active ? C.activeBorder : C.idleBorder}`,
  borderRadius: 14,
  background: active ? C.activeBackground : C.background,
  opacity: dimmed ? 0.55 : 1,
  cursor: "pointer",
  font: "inherit",
  fontSize: 12,
  whiteSpace: "nowrap",
  flex: "0 0 auto",
});

/**
 * Own legend of the scatter (F39): one button per category with its shape, its colour, its name
 * and the number of points it has with the current filters. A click shows only that category; Ctrl
 * or Shift adds more; a click on the active one or on «Ver todas» shows them all. The height is
 * fixed (two lines), so the panel does not jump when the width changes.
 *
 * @param {{ category: string, label: string, count: number }[]} items
 * @param {string[]} selected - Categories shown ([] = all).
 * @param {(category: string, additive: boolean) => void} onToggle
 * @param {() => void} onClear
 * @param {string} sizeNote - Note about the size of the points.
 */
function CategoryLegend({ items, selected, onToggle, onClear, sizeNote }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div
        role="group"
        aria-label="Categorías de capacidad"
        data-testid="category-legend"
        style={{ display: "flex", flexWrap: "wrap", alignContent: "flex-start", gap: GAP, height: 2 * LINE + GAP, overflow: "hidden" }}
      >
        {items.map((item) => {
          const active = selected.includes(item.category);
          return (
            <button
              key={item.category}
              type="button"
              aria-pressed={active}
              data-category={item.category}
              data-count={item.count}
              onClick={(event) => onToggle(item.category, event.ctrlKey || event.shiftKey || event.metaKey)}
              style={entryStyle(active, selected.length > 0 && !active)}
              className="obs-legend-entry"
            >
              <CategoryMark category={item.category} size={14} />
              <span>{item.label}</span>
              <b>{item.count.toLocaleString("es-CO")}</b>
            </button>
          );
        })}
        <button type="button" onClick={onClear} disabled={!selected.length} style={{ ...entryStyle(false, false), opacity: selected.length ? 1 : 0.45, cursor: selected.length ? "pointer" : "default" }} className="obs-legend-entry">
          Ver todas
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, minHeight: 22, marginTop: 4, fontSize: 12 }}>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>{sizeNote}</Typography.Text>
        <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          {SIZE_SAMPLES.map((fwci) => (
            <svg key={fwci} width={34} height={34} viewBox="-17 -17 34 34" style={{ flex: "0 0 auto" }}>
              <circle r={sizeFor(fwci)} fill={C.sampleFill} stroke={C.sampleStroke} strokeWidth="1" />
              <text y={4} textAnchor="middle" fontSize="9" fill={C.sampleText}>{String(fwci).replace(".", ",")}</text>
            </svg>
          ))}
        </span>
      </div>
    </div>
  );
}

export default memo(CategoryLegend);
