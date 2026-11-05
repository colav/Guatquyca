"use client";

/* Hooks */
import { memo } from "react";

/* lib */
import { LEGEND_COLORS as C } from "@/lib/observatories/palette";
import { sizeFor } from "@/lib/observatories/scatterSize";

/* Components */
import CategoryMark from "@/app/observatories/components/CategoryMark";

/* UI Library Components */
import { Tooltip, Typography } from "antd";

/* Constants */
const LINE = 28;
const GAP = 6;
const SIZE_SAMPLES = [0.5, 2, 8];

const entryStyle = ({ active = false, dimmed = false, informative = false } = {}) => ({
  boxSizing: "border-box",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  height: LINE,
  padding: "0 8px",
  border: `1px ${informative ? "dashed" : "solid"} ${active ? C.activeBorder : C.idleBorder}`,
  borderRadius: 14,
  background: active ? C.activeBackground : C.background,
  opacity: dimmed ? 0.55 : 1,
  cursor: informative ? "default" : "pointer",
  font: "inherit",
  fontSize: 12,
  whiteSpace: "nowrap",
  flex: "0 0 auto",
});

/**
 * Own legend of the scatter (F39, F43c): one button per drawable category with its shape, colour, name and
 * the number of units it has with the current filters. Without a selection all are shown and no button is
 * off; a click leaves only that category, a click on the active one or on Ver todas shows all again, and
 * Ctrl, Shift or Meta add more. The numbers do not change with the selection. No production is
 * informative: it has no click and no selected state, because it is not drawn. The height is fixed (two
 * lines), so the panel does not jump when the width changes.
 *
 * @param {{ category: string, label: string, count: number, informative?: boolean, hint?: string }[]} items
 * @param {string[]} selected - Isolated categories ([] = all shown).
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
          const count = item.count.toLocaleString("es-CO");
          if (item.informative) {
            const info = (
              <span
                tabIndex={0}
                data-category={item.category}
                data-count={item.count}
                data-informative="true"
                style={entryStyle({ informative: true })}
                className="obs-legend-entry"
              >
                <CategoryMark category={item.category} size={14} />
                <span>{item.label}</span>
                <b>{count}</b>
              </span>
            );
            return item.hint ? <Tooltip key={item.category} title={item.hint}>{info}</Tooltip> : info;
          }
          const active = selected.includes(item.category);
          const entry = (
            <button
              key={item.category}
              type="button"
              aria-pressed={active}
              data-category={item.category}
              data-count={item.count}
              onClick={(event) => onToggle(item.category, event.ctrlKey || event.shiftKey || event.metaKey)}
              style={entryStyle({ active, dimmed: selected.length > 0 && !active })}
              className="obs-legend-entry"
            >
              <CategoryMark category={item.category} size={14} />
              <span>{item.label}</span>
              <b>{count}</b>
            </button>
          );
          return item.hint ? <Tooltip key={item.category} title={item.hint}>{entry}</Tooltip> : entry;
        })}
        <button type="button" onClick={onClear} disabled={!selected.length} style={{ ...entryStyle(), opacity: selected.length ? 1 : 0.45, cursor: selected.length ? "pointer" : "default" }} className="obs-legend-entry">
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
